"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import Image from "next/image";
import { motion, motionValue, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExperienceData, HeroData, ProjectData, StatData } from "@/lib/types";
import { BRANDS, EXPOSURE, buildSectors, type Sector, type ShowItem } from "./showcase/data";
import { AppIcon, CALENDLY, FAINT, GOLD, INK, LINE, Location, LogoMarquee, LogoRow, MUTED, MarqueeItem, Thumb, Typing, Virtual, clampLines } from "./showcase/parts";

/*
 * One sticky stage, driven by page scroll.
 * Laptop screens: a laptop and a phone side by side → the laptop zooms in, the phone slides behind it →
 *                 the laptop screen scrolls through sectors, problems solved, impact and work history.
 * Phones:         the phone mockup takes the centre like an emulator → "Vivek Store" scrolls inside it.
 * Devices are laid out at their final (largest) size and scaled down for the intro, so text stays sharp.
 */

const LAP_W = 1440;
const LAP_H = 900;
const LAP_HEADER = 78;
const PHONE_W = 390;
const PHONE_HEADER = 158;

type Layout = {
  mobile: boolean;
  vw: number;
  vh: number;
  lap: { left: number; top: number; w: number; lidH: number; sI: number; dxI: number; dyI: number; screen: number };
  ph: { left: number; top: number; w: number; h: number; sI: number; dxI: number; dyI: number; screen: number; virtH: number };
  hide: { dx1: number; dy1: number; dx2: number; dy2: number };
  ctaTop: number;
  captionTop: number;
  headlineTop: number;
  showHint: boolean;
  floor: { left: number; top: number; w: number; h: number };
  a: number;
  b: number;
  c: number;
  total: number;
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const ease = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function computeLayout(vw: number, vh: number, lapInner: number, phInner: number): Layout {
  const mobile = vw < 1024;
  if (!mobile) {
    const nav = 76;
    const L = Math.min(0.56 * vw, (vh - nav - 210) / 0.6975);
    const lidH = 0.6575 * L;
    const lidLeft = (vw - 1.18 * L) / 2 + 0.05 * L;
    const blockH = 0.6975 * L + 28 + 50 + 22 + 54;
    const compTop = nav + Math.max(8, (vh - nav - blockH - 30) / 2);
    const S = Math.min((vh - nav - 40) / lidH, (0.92 * vw) / L);
    const Lz = L * S;
    const lidHz = 0.6575 * Lz;
    const cxZ = vw / 2;
    const cyZ = nav + (vh - nav) / 2 + 4;
    const P = 0.24 * L;
    const PH = 2.06 * P;
    const phLeft = lidLeft + 1.13 * L - P;
    const phTop = compTop + lidH + 0.04 * L - PH;
    const phScreen = (0.91 * P) / PHONE_W;
    const lapScreen = (0.956 * Lz) / LAP_W;
    const a = 0.3 * vh;
    const b = a + 1.7 * vh;
    const c = b + Math.max(0, lapInner) * lapScreen;
    return {
      mobile,
      vw,
      vh,
      lap: { left: cxZ - Lz / 2, top: cyZ - lidHz / 2, w: Lz, lidH: lidHz, sI: 1 / S, dxI: lidLeft + L / 2 - cxZ, dyI: compTop + lidH / 2 - cyZ, screen: lapScreen },
      ph: { left: phLeft, top: phTop, w: P, h: PH, sI: 1, dxI: 0, dyI: 0, screen: phScreen, virtH: (PH - 0.09 * P) / phScreen },
      hide: { dx1: 0.1 * L, dy1: 0.04 * L, dx2: cxZ - (phLeft + P / 2), dy2: cyZ - (phTop + PH / 2) },
      ctaTop: compTop + 0.6975 * L + 28 + 50 + 22,
      captionTop: 0,
      headlineTop: compTop + 0.6975 * L + 28,
      showHint: vh - 76 > compTop + 0.6975 * L + 100 + 54 + 10,
      floor: { left: lidLeft - 0.12 * L, top: compTop + 0.6 * L, w: 1.36 * L, h: 0.16 * L },
      a,
      b,
      c,
      total: c + 0.35 * vh,
    };
  }
  const nav = 72;
  const L = Math.min(0.76 * vw, (vh - nav - 300) / 0.6975);
  const lidH = 0.6575 * L;
  const lidLeft = (vw - 1.18 * L) / 2 + 0.05 * L;
  const blockH = 0.6975 * L + 28 + 92 + 18 + 52;
  const compTop = nav + Math.max(8, (vh - nav - blockH - 40) / 2);
  const P = 0.24 * L;
  const PH = 2.06 * P;
  const phLeftI = lidLeft + 1.13 * L - P;
  const phTopI = compTop + lidH + 0.04 * L - PH;
  // leave a strip under the phone for the "Skip to projects" pill
  const PHf = Math.min(vh - nav - 84, 0.9 * vw * 2.06);
  const Pf = PHf / 2.06;
  const cxF = vw / 2;
  const cyF = nav + (vh - nav - 60) / 2 + 4;
  const phScreen = (0.91 * Pf) / PHONE_W;
  const a = 0.25 * vh;
  const b = a + 0.9 * vh;
  const c = b + Math.max(0, phInner) * phScreen;
  const captionTop = compTop + 0.6975 * L + 28;
  return {
    mobile,
    vw,
    vh,
    lap: { left: lidLeft, top: compTop, w: L, lidH, sI: 1, dxI: 0, dyI: 0, screen: (0.956 * L) / LAP_W },
    ph: { left: cxF - Pf / 2, top: cyF - PHf / 2, w: Pf, h: PHf, sI: P / Pf, dxI: phLeftI + P / 2 - cxF, dyI: phTopI + PH / 2 - cyF, screen: phScreen, virtH: (PHf - 0.09 * Pf) / phScreen },
    hide: { dx1: 0, dy1: 0, dx2: 0, dy2: 0 },
    ctaTop: captionTop + 92 + 18,
    captionTop,
    headlineTop: captionTop,
    showHint: vh - 70 > captionTop + 92 + 18 + 52 + 10,
    floor: { left: lidLeft - 0.12 * L, top: compTop + 0.6 * L, w: 1.36 * L, h: 0.16 * L },
    a,
    b,
    c,
    total: c + 0.3 * vh,
  };
}

function useMotionValues() {
  const [mv] = useState(() => ({
    lapX: motionValue(0),
    lapY: motionValue(0),
    lapS: motionValue(1),
    lapO: motionValue(1),
    phX: motionValue(0),
    phY: motionValue(0),
    phS: motionValue(1),
    phO: motionValue(1),
    phZ: motionValue(30),
    lapIntro: motionValue(1),
    cmd: motionValue(0),
    tilt: motionValue(1),
    lapMain: motionValue(0),
    lapInnerY: motionValue(0),
    lapBar: motionValue(0),
    phIntro: motionValue(1),
    phMain: motionValue(0),
    phInnerY: motionValue(0),
    phBar: motionValue(0),
    cta: motionValue(1),
    hint: motionValue(1),
  }));
  return mv;
}
type MV = ReturnType<typeof useMotionValues>;

export default function HeroShowcase({ hero, projects, experiences, stats = [] }: { hero: HeroData | null; projects: ProjectData[]; experiences: ExperienceData[]; stats?: StatData[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lapInnerRef = useRef<HTMLDivElement>(null);
  const phInnerRef = useRef<HTMLDivElement>(null);
  const lapAnchors = useRef<Record<string, HTMLElement | null>>({});
  const phAnchors = useRef<Record<string, HTMLElement | null>>({});
  const mv = useMotionValues();
  const reduced = useReducedMotion();
  const mx = useSpring(0, { stiffness: 50, damping: 16 });
  const my = useSpring(0, { stiffness: 50, damping: 16 });
  const floatY = useMotionValue(0);
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduced]);
  useAnimationFrame((time) => {
    if (reduced) return;
    floatY.set(Math.sin(time / 900) * 7 * mv.cta.get());
  });
  // subtle 3D: the laptop leans in, the phone faces it; both settle flat as the laptop zooms
  const lapRY = useTransform(() => mv.tilt.get() * (reduced ? 0 : 7 + mx.get() * 3));
  const lapRX = useTransform(() => mv.tilt.get() * (reduced ? 0 : 4 - my.get() * 2.5));
  const phRY = useTransform(() => mv.tilt.get() * (reduced ? 0 : -9 + mx.get() * 4));

  const [view, setView] = useState<{ vw: number; vh: number } | null>(null);
  const [heights, setHeights] = useState({ lap: 0, ph: 0 });
  const [activeLap, setActiveLap] = useState("");
  const [activePh, setActivePh] = useState("");

  const desktopSectors = useMemo(() => buildSectors(projects, "desktop"), [projects]);
  const mobileSectors = useMemo(() => buildSectors(projects, "mobile"), [projects]);

  const layout = useMemo(() => {
    if (!view) return null;
    const mobile = view.vw < 1024;
    const phVirtH = mobile ? computeLayout(view.vw, view.vh, 0, 0).ph.virtH : 844;
    const lapInner = heights.lap - (LAP_H - LAP_HEADER);
    const phInner = heights.ph - (phVirtH - PHONE_HEADER);
    return computeLayout(view.vw, view.vh, lapInner, phInner);
  }, [view, heights]);
  const layoutRef = useRef<Layout | null>(null);
  layoutRef.current = layout;

  // viewport size: the stage is 100svh, so the mobile address bar does not cause jumps
  useEffect(() => {
    const measure = () => {
      const vh = stageRef.current?.clientHeight || window.innerHeight;
      setView((v) => (v && v.vw === window.innerWidth && v.vh === vh ? v : { vw: window.innerWidth, vh }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // inner content heights (virtual px)
  useEffect(() => {
    const els = [lapInnerRef.current, phInnerRef.current];
    const read = () => setHeights((h) => {
      const lap = lapInnerRef.current?.offsetHeight ?? 0;
      const ph = phInnerRef.current?.offsetHeight ?? 0;
      return h.lap === lap && h.ph === ph ? h : { lap, ph };
    });
    read();
    const ro = new ResizeObserver(read);
    els.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [layout?.mobile]);

  const update = useCallback(() => {
    const L = layoutRef.current;
    const sec = sectionRef.current;
    if (!L || !sec) return;
    const t = Math.max(0, window.scrollY - sec.offsetTop);
    const u = seg(t, L.a, L.b);
    mv.hint.set(1 - ease(seg(t, 0, 0.2 * L.vh)));
    mv.cta.set(1 - ease(seg(u, 0, L.mobile ? 0.25 : 0.12)));
    if (!L.mobile) {
      const z = ease(seg(u, 0.04, 0.42));
      mv.tilt.set(1 - z);
      mv.lapX.set(L.lap.dxI * (1 - z));
      mv.lapY.set(L.lap.dyI * (1 - z));
      mv.lapS.set(lerp(L.lap.sI, 1, z));
      mv.lapO.set(1);
      const o1 = ease(seg(u, 0, 0.12));
      const o2 = ease(seg(u, 0.12, 0.42));
      mv.phX.set(lerp(L.hide.dx1 * o1, L.hide.dx2, o2));
      mv.phY.set(lerp(L.hide.dy1 * o1, L.hide.dy2, o2));
      mv.phS.set(1 - 0.3 * o2);
      mv.phO.set(1 - ease(seg(u, 0.2, 0.4)));
      mv.phZ.set(u < 0.12 ? 30 : 5);
      // scrolling types the dossier command, presses enter, then the dossier replaces the terminal
      mv.cmd.set(seg(u, 0.06, 0.86));
      mv.lapIntro.set(1 - ease(seg(u, 0.9, 0.97)));
      mv.lapMain.set(ease(seg(u, 0.92, 1)));
      const p = seg(t, L.b, L.c);
      const max = Math.max(0, (lapInnerRef.current?.offsetHeight ?? 0) - (LAP_H - LAP_HEADER));
      mv.lapInnerY.set(-p * max);
      mv.lapBar.set(p);
      const tab = activeAnchor(lapAnchors, p * max);
      setActiveLap(tab);
      // where in the showcase the visitor is, for the analytics heartbeat
      sec.dataset.stage = u < 0.92 ? "intro" : tab || "overview";
    } else {
      mv.lapO.set(1 - ease(seg(u, 0, 0.45)));
      mv.cmd.set(0);
      mv.tilt.set(1 - ease(seg(u, 0, 0.4)));
      mv.lapS.set(1 - 0.12 * ease(seg(u, 0, 0.6)));
      mv.lapY.set(-0.08 * L.vh * ease(seg(u, 0, 0.6)));
      mv.lapX.set(0);
      const f = ease(seg(u, 0.05, 0.9));
      mv.phX.set(L.ph.dxI * (1 - f));
      mv.phY.set(L.ph.dyI * (1 - f));
      mv.phS.set(lerp(L.ph.sI, 1, f));
      mv.phO.set(1);
      mv.phZ.set(30);
      mv.phIntro.set(1 - ease(seg(u, 0.4, 0.65)));
      mv.phMain.set(ease(seg(u, 0.5, 0.8)));
      const p = seg(t, L.b, L.c);
      const max = Math.max(0, (phInnerRef.current?.offsetHeight ?? 0) - (L.ph.virtH - PHONE_HEADER));
      mv.phInnerY.set(-p * max);
      mv.phBar.set(p);
      const tab = activeAnchor(phAnchors, p * max);
      setActivePh(tab);
      sec.dataset.stage = u < 0.6 ? "intro" : tab || "overview";
    }
  }, [mv]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [update, layout]);

  // the section's height changes once content is measured: let the rest of the page's scroll triggers re-measure
  useEffect(() => {
    if (!layout) return;
    const id = setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => clearTimeout(id);
  }, [layout?.total, layout]);

  /** Scrolls the page so that the given anchor sits at the top of the device screen. */
  const goTo = useCallback((key: string, which: "lap" | "ph") => {
    const L = layoutRef.current;
    const sec = sectionRef.current;
    const inner = which === "lap" ? lapInnerRef.current : phInnerRef.current;
    const el = (which === "lap" ? lapAnchors : phAnchors).current[key];
    if (!L || !sec) return;
    // no such section (or not measured yet): open the dossier at its start rather than doing nothing
    const max = inner ? Math.max(1, inner.offsetHeight - (which === "lap" ? LAP_H - LAP_HEADER : L.ph.virtH - PHONE_HEADER)) : 1;
    const p = el ? Math.min(1, el.offsetTop / max) : 0;
    window.scrollTo({ top: sec.offsetTop + L.b + p * (L.c - L.b) + 2, behavior: "smooth" });
  }, []);

  const ctaEvents = useTransform(mv.cta, (v) => (v > 0.5 ? "auto" : "none"));
  const skipO = useTransform(mv.cta, (v) => 1 - v);
  const skipEvents = useTransform(mv.cta, (v) => (v < 0.5 ? "auto" : "none"));
  const lapMainEvents = useTransform(mv.lapMain, (v) => (v > 0.5 ? "auto" : "none"));
  const phMainEvents = useTransform(mv.phMain, (v) => (v > 0.5 ? "auto" : "none"));
  const h = hero;

  return (
    <section ref={sectionRef} id="showcase" className="relative" style={{ height: layout ? layout.total + layout.vh : "100svh" }}>
      <h1 className="sr-only">
        {h ? `${h.headline} ${h.headlineAccent}` : "Vivek Kumar Singh, software developer and architect"}
      </h1>
      <div ref={stageRef} className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>
        {/* ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />

        {layout && (
          <>
            {/* ---------------------------------------------------------------- laptop */}
            <motion.div
              className="absolute"
              style={{ left: layout.lap.left, top: layout.lap.top, width: layout.lap.w, x: mv.lapX, y: mv.lapY, scale: mv.lapS, opacity: mv.lapO, zIndex: 20, transformOrigin: `${layout.lap.w / 2}px ${layout.lap.lidH / 2}px` }}
            >
              <motion.div style={{ rotateX: lapRX, rotateY: lapRY, transformPerspective: 2400, transformOrigin: "50% 60%" }}>
              <div
                className="relative"
                style={{
                  height: layout.lap.lidH,
                  padding: `${0.03 * layout.lap.w}px ${0.022 * layout.lap.w}px`,
                  borderRadius: 0.028 * layout.lap.w,
                  background: "linear-gradient(160deg,#2a2524,#0c0a0a 40%,#151211)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09), 0 0 0 1px #000, 0 60px 120px -40px rgba(0,0,0,0.95), 0 0 120px -40px rgba(212,168,83,0.25)",
                }}
              >
                <span className="absolute left-1/2 rounded-full bg-black" style={{ top: 0.012 * layout.lap.w, width: 0.007 * layout.lap.w, height: 0.007 * layout.lap.w, transform: "translateX(-50%)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }} />
                <div className="relative h-full w-full overflow-hidden bg-[#070606]" style={{ borderRadius: 0.006 * layout.lap.w }}>
                  <Virtual w={LAP_W} h={LAP_H} scale={layout.lap.screen}>
                    <motion.div className="absolute inset-0" style={{ opacity: mv.lapIntro }}>
                      <LaptopIntro command={mv.cmd} operations={desktopSectors.reduce((n, s) => n + s.items.length, 0)} sectors={desktopSectors.length} />
                    </motion.div>
                    {!layout.mobile && (
                      <motion.div className="absolute inset-0" style={{ opacity: mv.lapMain, pointerEvents: lapMainEvents }}>
                        <Dossier sectors={desktopSectors} experiences={experiences} stats={stats} innerRef={lapInnerRef} anchors={lapAnchors} y={mv.lapInnerY} bar={mv.lapBar} active={activeLap} onTab={(k) => goTo(k, "lap")} />
                      </motion.div>
                    )}
                  </Virtual>
                </div>
              </div>
              <div
                style={{
                  marginLeft: -0.05 * layout.lap.w,
                  width: 1.1 * layout.lap.w,
                  height: 0.03 * layout.lap.w,
                  borderRadius: `0 0 ${0.02 * layout.lap.w}px ${0.02 * layout.lap.w}px`,
                  background: "linear-gradient(180deg,#5a504c,#2a2321 55%,#141010)",
                  boxShadow: "0 40px 60px -20px rgba(0,0,0,0.9)",
                }}
              >
                <div className="mx-auto bg-[#1a1513]" style={{ width: "16%", height: "32%", borderRadius: "0 0 10px 10px" }} />
              </div>
              </motion.div>
            </motion.div>

            {/* ---------------------------------------------------------------- phone */}
            <motion.div
              className="absolute"
              style={{ left: layout.ph.left, top: layout.ph.top, width: layout.ph.w, height: layout.ph.h, x: mv.phX, y: mv.phY, scale: mv.phS, opacity: mv.phO, zIndex: mv.phZ, transformOrigin: "50% 50%" }}
            >
              <motion.div className="h-full w-full" style={{ y: floatY, rotateY: phRY, transformPerspective: 1600 }}>
              <div
                className="relative h-full w-full"
                style={{
                  padding: 0.045 * layout.ph.w,
                  borderRadius: 0.16 * layout.ph.w,
                  background: "linear-gradient(145deg,#4a3e3a,#0d0a09 35%,#1c1614 70%,#463a35)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 1px #000, 0 50px 90px -30px rgba(0,0,0,0.95)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden bg-[#070606]" style={{ borderRadius: 0.12 * layout.ph.w }}>
                  <Virtual w={PHONE_W} h={layout.ph.virtH} scale={layout.ph.screen}>
                    <span className="absolute left-1/2 z-30 rounded-full bg-black" style={{ top: 11, width: 118, height: 34, transform: "translateX(-50%)" }} />
                    <motion.div className="absolute inset-0" style={{ opacity: mv.phIntro }}>
                      <PhoneProfile onExplore={() => goTo("overview", layout.mobile ? "ph" : "lap")} />
                    </motion.div>
                    {layout.mobile && (
                      <motion.div className="absolute inset-0" style={{ opacity: mv.phMain, pointerEvents: phMainEvents }}>
                        <Store sectors={mobileSectors} stats={stats} count={mobileSectors.reduce((n, s) => n + s.items.length, 0)} innerRef={phInnerRef} anchors={phAnchors} y={mv.phInnerY} bar={mv.phBar} active={activePh} onTab={(k) => goTo(k, "ph")} />
                      </motion.div>
                    )}
                  </Virtual>
                </div>
              </div>
              </motion.div>
            </motion.div>

            {/* floor glow under the devices */}
            <motion.div
              className="pointer-events-none absolute"
              style={{ left: layout.floor.left, top: layout.floor.top, width: layout.floor.w, height: layout.floor.h, opacity: mv.cta, zIndex: 1, background: "radial-gradient(50% 50% at 50% 50%, rgba(212,168,83,0.22), transparent 70%)", filter: "blur(14px)" }}
            />

            {/* ---------------------------------------------------------------- headline, caption (phones) and CTAs */}
            {!layout.mobile && (
              <motion.h2 className="absolute left-0 right-0 z-40 px-6 text-center font-serif text-white/90" style={{ top: layout.headlineTop, fontSize: 42, lineHeight: "50px", opacity: mv.cta }}>
                Engineering ideas into <em className="text-gold">intelligent</em> products.
              </motion.h2>
            )}
            {layout.mobile && (
              <motion.div className="absolute left-0 right-0 z-40 px-6 text-center" style={{ top: layout.captionTop, opacity: mv.cta }}>
                <h2 className="font-serif text-white/90" style={{ fontSize: 30, lineHeight: "34px" }}>
                  Engineering ideas into
                  <br />
                  <em className="text-gold">intelligent</em> products.
                </h2>
                <p className="mt-2 whitespace-nowrap text-[11px] uppercase tracking-[0.22em] text-white/45">Software Developer &amp; Architect</p>
              </motion.div>
            )}
            <motion.div className="absolute left-0 right-0 z-40 flex items-center justify-center gap-3 px-6" style={{ top: layout.ctaTop, opacity: mv.cta, pointerEvents: ctaEvents }}>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-gold px-4 py-3.5 text-sm font-semibold sm:px-7 text-black transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,168,83,0.3)] sm:flex-none"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Book a Call
              </a>
              <a href="#work" className="glass glass-hover inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3.5 sm:px-7 text-sm font-medium text-white/70 transition-all hover:text-white sm:flex-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                View My Work
              </a>
            </motion.div>

            {/* always-available way out of the sequence */}
            <motion.button
              type="button"
              onClick={() => {
                const el = document.getElementById("work");
                // "instant" overrides the site's CSS smooth scrolling: no long glide through the sequence
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
              }}
              className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur-md transition-colors hover:border-gold/50 hover:text-gold"
              style={{ opacity: skipO, pointerEvents: skipEvents }}
            >
              Skip to projects ↓
            </motion.button>

            {/* scroll hint */}
            {layout.showHint && (
            <motion.div className="pointer-events-none absolute bottom-6 left-0 right-0 z-40 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35" style={{ opacity: mv.hint }}>
              Scroll to explore
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="block h-6 w-px bg-gradient-to-b from-gold/70 to-transparent" />
            </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function activeAnchor(anchors: MutableRefObject<Record<string, HTMLElement | null>>, y: number) {
  let best = "";
  for (const [k, el] of Object.entries(anchors.current)) {
    if (el && el.offsetTop <= y + 260) best = k;
  }
  return best;
}

/* ==================================================================== laptop: intro screen */

function LaptopIntro({ command, operations, sectors }: { command: MotionValue<number>; operations: number; sectors: number }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "radial-gradient(60% 70% at 50% 35%,rgba(212,168,83,0.16),transparent 65%),radial-gradient(80% 80% at 80% 100%,rgba(120,40,30,0.25),transparent 60%),#090807" }}>
      <div className="flex shrink-0 items-center justify-between px-6" style={{ height: 40, background: "rgba(0,0,0,0.35)", borderBottom: `1px solid ${LINE}`, fontSize: 16, color: MUTED }}>
        <span style={{ display: "flex", gap: 26 }}>
          <b style={{ color: INK, fontWeight: 600 }}>vivek</b>
          <span>Fintech</span>
          <span>Automotive</span>
          <span>Real Estate</span>
          <span>Luxury</span>
        </span>
        <Location size={17} />
      </div>
      {/* Terminal and logo strip share one column, so they can never overlap. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center" style={{ padding: "36px 0 40px" }}>
      <BrowserWindow />
      <div className="relative overflow-hidden" style={{ width: 860, transform: "translateX(-150px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(14,12,11,0.92)", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)" }}>
        <div className="flex items-center gap-2 px-5" style={{ height: 48, borderBottom: `1px solid ${LINE}` }}>
          <span className="rounded-full bg-red-500/70" style={{ width: 13, height: 13 }} />
          <span className="rounded-full bg-yellow-500/70" style={{ width: 13, height: 13 }} />
          <span className="rounded-full bg-green-500/70" style={{ width: 13, height: 13 }} />
          <span style={{ marginLeft: 12, fontSize: 15, color: FAINT, fontFamily: "var(--font-mono), monospace" }}>~/vivek</span>
        </div>
        <div style={{ padding: "28px 36px 32px" }}>
          <Typing fontSize={21} height={450} command={command} operations={operations} sectors={sectors} />
        </div>
      </div>
      </div>
      <div className="shrink-0" style={{ padding: "4px 0 12px", borderTop: `1px solid ${LINE}` }}>
        <LogoMarquee logos={BRANDS} />
      </div>
    </div>
  );
}

/** A real shipped project, sitting behind the terminal like another open window. */
function BrowserWindow() {
  return (
    <div className="absolute overflow-hidden" style={{ right: 70, top: 46, width: 700, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: "#0d0b0b", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)", opacity: 0.62 }}>
      <div className="flex items-center gap-2 px-4" style={{ height: 40, borderBottom: `1px solid ${LINE}` }}>
        <span className="rounded-full bg-white/15" style={{ width: 11, height: 11 }} />
        <span className="rounded-full bg-white/15" style={{ width: 11, height: 11 }} />
        <span className="rounded-full bg-white/15" style={{ width: 11, height: 11 }} />
        <span className="mx-auto rounded-full" style={{ fontSize: 13, padding: "4px 18px", background: "rgba(255,255,255,0.06)", color: MUTED }}>
          therufescent.vercel.app
        </span>
      </div>
      <div className="relative" style={{ width: 700, height: 437 }}>
        <Image src="/images/projects/screenshots/the-rufescent-laptop.webp" alt="The Rufescent concept, live" fill sizes="520px" style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
}

/* ==================================================================== laptop: the work dossier */

function Dossier({
  sectors,
  experiences,
  stats,
  innerRef,
  anchors,
  y,
  bar,
  active,
  onTab,
}: {
  sectors: Sector[];
  experiences: ExperienceData[];
  stats: StatData[];
  innerRef: MutableRefObject<HTMLDivElement | null>;
  anchors: MutableRefObject<Record<string, HTMLElement | null>>;
  y: MotionValue<number>;
  bar: MotionValue<number>;
  active: string;
  onTab: (key: string) => void;
}) {
  const tabs = [{ key: "overview", label: "Overview" }, ...sectors.map((s) => ({ key: s.id, label: s.short })), { key: "history", label: "History" }];
  const barW = useTransform(bar, (v) => `${v * 100}%`);
  return (
    <div className="absolute inset-0" style={{ background: "radial-gradient(70% 50% at 100% 0%,rgba(212,168,83,0.08),transparent 60%),#0a0909" }}>
      {/* window chrome + sector tabs */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-8" style={{ height: LAP_HEADER, background: "rgba(10,9,9,0.94)", borderBottom: `1px solid ${LINE}` }}>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-500/70" style={{ width: 13, height: 13 }} />
          <span className="rounded-full bg-yellow-500/70" style={{ width: 13, height: 13 }} />
          <span className="rounded-full bg-green-500/70" style={{ width: 13, height: 13 }} />
          <span style={{ marginLeft: 16, fontSize: 17, color: FAINT, fontFamily: "var(--font-mono), monospace" }}>~/dossier · clearance 007</span>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              style={{ fontSize: 17, padding: "10px 18px", borderRadius: 999, color: active === t.key ? "#000" : MUTED, background: active === t.key ? GOLD : "transparent", fontWeight: active === t.key ? 600 : 400, transition: "all .3s" }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <motion.span className="absolute bottom-0 left-0 h-[2px] bg-gold" style={{ width: barW }} />
      </div>

      {/* scrolling content */}
      <div className="absolute left-0 right-0 overflow-hidden" style={{ top: LAP_HEADER, bottom: 0 }}>
        <motion.div ref={innerRef} className="relative" style={{ y, padding: "56px 72px 72px" }}>
          {/* 00 · the subject summary: track record and in what capacity each logo was earned */}
          <section ref={(el) => { anchors.current.overview = el; }} style={{ marginBottom: 88 }}>
            <div style={{ fontSize: 17, letterSpacing: "0.3em", color: GOLD, fontFamily: "var(--font-mono), monospace" }}>00 · SUBJECT SUMMARY</div>
            <h3 style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.02em", color: INK, margin: "8px 0 0", lineHeight: 1.05 }}>Experience &amp; industry exposure</h3>
            {stats.length > 0 && (
              <div className="grid" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 32, marginTop: 34, paddingTop: 30, borderTop: `1px solid ${LINE}` }}>
                {stats.map((st) => (
                  <div key={st.label}>
                    <div style={{ fontFamily: "var(--font-instrument), serif", fontSize: 78, color: INK, lineHeight: 1 }}>{st.value}</div>
                    <div style={{ fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: FAINT, marginTop: 10 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 40 }}>
              {EXPOSURE.map((row) => (
                <div key={row.sector} className="grid items-center" style={{ gridTemplateColumns: "290px 1fr 430px", gap: 28, padding: "20px 0", borderTop: `1px solid ${LINE}` }}>
                  <div style={{ fontFamily: "var(--font-instrument), serif", fontSize: 38, color: INK, lineHeight: 1.05 }}>{row.sector}</div>
                  <div className="flex flex-wrap items-center" style={{ margin: "0 -20px" }}>
                    {row.logos.map((l) => (
                      <MarqueeItem key={l.name} logo={l} />
                    ))}
                    {row.also && <span style={{ fontSize: 17, color: MUTED, padding: "0 20px" }}>{row.also}</span>}
                  </div>
                  <div style={{ textAlign: "right", fontSize: 18, lineHeight: 1.45, color: MUTED }}>
                    {row.role}
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 15, color: "rgba(212,168,83,0.75)", marginTop: 6 }}>
                      {row.years} · {row.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {sectors.map((s, si) => (
            <section key={s.id} ref={(el) => { anchors.current[s.id] = el; }} style={{ marginBottom: 72 }}>
              <div className="flex items-end justify-between" style={{ marginBottom: 34, gap: 40 }}>
                <div>
                  <div style={{ fontSize: 17, letterSpacing: "0.3em", color: GOLD, fontFamily: "var(--font-mono), monospace" }}>0{si + 1}</div>
                  <h3 style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.02em", color: INK, margin: "8px 0 6px", lineHeight: 1.05 }}>{s.label}</h3>
                  <p style={{ fontSize: 22, color: MUTED, margin: 0 }}>{s.line}</p>
                  {s.relation && <p style={{ fontSize: 16, color: FAINT, margin: "10px 0 0", fontFamily: "var(--font-mono), monospace" }}>{s.relation}</p>}
                </div>
                <LogoRow logos={s.logos} gap={44} />
              </div>
              {s.items.map((it) => (
                <DossierRow key={it.key} item={it} />
              ))}
            </section>
          ))}

          <section ref={(el) => { anchors.current.history = el; }} style={{ marginBottom: 80 }}>
            <div style={{ fontSize: 17, letterSpacing: "0.3em", color: GOLD, fontFamily: "var(--font-mono), monospace" }}>0{sectors.length + 1}</div>
            <h3 style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.02em", color: INK, margin: "8px 0 34px" }}>Work history</h3>
            {experiences.map((e) => (
              <div key={`${e.company}-${e.date}`} className="grid" style={{ gridTemplateColumns: "250px 1fr", gap: 40, padding: "26px 0", borderTop: `1px solid ${LINE}` }}>
                <div style={{ fontSize: 18, color: GOLD, fontFamily: "var(--font-mono), monospace", paddingTop: 4 }}>{e.date}</div>
                <div>
                  <div style={{ fontSize: 28, color: INK, fontWeight: 600 }}>{e.company}</div>
                  <div style={{ fontSize: 19, color: MUTED, marginTop: 4 }}>
                    {e.title}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  {e.highlights?.[0] && <p style={{ fontSize: 19, color: "rgba(255,255,255,0.7)", margin: "12px 0 0", maxWidth: 980, ...clampLines(2) }}>{e.highlights[0]}</p>}
                </div>
              </div>
            ))}
          </section>

          <section className="text-center" style={{ padding: "60px 0 40px", borderTop: `1px solid ${LINE}` }}>
            <p style={{ fontSize: 22, color: GOLD, fontFamily: "var(--font-mono), monospace", margin: 0 }}>Your next mission, should you choose to accept it:</p>
            <p style={{ fontSize: 64, fontWeight: 600, color: INK, margin: "12px 0 34px", letterSpacing: "-0.02em" }}>Let&apos;s build.</p>
            <div className="flex justify-center" style={{ gap: 16 }}>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ fontSize: 20, fontWeight: 600, padding: "18px 34px", borderRadius: 16, background: GOLD, color: "#000" }}>
                Book a Call
              </a>
              <a href="#work" style={{ fontSize: 20, padding: "18px 34px", borderRadius: 16, border: `1px solid rgba(255,255,255,0.16)`, color: INK }}>
                All projects
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

function DossierRow({ item }: { item: ShowItem }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "520px 1fr", gap: 52, padding: "34px 0", borderTop: `1px solid ${LINE}` }}>
      <Thumb item={item} w={520} h={325} sizes="440px" rounded={16} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {item.tagLogo ? (
          <img src={item.tagLogo.src} alt={item.tagLogo.name} title={item.tagLogo.name} style={{ alignSelf: "flex-start", height: 40, width: "auto" }} />
        ) : (
          item.tag && <span style={{ alignSelf: "flex-start", fontSize: 14, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, border: "1px solid rgba(212,168,83,0.35)", borderRadius: 999, padding: "6px 14px" }}>{item.tag}</span>
        )}
        <h4 style={{ fontSize: 36, fontWeight: 600, color: INK, margin: "14px 0 8px", letterSpacing: "-0.01em" }}>{item.title}</h4>
        <p style={{ fontSize: 20, color: MUTED, margin: 0, ...clampLines(2) }}>{item.desc}</p>
        {item.role && (
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", margin: "12px 0 0", ...clampLines(1) }}>
            <span style={{ color: FAINT, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 14, marginRight: 10 }}>Role</span>
            {item.role}
          </p>
        )}
        {item.problem && (
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", margin: "16px 0 0", ...clampLines(2) }}>
            <span style={{ color: FAINT, letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 14, marginRight: 10 }}>Problem</span>
            {item.problem}
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          {item.impact.map((x) => (
            <span key={x} style={{ fontSize: 18, color: INK, display: "flex", gap: 12, ...clampLines(1) }}>
              <span style={{ color: GOLD }}>▸</span>
              {x}
            </span>
          ))}
        </div>
        {(item.href || item.live) && (
          <div style={{ display: "flex", gap: 22, marginTop: "auto", paddingTop: 16, fontSize: 18 }}>
            {item.href && (
              <a href={item.href} style={{ color: GOLD }}>
                Case study →
              </a>
            )}
            {item.live && (
              <a href={item.live} target="_blank" rel="noopener noreferrer" style={{ color: MUTED }}>
                Live site ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================================================================== phone: profile (intro) */

/** Profile card palette: warmer charcoal, antique gold, soft off-white. */
const CARD_BG = "#0C0B0A";
const ANTIQUE = "#BD9654";
const IVORY = "rgba(240,235,225,0.92)";
const IVORY_SOFT = "rgba(240,235,225,0.62)";
const SPECIALIZATIONS = ["Fintech", "System Design", "Cloud", "Enterprise Apps", "Experience Design"];

/** Rounded-square outline as one path, so the gold border can draw itself around the portrait. */
function roundedRectPath(w: number, h: number, r: number, inset: number) {
  const x0 = inset, y0 = inset, x1 = w - inset, y1 = h - inset;
  return `M ${x0 + r} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
}

/**
 * The phone's identity card. One sequence on load, no loops: the gold border draws around the portrait,
 * name and role fade in, then the specialisations appear one by one.
 */
function PhoneProfile({ onExplore }: { onExplore: () => void }) {
  const reduced = useReducedMotion();
  const T0 = 2.4; // after the preloader
  const enter = (delay: number) =>
    reduced
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: T0 + delay, ease: [0.22, 1, 0.36, 1] as const } };
  const P = 128;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: `radial-gradient(90% 50% at 50% 0%, rgba(189,150,84,0.13), transparent 62%), ${CARD_BG}`, padding: "72px 30px 34px" }}>
      <div style={{ fontSize: 13, letterSpacing: "0.32em", color: "rgba(189,150,84,0.8)", fontFamily: "var(--font-mono), monospace" }}>V / PROFILE</div>

      <div className="relative" style={{ width: P, height: P, marginTop: 30 }}>
        <div className="absolute overflow-hidden" style={{ inset: 4, borderRadius: 26, background: "#141210" }}>
          <Image src="/images/vivek.png" alt="Vivek Kumar Singh" fill sizes="140px" style={{ objectFit: "cover", objectPosition: "50% 30%", filter: "grayscale(1) contrast(1.12) brightness(1.02)" }} priority />
        </div>
        <svg className="absolute inset-0" width={P} height={P} viewBox={`0 0 ${P} ${P}`} aria-hidden="true">
          <motion.path
            d={roundedRectPath(P, P, 29, 0.75)}
            fill="none"
            stroke={ANTIQUE}
            strokeWidth={1.5}
            initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: T0, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      </div>

      <motion.p {...enter(0.7)} style={{ fontSize: 30, fontWeight: 600, color: IVORY, margin: "22px 0 0", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
        Vivek Kumar Singh
      </motion.p>
      <motion.p {...enter(0.85)} style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: ANTIQUE, margin: "9px 0 0", whiteSpace: "nowrap" }}>
        Software Developer / Architect
      </motion.p>
      <motion.p {...enter(1.05)} style={{ fontFamily: "var(--font-instrument), serif", fontSize: 22, lineHeight: 1.3, color: IVORY_SOFT, margin: "20px 0 0", maxWidth: 310 }}>
        Building scalable systems and meaningful digital experiences.
      </motion.p>

      <motion.div {...enter(1.3)} style={{ width: 44, height: 1, background: "rgba(189,150,84,0.35)", margin: "26px 0 18px" }} />
      <motion.div {...enter(1.35)} style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(240,235,225,0.42)" }}>
        Specializations
      </motion.div>
      <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
        {SPECIALIZATIONS.map((t, k) => (
          <motion.span key={t} {...enter(1.5 + k * 0.12)} style={{ fontSize: 14, padding: "7px 13px", borderRadius: 999, border: "1px solid rgba(189,150,84,0.32)", color: IVORY }}>
            {t}
          </motion.span>
        ))}
      </div>
      <motion.div {...enter(2.05)} style={{ marginTop: 22 }}>
        <Location size={16} label="Abu Dhabi, UAE" color={IVORY_SOFT} />
      </motion.div>

      <motion.button
        {...enter(2.25)}
        type="button"
        onClick={onExplore}
        className="flex flex-col items-center"
        style={{ marginTop: "auto", gap: 10, alignSelf: "center", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: ANTIQUE, background: "none", border: 0, cursor: "pointer", padding: 8 }}
      >
        Explore my work
        <motion.span
          animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: T0 + 2.6 }}
          style={{ display: "block", width: 1, height: 26, background: `linear-gradient(${ANTIQUE}, transparent)` }}
        />
      </motion.button>
    </div>
  );
}

/* ==================================================================== phone: Vivek Store */

function Store({
  sectors,
  stats,
  count,
  innerRef,
  anchors,
  y,
  bar,
  active,
  onTab,
}: {
  sectors: Sector[];
  stats: StatData[];
  count: number;
  innerRef: MutableRefObject<HTMLDivElement | null>;
  anchors: MutableRefObject<Record<string, HTMLElement | null>>;
  y: MotionValue<number>;
  bar: MotionValue<number>;
  active: string;
  onTab: (key: string) => void;
}) {
  const barW = useTransform(bar, (v) => `${v * 100}%`);
  return (
    <div className="absolute inset-0 bg-[#0a0909]">
      <div className="absolute left-0 right-0 top-0 z-20" style={{ height: PHONE_HEADER, background: "rgba(10,9,9,0.96)", borderBottom: `1px solid ${LINE}`, padding: "54px 18px 0" }}>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: INK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Vivek Store</div>
            <div style={{ fontSize: 13, color: FAINT, marginTop: 2 }}>{count} apps by Vivek</div>
          </div>
          <span className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 99, background: "linear-gradient(140deg,#d4a853,#8a6a2c)", color: "#000", fontWeight: 700, fontSize: 14 }}>
            VK
          </span>
        </div>
        <div className="flex" style={{ gap: 6, marginTop: 12 }}>
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => onTab(s.id)}
              style={{ fontSize: 12.5, padding: "6px 11px", borderRadius: 999, whiteSpace: "nowrap", color: active === s.id ? "#000" : MUTED, background: active === s.id ? GOLD : "rgba(255,255,255,0.06)", fontWeight: active === s.id ? 600 : 400, transition: "all .3s" }}
            >
              {s.short}
            </button>
          ))}
        </div>
        <motion.span className="absolute bottom-0 left-0 h-[2px] bg-gold" style={{ width: barW }} />
      </div>

      <div className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ top: PHONE_HEADER }}>
        <motion.div ref={innerRef} className="relative" style={{ y, padding: "18px 16px 60px" }}>
          {stats.length > 0 && (
            <section ref={(el) => { anchors.current.overview = el; }} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD }}>Track record</div>
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                {stats.map((st) => (
                  <div key={st.label} style={{ border: `1px solid ${LINE}`, borderRadius: 14, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-instrument), serif", fontSize: 32, color: INK, lineHeight: 1 }}>{st.value}</div>
                    <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: FAINT, marginTop: 6 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {sectors.map((s) => {
            const [featured, ...rest] = s.items;
            return (
              <section key={s.id} ref={(el) => { anchors.current[s.id] = el; }} style={{ marginBottom: 30 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: INK, margin: 0 }}>{s.label}</h3>
                </div>
                {s.logos.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <LogoRow logos={s.logos} height={0.55} gap={18} />
                  </div>
                )}
                <FeaturedWrap item={featured}>
                  <Thumb item={featured} w={358} h={200} sizes="300px" rounded={18} />
                  <div style={{ padding: "12px 4px 8px" }}>
                    {featured.tagLogo ? (
                      <img src={featured.tagLogo.src} alt={featured.tagLogo.name} title={featured.tagLogo.name} style={{ height: 24, width: "auto", display: "block" }} />
                    ) : (
                      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>{featured.tag}</div>
                    )}
                    <div style={{ fontSize: 20, fontWeight: 700, color: INK, marginTop: 4 }}>{featured.title}</div>
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 3, ...clampLines(2) }}>{featured.impact[0] ?? featured.desc}</div>
                  </div>
                </FeaturedWrap>
                {rest.map((it) => (
                  <StoreRow key={it.key} item={it} />
                ))}
              </section>
            );
          })}
          <div className="text-center" style={{ padding: "18px 0 10px" }}>
            <div style={{ fontSize: 13, color: GOLD, fontFamily: "var(--font-mono), monospace" }}>Your next mission:</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK, margin: "4px 0 14px" }}>Let&apos;s build.</div>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontSize: 15, fontWeight: 600, padding: "12px 26px", borderRadius: 12, background: GOLD, color: "#000" }}>
              Book a Call
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** The featured card links to its case study or live site; work without a public page is not a link. */
function FeaturedWrap({ item, children }: { item: ShowItem; children: React.ReactNode }) {
  const style = { position: "relative" as const, display: "block", marginBottom: 6, borderBottom: `1px solid ${LINE}`, paddingBottom: 6 };
  if (item.href) return <a href={item.href} style={style}>{children}</a>;
  if (item.live) return <a href={item.live} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>;
  return <div style={style}>{children}</div>;
}

function StoreRow({ item }: { item: ShowItem }) {
  const href = item.href ?? item.live;
  return (
    <div className="flex items-center" style={{ gap: 12, padding: "12px 0", borderBottom: `1px solid ${LINE}` }}>
      <AppIcon item={item} size={60} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: INK, ...clampLines(1) }}>{item.title}</div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2, ...clampLines(2) }}>{item.desc}</div>
      </div>
      {href ? (
        <a
          href={href}
          target={item.href ? undefined : "_blank"}
          rel="noopener noreferrer"
          style={{ fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 999, background: "rgba(212,168,83,0.16)", color: GOLD, flexShrink: 0 }}
        >
          {item.href ? "VIEW" : "OPEN"}
        </a>
      ) : (
        <span style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, border: `1px solid ${LINE}`, color: FAINT, flexShrink: 0 }}>In-house</span>
      )}
    </div>
  );
}
