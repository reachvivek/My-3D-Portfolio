import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { geo, ipKey, isAdmin } from "@/lib/admin-auth";

/*
 * Receives the visit heartbeat (src/components/Analytics.tsx). Public by design, so everything is
 * validated and capped: unknown fields are dropped, time per beat is bounded, clicks are limited,
 * new sessions per IP are throttled, and the owner's own visits and bots are ignored.
 */

const ID = /^[a-z0-9]{8,32}$/;
const SECTION = /^[a-z0-9-]{1,40}(\/[a-z0-9-]{1,40})?$/;
const KINDS = new Set(["project", "book-call", "resume", "whatsapp", "email", "social", "blog", "nav", "external", "link", "button"]);
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|bingpreview|vercel-screenshot/i;
const MAX_BODY = 16_000;
const MAX_MS_PER_BEAT = 8_000;
const MAX_NEW_SESSIONS_PER_IP_HOUR = 30;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);

function device(ua: string, sw?: number) {
  const tablet = /ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua));
  const mobile = !tablet && /mobi|iphone|android/i.test(ua);
  const os = /iphone|ipad|ios/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" : /mac os/i.test(ua) ? "macOS" : /windows/i.test(ua) ? "Windows" : /linux/i.test(ua) ? "Linux" : "Other";
  const browser = /edg\//i.test(ua) ? "Edge" : /opr\/|opera/i.test(ua) ? "Opera" : /samsungbrowser/i.test(ua) ? "Samsung" : /firefox|fxios/i.test(ua) ? "Firefox" : /chrome|crios/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : "Other";
  return { device: tablet ? "Tablet" : mobile ? "Mobile" : sw && sw < 768 ? "Mobile" : "Desktop", os, browser };
}

function refHost(ref: string | undefined, own: string | null) {
  if (!ref) return undefined;
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "");
    return own && h === own.replace(/^www\./, "").split(":")[0] ? undefined : h.slice(0, 80);
  } catch {
    return undefined;
  }
}

let indexed = false;

export async function POST(request: Request) {
  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return new NextResponse(null, { status: 413 });
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return new NextResponse(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const sid = str(body.sid, 40);
  const vid = str(body.vid, 40);
  const path = str(body.path, 200);
  if (!sid || !vid || !ID.test(sid) || !ID.test(vid) || !path?.startsWith("/") || path.startsWith("/admin")) {
    return new NextResponse(null, { status: 400 });
  }

  // the owner's own browsing never counts
  if (await isAdmin(request)) return new NextResponse(null, { status: 204 });

  const inc: Record<string, number> = {};
  let total = 0;
  if (body.d && typeof body.d === "object") {
    for (const [k, v] of Object.entries(body.d as Record<string, unknown>).slice(0, 30)) {
      if (!SECTION.test(k) || typeof v !== "number" || !Number.isFinite(v) || v <= 0) continue;
      const ms = Math.min(v, MAX_MS_PER_BEAT, MAX_MS_PER_BEAT - total);
      if (ms <= 0) break;
      inc[`sections.${k}`] = (inc[`sections.${k}`] || 0) + ms;
      total += ms;
    }
  }
  if (total) inc.time = total;

  const now = new Date();
  const clicks = Array.isArray(body.ev)
    ? (body.ev as unknown[])
        .slice(0, 20)
        .map((e) => e as Record<string, unknown>)
        .filter((e) => typeof e?.k === "string" && KINDS.has(e.k as string))
        .map((e) => ({ k: e.k as string, l: str(e.l, 80) ?? "", h: str(e.h, 200), p: path, t: now }))
    : [];
  const scroll = typeof body.s === "number" && Number.isFinite(body.s) ? Math.max(0, Math.min(100, Math.round(body.s))) : 0;

  await connectDB();
  const db = mongoose.connection.db!;
  const sessions = db.collection<{ _id: string } & Record<string, unknown>>("analytics_sessions");
  if (!indexed) {
    indexed = true;
    await Promise.all([
      sessions.createIndex({ lastSeen: -1 }),
      sessions.createIndex({ firstSeen: 1 }, { expireAfterSeconds: 400 * 24 * 3600 }), // kept ~13 months
      sessions.createIndex({ ipKey: 1, firstSeen: -1 }),
    ]).catch(() => (indexed = false));
  }

  const key = ipKey(request);
  const exists = await sessions.findOne({ _id: sid }, { projection: { _id: 1 } });
  if (!exists) {
    const recent = await sessions.countDocuments({ ipKey: key, firstSeen: { $gt: new Date(Date.now() - 3600_000) } });
    if (recent >= MAX_NEW_SESSIONS_PER_IP_HOUR) return new NextResponse(null, { status: 204 });
  }

  const sw = typeof body.sw === "number" ? Math.round(body.sw) : undefined;
  const utm = body.utm && typeof body.utm === "object" ? body.utm as Record<string, unknown> : undefined;
  const update: Record<string, unknown> = {
    $setOnInsert: {
      vid,
      firstSeen: now,
      returning: body.ret === true,
      ipKey: key,
      ...geo(request),
      ...device(ua, sw),
      ref: refHost(str(body.ref, 300), request.headers.get("host")),
      utm: utm ? { source: str(utm.source, 60), medium: str(utm.medium, 60), campaign: str(utm.campaign, 60) } : undefined,
      landing: path,
    },
    $set: { lastSeen: now },
    $max: { scroll },
    $addToSet: { pages: path },
  };
  if (Object.keys(inc).length) update.$inc = inc;
  if (clicks.length) update.$push = { clicks: { $each: clicks, $slice: -200 } };
  if (body.pv === true) update.$inc = { ...(update.$inc as object), views: 1 };

  await sessions.updateOne({ _id: sid }, update, { upsert: true });
  return new NextResponse(null, { status: 204 });
}
