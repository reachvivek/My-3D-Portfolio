"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Loader2, Save, CheckCircle, Type, MapPin } from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface HeroData {
  headline: string;
  headlineAccent: string;
  subline: string;
  location: string;
}

const emptyHero: HeroData = {
  headline: "",
  headlineAccent: "",
  subline: "",
  location: "",
};

export default function HeroAdminPage() {
  const [data, setData] = useState<HeroData>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedData = useRef<string>("");

  const isDirty = JSON.stringify(data) !== savedData.current;

  useEffect(() => {
    fetch("/api/admin/site-config/hero")
      .then((r) => r.json())
      .then((d) => {
        const merged = { ...emptyHero, ...d };
        setData(merged);
        savedData.current = JSON.stringify(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/site-config/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    savedData.current = JSON.stringify(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                <Type className="w-5 h-5 text-[#d4a853]" />
                <h1 className="text-2xl font-bold tracking-tight">Hero Section</h1>
              </div>
              <p className="text-sm text-white/40 mt-1 ml-8">
                Edit the main landing section of your portfolio
              </p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => setData({ ...data, headline: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                  placeholder="Your main headline"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Headline Accent
                </label>
                <input
                  type="text"
                  value={data.headlineAccent}
                  onChange={(e) =>
                    setData({ ...data, headlineAccent: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                  placeholder="The accented part of the headline"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Subline
                </label>
                <input
                  type="text"
                  value={data.subline}
                  onChange={(e) => setData({ ...data, subline: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                  placeholder="A brief subtitle"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                  placeholder="e.g. Abu Dhabi, UAE"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
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
            </div>
          </motion.div>
        </div>

        {/* Live mobile preview */}
        <MobilePreview label="Hero Section">
          <div className="flex flex-col justify-center min-h-[480px] px-2">
            <h1 className="text-[22px] font-bold tracking-tight leading-tight">
              {data.headline || "Your Headline"}
              <br />
              <span className="bg-gradient-to-r from-[#d4a853] to-[#b8860b] bg-clip-text text-transparent">
                {data.headlineAccent || "Accent Text"}
              </span>
            </h1>
            <p className="text-[11px] text-white/50 mt-3 leading-relaxed">
              {data.subline || "Your subtitle goes here"}
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <MapPin className="w-3 h-3 text-[#d4a853]/60" />
              <span className="text-[10px] text-white/30">
                {data.location || "Location"}
              </span>
            </div>
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
