"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Clock, Eye, Loader2, MousePointerClick, RefreshCw, Repeat, ScrollText, Shield, Users, type LucideIcon } from "lucide-react";

/* Visits, attention and clicks on the public site, from the first-party heartbeat. */

type Row = { label: string; value: number };
type Data = {
  range: string;
  generatedAt: string;
  kpis: { visitors: number; sessions: number; avgTimeMs: number; avgScroll: number; returningPct: number; engagedPct: number; live: number };
  daily: { date: string; sessions: number; visitors: number }[];
  sections: { id: string; label: string; totalMs: number; visitors: number; avgMs: number }[];
  stages: Row[];
  projects: Row[];
  actions: Row[];
  sources: Row[];
  countries: Row[];
  cities: Row[];
  devices: Row[];
  browsers: Row[];
  pages: Row[];
  recent: {
    id: string;
    firstSeen: string;
    lastSeen: string;
    place: string;
    device: string;
    source: string;
    returning: boolean;
    timeMs: number;
    scroll: number;
    pages: string[];
    topSection: string | null;
    clicks: { kind: string; label: string; at: string }[];
  }[];
  security: { at: string; ok: boolean; country?: string; city?: string; ua?: string; note?: string }[];
};

const GOLD = "#d4a853";
const RANGES = ["24h", "7d", "30d", "90d"] as const;
const ACTION_NAMES: Record<string, string> = {
  project: "Opened a project",
  "book-call": "Book a Call",
  resume: "Resume download",
  whatsapp: "WhatsApp",
  email: "Email",
  social: "Social profile",
  blog: "Blog",
  nav: "In-page navigation",
  external: "External link",
  link: "Other link",
  button: "Button / tab",
};

function duration(ms: number) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function ago(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

function Card({ title, hint, children, className = "" }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-white/85">{title}</h2>
        {hint && <span className="text-[11px] text-white/35">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45">
        <Icon className="h-3.5 w-3.5 text-[#d4a853]" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white/90">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
    </div>
  );
}

/** Horizontal bars: label above, value at the end, hover for the exact figure. */
function BarList({ rows, format = (v: number) => v.toLocaleString(), empty = "No data yet" }: { rows: Row[]; format?: (v: number) => string; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-white/35">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="group" title={`${r.label}: ${format(r.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate text-white/70">{r.label}</span>
            <span className="shrink-0 tabular-nums text-white/55">{format(r.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04]">
            <div className="h-2 rounded-full transition-opacity group-hover:opacity-80" style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, background: GOLD }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Sessions per day: thin bars on a recessive grid, a tooltip on hover. */
function DailyChart({ daily }: { daily: Data["daily"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 180;
  const pad = { l: 28, r: 8, t: 10, b: 24 };
  const max = Math.max(...daily.map((d) => d.sessions), 1);
  const nice = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const bw = (W - pad.l - pad.r) / daily.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / nice);
  const labelEvery = Math.ceil(daily.length / 8);
  const h = hover !== null ? daily[hover] : null;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Sessions per day">
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y(nice * f)} y2={y(nice * f)} stroke="rgba(255,255,255,0.06)" />
            <text x={pad.l - 6} y={y(nice * f) + 3} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)">
              {Math.round(nice * f)}
            </text>
          </g>
        ))}
        {daily.map((d, i) => {
          const x = pad.l + i * bw;
          const bh = Math.max(d.sessions ? 2 : 0, H - pad.b - y(d.sessions));
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              {bh > 0 && <rect x={x + (bw - Math.min(bw - 2, 24)) / 2} y={H - pad.b - bh} width={Math.max(1, Math.min(bw - 2, 24))} height={bh} rx={Math.min(4, bw / 2 - 1)} fill={GOLD} opacity={hover === null || hover === i ? 1 : 0.45} />}
              {i % labelEvery === 0 && (
                <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.35)">
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && (
        <div className="pointer-events-none absolute right-2 top-0 rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-xs text-white/80 shadow-xl">
          <div className="text-white/45">{h.date}</div>
          <div>
            {h.sessions} sessions · {h.visitors} visitors
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("7d");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 401 ? "Your session has expired. Sign in again." : "Could not load analytics.");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // keeps "here now" fresh
    return () => clearInterval(t);
  }, [load]);

  if (!data && loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-white/45">Who came, where their attention went, and what they clicked. Your own visits are never counted.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-white/10 p-1" role="tablist" aria-label="Time range">
            {RANGES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${range === r ? "bg-[#d4a853] font-semibold text-black" : "text-white/55 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={load} className="rounded-full border border-white/10 p-2 text-white/55 hover:text-white" aria-label="Refresh">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Kpi icon={Activity} label="Here now" value={String(data.kpis.live)} sub="active in the last minute" />
            <Kpi icon={Users} label="Visitors" value={data.kpis.visitors.toLocaleString()} sub={`${data.kpis.sessions.toLocaleString()} visits`} />
            <Kpi icon={Clock} label="Avg. time" value={duration(data.kpis.avgTimeMs)} sub="active time per visit" />
            <Kpi icon={ScrollText} label="Avg. scroll" value={`${data.kpis.avgScroll}%`} sub="of the page" />
            <Kpi icon={Eye} label="Engaged" value={`${data.kpis.engagedPct}%`} sub="stayed 10 s or more" />
            <Kpi icon={Repeat} label="Returning" value={`${data.kpis.returningPct}%`} sub="came back again" />
          </div>

          <Card title="Visits per day" hint="Gulf Standard Time">
            <DailyChart daily={data.daily} />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Where attention went" hint="total active time per section">
              {data.sections.length ? (
                <ul className="space-y-2.5">
                  {data.sections.map((s) => {
                    const max = data.sections[0].totalMs || 1;
                    return (
                      <li key={s.id} title={`${s.label}: ${duration(s.totalMs)} in total, ${duration(s.avgMs)} per visitor who reached it`}>
                        <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                          <span className="truncate text-white/70">{s.label}</span>
                          <span className="shrink-0 tabular-nums text-white/55">
                            {duration(s.totalMs)} <span className="text-white/30">· {s.visitors} reached · {duration(s.avgMs)} avg</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.04]">
                          <div className="h-2 rounded-full" style={{ width: `${Math.max(2, (s.totalMs / max) * 100)}%`, background: GOLD }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-white/35">No data yet</p>
              )}
            </Card>
            <Card title="Inside the showcase" hint="time per dossier tab">
              <BarList rows={data.stages} format={duration} />
            </Card>
            <Card title="Most clicked projects">
              <BarList rows={data.projects} empty="No project clicks yet" />
            </Card>
            <Card title="Actions" hint="clicks by type">
              <BarList rows={data.actions.map((a) => ({ label: ACTION_NAMES[a.label] ?? a.label, value: a.value }))} empty="No clicks yet" />
            </Card>
            <Card title="Traffic sources">
              <BarList rows={data.sources} />
            </Card>
            <Card title="Pages viewed">
              <BarList rows={data.pages} />
            </Card>
            <Card title="Countries">
              <BarList rows={data.countries} />
            </Card>
            <Card title="Cities">
              <BarList rows={data.cities} empty="City data appears once the site is visited on Vercel" />
            </Card>
            <Card title="Devices">
              <BarList rows={data.devices} />
            </Card>
            <Card title="Browsers">
              <BarList rows={data.browsers} />
            </Card>
          </div>

          <Card title="Recent visits" hint="newest first · tap a visit for its trail">
            {data.recent.length ? (
              <div className="divide-y divide-white/[0.05]">
                {data.recent.map((v) => (
                  <div key={v.id + v.firstSeen}>
                    <button onClick={() => setOpen(open === v.id ? null : v.id)} className="grid w-full grid-cols-[1fr_auto] items-center gap-3 py-3 text-left md:grid-cols-[150px_1fr_120px_90px_70px]">
                      <span className="text-xs text-white/45">{ago(v.lastSeen)}</span>
                      <span className="truncate text-sm text-white/80">
                        {v.place} <span className="text-white/35">· {v.device}</span>
                        {v.returning && <span className="ml-2 rounded-full border border-[#d4a853]/30 px-2 py-0.5 text-[10px] text-[#d4a853]">returning</span>}
                      </span>
                      <span className="hidden truncate text-xs text-white/45 md:block">{v.source}</span>
                      <span className="hidden text-xs tabular-nums text-white/55 md:block">{duration(v.timeMs)}</span>
                      <span className="hidden text-xs tabular-nums text-white/55 md:block">{v.scroll}%</span>
                    </button>
                    {open === v.id && (
                      <div className="mb-3 rounded-xl bg-white/[0.03] p-4 text-xs text-white/60">
                        <div>Pages: {v.pages.join(" → ")}</div>
                        {v.topSection && <div className="mt-1">Spent the most time on: {v.topSection}</div>}
                        <div className="mt-2 text-white/45">Clicks</div>
                        {v.clicks.length ? (
                          <ul className="mt-1 space-y-1">
                            {v.clicks.map((c, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <MousePointerClick className="h-3 w-3 text-[#d4a853]" />
                                <span className="text-white/75">{c.label || ACTION_NAMES[c.kind]}</span>
                                <span className="text-white/30">· {ACTION_NAMES[c.kind] ?? c.kind}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="mt-1 text-white/35">No clicks</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/35">No visits in this range yet</p>
            )}
          </Card>

          <Card title="Admin sign-ins" hint="last 15 attempts">
            {data.security.length ? (
              <ul className="space-y-2 text-xs">
                {data.security.map((s, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Shield className={`h-3.5 w-3.5 ${s.ok ? "text-emerald-400" : "text-red-400"}`} />
                    <span className={s.ok ? "text-emerald-300" : "text-red-300"}>{s.ok ? "Signed in" : s.note === "throttled" ? "Blocked (too many attempts)" : "Wrong password"}</span>
                    <span className="text-white/45">{ago(s.at)}</span>
                    <span className="truncate text-white/35">{[s.city, s.country].filter(Boolean).join(", ")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/35">No sign-in attempts recorded yet</p>
            )}
          </Card>
          <p className="text-[11px] text-white/30">Updated {ago(data.generatedAt)} · refreshes every 30 seconds</p>
        </>
      )}
    </div>
  );
}
