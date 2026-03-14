"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { TestimonialData } from "@/lib/types";

interface TestimonialsProps {
  readonly testimonials: TestimonialData[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gsap-stagger-parent">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass rounded-xl p-6 flex flex-col justify-between group hover:border-gold/15 transition-all gsap-stagger-child"
            >
              <div>
                <svg className="w-6 h-6 text-gold/20 mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <p className="text-sm text-white/50 leading-relaxed mb-6">{t.text}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-gold/20 transition-colors">
                  <Image src={t.imgPath} alt={t.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/30">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
