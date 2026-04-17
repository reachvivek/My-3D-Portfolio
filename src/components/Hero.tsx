"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { HeroData } from "@/lib/types";

interface HeroProps {
  hero: HeroData | null;
}

const defaultHero: HeroData = {
  headline: "Engineering Digital Products",
  headlineAccent: "That Scale Businesses",
  subline:
    "AI systems, fintech platforms, and high-performance web applications.",
  location: "Based in UAE, working with global teams",
};

const TYPING_TEXT = `$ whoami
> Hey, I'm Vivek.
> Full-Stack Engineer + AI Developer.
> Building voice agents for Audi, Porsche & VW.
> Shipped fintech platforms for BSE & NSDL.
> Based in Abu Dhabi, UAE.
>
> Your next mission, should you choose to accept it: let's build.
$ _`;

function useTypingProgress() {
  const [displayed, setDisplayed] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < TYPING_TEXT.length) {
        setDisplayed(TYPING_TEXT.slice(0, i + 1));
        setProgress((i + 1) / TYPING_TEXT.length);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return { displayed, progress };
}

function PhotoReveal({ show, className }: { show: boolean; className?: string }) {
  const [phase, setPhase] = useState<"hidden" | "loading" | "scanning" | "found" | "revealed">("hidden");

  useEffect(() => {
    if (!show) return;

    setPhase("loading");
    // INTEL LOOKUP for 3s, then IDENTITY CONFIRMED for 2s, then slow scan reveal 3.5s
    const t1 = setTimeout(() => setPhase("found"), 3000);
    const t2 = setTimeout(() => setPhase("scanning"), 5000);
    const t3 = setTimeout(() => setPhase("revealed"), 8500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{
        opacity: show ? 1 : 0,
        x: show ? 0 : 60,
      }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`glass rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl ${className || ""}`}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-black/40">
        {/* Photo — masked with clip-path, reveals bottom-to-top during scan */}
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{
            clipPath:
              phase === "hidden" || phase === "loading" || phase === "found"
                ? "inset(100% 0 0 0)"
                : phase === "scanning"
                ? "inset(5% 0 0 0)"
                : "inset(0% 0 0 0)",
          }}
          transition={{ duration: phase === "scanning" ? 3.5 : 0.3, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Image
            src="/images/vivek.png"
            alt="Vivek Kumar Singh"
            width={200}
            height={200}
            className="w-full h-full object-contain grayscale contrast-[1.1] brightness-[0.95]"
            priority
          />
        </motion.div>

        {/* Scan line — sweeps bottom to top */}
        {phase === "scanning" && (
          <motion.div
            initial={{ bottom: "0%" }}
            animate={{ bottom: "100%" }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent"
            style={{ boxShadow: "0 0 20px rgba(212,168,83,0.6), 0 0 40px rgba(212,168,83,0.3)" }}
          />
        )}

        {/* Loading state — magnifying glass + animated dots */}
        {phase === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Pulsing gold glow behind icon */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-20 h-20 rounded-full bg-gold/10 blur-xl"
            />
            {/* Magnifying glass with subtle bounce */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </motion.div>
            <span className="text-[11px] font-mono text-gold/70 tracking-wider inline-flex items-center">
              INTEL LOOKUP
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.3 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.6 }}
              >
                .
              </motion.span>
            </span>
          </div>
        )}

        {/* "MATCH FOUND" flash */}
        {phase === "found" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="px-2.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[8px] sm:text-[10px] font-mono text-gold tracking-wider inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400 shrink-0"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.svg>
              IDENTITY CONFIRMED
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function TypingTerminal({ displayed }: { displayed: string }) {
  const lines = displayed.split("\n");

  return (
    <pre className="text-[11px] sm:text-xs font-mono leading-[1.8] whitespace-pre-wrap">
      {lines.map((line, idx) => {
        if (line.startsWith("$")) {
          return (
            <span key={idx}>
              <span className="text-green-400">$</span>
              <span className="text-white/50">{line.slice(1)}</span>
              {idx < lines.length - 1 && "\n"}
            </span>
          );
        }
        return (
          <span key={idx}>
            <span className="text-gold/40">&gt;</span>
            <span className="text-gold">{line.slice(1)}</span>
            {idx < lines.length - 1 && "\n"}
          </span>
        );
      })}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
        className="inline-block w-[7px] h-[14px] bg-gold/60 translate-y-[3px] ml-px"
      />
    </pre>
  );
}

export default function Hero({ hero }: Readonly<HeroProps>) {
  const h = hero || defaultHero;
  const { displayed, progress } = useTypingProgress();
  // Photo reveals after ~40% of typing is done
  const showPhoto = progress > 0.4;

  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold-dark/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-32 pb-20 md:pt-0 md:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* ── Left Column: Value Proposition ── */}
          <div>
            {/* Big Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.08]"
            >
              {h.headline}
              <br />
              <span className="gradient-text">{h.headlineAccent}</span>
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.7 }}
              className="mt-5 sm:mt-8 text-sm sm:text-base text-white/40 leading-relaxed max-w-lg"
            >
              {h.subline} Building AI voice agents for{" "}
              <span className="text-white/60">Audi, Porsche & Volkswagen</span>
              . Previously shipped fintech platforms for{" "}
              <span className="text-white/60">BSE & NSDL</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.9 }}
              className="flex flex-row items-center gap-3 mt-6 sm:mt-10 flex-wrap"
            >
              <a
                href="https://calendly.com/rogerthatvivek/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden px-7 py-3.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)] group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book a Call
                </span>
              </a>
              <a
                href="#work"
                className="relative overflow-hidden px-7 py-3.5 rounded-xl glass glass-hover text-sm font-medium text-white/60 hover:text-white transition-all group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  View My Work
                </span>
              </a>
            </motion.div>
          </div>

          {/* ── Right Column: Diagonal cards with connector ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="relative h-[400px] hidden lg:block mt-14 mb-16"
          >
            {/* Gold glow behind */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 rounded-3xl blur-3xl" />

            {/* Diagonal connector line — fades in with photo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showPhoto ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-[45%] left-[55%] w-[80px] h-px bg-gradient-to-r from-gold/20 to-gold/5 rotate-[35deg] origin-left z-15 pointer-events-none"
            />

            {/* Terminal card — top left */}
            <div className="absolute top-6 left-0 w-[340px] glass rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl z-20">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[9px] text-white/20 font-mono">
                  ~/vivek
                </span>
              </div>
              <div className="p-4">
                <TypingTerminal displayed={displayed} />
              </div>
            </div>

            {/* Photo card — bottom right, scan reveal */}
            <div className="absolute bottom-6 right-4 w-[200px] z-10">
              <PhotoReveal show={showPhoto} />
            </div>
          </motion.div>

          {/* Mobile: diagonal cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="relative h-[360px] lg:hidden"
          >
            {/* Terminal card — top left */}
            <div className="absolute top-0 left-0 right-8 glass rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl z-20">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[9px] text-white/20 font-mono">~/vivek</span>
              </div>
              <div className="p-3">
                <TypingTerminal displayed={displayed} />
              </div>
            </div>

            {/* Photo card — bottom right, scan reveal */}
            <div className="absolute bottom-0 right-0 w-[160px] z-10">
              <PhotoReveal show={showPhoto} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 3.5, duration: 0.6 },
          y: { delay: 3.5, duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/20 hover:text-white/40 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.a>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
