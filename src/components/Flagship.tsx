"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FlagshipData } from "@/lib/types";

interface FlagshipProps {
  readonly flagship: FlagshipData | null;
}

const defaultFlagship: FlagshipData = {
  title: "Voxen, AI Sales Assistant",
  problem: "Sales teams lose deals when they can't respond fast enough or join every meeting.",
  solution: "Built an AI assistant that joins meetings autonomously, engages prospects with real-time voice interaction, and closes deals without human intervention.",
  impact: ["Autonomous meeting participation via WebRTC", "Real-time AI voice interaction", "Reduced sales team workload by 40%"],
  stack: ["Next.js", "WebRTC", "AI/ML", "Node.js", "Cloud Infrastructure"],
  imgPath: "/images/projects/voxen.webp",
};

export default function Flagship({ flagship }: FlagshipProps) {
  const f = flagship || defaultFlagship;

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest text-gold/50 mb-3">
            Flagship System
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {f.title}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        >
          <div className="rounded-xl overflow-hidden glass p-2 self-start gsap-slide-right">
            <Image
              src={f.imgPath}
              alt={f.title}
              width={1280}
              height={800}
              className="w-full h-auto rounded-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="space-y-6 gsap-reveal">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Problem</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.problem}</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Solution</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.solution}</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/30 mb-2">Impact</h3>
              <ul className="space-y-1.5">
                {f.impact.map((item) => (
                  <li key={item} className="text-sm text-white/50 flex items-start gap-2">
                    <span className="text-gold mt-1 text-xs">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/30 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {f.stack.map((tech) => (
                  <span key={tech} className="text-[11px] px-3 py-1 rounded-full bg-gold/10 text-gold/70 border border-gold/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/projects/voxen"
              className="inline-flex items-center gap-2 mt-2 text-sm text-gold/70 hover:text-gold transition-colors"
            >
              View Case Study
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
