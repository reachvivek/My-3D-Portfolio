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
  Quote,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  text: string;
  imgPath: string;
  order: number;
}

const empty: Testimonial = {
  name: "",
  role: "",
  text: "",
  imgPath: "",
  order: 0,
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Testimonial>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Testimonial | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/testimonials");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Testimonial created");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Testimonial updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/sections/testimonials/${id}`, { method: "DELETE" });
    showFlash("Testimonial deleted");
    fetchItems();
  }

  function renderFields(
    data: Testimonial,
    onChange: (t: Testimonial) => void
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Name</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Role</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.role}
            onChange={(e) => onChange({ ...data, role: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">
            Testimonial Text
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.text}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">
            Image Path
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.imgPath}
            onChange={(e) => onChange({ ...data, imgPath: e.target.value })}
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
            <Quote className="w-7 h-7 text-[#d4a853]" />
            Testimonials
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage client testimonials
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
            New Testimonial
          </h2>
          {renderFields(form, setForm)}
          <button
            onClick={handleCreate}
            disabled={saving || !form.name}
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

      {/* Card layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item._id!)}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-[#d4a853] text-black text-xs font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-white/8 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <Quote className="w-5 h-5 text-[#d4a853]/30" />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-white/20 mr-1 tabular-nums">
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
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3">
                    {item.imgPath && (
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] overflow-hidden">
                        <img
                          src={item.imgPath}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {item.name}
                      </p>
                      <p className="text-xs text-white/30">{item.role}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
      </div>

      {items.length === 0 && (
        <p className="text-white/20 text-sm text-center py-12">
          No testimonials yet
        </p>
      )}
        </div>
        <MobilePreview label="Testimonials">
          <div className="pt-4 space-y-3">
            {items.map((t) => (
              <div key={t._id || t.name} className="bg-white/[0.04] rounded-lg p-3 border border-white/6">
                <p className="text-[9px] text-white/40 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2 mt-2">
                  {t.imgPath && <img src={t.imgPath} alt={t.name} className="w-5 h-5 rounded-full object-cover" />}
                  <div>
                    <p className="text-[10px] font-semibold">{t.name}</p>
                    <p className="text-[8px] text-white/30">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No testimonials yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
