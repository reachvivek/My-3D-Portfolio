"use client";

import { motion } from "motion/react";
import type { StatData } from "@/lib/types";
import { BRANDS, type Logo } from "./showcase/data";
import { MarqueeItem } from "./showcase/parts";

const pick = (...names: string[]) => names.map((n) => BRANDS.find((b) => b.name === n)).filter((b): b is Logo => !!b);

/**
 * Who the work was for, and in what capacity. Relationships follow the experience entries:
 * capital-markets work was delivered as client engagements through Oneture; automotive is in-house at Ali & Sons.
 */
const SECTORS: { sector: string; logos: Logo[]; also?: string; role: string; years: string; city: string }[] = [
  { sector: "Capital markets", logos: pick("BSE", "NSDL", "ICCL", "CMS Info Systems"), role: "Client engagements via Oneture Technologies", years: "2024 – 2025", city: "Mumbai" },
  { sector: "Brokerage & payments", logos: pick("Azaya"), also: "N-Genius · e& Payments · MyFatoorah", role: "Lead full-stack engineer at Azaya", years: "2025 – 2026", city: "Dubai" },
  { sector: "Automotive", logos: pick("Porsche", "Audi", "Volkswagen", "XPENG"), role: "In-house at Ali & Sons, the group behind these dealerships", years: "2026 – now", city: "Abu Dhabi" },
  { sector: "AI products", logos: pick("Hoopr", "Blackcurrant Labs"), role: "Full-stack developer at Blackcurrant Labs", years: "2021 – 2024", city: "Mumbai" },
];

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Credentials({ stats }: { stats: StatData[] }) {
  return (
    <section id="credentials" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.p {...reveal(0)} className="text-[11px] uppercase tracking-[0.32em] text-gold/70">
          Experience &amp; industry exposure
        </motion.p>

        {stats.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-y-10 border-t border-white/[0.06] pt-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...reveal(i + 1)}>
                <div className="font-serif text-5xl text-white/90 md:text-6xl">{s.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20">
          {SECTORS.map((row, i) => (
            <motion.div
              key={row.sector}
              {...reveal(i)}
              className="grid grid-cols-1 items-center gap-4 border-t border-white/[0.06] py-7 last:border-b md:grid-cols-[220px_1fr_300px] md:gap-8"
            >
              <div className="font-serif text-3xl text-white/90">{row.sector}</div>
              <div className="-mx-5 flex flex-wrap items-center">
                {row.logos.map((l) => (
                  <MarqueeItem key={l.name} logo={l} />
                ))}
                {row.also && <span className="px-5 text-sm text-white/45">{row.also}</span>}
              </div>
              <div className="text-sm leading-relaxed text-white/50 md:text-right">
                {row.role}
                <span className="mt-1 block font-mono text-xs text-gold/60">
                  {row.years} · {row.city}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
