"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from "motion/react";
import type { Logo, Mock, ShowItem } from "./data";

export const CALENDLY = "https://calendly.com/rogerthatvivek/30min";
export const GOLD = "#d4a853";
export const GOLD_SOFT = "rgba(212,168,83,0.6)";
export const INK = "rgba(255,255,255,0.92)";
export const MUTED = "rgba(255,255,255,0.58)";
export const FAINT = "rgba(255,255,255,0.34)";
export const LINE = "rgba(255,255,255,0.08)";
/** Brighter gold for terminal text: same hue, more contrast on near-black. */
export const TERM_GOLD = "#ecc980";

/** Renders children on a fixed virtual canvas and scales it to the real screen size. */
export function Virtual({ w, h, scale, children }: { w: number; h: number; scale: number; children: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  );
}

export const clampLines = (n: number): CSSProperties => ({
  display: "-webkit-box",
  WebkitLineClamp: n,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

/* ------------------------------------------------------------------ typing terminal */

/** Typed on load: short on purpose, the rest is revealed by scrolling. */
export const TYPING_TEXT = `$ whoami
> Vivek. Software developer & architect.
> Fintech & payments ·¹²³⁴⁵
> Built for BSE, NSDL, CMS, Porsche & Audi.`;

/** Placeholder characters in TYPING_TEXT that render as tech logos when typing reaches them. */
const TECH: Record<string, { src: string; name: string }> = {
  "¹": { src: "/images/tech/java.svg", name: "Java" },
  "²": { src: "/images/tech/dot-net.svg", name: ".NET" },
  "³": { src: "/images/tech/angular.svg", name: "Angular" },
  "⁴": { src: "/images/tech/react.svg", name: "React" },
  "⁵": { src: "/images/tech/nodejs.svg", name: "Node.js" },
};

function withLogos(text: string, fontSize: number) {
  const out: ReactNode[] = [];
  let run = "";
  [...text].forEach((ch, k) => {
    const t = TECH[ch];
    if (!t) {
      run += ch;
      return;
    }
    if (run) out.push(run);
    run = "";
    out.push(
      <motion.img
        key={k}
        src={t.src}
        alt={t.name}
        title={t.name}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        style={{ display: "inline-block", width: fontSize * 1.3, height: fontSize * 1.3, verticalAlign: `${-fontSize * 0.32}px`, margin: `0 0 0 ${fontSize * 0.42}px` }}
      />,
    );
  });
  if (run) out.push(run);
  return out;
}

type Step = { kind: "cmd" | "out"; text: string; at: [number, number]; color?: string };

/** Revealed by scroll progress (0 → 1): one command or one line at a time. */
function scrollScript(operations: number, sectors: number): Step[] {
  return [
    { kind: "cmd", text: "cat principles.txt", at: [0.0, 0.12] },
    { kind: "out", text: "01 / Scope is a commitment. Changes are transparent.", at: [0.16, 0.28] },
    { kind: "out", text: "02 / Confidential by design. Ownership defined upfront.", at: [0.3, 0.42] },
    { kind: "out", text: "03 / Built for production. Delivered with accountability.", at: [0.44, 0.56] },
    { kind: "cmd", text: "./dossier --clearance 007 --all", at: [0.6, 0.76] },
    { kind: "out", text: `Decrypting ${operations} operations across ${sectors} sectors…`, at: [0.8, 0.86] },
    { kind: "out", text: "Clearance verified. Access granted.", at: [0.9, 0.95], color: "#4ade80" },
  ];
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * The terminal. The whoami briefing types itself on a timer; after that, `command` (0 → 1, driven by
 * page scroll) types each step of the script in turn. Older lines scroll up inside a fixed-height body.
 */
export function Typing({ fontSize, startDelay = 2200, command, operations = 0, sectors = 0, height }: { fontSize: number; startDelay?: number; command?: MotionValue<number>; operations?: number; sectors?: number; height?: number }) {
  const [n, setN] = useState(0);
  const [c, setC] = useState(0);
  const idle = useMotionValue(0);
  useMotionValueEvent(command ?? idle, "change", (v) => setC((prev) => (Math.abs(prev - v) > 0.003 || v === 0 || v === 1 ? v : prev)));
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setN((v) => {
          if (v >= TYPING_TEXT.length) {
            clearInterval(timer);
            return v;
          }
          return v + 1;
        });
      }, 24);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [startDelay]);

  // scrolling finishes the briefing instantly, so the commands never collide with it
  const introDone = n >= TYPING_TEXT.length || c > 0;
  const intro = c > 0 ? TYPING_TEXT : TYPING_TEXT.slice(0, n);
  const script = scrollScript(operations, sectors);
  const shown = script.map((st, i) => {
    const prevEnd = i === 0 ? 0 : script[i - 1].at[1];
    const visible = st.kind === "cmd" ? c >= prevEnd && introDone : c > st.at[0];
    const p = clamp01((c - st.at[0]) / (st.at[1] - st.at[0]));
    return { ...st, visible, typed: st.text.slice(0, Math.round(p * st.text.length)), done: p >= 1 };
  });
  const finished = shown[shown.length - 1].done;
  const activeIndex = shown.findIndex((st) => st.visible && !st.done);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [n, c]);

  const cursor = (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
      style={{ display: "inline-block", width: fontSize * 0.55, height: fontSize * 1.1, background: GOLD_SOFT, transform: `translateY(${fontSize * 0.2}px)`, marginLeft: 2 }}
    />
  );
  const lines = intro.split("\n");
  return (
    <div ref={bodyRef} style={{ maxHeight: height, overflow: "hidden" }}>
      <pre style={{ margin: 0, fontFamily: "var(--font-mono), ui-monospace, Menlo, monospace", fontSize, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {lines.map((line, i) => (
          <span key={i}>
            {line.startsWith("$") ? (
              <>
                <span style={{ color: "#4ade80" }}>$</span>
                <span style={{ color: "rgba(255,255,255,0.78)" }}>{line.slice(1)}</span>
              </>
            ) : (
              <>
                <span style={{ color: "rgba(236,201,128,0.6)" }}>&gt;</span>
                <span style={{ color: TERM_GOLD }}>{withLogos(line.slice(1), fontSize)}</span>
              </>
            )}
            {i < lines.length - 1 && "\n"}
          </span>
        ))}
        {!introDone && cursor}
        {introDone &&
          shown.map((st, i) =>
            st.visible ? (
              <span key={i}>
                {"\n"}
                {st.kind === "cmd" ? <span style={{ color: "#4ade80" }}>$ </span> : <span style={{ color: "rgba(236,201,128,0.6)" }}>&gt; </span>}
                <span style={{ color: st.kind === "cmd" ? INK : st.color ?? TERM_GOLD }}>{st.typed}</span>
                {(i === activeIndex || (activeIndex === -1 && !finished && i === shown.filter((x) => x.visible).length - 1)) && cursor}
              </span>
            ) : null,
          )}
        {finished && (
          <>
            {"\n"}
            <span style={{ color: "#4ade80" }}>$ </span>
            {cursor}
          </>
        )}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ logos */

const LOGO_FILTER = {
  white: { filter: "brightness(0) invert(1)", opacity: 0.78 },
  screen: { filter: "grayscale(1) brightness(1.15)", mixBlendMode: "screen" as const, opacity: 0.85 },
  invert: { filter: "invert(1) grayscale(1) brightness(1.3)", mixBlendMode: "screen" as const, opacity: 0.85 },
};

/** One brand mark: drawn for the dark UI, or in its real colours when `colored` (hover). */
export function BrandMark({ logo, scale = 1, colored = false, textScale = 0.75, tracking = "0.22em" }: { logo: Logo; scale?: number; colored?: boolean; textScale?: number; tracking?: string }) {
  const look = colored ? { filter: "none", opacity: 1 } : LOGO_FILTER[logo.mode ?? "white"];
  const src = colored && logo.colorSrc ? logo.colorSrc : logo.src;
  const tinted = colored && !!logo.tint;
  return (
    <span title={logo.name} style={{ display: "inline-flex", alignItems: "center", gap: 10 * scale, flexShrink: 0 }}>
      {src && (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <img src={src} alt={logo.text ? "" : logo.name} draggable={false} style={{ height: logo.h * scale, width: "auto", transition: "filter .25s, opacity .25s", ...look, ...(tinted ? { opacity: 0 } : {}) }} />
          {tinted && (
            <span
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, background: logo.tint, WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }}
            />
          )}
        </span>
      )}
      {logo.text && (
        <span style={{ fontSize: (logo.src ? textScale : 1) * logo.h * scale, fontWeight: 700, letterSpacing: tracking, color: colored ? logo.color ?? "#111" : "rgba(255,255,255,0.78)", lineHeight: 1, whiteSpace: "nowrap", transition: "color .25s" }}>
          {logo.text}
        </span>
      )}
    </span>
  );
}

/**
 * Uniform optical size: image logos share the same visual area (so a wide wordmark and a tall
 * crest weigh the same), capped in height and width; icon + wordmark pairs and plain wordmarks
 * use one fixed icon height and one text size.
 */
const MARK_AREA = 2500;
const MARK_MAX_H = 42;
const MARK_MAX_W = 118;
function uniform(logo: Logo): Logo {
  if (logo.src && !logo.text && logo.ratio) {
    const h = Math.min(Math.sqrt(MARK_AREA / logo.ratio), MARK_MAX_H, MARK_MAX_W / logo.ratio);
    return { ...logo, h };
  }
  if (logo.src && logo.text) return { ...logo, h: Math.min(26, Math.sqrt(1000 / (logo.ratio ?? 1))) };
  return { ...logo, h: 20 };
}

/** A logo in the strip: on hover it lifts onto a plate and shows its real colours. */
export function MarqueeItem({ logo: raw }: { logo: Logo }) {
  const logo = uniform(raw);
  const [on, setOn] = useState(false);
  return (
    <motion.span
      onHoverStart={() => setOn(true)}
      onHoverEnd={() => setOn(false)}
      animate={{ scale: on ? 1.22 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", height: MARK_MAX_H + 24, padding: "0 20px", borderRadius: 16, flexShrink: 0, zIndex: on ? 2 : 1 }}
    >
      <span
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, borderRadius: 16, background: logo.plate ?? "#f7f4ee", opacity: on ? 1 : 0, transition: "opacity .25s", boxShadow: on ? "0 18px 40px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,83,0.35)" : "none" }}
      />
      <span style={{ position: "relative" }}>
        <BrandMark logo={logo} colored={on} textScale={0.72} tracking="0.18em" />
      </span>
    </motion.span>
  );
}

export function LogoRow({ logos, height = 1, gap = 40 }: { logos: Logo[]; height?: number; gap?: number }) {
  if (!logos.length) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap, flexWrap: "wrap" }}>
      {logos.map((l) => (
        <BrandMark key={l.name} logo={l} scale={height} />
      ))}
    </div>
  );
}

/** Logos drifting right to left in a seamless loop, faded at both edges. Hovering pauses it. */
export function LogoMarquee({ logos, gap = 40, speed = 55, startDelay = 2400 }: { logos: Logo[]; gap?: number; speed?: number; startDelay?: number }) {
  const x = useMotionValue(0);
  const setRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const reduced = useReducedMotion();
  useAnimationFrame((time, delta) => {
    if (reduced || paused.current || time < startDelay) return;
    const w = setRef.current?.offsetWidth ?? 0;
    if (!w) return;
    let v = x.get() - (speed * Math.min(delta, 64)) / 1000;
    if (v <= -w) v += w;
    x.set(v);
  });
  const set = (k: number) => (
    <div key={k} ref={k === 0 ? setRef : undefined} aria-hidden={k === 1} style={{ display: "flex", alignItems: "center", gap, paddingRight: gap, flexShrink: 0 }}>
      {logos.map((l) => (
        <MarqueeItem key={l.name} logo={l} />
      ))}
    </div>
  );
  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      style={{ overflow: "hidden", padding: "10px 0", paddingLeft: "14%", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}
    >
      <motion.div style={{ display: "flex", width: "max-content", x }}>
        {set(0)}
        {set(1)}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ illustrations for work without public screenshots */

function seeded(n: number) {
  let s = 7;
  return Array.from({ length: n }, () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  });
}
const CANDLES = (() => {
  const r = seeded(120);
  let price = 100;
  return Array.from({ length: 30 }, (_, i) => {
    const open = price;
    const close = open + (r[i * 3] - 0.45) * 7;
    const high = Math.max(open, close) + r[i * 3 + 1] * 3;
    const low = Math.min(open, close) - r[i * 3 + 2] * 3;
    price = close;
    return { open, close, high, low };
  });
})();

function MockTrading() {
  const lo = Math.min(...CANDLES.map((c) => c.low));
  const hi = Math.max(...CANDLES.map((c) => c.high));
  const Y = (v: number) => 12 + ((hi - v) / (hi - lo)) * 196;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#121212,#0a0a0a)", padding: 20, display: "grid", gridTemplateColumns: "1fr 150px", gap: 16 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: MUTED, marginBottom: 6, fontFamily: "var(--font-mono), monospace" }}>
          <span style={{ color: INK }}>XAUUSD · M15</span>
          <span style={{ color: "#4ade80" }}>MT5 live</span>
        </div>
        <svg width="330" height="220" viewBox="0 0 330 220">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" x2="330" y1={20 + i * 60} y2={20 + i * 60} stroke="rgba(255,255,255,0.06)" />
          ))}
          {CANDLES.map((c, i) => {
            const x = 8 + i * 10.6;
            const up = c.close >= c.open;
            const col = up ? "#d4a853" : "rgba(255,255,255,0.35)";
            return (
              <g key={i}>
                <line x1={x + 3} x2={x + 3} y1={Y(c.high)} y2={Y(c.low)} stroke={col} strokeWidth="1" />
                <rect x={x} width="6" y={Y(Math.max(c.open, c.close))} height={Math.max(2, Math.abs(Y(c.open) - Y(c.close)))} fill={col} rx="1" />
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.18em", color: FAINT, textTransform: "uppercase" }}>Deposit via</span>
        {["N-Genius", "e& Payments", "MyFatoorah"].map((g, i) => (
          <span key={g} style={{ fontSize: 13, padding: "9px 12px", borderRadius: 10, border: `1px solid ${i === 0 ? "rgba(212,168,83,0.5)" : LINE}`, color: i === 0 ? GOLD : MUTED, background: i === 0 ? "rgba(212,168,83,0.08)" : "transparent" }}>
            {g}
          </span>
        ))}
        <span style={{ marginTop: "auto", fontSize: 12, color: "#4ade80" }}>● Settled</span>
      </div>
    </div>
  );
}

/* AMAN DMS, rebuilt from the app's own design tokens (palette.json): navy header, white cards, slate text. */
const AM = {
  navy: "#1E2D6B", brand: "#2B4094", brandTint: "#EEF2FF", page: "#EEF2F7", card: "#FFFFFF", text: "#1E293B",
  text2: "#475569", text3: "#64748B", border: "#E2E8F0", onNavy2: "#CBD5E1", success: "#1E7A5A", warning: "#A7833D", danger: "#C04A4A",
};

/** An iPhone-style frame around a 300 × 650 screen, scaled to `scale`. */
function AmanPhone({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div style={{ width: 300 * scale + 14, height: 650 * scale + 14, borderRadius: 46 * scale + 7, padding: 7, background: "linear-gradient(145deg,#3a3a3c,#0c0c0d 40%,#1c1c1e 75%,#3a3a3c)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.1)", flexShrink: 0 }}>
      <div style={{ position: "relative", width: 300 * scale, height: 650 * scale, borderRadius: 40 * scale, overflow: "hidden", background: AM.page }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 650, transform: `scale(${scale})`, transformOrigin: "0 0", fontFamily: "-apple-system, 'SF Pro Text', Inter, system-ui, sans-serif" }}>
          {children}
          <span style={{ position: "absolute", left: "50%", top: 10, width: 96, height: 28, borderRadius: 20, background: "#000", transform: "translateX(-50%)" }} />
        </div>
      </div>
    </div>
  );
}

function AmanStatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px 0", color: "#fff", fontSize: 13, fontWeight: 600 }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="#fff"><rect x="0" y="6" width="3" height="4" rx="1" /><rect x="4.3" y="4" width="3" height="6" rx="1" /><rect x="8.6" y="2" width="3" height="8" rx="1" /><rect x="12.9" y="0" width="3" height="10" rx="1" /></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="19" height="10" rx="3" fill="none" stroke="#fff" strokeOpacity="0.5" /><rect x="2" y="2" width="14" height="7" rx="1.6" fill="#fff" /></svg>
      </span>
    </div>
  );
}

const amIcon = {
  chart: "M5 19V11M12 19V5M19 19v-6",
  check: "M4 12.5l5 5L20 7",
  chat: "M4 5h16v11H9l-5 4z",
  bag: "M4 8h16v12H4zM9 8V5h6v3",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  back: "M15 5l-7 7 7 7",
};
const AmSvg = ({ d, size = 18, color = AM.brand }: { d: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const Initials = ({ t, size, bg = AM.brandTint, fg = AM.brand }: { t: string; size: number; bg?: string; fg?: string }) => (
  <span style={{ width: size, height: size, borderRadius: 99, background: bg, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, flexShrink: 0 }}>{t}</span>
);

function AmanTabBar({ active }: { active: number }) {
  const tabs: [string, string][] = [["Dashboard", amIcon.chart], ["Approvals", amIcon.check], ["Messages", amIcon.chat], ["Deals", amIcon.bag]];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 74, background: AM.card, borderTop: `1px solid ${AM.border}`, display: "flex", justifyContent: "space-around", paddingTop: 10 }}>
      {tabs.map(([t, d], k) => (
        <span key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: k === active ? 700 : 500, color: k === active ? AM.brand : AM.text3 }}>
          <AmSvg d={d} size={20} color={k === active ? AM.brand : AM.text3} />
          {t}
        </span>
      ))}
    </div>
  );
}

function AmanOverviewScreen() {
  const stat = (icon: string, label: string, value: ReactNode, cap: string) => (
    <div style={{ background: AM.card, border: `1px solid ${AM.border}`, borderRadius: 14, padding: "10px 11px", boxShadow: "0 1px 2px rgba(15,23,42,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: AM.text2 }}>
        <span style={{ width: 22, height: 22, borderRadius: 99, background: AM.brandTint, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><AmSvg d={icon} size={12} /></span>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 8, letterSpacing: "0.08em", color: AM.text2, marginTop: 5, fontWeight: 600 }}>{cap}</div>
    </div>
  );
  const gm = (ini: string, name: string, brand: string, c: number, o: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: AM.card, border: `1px solid ${AM.border}`, borderRadius: 14, padding: "10px 11px", marginTop: 8 }}>
      <Initials t={ini} size={34} bg="#DCE3F5" fg={AM.navy} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: AM.text }}>{name}</div>
        <div style={{ fontSize: 10.5, color: AM.text2 }}>{brand}</div>
        <div style={{ fontSize: 10.5, color: AM.text2, marginTop: 1 }}>
          Deals: <b style={{ color: AM.success }}>{c}</b> closed · <b style={{ color: AM.text }}>{o}</b> open
        </div>
      </div>
      <AmSvg d="M9 5l7 7-7 7" size={14} color={AM.text3} />
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: AM.page, color: AM.text }}>
      <div style={{ background: AM.navy, borderRadius: "0 0 22px 22px", paddingBottom: 14 }}>
        <AmanStatusBar />
        <div style={{ position: "relative", textAlign: "center", marginTop: 12 }}>
          <img src="/images/logos/aman-logo.png" alt="AMAN" style={{ height: 26, width: "auto", display: "block", margin: "0 auto" }} />
          <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginTop: 6 }}>Group Overview</div>
          <div style={{ color: AM.onNavy2, fontSize: 11 }}>Sara · Managing Director</div>
          <span style={{ position: "absolute", left: 16, top: 28 }}><Initials t="SA" size={30} bg="rgba(255,255,255,0.14)" fg="#fff" /></span>
          <span style={{ position: "absolute", right: 16, top: 28, width: 30, height: 30, borderRadius: 99, background: "rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <AmSvg d={amIcon.bell} size={15} color="#fff" />
            <span style={{ position: "absolute", top: -3, right: -3, width: 14, height: 14, borderRadius: 99, background: AM.danger, color: "#fff", fontSize: 8.5, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>2</span>
          </span>
        </div>
      </div>
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>Good evening, Sara.</div>
        <div style={{ fontSize: 11, color: AM.text2, marginTop: 2 }}>You have 3 approvals awaiting your decision.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          {stat(amIcon.check, "Approvals", <span style={{ color: AM.warning }}>3</span>, "PENDING YOUR DECISION")}
          {stat(amIcon.bag, "Deals", <><span style={{ color: AM.success }}>96</span><span style={{ color: AM.text3, fontWeight: 400 }}> | </span>164</>, "CLOSED | OPEN")}
          {stat(amIcon.chat, "Messages", <span style={{ color: AM.success }}>4</span>, "UNREAD")}
          {stat(amIcon.bell, "Notifications", <span style={{ color: AM.warning }}>2</span>, "NEED ATTENTION")}
        </div>
        <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: AM.text2, fontWeight: 700, marginTop: 12 }}>GENERAL MANAGERS · NOVEMBER</div>
        {gm("OH", "Omar Haddad", "SKODA", 12, 18)}
        {gm("DR", "Daniel Reyes", "AUDI · Volkswagen", 41, 77)}
      </div>
      <AmanTabBar active={0} />
    </div>
  );
}

function AmanApprovalsScreen() {
  const req = (kind: string, title: string, meta: string, amount: string, ini: string) => (
    <div style={{ background: AM.card, border: `1px solid ${AM.border}`, borderRadius: 14, padding: "11px 12px", marginTop: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: AM.brand, background: AM.brandTint, borderRadius: 99, padding: "3px 8px" }}>{kind}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: AM.text }}>{amount}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 7 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: AM.text2, marginTop: 4 }}>
        <Initials t={ini} size={18} />
        {meta}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 10 }}>
        <span style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: AM.danger, border: `1px solid #E6BDBD`, borderRadius: 10, padding: "7px 0" }}>Reject</span>
        <span style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: "#fff", background: `linear-gradient(180deg, ${AM.brand}, ${AM.navy})`, borderRadius: 10, padding: "7px 0" }}>Approve</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: AM.page, color: AM.text }}>
      <div style={{ background: AM.navy, borderRadius: "0 0 22px 22px", paddingBottom: 16 }}>
        <AmanStatusBar />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 0" }}>
          <AmSvg d={amIcon.back} size={18} color="#fff" />
          <div>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Approvals</div>
            <div style={{ color: AM.onNavy2, fontSize: 11 }}>3 waiting on you</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#E2E8F0", borderRadius: 11, padding: 3, fontSize: 11, fontWeight: 600, textAlign: "center" }}>
          <span style={{ background: AM.card, borderRadius: 9, padding: "6px 0", color: AM.text, boxShadow: "0 1px 2px rgba(15,23,42,0.08)" }}>Pending · 3</span>
          <span style={{ padding: "6px 0", color: AM.text3 }}>Approved</span>
          <span style={{ padding: "6px 0", color: AM.text3 }}>Rejected</span>
        </div>
        {req("DISCOUNT", "Audi Q5 Sportback · S line", "L. Mendes · Sales advisor", "AED 4,500", "LM")}
        {req("LPO", "Workshop parts · 14 lines", "R. Khan · Parts", "AED 12,840", "RK")}
      </div>
      <AmanTabBar active={1} />
    </div>
  );
}

function MockAmanMobile() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 80% at 50% 0%, rgba(43,64,148,0.35), transparent 65%), #0b0b0d", display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
      <AmanPhone scale={0.44}>
        <AmanOverviewScreen />
      </AmanPhone>
      <div style={{ transform: "translateY(10px)" }}>
        <AmanPhone scale={0.44}>
          <AmanApprovalsScreen />
        </AmanPhone>
      </div>
      <span style={{ position: "absolute", right: 30, top: 36, fontSize: 9.5, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)" }}>DEMO DATA</span>
    </div>
  );
}

function MockGoLive() {
  const brands = ["XPENG", "MG", "Audi", "VW", "Škoda", "Porsche"];
  const stages = ["Plan", "Build", "Test", "Train", "Go-live"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#121110,#0a0a0a)", padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 18, color: INK, fontWeight: 600 }}>Go-live command centre</span>
        <span style={{ fontSize: 11, color: FAINT }}>Illustration</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {brands.map((b, i) => (
          <span key={b} style={{ fontSize: 12, padding: "7px 12px", borderRadius: 999, border: `1px solid ${i === 0 ? "rgba(212,168,83,0.55)" : LINE}`, color: i === 0 ? GOLD : MUTED }}>
            {b}
          </span>
        ))}
      </div>
      <div style={{ position: "relative", marginTop: 8 }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 2, background: LINE }} />
        <div style={{ position: "absolute", left: 10, width: "52%", top: 10, height: 2, background: GOLD }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {stages.map((s, i) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
              <span style={{ width: 22, height: 22, borderRadius: 99, background: i <= 2 ? GOLD : "#1a1a1a", border: `2px solid ${i <= 2 ? GOLD : "rgba(255,255,255,0.15)"}` }} />
              <span style={{ fontSize: 12, color: i <= 2 ? INK : FAINT }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: "auto" }}>
        {["Readiness", "Blockers", "Next wave"].map((k) => (
          <div key={k} style={{ borderRadius: 12, border: `1px solid ${LINE}`, padding: "12px 14px", fontSize: 12, color: MUTED }}>
            {k}
            <div style={{ height: 6, marginTop: 10, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MockVoice() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 80% at 30% 40%,rgba(212,168,83,0.12),transparent 60%),#0b0b0b", padding: 24, display: "grid", gridTemplateColumns: "170px 1fr", gap: 22, alignItems: "center" }}>
      <div style={{ width: 160, height: 160, borderRadius: 999, border: "1px solid rgba(212,168,83,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <motion.span
            key={i}
            animate={{ scaleY: [0.35, 1, 0.5, 0.85, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.09, ease: "easeInOut" }}
            style={{ width: 5, height: 56, borderRadius: 4, background: GOLD, display: "block" }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
        <span style={{ alignSelf: "flex-start", maxWidth: 260, padding: "9px 12px", borderRadius: "12px 12px 12px 3px", background: "rgba(255,255,255,0.06)", color: MUTED }}>
          I&apos;d like to book a service for my car.
        </span>
        <span style={{ alignSelf: "flex-end", maxWidth: 260, padding: "9px 12px", borderRadius: "12px 12px 3px 12px", background: "rgba(212,168,83,0.14)", color: GOLD }}>
          Thursday at 10:00 is free. Shall I confirm it?
        </span>
        <span style={{ fontSize: 11, color: FAINT }}>Illustration · voice booking flow</span>
      </div>
    </div>
  );
}

const MOCKS: Record<Mock, () => ReactNode> = {
  trading: MockTrading,
  "aman-mobile": MockAmanMobile,
  golive: MockGoLive,
  voice: MockVoice,
};

/** A project's picture: its screenshot, or an illustration drawn at 520 × 325 and scaled. */
export function Thumb({ item, w, h, sizes, rounded = 14 }: { item: ShowItem; w: number; h: number; sizes: string; rounded?: number }) {
  const MockView = item.mock ? MOCKS[item.mock] : null;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: rounded, overflow: "hidden", border: `1px solid ${LINE}`, background: "#0b0b0b", flexShrink: 0 }}>
      {MockView ? (
        <div style={{ position: "absolute", left: (w - 520 * Math.max(w / 520, h / 325)) / 2, top: (h - 325 * Math.max(w / 520, h / 325)) / 2, width: 520, height: 325, transform: `scale(${Math.max(w / 520, h / 325)})`, transformOrigin: "0 0" }}>
          <MockView />
        </div>
      ) : item.img ? (
        <Image src={item.img} alt={item.title} fill sizes={sizes} style={{ objectFit: "cover", objectPosition: "top" }} />
      ) : null}
    </div>
  );
}

/** App-store style icon: a crop of the screenshot, or a gold glyph tile. */
export function AppIcon({ item, size }: { item: ShowItem; size: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: size * 0.23, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
      {item.icon ? (
        <Image src={item.icon} alt="" fill sizes={`${Math.round(size)}px`} style={{ objectFit: "cover" }} />
      ) : item.img && !item.mock ? (
        <Image src={item.img} alt="" fill sizes={`${Math.round(size)}px`} style={{ objectFit: "cover", objectPosition: "top left" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(140deg,#3a2c14,#0f0c08 70%)", color: GOLD, fontWeight: 700, fontSize: size * (item.glyph && item.glyph.length > 2 ? 0.26 : 0.36), letterSpacing: "0.04em" }}>
          {item.glyph ?? item.title.slice(0, 1)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ location */

/** UAE flag: red hoist band, then green, white and black stripes (1:2). */
export function UaeFlag({ h }: { h: number }) {
  return (
    <svg width={h * 2} height={h} viewBox="0 0 12 6" role="img" aria-label="United Arab Emirates" style={{ borderRadius: h * 0.14, boxShadow: "0 0 0 1px rgba(255,255,255,0.15)", flexShrink: 0 }}>
      <rect x="3" y="0" width="9" height="2" fill="#00732F" />
      <rect x="3" y="2" width="9" height="2" fill="#FFFFFF" />
      <rect x="3" y="4" width="9" height="2" fill="#000000" />
      <rect x="0" y="0" width="3" height="6" fill="#EF3340" />
    </svg>
  );
}

/** Flag + gold pin + city: "currently in Abu Dhabi". */
export function Location({ size, label = "Abu Dhabi", color = "rgba(255,255,255,0.85)" }: { size: number; label?: string; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.55, color, fontSize: size, lineHeight: 1 }}>
      <UaeFlag h={size * 0.95} />
      <svg width={size} height={size} viewBox="0 0 24 24" fill={GOLD} aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      {label}
    </span>
  );
}
