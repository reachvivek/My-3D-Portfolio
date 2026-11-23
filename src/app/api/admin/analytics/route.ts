import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { recentLogins, requireAdmin } from "@/lib/admin-auth";

/** Aggregates the visit heartbeat for the admin Analytics page. Signed-in admins only. */

type Session = {
  _id: string;
  vid: string;
  firstSeen: Date;
  lastSeen: Date;
  returning?: boolean;
  country?: string;
  city?: string;
  device?: string;
  os?: string;
  browser?: string;
  ref?: string;
  utm?: { source?: string };
  landing?: string;
  pages?: string[];
  time?: number;
  scroll?: number;
  views?: number;
  sections?: Record<string, number>;
  clicks?: { k: string; l: string; h?: string; p?: string; t: Date }[];
};

const RANGES: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 };
const SECTION_NAMES: Record<string, string> = {
  showcase: "Hero showcase",
  work: "Projects grid",
  "case-studies": "Case studies",
  about: "About",
  experience: "Experience",
  process: "Process",
  skills: "Tech stack",
  highlights: "Highlights",
  github: "GitHub",
  blog: "Blog",
  testimonials: "Testimonials",
  contact: "Contact",
};
const STAGE_NAMES: Record<string, string> = { intro: "Intro (terminal & profile)", overview: "Overview", fintech: "Fintech", automotive: "Automotive", property: "Property", luxury: "Luxury", ai: "AI", history: "Work history" };

const tally = (m: Map<string, number>, k: string | undefined, by = 1) => {
  if (!k) return;
  m.set(k, (m.get(k) ?? 0) + by);
};
const top = (m: Map<string, number>, n = 10) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, value]) => ({ label, value }));

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const range = RANGES[url.searchParams.get("range") ?? "7d"] ? (url.searchParams.get("range") as string) : "7d";
  const days = RANGES[range];
  const since = new Date(Date.now() - days * 864e5);

  await connectDB();
  const db = mongoose.connection.db!;
  const sessions = (await db
    .collection("analytics_sessions")
    .find({ lastSeen: { $gte: since } })
    .sort({ lastSeen: -1 })
    .limit(20000)
    .toArray()) as unknown as Session[];
  const live = await db.collection("analytics_sessions").countDocuments({ lastSeen: { $gte: new Date(Date.now() - 60_000) } });

  // project titles for project-click labels
  const projectTitles = new Map<string, string>();
  for (const p of await db.collection("projects").find({}, { projection: { slug: 1, title: 1 } }).toArray()) {
    projectTitles.set(String(p.slug), String(p.title));
  }

  const visitors = new Set<string>();
  let time = 0;
  let scroll = 0;
  let returning = 0;
  let engaged = 0;
  const daily = new Map<string, { sessions: number; visitors: Set<string> }>();
  const sectionTime = new Map<string, number>();
  const sectionReach = new Map<string, number>();
  const stageTime = new Map<string, number>();
  const clickKinds = new Map<string, number>();
  const projectClicks = new Map<string, number>();
  const refs = new Map<string, number>();
  const countries = new Map<string, number>();
  const cities = new Map<string, number>();
  const devices = new Map<string, number>();
  const browsers = new Map<string, number>();
  const pages = new Map<string, number>();

  const dayKey = (d: Date) => new Date(d.getTime() + 4 * 3600e3).toISOString().slice(0, 10); // Gulf Standard Time
  for (let i = days - 1; i >= 0; i--) daily.set(dayKey(new Date(Date.now() - i * 864e5)), { sessions: 0, visitors: new Set() });

  for (const s of sessions) {
    visitors.add(s.vid);
    time += s.time ?? 0;
    scroll += s.scroll ?? 0;
    if (s.returning) returning++;
    if ((s.time ?? 0) >= 10_000) engaged++;
    const day = daily.get(dayKey(new Date(s.firstSeen)));
    if (day) {
      day.sessions++;
      day.visitors.add(s.vid);
    }
    for (const [k, ms] of Object.entries(s.sections ?? {})) {
      const [sec, stage] = k.split("/");
      tally(sectionTime, sec, ms);
      if (stage) tally(stageTime, stage, ms);
    }
    for (const sec of new Set(Object.keys(s.sections ?? {}).map((k) => k.split("/")[0]))) tally(sectionReach, sec);
    for (const c of s.clicks ?? []) {
      tally(clickKinds, c.k);
      if (c.k === "project" && c.h) {
        const slug = c.h.replace(/^\/projects\//, "").split(/[?#]/)[0];
        tally(projectClicks, projectTitles.get(slug) ?? slug);
      }
    }
    tally(refs, s.utm?.source ? (s.ref && s.ref !== s.utm.source ? `${s.utm.source} (via ${s.ref})` : s.utm.source) : s.ref ?? "Direct");
    tally(countries, s.country ?? "Unknown");
    if (s.city) tally(cities, `${s.city}${s.country ? `, ${s.country}` : ""}`);
    tally(devices, s.device ?? "Unknown");
    tally(browsers, s.browser ?? "Unknown");
    for (const p of s.pages ?? []) tally(pages, p);
  }

  const n = sessions.length || 1;
  const sectionRows = [...sectionTime.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, ms]) => ({ id, label: SECTION_NAMES[id] ?? id, totalMs: ms, visitors: sectionReach.get(id) ?? 0, avgMs: Math.round(ms / Math.max(1, sectionReach.get(id) ?? 1)) }));

  return NextResponse.json(
    {
      range,
      generatedAt: new Date().toISOString(),
      kpis: {
        visitors: visitors.size,
        sessions: sessions.length,
        avgTimeMs: Math.round(time / n),
        avgScroll: Math.round(scroll / n),
        returningPct: Math.round((returning / n) * 100),
        engagedPct: Math.round((engaged / n) * 100),
        live,
      },
      daily: [...daily.entries()].map(([date, v]) => ({ date, sessions: v.sessions, visitors: v.visitors.size })),
      sections: sectionRows,
      stages: [...stageTime.entries()].sort((a, b) => b[1] - a[1]).map(([id, ms]) => ({ label: STAGE_NAMES[id] ?? id, value: ms })),
      projects: top(projectClicks, 12),
      actions: top(clickKinds, 12),
      sources: top(refs, 10),
      countries: top(countries, 10),
      cities: top(cities, 10),
      devices: top(devices, 5),
      browsers: top(browsers, 6),
      pages: top(pages, 10),
      recent: sessions.slice(0, 40).map((s) => ({
        id: s._id.slice(0, 6),
        firstSeen: s.firstSeen,
        lastSeen: s.lastSeen,
        place: [s.city, s.country].filter(Boolean).join(", ") || "Unknown",
        device: [s.device, s.os, s.browser].filter(Boolean).join(" · "),
        source: s.utm?.source ?? s.ref ?? "Direct",
        returning: !!s.returning,
        timeMs: s.time ?? 0,
        scroll: s.scroll ?? 0,
        pages: s.pages ?? [],
        topSection: Object.entries(s.sections ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        clicks: (s.clicks ?? []).slice(-12).map((c) => ({ kind: c.k, label: c.k === "project" && c.h ? projectTitles.get(c.h.replace(/^\/projects\//, "")) ?? c.l : c.l, at: c.t })),
      })),
      security: await recentLogins(15),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
