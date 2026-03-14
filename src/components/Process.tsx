"use client";

import { motion } from "motion/react";
import { Search, Layers, Code2, Rocket } from "lucide-react";
import type { ProcessData } from "@/lib/types";

const stepIcons = [
  <Search key="search" className="w-5 h-5" />,
  <Layers key="layers" className="w-5 h-5" />,
  <Code2 key="code" className="w-5 h-5" />,
  <Rocket key="rocket" className="w-5 h-5" />,
];

interface ProcessProps {
  readonly process: ProcessData[];
}

export default function Process({ process }: ProcessProps) {
  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            How I <span className="gradient-text">Work</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            A structured approach to building products that last.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gsap-stagger-parent">
          {process.map((item, i) => (
            <div
              key={item.step}
              className="glass rounded-xl p-6 relative group hover:border-gold/15 transition-all gsap-stagger-child"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/15 transition-colors">
                  {stepIcons[i] || stepIcons[0]}
                </div>
                <span className="text-xs font-mono text-white/20">{item.step}</span>
              </div>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
