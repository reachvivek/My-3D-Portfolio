import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import mongoose from "mongoose";
import { connectDB } from "./mongodb";

/**
 * Server-side admin sessions.
 *
 * - A session is a 256-bit random token in an HttpOnly, SameSite=Strict cookie (Secure in production).
 *   Only its SHA-256 hash is stored, so a database read never yields a usable session.
 * - Sessions expire after SESSION_HOURS and are deleted by a TTL index; signing out deletes the row.
 * - Login attempts are throttled per IP and globally, and every attempt is written to an audit log
 *   (hashed IP, country, device), never the password.
 * - Mutating admin requests must come from this site's own origin (defence in depth against CSRF).
 */

export const SESSION_COOKIE = "rv_admin";
const SESSION_HOURS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_GLOBAL = 25;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function db() {
  await connectDB();
  const d = mongoose.connection.db;
  if (!d) throw new Error("Database not connected");
  await ensureIndexes(d);
  return d;
}

let indexed: Promise<unknown> | null = null;
function ensureIndexes(d: NonNullable<typeof mongoose.connection.db>) {
  indexed ??= Promise.all([
    d.collection("adminsessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    d.collection("adminsessions").createIndex({ tokenHash: 1 }, { unique: true }),
    d.collection("adminlogins").createIndex({ at: 1 }, { expireAfterSeconds: 90 * 24 * 3600 }),
    d.collection("adminlogins").createIndex({ ipKey: 1, at: -1 }),
  ]).catch(() => {
    indexed = null;
  });
  return indexed;
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

/** A salted hash of the IP: enough to throttle and to tell attempts apart, never the address itself. */
export function ipKey(req: Request) {
  return sha256(`rv-ip|${clientIp(req)}|${process.env.MONGODB_URI ?? ""}`).slice(0, 32);
}

export function geo(req: Request) {
  const dec = (v: string | null) => {
    if (!v) return undefined;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    country: req.headers.get("x-vercel-ip-country") ?? undefined,
    region: dec(req.headers.get("x-vercel-ip-country-region")),
    city: dec(req.headers.get("x-vercel-ip-city")),
  };
}

function readCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Same-origin check for state-changing requests. Requests without an Origin header (same-origin GETs, curl) are judged by the session alone. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function isAdmin(req: Request) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token || token.length < 32 || token.length > 128) return false;
  const d = await db();
  const s = await d.collection("adminsessions").findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
  return !!s;
}

/** Returns a 401/403 response when the request is not from a signed-in admin, or null to carry on. */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const method = req.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && !sameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return null;
}

/** How long this IP (or everyone, under a broad attack) must wait before trying again. 0 = allowed. */
export async function loginRetryAfter(req: Request) {
  const d = await db();
  const since = new Date(Date.now() - WINDOW_MS);
  const logins = d.collection("adminlogins");
  const mine = await logins.find({ ipKey: ipKey(req), ok: false, at: { $gt: since } }).sort({ at: 1 }).toArray();
  if (mine.length >= MAX_FAILS_PER_IP) {
    return Math.ceil((mine[mine.length - MAX_FAILS_PER_IP].at.getTime() + WINDOW_MS - Date.now()) / 1000);
  }
  const all = await logins.countDocuments({ ok: false, at: { $gt: since } });
  if (all >= MAX_FAILS_GLOBAL) return Math.ceil(WINDOW_MS / 1000);
  return 0;
}

export async function recordLogin(req: Request, ok: boolean, note?: string) {
  const d = await db();
  await d.collection("adminlogins").insertOne({
    at: new Date(),
    ok,
    note,
    ipKey: ipKey(req),
    ...geo(req),
    ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
  });
}

export async function createSession(req: Request) {
  const token = randomBytes(32).toString("base64url");
  const d = await db();
  const now = Date.now();
  await d.collection("adminsessions").insertOne({
    tokenHash: sha256(token),
    createdAt: new Date(now),
    expiresAt: new Date(now + SESSION_HOURS * 3600 * 1000),
    ipKey: ipKey(req),
    ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
  });
  return token;
}

export async function destroySession(req: Request) {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return;
  const d = await db();
  await d.collection("adminsessions").deleteOne({ tokenHash: sha256(token) });
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
}

/** The last admin sign-in attempts, for the security panel. */
export async function recentLogins(limit = 20) {
  const d = await db();
  return d.collection("adminlogins").find({}, { projection: { _id: 0, ua: 1, at: 1, ok: 1, country: 1, city: 1, note: 1 } }).sort({ at: -1 }).limit(limit).toArray();
}
