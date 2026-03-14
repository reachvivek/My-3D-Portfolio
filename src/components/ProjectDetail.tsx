"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ProjectData } from "@/lib/types";

interface ProjectDetailProps {
  readonly project: ProjectData;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Hero section: centered */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {project.title}
          </h1>
          <span className="text-[11px] px-3 py-1 rounded-full bg-gold/10 text-gold/70 border border-gold/20 inline-block">
            {project.category}
          </span>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {project.desc}
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40 pt-4">
            {project.role && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/20 block mb-1">Role</span>
                <span className="text-white/60">{project.role}</span>
              </div>
            )}
            {project.duration && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/20 block mb-1">Duration</span>
                <span className="text-white/60">{project.duration}</span>
              </div>
            )}
            {project.liveUrl && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/20 block mb-1">Live</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/70 hover:text-gold transition-colors"
                >
                  View Project
                </a>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 rounded-xl overflow-hidden glass p-2"
        >
          <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={project.imgPath}
              alt={project.title}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-16">

        {/* Problem */}
        {project.problem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-3">The Problem</h2>
            <p className="text-white/50 leading-relaxed">{project.problem}</p>
          </motion.div>
        )}

        {/* Solution + Impact + Video */}
        {project.solution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={project.videoUrl ? "grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-center" : ""}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-3">The Solution</h2>
                  <p className="text-white/50 leading-relaxed">{project.solution}</p>
                </div>

                {project.impact && project.impact.length > 0 && (
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-4">Impact</h2>
                    <div className="space-y-2">
                      {project.impact.map((item) => (
                        <div
                          key={item}
                          className="glass rounded-lg px-4 py-3 flex items-start gap-3"
                        >
                          <span className="text-gold mt-0.5 text-xs shrink-0">▸</span>
                          <span className="text-sm text-white/50">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {project.videoUrl && (
                <div className="flex justify-end">
                  <div className="w-[230px] rounded-[2.5rem] border-[3px] border-white/10 bg-black p-1.5 shadow-2xl">
                    <div className="relative w-full rounded-[2rem] overflow-hidden" style={{ aspectRatio: "9 / 19" }}>
                      <iframe
                        src={project.videoUrl}
                        title={`${project.title} demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Impact (shown separately when no video) */}
        {!project.videoUrl && project.impact && project.impact.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-4">Impact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.impact.map((item) => (
                <div
                  key={item}
                  className="glass rounded-lg px-4 py-3 flex items-start gap-3"
                >
                  <span className="text-gold mt-0.5 text-xs shrink-0">▸</span>
                  <span className="text-sm text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        {project.stack && project.stack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-gold/10 text-gold/70 border border-gold/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs uppercase tracking-widest text-gold/50 mb-4">Screenshots</h2>
            <div className="space-y-4">
              {project.screenshots.map((src, i) => (
                <div key={src} className="rounded-xl overflow-hidden glass p-2">
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={1280}
                    height={800}
                    className="w-full h-auto rounded-lg"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center pt-8 border-t border-white/[0.06]"
        >
          <p className="text-white/30 text-sm mb-4">Interested in building something similar?</p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold-light transition-colors"
          >
            Let&apos;s Talk
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
