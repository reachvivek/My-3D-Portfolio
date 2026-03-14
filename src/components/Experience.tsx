"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ExperienceData } from "@/lib/types";

interface ExperienceProps {
  readonly experiences: ExperienceData[];
}

const companyLogos: Record<string, string> = {
  "Ali and Sons": "/images/logos/ali-and-sons.png",
  "Azaya Marketing": "/images/logos/azaya.png",
  "Indian Clearing Corporation Limited (ICCL)": "/images/logos/iccl.jpg",
  "Bombay Stock Exchange (BSE)": "/images/logos/bse.png",
  "NSDL (National Securities Depository Limited)": "/images/logos/nsdl.png",
  "CMS Info Systems (via Oneture Technologies)": "/images/logos/cms.png",
  "Oneture Technologies": "/images/logos/oneture.png",
  "Blackcurrant Labs Pvt. Ltd.": "/images/logos/blc.png",
};

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Career <span className="gradient-text">Journey</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            From India to the UAE, building products that move industries.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.date}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative pl-12 sm:pl-20"
              >
                {/* Dot on timeline */}
                <div className="absolute left-[11px] sm:left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold border-2 border-[#0a0a0a]" />

                {/* Card */}
                <div className="glass rounded-xl p-5 sm:p-6 group hover:border-gold/15 transition-all">
                  <div className="flex items-start gap-4 mb-3">
                    {/* Company logo */}
                    {companyLogos[exp.company] && (
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center p-1.5 overflow-hidden">
                        <Image
                          src={companyLogos[exp.company]}
                          alt={exp.company}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="text-base font-semibold group-hover:text-gold transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-white/50">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span>{exp.date}</span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h) => (
                      <li key={h} className="text-sm text-white/40 flex items-start gap-2">
                        <span className="text-gold/50 mt-1 text-xs shrink-0">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-gold/5 text-gold/50 border border-gold/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
