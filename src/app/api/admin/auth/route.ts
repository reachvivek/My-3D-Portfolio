import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { AdminConfig } from "@/lib/models";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  isAdmin,
  loginRetryAfter,
  recordLogin,
  sameOrigin,
  setSessionCookie,
} from "@/lib/admin-auth";

const NO_STORE = { "Cache-Control": "no-store" };
const BCRYPT_COST = 12;

/** Is this browser signed in? (The cookie itself is HttpOnly, so the page has to ask.) */
export async function GET(request: Request) {
  return NextResponse.json({ authed: await isAdmin(request) }, { headers: NO_STORE });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const wait = await loginRetryAfter(request);
  if (wait > 0) {
    await recordLogin(request, false, "throttled");
    return NextResponse.json(
      { error: "Too many attempts", retryAfter: wait },
      { status: 429, headers: { ...NO_STORE, "Retry-After": String(wait) } },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    /* empty or malformed body: treated as a wrong password */
  }

  await connectDB();
  const config = (await AdminConfig.findOne({ key: "admin_password" }).lean()) as { value: string } | null;
  if (!config) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const valid = password.length > 0 && password.length <= 200 && (await bcrypt.compare(password, config.value));
  if (!valid) {
    await recordLogin(request, false);
    await new Promise((r) => setTimeout(r, 600)); // slows scripted guessing; same delay for every failure
    return NextResponse.json({ error: "Invalid password" }, { status: 401, headers: NO_STORE });
  }

  // upgrade older, cheaper hashes on a successful sign-in
  const cost = Number(config.value.split("$")[2]);
  if (!Number.isFinite(cost) || cost < BCRYPT_COST) {
    await AdminConfig.updateOne({ key: "admin_password" }, { $set: { value: await bcrypt.hash(password, BCRYPT_COST) } });
  }

  await recordLogin(request, true);
  const res = NextResponse.json({ success: true }, { headers: NO_STORE });
  setSessionCookie(res, await createSession(request));
  return res;
}

/** Sign out: the session is deleted server-side, not just forgotten by the browser. */
export async function DELETE(request: Request) {
  await destroySession(request);
  const res = NextResponse.json({ success: true }, { headers: NO_STORE });
  clearSessionCookie(res);
  return res;
}
