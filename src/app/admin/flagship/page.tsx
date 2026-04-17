"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Loader2,
  Save,
  CheckCircle,
  Award,
  Plus,
  Trash2,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface FlagshipData {
  title: string;
  slug: string;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
  imgPath: string;
}

const emptyFlagship: FlagshipData = {
  title: "",
  slug: "",
  problem: "",
  solution: "",
  impact: [],
  stack: [],
  imgPath: "",
};

export default function FlagshipAdminPage() {
  const [data, setData] = useState<FlagshipData>(emptyFlagship);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedData = useRef<string>(JSON.stringify(emptyFlagship));

  useEffect(() => {
    fetch("/api/admin/site-config/flagship")
      .then((r) => r.json())
      .then((d) => {
        const loaded = { ...emptyFlagship, ...d };
        setData(loaded);
        savedData.current = JSON.stringify(loaded);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/site-config/flagship", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    savedData.current = JSON.stringify(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isDirty = JSON.stringify(data) !== savedData.current;

  const addImpact = () => setData({ ...data, impact: [...data.impact, ""] });
  const removeImpact = (i: number) =>
    setData({ ...data, impact: data.impact.filter((_, idx) => idx !== i) });
  const updateImpact = (i: number, val: string) =>
    setData({
      ...data,
      impact: data.impact.map((v, idx) => (idx === i ? val : v)),
    });

  const addStack = () => setData({ ...data, stack: [...data.stack, ""] });
  const removeStack = (i: number) =>
    setData({ ...data, stack: data.stack.filter((_, idx) => idx !== i) });
  const updateStack = (i: number, val: string) =>
    setData({
      ...data,
      stack: data.stack.map((v, idx) => (idx === i ? val : v)),
    });

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
            <Award className="w-5 h-5 text-[#d4a853]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Flagship Project
            </h1>
          </div>
          <p className="text-sm text-white/40 mt-1 ml-8">
            Edit the featured project showcased on your portfolio
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">
                Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                placeholder="project-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Image Path
            </label>
            <input
              type="text"
              value={data.imgPath}
              onChange={(e) => setData({ ...data, imgPath: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
              placeholder="/images/flagship.png"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Problem
            </label>
            <textarea
              value={data.problem}
              onChange={(e) => setData({ ...data, problem: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors resize-none"
              placeholder="Describe the problem this project solves"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Solution
            </label>
            <textarea
              value={data.solution}
              onChange={(e) => setData({ ...data, solution: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors resize-none"
              placeholder="Describe the solution"
            />
          </div>

          {/* Impact array */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-white/50">
                Impact
              </label>
              <button
                onClick={addImpact}
                className="text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {data.impact.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateImpact(i, e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                    placeholder="Impact metric"
                  />
                  <button
                    onClick={() => removeImpact(i)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {data.impact.length === 0 && (
                <p className="text-xs text-white/20 py-2">
                  No impact items. Click Add to start.
                </p>
              )}
            </div>
          </div>

          {/* Stack array */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-white/50">
                Tech Stack
              </label>
              <button
                onClick={addStack}
                className="text-xs text-[#d4a853] hover:text-[#d4a853]/80 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.stack.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-lg pl-3 pr-1.5 py-1.5"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateStack(i, e.target.value)}
                    className="bg-transparent text-sm text-white outline-none w-24 placeholder:text-white/20"
                    placeholder="Tech"
                  />
                  <button
                    onClick={() => removeStack(i)}
                    className="p-1 rounded text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {data.stack.length === 0 && (
                <p className="text-xs text-white/20 py-2">
                  No stack items. Click Add to start.
                </p>
              )}
            </div>
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
            {isDirty && !saving && (
              <span className="text-xs text-yellow-400/60">Unsaved changes</span>
            )}
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
          </div>
        </div>
      </motion.div>
        </div>
        <MobilePreview label="Flagship Project">
          <div className="pt-6 px-1">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3">Featured Project</p>
            <div className="bg-white/[0.04] rounded-xl p-4 border border-white/6">
              <p className="text-sm font-bold">{data.title || "Project Title"}</p>
              <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{data.problem || "Project description"}</p>
              {data.stack && data.stack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {data.stack.map((t: string) => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 bg-[#d4a853]/10 text-[#d4a853]/70 rounded">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
