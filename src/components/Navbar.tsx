"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download } from "lucide-react";
import type { NavLinkData } from "@/lib/types";

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
  const links = navLinks || defaultNavLinks;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              download
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

      {/* Sidebar overlay + panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[320px] bg-[#0a0a0a] border-l border-white/8 flex flex-col"
            >
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center px-10">
                <ul className="space-y-1">
                  {links.map((link, i) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-3 text-sm font-medium tracking-[0.2em] uppercase text-white/50 hover:text-gold hover:pl-2 transition-all duration-300"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="p-8 space-y-4 border-t border-white/6">
                <a
                  href="/resume.pdf"
                  download
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium tracking-wider uppercase rounded-lg bg-gold text-black hover:bg-gold-light transition-all"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block text-center w-full py-3 text-sm font-medium tracking-wider uppercase rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-all"
                >
                  Get in Touch
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
