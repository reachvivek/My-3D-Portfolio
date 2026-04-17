"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { StatData } from "@/lib/types";

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-gold leading-none">
      {count}
      {suffix}
    </div>
  );
}

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) return { num: Number.parseInt(match[1]), suffix: match[2] };
  return { num: 0, suffix: value };
}

interface StatsProps {
  readonly stats: StatData[];
}

export default function Stats({ stats }: StatsProps) {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Stats grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-14">
            {stats.map((stat, i) => {
              const { num, suffix } = parseStatValue(stat.value);
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <AnimatedNumber value={num} suffix={suffix} />
                  <div className="text-xs sm:text-sm text-white/40 mt-3 tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Bold statement */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1]">
              A Full-Stack
              <br />
              Engineer
              <br />
              Who Ships{" "}
              <span className="text-gold/30 font-light italic">
                Products
                <br />
                That Scale
              </span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
