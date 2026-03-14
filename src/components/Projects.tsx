"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectData } from "@/lib/types";

const INITIAL_COUNT = 6;

interface ProjectsProps {
  readonly projects: ProjectData[];
}

export default function Projects({ projects }: ProjectsProps) {
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects]
  );
  const [active, setActive] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Selected <span className="gradient-text">Work</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            Products shipped across AI, fintech, healthcare & more.
          </p>
        </motion.div>

        <div className="overflow-x-auto scrollbar-hide mb-10">
          <div className="flex items-center gap-2 w-max md:w-auto md:flex-wrap md:justify-center mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActive(cat);
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  active === cat
                    ? "bg-gold/10 text-gold border border-gold/30"
                    : "glass glass-hover text-white/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative block rounded-xl overflow-hidden glass cursor-pointer card-lift"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.imgPath}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex flex-col items-center justify-center gap-3 px-6">
                      <p className="text-white/80 text-sm text-center">{project.desc}</p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold/70 border border-gold/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] text-gold/60 mt-1">View Case Study →</span>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold truncate group-hover:text-gold transition-colors">{project.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 shrink-0">
                        {project.category}
                      </span>
                    </div>
                    <div className="sm:hidden mt-2">
                      <p className="text-xs text-white/40 leading-relaxed">{project.desc}</p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/10 text-gold/60 border border-gold/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!showAll && filtered.length > INITIAL_COUNT && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-xl glass glass-hover text-sm font-medium text-white/50 hover:text-white transition-all cursor-pointer"
            >
              View Full Portfolio ({filtered.length - INITIAL_COUNT} more)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
