"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectData } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudiesProps {
  readonly projects: ProjectData[];
}

export default function CaseStudies({ projects }: CaseStudiesProps) {
  const featuredSlugs = ["voxen", "3d-virtual-expo", "aegisuae"];
  const caseStudies = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is ProjectData => !!p && !!p.problem && !!p.solution);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || caseStudies.length === 0) return;

    const track = trackRef.current;
    const cards = track.querySelectorAll<HTMLElement>(".case-card");
    if (cards.length === 0) return;

    // Calculate total scroll width
    const totalWidth = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (counterRef.current) {
              const idx = Math.min(
                Math.floor(self.progress * caseStudies.length),
                caseStudies.length - 1
              );
              counterRef.current.textContent = `${idx + 1} / ${caseStudies.length}`;
            }
          },
        },
      });

      // Animate each card's content on enter
      cards.forEach((card) => {
        const content = card.querySelector(".case-content");
        const image = card.querySelector(".case-image");

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 80%",
                end: "left 40%",
                scrub: true,
              },
            }
          );
        }

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.15, opacity: 0.6 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 90%",
                end: "left 50%",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [caseStudies.length]);

  if (caseStudies.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Fixed header + counter */}
      <div className="absolute top-8 left-6 sm:left-10 z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase"
        >
          Case Studies
        </motion.h2>
      </div>

      <div className="absolute top-8 right-6 sm:right-10 z-10">
        <span
          ref={counterRef}
          className="text-sm tracking-[0.15em] text-white/30 font-medium tabular-nums"
        >
          1 / {caseStudies.length}
        </span>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-10">
        <div className="h-full bg-gold/40 origin-left case-progress" />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex items-stretch pt-20 pb-8"
        style={{ width: `${caseStudies.length * 100}vw` }}
      >
        {caseStudies.map((project, i) => (
          <div
            key={project.slug || i}
            className="case-card flex-shrink-0 w-screen h-[calc(100vh-7rem)] flex items-center px-6 sm:px-10 lg:px-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full max-w-[1400px] mx-auto">
              {/* Image */}
              <div className="case-image relative aspect-[4/3] rounded-xl overflow-hidden order-2 lg:order-1">
                <Image
                  src={project.imgPath}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i < 2}
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Tags on image */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 flex-wrap">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/70 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="case-content order-1 lg:order-2">
                {project.category && (
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold/60 font-medium">
                    {project.category}
                  </span>
                )}
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mt-2 mb-5">
                  {project.title}
                </h3>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                  {project.desc}
                </p>

                {project.impact && (
                  <ul className="space-y-3 mb-8">
                    {project.impact.slice(0, 3).map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-white/40"
                      >
                        <span className="text-gold mt-0.5 text-xs">&#9670;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium tracking-wider uppercase rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all group"
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors"
                    >
                      Live Site &rarr;
                    </a>
                  )}
                </div>

                {/* Role + Duration */}
                {(project.role || project.duration) && (
                  <div className="flex items-center gap-4 mt-6 text-[11px] text-white/20 tracking-wide">
                    {project.role && <span>{project.role}</span>}
                    {project.role && project.duration && (
                      <span className="text-white/10">|</span>
                    )}
                    {project.duration && <span>{project.duration}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
