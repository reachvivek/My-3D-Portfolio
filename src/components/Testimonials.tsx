"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import Image from "next/image";
import type { TestimonialData } from "@/lib/types";

interface TestimonialsProps {
  readonly testimonials: TestimonialData[];
}

const CARD_GAP = 24;
const getCardWidth = () =>
  typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 400;

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [cardWidth, setCardWidth] = useState(400);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    setCardWidth(getCardWidth());
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const count = testimonials.length;
    const cardUnit = cardWidth + CARD_GAP;
    const totalWidth = count * cardUnit;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 80,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          return parseFloat(String(x)) % totalWidth;
        }),
      },
      onUpdate: function () {
        // Use tween progress to calculate current card index
        const progress = this.progress();
        const currentX = progress * totalWidth;
        const index = Math.floor(currentX / cardUnit) % count;
        if (index !== lastIndexRef.current) {
          lastIndexRef.current = index;
          setActiveIndex(index);
        }
      },
    });

    tweenRef.current = tween;

    const handleEnter = () => tween.pause();
    const handleLeave = () => tween.resume();

    track.addEventListener("mouseenter", handleEnter);
    track.addEventListener("mouseleave", handleLeave);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", handleEnter);
      track.removeEventListener("mouseleave", handleLeave);
    };
  }, [cardWidth, testimonials.length]);

  const scrollToIndex = (index: number) => {
    const tween = tweenRef.current;
    if (!tween) return;

    const cardUnit = cardWidth + CARD_GAP;
    const totalWidth = testimonials.length * cardUnit;
    const targetProgress = (index * cardUnit) / totalWidth;

    tween.pause();
    gsap.to(tween, {
      progress: targetProgress,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        setActiveIndex(index);
      },
      onComplete: () => {
        setActiveIndex(index);
        lastIndexRef.current = index;
        tween.resume();
      },
    });
  };

  const doubled = [...testimonials, ...testimonials];

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

        <div
          ref={trackRef}
          className="flex"
          style={{ width: "max-content", gap: `${CARD_GAP}px` }}
        >
          {doubled.map((t, i) => (
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

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-gold w-6"
                : "bg-white/20 hover:bg-white/40 w-2"
            }`}
            aria-label={`Go to ${t.name}'s testimonial`}
          />
        ))}
      </div>
    </section>
  );
}
