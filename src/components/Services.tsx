"use client";

import { motion } from "motion/react";
import { Brain, Globe, Smartphone, Cloud, CreditCard, BarChart3 } from "lucide-react";
import type { ServiceData } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  ai: <Brain className="w-6 h-6" />,
  web: <Globe className="w-6 h-6" />,
  mobile: <Smartphone className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
  fintech: <CreditCard className="w-6 h-6" />,
  dashboard: <BarChart3 className="w-6 h-6" />,
};

interface ServicesProps {
  readonly services: ServiceData[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What I <span className="gradient-text">Do</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            End-to-end engineering across the stack.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gsap-stagger-parent">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass glass-hover rounded-xl p-6 group transition-all hover:border-gold/15 gsap-stagger-child"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/15 transition-colors">
                {iconMap[service.icon] || <Globe className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-semibold mb-1">{service.title}</h3>
              <p className="text-sm text-white/35">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
