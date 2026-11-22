import type { ProjectData } from "@/lib/types";

/**
 * How a logo is drawn on the dark UI:
 * "white"  – transparent PNG/SVG turned into a white silhouette (default)
 * "screen" – logo on a black square: black drops out, colours become greys
 * "invert" – logo on a white square: inverted, then black drops out
 */
export type Logo = {
  name: string;
  src?: string;
  text?: string;
  h: number;
  mode?: "white" | "screen" | "invert";
  /** Hover state: full-colour file (defaults to src), a single brand tint for monochrome marks, and wordmark colour. */
  colorSrc?: string;
  tint?: string;
  color?: string;
  /** Width / height of the trimmed logo file, used to size every logo to the same visual weight. */
  ratio?: number;
  /** Hover plate colour (defaults to ivory). */
  plate?: string;
};
export type Mock = "trading" | "aman-mobile" | "golive" | "voice";

export type ShowItem = {
  key: string;
  title: string;
  tag?: string;
  desc: string;
  problem?: string;
  impact: string[];
  img?: string;
  mock?: Mock;
  glyph?: string;
  href?: string;
  live?: string;
  role?: string;
};

export type Sector = {
  id: string;
  label: string;
  short: string;
  line: string;
  /** In what capacity the work was done, so logos never imply more than the relationship was. */
  relation?: string;
  logos: Logo[];
  items: ShowItem[];
};

const LOGO: Record<string, Logo> = {
  bse: { name: "BSE", src: "/images/logos/bse-mark.png", h: 40 },
  nsdl: { name: "NSDL", src: "/images/logos/nsdl-mark.png", h: 42 },
  cms: { name: "CMS Info Systems", src: "/images/logos/cms-mark.png", text: "CMS", h: 22 },
  porsche: { name: "Porsche", src: "/images/logos/porsche-crest.svg", h: 44 },
  audi: { name: "Audi", src: "/images/logos/audi.svg", h: 30 },
  vw: { name: "Volkswagen", src: "/images/logos/volkswagen.svg", h: 34 },
  xpeng: { name: "XPENG", text: "XPENG", h: 22 },
  rufescent: { name: "The Rufescent", src: "/images/logos/rufescent-crest.png", h: 44 },
};

/** Every company worked with, for the scrolling strip on the laptop. */
export const BRANDS: Logo[] = [
  { name: "BSE", src: "/images/logos/bse-mark.png", ratio: 2.212, h: 34 },
  { name: "Porsche", src: "/images/logos/porsche-crest-mark.png", colorSrc: "/images/logos/porsche-mark.png", ratio: 0.787, h: 42 },
  { name: "Audi", src: "/images/logos/audi-mark.png", ratio: 2.854, h: 30 },
  { name: "NSDL", src: "/images/logos/nsdl-mark.png", ratio: 0.926, h: 42 },
  { name: "Volkswagen", src: "/images/logos/volkswagen-mark.png", tint: "#001E50", ratio: 1, h: 42 },
  { name: "ICCL", src: "/images/logos/iccl-mark.png", colorSrc: "/images/logos/iccl-color-mark.png", ratio: 1.642, h: 39 },
  { name: "XPENG", text: "XPENG", color: "#111111", h: 20 },
  { name: "CMS Info Systems", src: "/images/logos/cms-mark.png", text: "CMS", color: "#1d2a5c", ratio: 2.755, h: 26 },
  { name: "Ali & Sons", src: "/images/logos/alisons-mark.png", ratio: 0.869, h: 42 },
  { name: "Azaya", text: "AZAYA", color: "#0e2a5c", h: 20 },
  { name: "Oneture Technologies", src: "/images/logos/oneture-mark.png", text: "ONETURE", color: "#1e3a8a", ratio: 0.998, h: 26 },
  { name: "Hoopr", src: "/images/logos/hoopr-mark.png", plate: "#0d0d0d", ratio: 2.308, h: 33 },
  { name: "Blackcurrant Labs", src: "/images/logos/blc-mark.png", text: "BLACKCURRANT", color: "#3b1452", ratio: 0.665, h: 26 },
];

/** Work that has no public case-study page. Wording follows the CV, the experience entries and project READMEs. */
const STATIC: Record<string, ShowItem> = {
  mt5: {
    key: "mt5-trading",
    title: "MT5 Trading & Payments",
    tag: "Azaya · UAE-licensed brokers",
    desc: "MT5 trading platforms and regional payment gateways for UAE-licensed brokers.",
    problem: "Broker deposits took hours to clear, slowing trader onboarding on live MT5 accounts.",
    impact: ["99.9% uptime on production MT5 platforms", "Deposits cut from 2 hours to 15 minutes", "e& Payments, N-Genius and MyFatoorah integrated"],
    role: "Lead full-stack engineer: platform architecture, gateway integrations, delivery",
    mock: "trading",
    glyph: "MT5",
  },
  amanMobile: {
    key: "aman-dms-mobile",
    title: "AMAN DMS Mobile",
    tag: "Ali & Sons",
    desc: "The dealer management system on the phone for sales, service, drivers and warehouse staff.",
    problem: "Dealership teams could only reach approvals, deals and job cards from a desk.",
    impact: ["One React Native app for iOS and Android", ".NET API writing to the DMS through stored procedures", "Approvals, deals, job cards, parking, stock in one app"],
    role: "Full-stack developer & AI engineer, Ali & Sons",
    mock: "aman-mobile",
    glyph: "A",
  },
  amanGoLive: {
    key: "aman-go-live",
    title: "AMAN Go-Live Command Centre",
    tag: "Ali & Sons",
    desc: "An executive control room for the DMS roll-out across XPENG, MG, Audi, Volkswagen, Škoda and Porsche.",
    problem: "Leadership needed one screen to see readiness, blockers and the next brand wave.",
    impact: ["Readiness, blockers and next wave at a glance", "React on ASP.NET Core, Dapper and SQL Server", "Built for live executive reviews"],
    role: "Full-stack developer & AI engineer, Ali & Sons",
    mock: "golive",
    glyph: "GL",
  },
  voice: {
    key: "dealer-voice-agents",
    title: "AI Voice Agents",
    tag: "Audi · Porsche · Volkswagen",
    desc: "Voice agents that answer dealership customers and book appointments.",
    problem: "Routine customer calls tied up dealership staff across three brands.",
    impact: ["60%+ of routine customer queries automated", "Natural conversation with calendar booking", "Hand-off to the CRM"],
    role: "Full-stack developer & AI engineer, Ali & Sons",
    mock: "voice",
    glyph: "AI",
  },
};

function fromProject(p: ProjectData | undefined, tag?: string): ShowItem | null {
  if (!p) return null;
  return {
    key: p.slug,
    title: p.title,
    tag: tag ?? p.category,
    desc: p.desc,
    problem: p.problem,
    impact: (p.impact ?? []).slice(0, 3),
    img: p.imgPath,
    href: `/projects/${p.slug}`,
    live: p.liveUrl,
    role: p.role,
  };
}

export function buildSectors(projects: ProjectData[], mode: "desktop" | "mobile"): Sector[] {
  const by = (slug: string, tag?: string) => fromProject(projects.find((p) => p.slug === slug), tag);
  const keep = (xs: (ShowItem | null)[]) => xs.filter((x): x is ShowItem => !!x);

  const fintech: Sector = {
    id: "fintech",
    label: "Banking & Fintech",
    short: "Fintech",
    line: "Exchanges, depositories, brokers and payments.",
    relation: "BSE, NSDL, ICCL and CMS as client engagements via Oneture · Lead engineer at Azaya",
    logos: [LOGO.bse, LOGO.nsdl, LOGO.cms],
    items: keep([STATIC.mt5, by("bse-data-service", "BSE · Exchange"), by("nsdl-fpi-dashboard", "NSDL · Depository"), by("signflow", "KYC · UAE brokers")]),
  };
  const automotive: Sector = {
    id: "automotive",
    label: "Automotive",
    short: "Auto",
    line: "Dealer systems and AI agents for the Ali & Sons brands.",
    relation: "In-house at Ali & Sons, the group behind these dealerships",
    logos: [LOGO.porsche, LOGO.audi, LOGO.vw, LOGO.xpeng],
    items: keep([STATIC.amanMobile, STATIC.amanGoLive, STATIC.voice, by("luxury-automotive", "Freelance")]),
  };
  const property: Sector = {
    id: "property",
    label: "Real Estate & Interiors",
    short: "Property",
    line: "Property and interiors for Dubai and Abu Dhabi.",
    logos: [],
    items: keep([by("prestige-real-estate", "Freelance"), by("myvisual-space", "Freelance")]),
  };
  const luxury: Sector = {
    id: "luxury",
    label: "Luxury & Hospitality",
    short: "Luxury",
    line: "Members' clubs, studios and personal brands.",
    relation: "The Rufescent is a self-initiated concept, not client work",
    logos: [LOGO.rufescent],
    items: keep([by("the-rufescent-private-invitations", "Concept"), by("podcast-ecospace", "Freelance"), by("kristina-svirina", "Freelance")]),
  };
  const ai: Sector = {
    id: "ai",
    label: "AI Systems",
    short: "AI",
    line: "Agents, search and recognition in production.",
    logos: [],
    items: keep([by("voxen"), by("aegisuae"), by("querytube"), by("hoopr-ai")]),
  };

  const order = mode === "desktop" ? [fintech, automotive, property, luxury, ai] : [automotive, fintech, property, ai, luxury];
  return order.filter((s) => s.items.length > 0);
}
