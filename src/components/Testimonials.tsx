"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { TestimonialData } from "@/lib/types";

interface TestimonialsProps {
  readonly testimonials: TestimonialData[];
}

const CARD_GAP = 24;
const SPEED = 1.2;
const getCardWidth = () =>
  typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 400;

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const pauseIconRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const animRef = useRef(0);
  const pausedRef = useRef(false);
  const stepFnRef = useRef<(() => void) | null>(null);
  const [cardWidth, setCardWidth] = useState(400);

  useEffect(() => {
    setCardWidth(getCardWidth());
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    const dotsContainer = dotsRef.current;
    if (!scroll || !dotsContainer) return;

    const count = testimonials.length;
    const cardUnit = cardWidth + CARD_GAP;
    const singleSetWidth = count * cardUnit;
    let lastIndex = -1;

    const updateDots = (index: number) => {
      if (index === lastIndex) return;
      lastIndex = index;
      const dots = dotsContainer.children;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i] as HTMLElement;
        if (i === index) {
          dot.style.width = "24px";
          dot.style.backgroundColor = "var(--color-gold, #d4a853)";
        } else {
          dot.style.width = "8px";
          dot.style.backgroundColor = "rgba(255,255,255,0.2)";
        }
      }
    };

    updateDots(0);

    const step = () => {
      posRef.current += SPEED;
      if (posRef.current >= singleSetWidth) {
        posRef.current -= singleSetWidth;
      }
      scroll.style.transform = `translateX(-${posRef.current}px)`;

      const index = Math.floor(posRef.current / cardUnit) % count;
      updateDots(index);

      animRef.current = requestAnimationFrame(step);
    };

    stepFnRef.current = step;
    animRef.current = requestAnimationFrame(step);

    // Desktop: hover to pause
    const pause = () => {
      if (!pausedRef.current) {
        pausedRef.current = true;
        cancelAnimationFrame(animRef.current);
      }
    };
    const resume = () => {
      if (pausedRef.current) {
        pausedRef.current = false;
        animRef.current = requestAnimationFrame(step);
        // Hide pause icon
        if (pauseIconRef.current) {
          pauseIconRef.current.style.opacity = "0";
        }
      }
    };
    scroll.addEventListener("mouseenter", pause);
    scroll.addEventListener("mouseleave", resume);

    // Mobile: tap to toggle pause/play
    const handleTap = (e: TouchEvent) => {
      // Don't interfere with dot clicks
      if ((e.target as HTMLElement).closest("[data-dot]")) return;

      if (pausedRef.current) {
        // Resume
        pausedRef.current = false;
        animRef.current = requestAnimationFrame(step);
        if (pauseIconRef.current) {
          pauseIconRef.current.style.opacity = "0";
        }
      } else {
        // Pause
        pausedRef.current = true;
        cancelAnimationFrame(animRef.current);
        if (pauseIconRef.current) {
          pauseIconRef.current.style.opacity = "1";
        }
      }
    };
    scroll.addEventListener("touchstart", handleTap, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      scroll.removeEventListener("mouseenter", pause);
      scroll.removeEventListener("mouseleave", resume);
      scroll.removeEventListener("touchstart", handleTap);
    };
  }, [cardWidth, testimonials.length]);

  const scrollToIndex = (index: number) => {
    const cardUnit = cardWidth + CARD_GAP;
    posRef.current = index * cardUnit;
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
    const dotsContainer = dotsRef.current;
    if (dotsContainer) {
      const dots = dotsContainer.children;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i] as HTMLElement;
        if (i === index) {
          dot.style.width = "24px";
          dot.style.backgroundColor = "var(--color-gold, #d4a853)";
        } else {
          dot.style.width = "8px";
          dot.style.backgroundColor = "rgba(255,255,255,0.2)";
        }
      }
    }
    // Resume scrolling after jumping to a dot
    if (pausedRef.current && stepFnRef.current) {
      pausedRef.current = false;
      animRef.current = requestAnimationFrame(stepFnRef.current);
      if (pauseIconRef.current) {
        pauseIconRef.current.style.opacity = "0";
      }
    }
  };

  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            From colleagues and clients I&apos;ve worked with.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Pause indicator overlay */}
        <div
          ref={pauseIconRef}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-4">
            <svg
              className="w-8 h-8 text-white/70"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
        </div>

        <div ref={scrollRef} className="will-change-transform cursor-pointer">
          <div
            className="flex"
            style={{ width: "max-content", gap: `${CARD_GAP}px` }}
          >
            {items.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="flex-shrink-0"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="glass rounded-xl p-6 h-full flex flex-col justify-between group hover:border-gold/15 transition-all">
                  <div>
                    <svg
                      className="w-6 h-6 text-gold/20 mb-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                    </svg>
                    <p className="text-sm text-white/50 leading-relaxed mb-6">
                      {t.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-gold/20 transition-colors">
                      <Image
                        src={t.imgPath}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-white/30">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div ref={dotsRef} className="flex justify-center gap-2 mt-8">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            data-dot
            onClick={() => scrollToIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === 0 ? "24px" : "8px",
              backgroundColor:
                i === 0
                  ? "var(--color-gold, #d4a853)"
                  : "rgba(255,255,255,0.2)",
            }}
            aria-label={`Go to ${t.name}'s testimonial`}
          />
        ))}
      </div>
    </section>
  );
}
