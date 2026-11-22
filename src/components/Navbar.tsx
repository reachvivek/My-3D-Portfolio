"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download } from "lucide-react";
import type { NavLinkData } from "@/lib/types";
import { Location } from "./showcase/parts";

/** The five places that tell the story; everything else in the CMS list becomes a quieter secondary row. */
const PRIMARY: NavLinkData[] = [
  { name: "About", href: "#about" },
  { name: "Selected Work", href: "#work" },
  { name: "Experience", href: "#experience" },
  { name: "Technical Arsenal", href: "#skills" },
  { name: "Contact", href: "#contact" },
];
const CALENDLY = "https://calendly.com/rogerthatvivek/30min";
const EASE = [0.76, 0, 0.24, 1] as const;

interface NavbarProps {
  navLinks: NavLinkData[] | null;
}

const defaultNavLinks: NavLinkData[] = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Highlights", href: "#highlights" },
  { name: "Blog", href: "#blog" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ navLinks }: NavbarProps) {
  const secondary = (navLinks || defaultNavLinks).filter((l) => !PRIMARY.some((p) => p.href === l.href));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-10 py-5 ${
          scrolled
            ? "backdrop-blur-xl bg-black/60"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          {/* Logo */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-[0.3em] uppercase text-white hover:text-gold transition-colors"
          >
            V I V E K
          </motion.a>

          {/* Center: Get in Touch */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:block text-xs font-semibold tracking-[0.25em] uppercase text-white/70 hover:text-gold transition-colors"
          >
            GET IN TOUCH
          </motion.a>

          {/* Right: Resume + Hamburger */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <a
              href="/resume.pdf"
              download="Vivek_Singh_Full_Stack_Developer_UAE_2026.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-gold text-black hover:bg-gold-light transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.25)]"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="relative w-8 h-8 flex items-center justify-center text-white hover:text-gold transition-colors group"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-[5px] items-end">
                <span className="block w-6 h-[1.5px] bg-current transition-all group-hover:w-7" />
                <span className="block w-5 h-[1.5px] bg-current transition-all group-hover:w-7" />
                <span className="block w-4 h-[1.5px] bg-current transition-all group-hover:w-7" />
              </div>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[#090909]"
            style={{ backgroundImage: "radial-gradient(60% 50% at 80% 0%, rgba(212,168,83,0.10), transparent 60%)" }}
          >
            <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-6 py-5 md:px-10">
              <span className="text-xl font-bold uppercase tracking-[0.3em] text-white">V I V E K</span>
              <button onClick={() => setOpen(false)} className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-gold" aria-label="Close menu" autoFocus>
                Close
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-14 px-6 pb-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
              <nav aria-label="Primary">
                <ul>
                  {PRIMARY.map((link, i) => (
                    <li key={link.href} className="overflow-hidden border-b border-white/[0.06]">
                      <motion.a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.9, delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="group flex items-baseline gap-5 py-3 md:py-4"
                      >
                        <span className="font-mono text-xs text-gold/60">0{i + 1}</span>
                        <span className="font-serif text-4xl text-white/85 transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold sm:text-5xl md:text-6xl">
                          {link.name}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
                {secondary.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                    {secondary.map((l) => (
                      <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-gold">
                        {l.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </nav>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col justify-end gap-8">
                <Location size={15} />
                <div className="space-y-2 text-sm">
                  <a href="mailto:rogerthatvivek@gmail.com" className="block text-white/70 transition-colors hover:text-gold">rogerthatvivek@gmail.com</a>
                  <a href="https://linkedin.com/in/reachvivek" target="_blank" rel="noopener noreferrer" className="block text-white/50 transition-colors hover:text-gold">LinkedIn ↗</a>
                  <a href="https://github.com/reachvivek" target="_blank" rel="noopener noreferrer" className="block text-white/50 transition-colors hover:text-gold">GitHub ↗</a>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-light">
                    Book a Call
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Vivek_Singh_Full_Stack_Developer_UAE_2026.pdf"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-5 py-3 text-sm text-gold transition-colors hover:bg-gold/10"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
