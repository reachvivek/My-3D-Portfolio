"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Calendar,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface Experience {
  _id?: string;
  title: string;
  company: string;
  date: string;
  location: string;
  highlights: string[];
  tags: string[];
  order: number;
}

const empty: Experience = {
  title: "",
  company: "",
  date: "",
  location: "",
  highlights: [],
  tags: [],
  order: 0,
};

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Experience>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Experience | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/experience");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Experience added");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Experience updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/admin/sections/experience/${id}`, { method: "DELETE" });
    showFlash("Experience deleted");
    fetchItems();
  }

  function renderFields(
    data: Experience,
    onChange: (e: Experience) => void
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Job Title</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Company</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.company}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">
            Date (e.g. 2023 - Present)
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Location</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Order</label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.order}
            onChange={(e) => onChange({ ...data, order: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">
            Tags (comma-separated)
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.tags.join(", ")}
            onChange={(e) =>
              onChange({
                ...data,
                tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">
            Highlights (one per line)
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.highlights.join("\n")}
            onChange={(e) =>
              onChange({
                ...data,
                highlights: e.target.value.split("\n").filter(Boolean),
              })
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#d4a853]" />
            Experience
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage your work experience
          </p>
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setForm({ ...empty });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? "Cancel" : "Add New"}
        </button>
      </div>

      {flash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-emerald-400 font-medium"
        >
          {flash}
        </motion.div>
      )}

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            New Experience
          </h2>
          {renderFields(form, setForm)}
          <button
            onClick={handleCreate}
            disabled={saving || !form.title}
            className="px-6 py-2.5 rounded-xl bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Create
          </button>
        </motion.div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6"
            >
              {editingId === item._id && editForm ? (
                <div className="space-y-4">
                  {renderFields(editForm, setEditForm)}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(item._id!)}
                      disabled={saving}
                      className="px-5 py-2 rounded-xl bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                      className="px-5 py-2 rounded-xl border border-white/8 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white/90">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#d4a853]/80">{item.company}</p>
                    <p className="text-xs text-white/30">
                      {item.date} / {item.location}
                    </p>
                    {item.highlights.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {item.highlights.map((h, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-white/40 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-white/20"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.06] text-white/40 border border-white/[0.04]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-white/20 mr-2 tabular-nums">
                      #{item.order}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(item._id!);
                        setEditForm({ ...item });
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#d4a853] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

        {items.length === 0 && (
          <p className="text-white/20 text-sm text-center py-12">
            No experience entries yet
          </p>
        )}
      </div>
        </div>
        <MobilePreview label="Experience">
          <div className="pt-4 space-y-3">
            {items.map((exp) => (
              <div key={exp._id || exp.title} className="border-l-2 border-[#d4a853]/30 pl-3 py-1">
                <p className="text-xs font-semibold">{exp.title}</p>
                <p className="text-[9px] text-[#d4a853]/60">{exp.company}</p>
                <p className="text-[8px] text-white/25 mt-0.5">{exp.date}</p>
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No experience yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
