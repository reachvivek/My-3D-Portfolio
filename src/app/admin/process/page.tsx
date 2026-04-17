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
  Layers,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface ProcessStep {
  _id?: string;
  step: string;
  title: string;
  desc: string;
  order: number;
}

const empty: ProcessStep = {
  step: "",
  title: "",
  desc: "",
  order: 0,
};

export default function ProcessAdmin() {
  const [items, setItems] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ProcessStep>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProcessStep | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/process");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Process step created");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/process/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Process step updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this process step?")) return;
    await fetch(`/api/admin/sections/process/${id}`, { method: "DELETE" });
    showFlash("Process step deleted");
    fetchItems();
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
            <Layers className="w-7 h-7 text-[#d4a853]" />
            Process
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage your workflow steps
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
            New Step
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">
                Step (e.g. 01)
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                value={form.step}
                onChange={(e) => setForm({ ...form, step: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Title</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Order</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
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

      {/* Table */}
      <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium w-20">
                Step
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Title
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">
                Description
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium w-20">
                Order
              </th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  {editingId === item._id && editForm ? (
                    <>
                      <td className="px-5 py-3">
                        <input
                          className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                          value={editForm.step}
                          onChange={(e) =>
                            setEditForm({ ...editForm, step: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <input
                          className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                          value={editForm.desc}
                          onChange={(e) =>
                            setEditForm({ ...editForm, desc: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                          value={editForm.order}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              order: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdate(item._id!)}
                            disabled={saving}
                            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-emerald-400 transition-colors"
                          >
                            {saving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 text-[#d4a853] font-mono font-semibold">
                        {item.step}
                      </td>
                      <td className="px-5 py-3 text-white/80 font-medium">
                        {item.title}
                      </td>
                      <td className="px-5 py-3 text-white/40 hidden md:table-cell">
                        {item.desc}
                      </td>
                      <td className="px-5 py-3 text-white/40 tabular-nums">
                        {item.order}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
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
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-white/20 text-sm text-center py-12">
            No process steps yet
          </p>
        )}
      </div>
        </div>
        <MobilePreview label="Process">
          <div className="pt-4 space-y-3">
            {items.map((step, i) => (
              <div key={step._id || i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#d4a853]/15 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#d4a853]">{step.step || i + 1}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">{step.title}</p>
                  <p className="text-[9px] text-white/30 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No steps yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
