"use client";

import { motion } from "motion/react";

const CALENDLY = "https://calendly.com/rogerthatvivek/30min";

/** The working principles shown in the hero terminal, given room to breathe. */
const RULES = [
  { n: "01", title: "Scope is a commitment.", line: "Changes are transparent." },
  { n: "02", title: "Confidential by design.", line: "Ownership defined upfront." },
  { n: "03", title: "Built for production.", line: "Delivered with accountability." },
];

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
});

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr] md:gap-24">
        <div>
          <motion.p {...reveal(0)} className="text-[11px] uppercase tracking-[0.32em] text-gold/70">
            The person behind the code
          </motion.p>
          <motion.h2 {...reveal(1)} className="mt-6 font-serif text-5xl leading-[1.05] text-white/90 md:text-6xl">
            Engineering is a <em className="text-gold">promise</em> kept.
          </motion.h2>
          <motion.p {...reveal(2)} className="mt-8 max-w-xl text-base leading-relaxed text-white/55">
            Software developer and architect with 5+ years shipping fintech, payments and enterprise platforms: MT5 trading for UAE-licensed brokers, payment gateways across the GCC, and data systems for BSE and NSDL. Today I build dealer systems and AI agents at Ali &amp; Sons in Abu Dhabi.
          </motion.p>
          <motion.div {...reveal(3)} className="mt-10 flex flex-wrap gap-3">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-light">
              Book a Call
            </a>
            <a href="/resume.pdf" download="Vivek_Singh_Full_Stack_Developer_UAE_2026.pdf" className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/70 transition-colors hover:border-gold/40 hover:text-white">
              Download Resume
            </a>
          </motion.div>
        </div>
        <div className="md:pt-10">
          {RULES.map((r, i) => (
            <motion.div key={r.n} {...reveal(i + 1)} className="grid grid-cols-[48px_1fr] gap-4 border-t border-white/[0.06] py-8 last:border-b">
              <span className="font-mono text-xs text-gold/70">{r.n}</span>
              <div>
                <div className="font-serif text-3xl text-white/90">{r.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{r.line}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
