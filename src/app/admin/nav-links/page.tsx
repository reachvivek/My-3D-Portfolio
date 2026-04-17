"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  Save,
  CheckCircle,
  Compass,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface NavLink {
  name: string;
  href: string;
}

export default function NavLinksAdminPage() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedData = useRef<string>("");

  useEffect(() => {
    fetch("/api/admin/site-config/navLinks")
      .then((r) => r.json())
      .then((d) => {
        const loaded = Array.isArray(d) ? d : [];
        setLinks(loaded);
        savedData.current = JSON.stringify(loaded);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isDirty = JSON.stringify(links) !== savedData.current;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/site-config/navLinks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(links),
    });
    savedData.current = JSON.stringify(links);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addLink = () => {
    setLinks([...links, { name: "", href: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof NavLink, value: string) => {
    setLinks(links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Compass className="w-5 h-5 text-[#d4a853]" />
                  <h1 className="text-2xl font-bold tracking-tight">
                    Navigation Links
                  </h1>
                </div>
                <p className="text-sm text-white/40 mt-1 ml-8">
                  Manage the links in your site navigation
                </p>
              </div>
              <button
                onClick={addLink}
                className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/8 text-sm font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {links.map((link, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-4 flex items-center gap-3"
                  >
                    <GripVertical className="w-4 h-4 text-white/15 shrink-0" />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateLink(index, "name", e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateLink(index, "href", e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                        placeholder="#section or /path"
                      />
                    </div>
                    <button
                      onClick={() => removeLink(index)}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {links.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <Compass className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No navigation links yet</p>
                  <button
                    onClick={addLink}
                    className="mt-4 text-xs text-[#d4a853] hover:underline"
                  >
                    Add your first link
                  </button>
                </div>
              )}
            </div>

            {links.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className="px-5 py-2.5 rounded-lg bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-emerald-400 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Saved
                  </motion.span>
                )}
                {isDirty && !saving && (
                  <span className="text-xs text-yellow-400/60">Unsaved changes</span>
                )}
              </div>
            )}
          </motion.div>
        </div>
        <MobilePreview label="Navigation">
          <div className="pt-0 -mx-4 -mt-6 min-h-[480px] bg-[#0a0a0a] px-5 py-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-base font-semibold tracking-tight">
                vivek<span className="text-[#d4a853]">.</span>
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <span className="text-white/50 text-xs">✕</span>
              </div>
            </div>

            {/* Nav items */}
            <div className="space-y-1 flex-1">
              {links.map((link, idx) => (
                <div
                  key={link.name || idx}
                  className="py-2.5 text-[15px] text-white/70 font-medium"
                >
                  {link.name || "Untitled"}
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-[10px] text-white/20 text-center py-6">No links</p>
              )}
            </div>

            {/* Bottom actions */}
            <div className="mt-auto space-y-2.5 pt-4">
              <button className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-medium text-white/60 flex items-center justify-center gap-2">
                <span className="text-[10px]">↓</span> Resume
              </button>
              <button className="w-full py-2.5 rounded-xl bg-[#d4a853] text-black text-xs font-semibold">
                Get in Touch
              </button>
            </div>

            {/* Footer text */}
            <div className="mt-4 space-y-0.5">
              <p className="text-[8px] text-[#d4a853]/50 leading-relaxed">Hey, I'm Vivek.</p>
              <p className="text-[8px] text-[#d4a853]/50 leading-relaxed">Full-Stack Engineer + AI Developer.</p>
              <p className="text-[8px] text-[#d4a853]/50 leading-relaxed">Building voice agents for Audi, Porsche & VW.</p>
              <p className="text-[8px] text-[#d4a853]/50 leading-relaxed">Based in Abu Dhabi, UAE.</p>
            </div>
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
