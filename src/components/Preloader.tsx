"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2200);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9998] bg-[#0a0a0a] flex items-center justify-center"
        >
          {/* Subtle ambient glow */}
          <div className="absolute w-[300px] h-[300px] bg-gold/[0.04] rounded-full blur-[100px]" />

          <div className="relative flex flex-col items-center gap-4">
            {/* Initials */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-1"
            >
              <span className="text-2xl sm:text-3xl font-light tracking-[0.3em] text-white/90">
                VKS
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-2xl sm:text-3xl font-light text-white/30"
              >
                {" "}/ DEV
              </motion.span>
            </motion.div>

            {/* Loading bar */}
            <motion.div className="w-48 h-px bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="h-full bg-gradient-to-r from-gold/60 to-gold"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
