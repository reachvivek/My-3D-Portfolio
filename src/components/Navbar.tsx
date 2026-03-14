"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import type { NavLinkData } from "@/lib/types";

interface NavbarProps {
  navLinks: NavLinkData[] | null;
}

const defaultNavLinks: NavLinkData[] = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Skills", href: "#skills" },
  { name: "Highlights", href: "#highlights" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ navLinks }: NavbarProps) {
  const links = navLinks || defaultNavLinks;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Scroll state for background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver scroll spy
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    links.forEach((link) => {
      const id = link.href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -50% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [links]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl px-4 md:px-6 py-2.5 md:py-3 border shadow-lg ${
        scrolled
          ? "backdrop-blur-xl bg-black/30 border-white/15 shadow-black/30"
          : "backdrop-blur-md bg-white/[0.03] border-white/[0.06]"
      }`}
      style={{ borderRadius: "4rem" }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <a href="/" className="flex items-center gap-1 group">
            <span className="text-lg font-semibold tracking-tight text-white group-hover:text-gold transition-colors">
              vivek<span className="text-gold">.</span>
            </span>
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow justify-center">
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1"
          >
            {links.map((link, i) => {
              const sectionId = link.href.replace("#", "");
              const active = activeSection === sectionId;
              return (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.05 },
                  }}
                >
                  <a
                    href={link.href}
                    className={`relative px-4 py-1.5 text-sm tracking-wide transition-all duration-300 rounded-full ${
                      active
                        ? "text-gold"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gold/10 border border-gold/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Desktop CTAs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-2"
        >
          <a
            href="/resume.pdf"
            download
            className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full bg-gold text-black hover:bg-gold-light transition-all hover:shadow-[0_0_20px_rgba(212,168,83,0.25)] group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <Download className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Resume</span>
          </a>
          <a
            href="#contact"
            className="relative overflow-hidden px-4 py-1.5 text-sm font-medium rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-all group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-gold/20 to-transparent pointer-events-none" />
            <span className="relative z-10">Get in Touch</span>
          </a>
        </motion.div>

        {/* Mobile toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:hidden text-white hover:text-gold transition-colors p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 pt-3 border-t border-white/10"
          >
            <nav>
              <ul className="flex flex-col gap-1">
                {links.map((link, i) => {
                  const sectionId = link.href.replace("#", "");
                  const active = activeSection === sectionId;
                  return (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: i * 0.05 },
                      }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block px-4 py-2.5 text-sm tracking-wide rounded-full transition-all duration-300 ${
                          active
                            ? "text-gold bg-gold/10"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  );
                })}
                <li className="pt-2 flex flex-col gap-2 px-2">
                  <a
                    href="/resume.pdf"
                    download
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-full bg-gold text-black"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Resume
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="text-center px-4 py-2.5 text-sm font-medium rounded-full border border-gold/30 text-gold"
                  >
                    Get in Touch
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
