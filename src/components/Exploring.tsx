"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const explorations = [
  "AI-powered product demo automation",
  "LLM agent orchestration systems",
  "Scalable real-time analytics platforms",
  "Browser automation for enterprise workflows",
];

export default function Exploring() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold/50 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Currently Exploring
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {explorations.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="text-sm px-4 py-2 rounded-full glass text-white/35"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
