"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Linkedin } from "lucide-react";
import type { SocialLinkData } from "@/lib/types";

interface ContactProps {
  readonly socialLinks: SocialLinkData[];
}

export default function Contact({ socialLinks }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const linkedIn = socialLinks.find((l) => l.name === "LinkedIn");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Let&apos;s <span className="gradient-text">Talk</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <a
            href="https://calendly.com/rogerthatvivek/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]"
          >
            Schedule a Call
          </a>
          <a
            href="https://wa.me/971501480042"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-sm font-medium text-white/60 hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          {linkedIn && (
            <a
              href={linkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-sm font-medium text-white/60 hover:text-white transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/30 mb-1.5 uppercase tracking-wider">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs text-white/30 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors"
                placeholder="you@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1.5 uppercase tracking-wider">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/30 transition-colors resize-none"
              placeholder="Tell me about your project..."
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
