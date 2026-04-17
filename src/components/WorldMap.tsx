"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

// Client country dots: approximate x,y % positions on a simple world map
const clientLocations = [
  { name: "India", x: 68, y: 48, size: 14 },
  { name: "UAE", x: 59, y: 44, size: 12 },
  { name: "USA", x: 20, y: 38, size: 10 },
  { name: "UK", x: 46, y: 28, size: 8 },
  { name: "Germany", x: 49, y: 30, size: 7 },
  { name: "Singapore", x: 74, y: 58, size: 7 },
  { name: "Australia", x: 82, y: 72, size: 8 },
];

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}</span>;
}

export default function WorldMap() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1]">
              From Mumbai
              <br />
              To Dubai{" "}
              <span className="text-gold/30 font-light italic">
                Clients
                <br />
                Worldwide
              </span>
            </h2>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* SVG World Map (simplified outline) */}
            <div className="relative w-full aspect-[2/1]">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full"
                fill="none"
              >
                {/* Simplified world continents */}
                {/* North America */}
                <path
                  d="M50,120 Q80,80 150,90 Q200,70 230,100 Q260,80 280,110 Q290,130 270,160 Q250,180 240,200 Q220,230 200,250 Q180,240 160,220 Q140,200 120,190 Q100,180 80,170 Q60,150 50,120Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
                {/* South America */}
                <path
                  d="M200,280 Q230,260 250,280 Q270,310 280,340 Q290,370 280,400 Q260,430 240,440 Q220,430 210,400 Q200,370 190,340 Q185,310 200,280Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
                {/* Europe */}
                <path
                  d="M420,80 Q440,70 460,80 Q480,75 500,90 Q520,100 510,120 Q500,140 480,150 Q460,145 440,140 Q430,130 420,110 Q415,95 420,80Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
                {/* Africa */}
                <path
                  d="M440,180 Q470,170 500,180 Q530,190 540,220 Q550,260 545,300 Q530,340 510,370 Q490,380 470,370 Q450,350 440,310 Q435,270 430,240 Q430,210 440,180Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
                {/* Asia */}
                <path
                  d="M540,70 Q580,50 630,60 Q680,55 730,70 Q770,80 800,100 Q810,130 790,160 Q770,180 740,200 Q710,220 680,240 Q650,250 620,240 Q590,220 560,200 Q540,180 530,150 Q520,120 530,90 Q535,80 540,70Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
                {/* Australia */}
                <path
                  d="M760,320 Q800,310 840,320 Q870,340 880,370 Q870,400 840,410 Q810,415 780,400 Q760,380 755,350 Q755,335 760,320Z"
                  fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.1" strokeWidth="1"
                />
              </svg>

              {/* Client location dots */}
              {clientLocations.map((loc, i) => (
                <motion.div
                  key={loc.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", bounce: 0.4 }}
                  className="absolute group"
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="rounded-full bg-gold shadow-[0_0_20px_rgba(212,168,83,0.4)] cursor-pointer transition-transform hover:scale-125"
                    style={{
                      width: `${loc.size}px`,
                      height: `${loc.size}px`,
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[10px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {loc.name}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats below map */}
            <div className="flex items-end justify-between mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-5xl sm:text-6xl font-bold text-gold leading-none">
                  <AnimatedCount target={7} />+
                </div>
                <div className="text-xs text-white/40 mt-2 tracking-wide">Countries</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="text-5xl sm:text-6xl font-bold text-gold leading-none">
                  <AnimatedCount target={3} />
                </div>
                <div className="text-xs text-white/40 mt-2 tracking-wide">Continents</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
