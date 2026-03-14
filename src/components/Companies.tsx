"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { CompanyData } from "@/lib/types";

interface CompaniesProps {
  readonly companies: CompanyData[];
}

export default function Companies({ companies }: CompaniesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    const inner = innerRef.current;
    if (!scroll || !inner) return;

    // Clone enough sets so we never see the end
    // We measure one set width, then translate by that amount and reset
    let animId: number;
    let pos = 0;
    const speed = 0.5; // px per frame

    const step = () => {
      pos += speed;
      const singleSetWidth = inner.scrollWidth / 2;
      if (pos >= singleSetWidth) {
        pos -= singleSetWidth;
      }
      scroll.style.transform = `translateX(-${pos}px)`;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    // Pause on hover
    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(step); };
    scroll.addEventListener("mouseenter", pause);
    scroll.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animId);
      scroll.removeEventListener("mouseenter", pause);
      scroll.removeEventListener("mouseleave", resume);
    };
  }, []);

  // Duplicate enough times for seamless loop
  const items = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="py-16 border-t border-b border-white/[0.04] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs uppercase tracking-widest text-white/20 mb-10"
        >
          Trusted by teams at
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div ref={scrollRef} className="will-change-transform">
          <div ref={innerRef} className="flex w-max">
            {items.map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className={`flex-shrink-0 mx-10 md:mx-14 grayscale transition-all duration-300 hover:grayscale-0 ${
                  company.highlight
                    ? "opacity-50 hover:opacity-100"
                    : "opacity-25 hover:opacity-60"
                }`}
                title={company.name}
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  height={56}
                  width={180}
                  className="object-contain invert"
                  style={{ height: "56px", width: "auto", maxWidth: "180px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
