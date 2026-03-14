"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";

const linkedInPosts = [
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7437496509077766144?collapsed=1",
    label: "Birthday in Dubai",
  },
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7426638140943089665?collapsed=1",
    label: "Burj2Burj Half Marathon",
  },
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7398418207193112576?collapsed=1",
    label: "Startup Journey",
  },
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:7319721238300368896?collapsed=1",
    label: "Tech Insights",
  },
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:share:6634804746878316544?collapsed=1",
    label: "Hackathon Win",
  },
  {
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:6723554635728117760?compact=1",
    label: "Achievement",
  },
];

const getCardWidth = () => (typeof window !== "undefined" && window.innerWidth < 640 ? 300 : 420);
const CARD_GAP = 24;
const getCardHeight = () => (typeof window !== "undefined" && window.innerWidth < 640 ? 380 : 480);

export default function Highlights() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [cardWidth, setCardWidth] = useState(420);
  const [cardHeight, setCardHeight] = useState(480);

  useEffect(() => {
    setCardWidth(getCardWidth());
    setCardHeight(getCardHeight());
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = linkedInPosts.length * (cardWidth + CARD_GAP);

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 60,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          return parseFloat(String(x)) % totalWidth;
        }),
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
  }, [cardWidth]);

  const doubled = [...linkedInPosts, ...linkedInPosts];

  return (
    <section id="highlights" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Beyond <span className="gradient-text">Code</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base max-w-xl mx-auto">
            I believe the best engineers are built outside the IDE too.
            Marathon runner, hackathon competitor, and always learning in public.
          </p>
        </motion.div>
      </div>

      {/* GSAP-powered infinite marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex"
          style={{ width: "max-content", gap: `${CARD_GAP}px` }}
        >
          {doubled.map((post, i) => (
            <div
              key={`${post.label}-${i}`}
              className="flex-shrink-0"
              style={{ width: `${cardWidth}px` }}
            >
              <div className="glass rounded-xl overflow-hidden p-1 h-full">
                <iframe
                  src={post.src}
                  height={cardHeight}
                  width="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={post.label}
                  className="rounded-lg w-full"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal note */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 glass rounded-xl p-6 sm:p-8 max-w-3xl mx-auto text-center"
        >
          <p className="text-sm text-white/50 leading-relaxed">
            When I&apos;m not shipping code, you&apos;ll find me training for my next
            race, competing in hackathons, or sharing engineering insights on
            LinkedIn. I moved to the UAE to build at the intersection of tech
            and ambition, and I bring that same energy to every product I touch.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
            <span className="text-xs text-gold font-medium">
              Next up: HYROX Hong Kong, May 8-10 2026
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
