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
  Globe,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface SocialLink {
  _id?: string;
  name: string;
  url: string;
  order: number;
}

const empty: SocialLink = {
  name: "",
  url: "",
  order: 0,
};

export default function SocialLinksAdmin() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<SocialLink>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SocialLink | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/social-links");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Social link created");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/social-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Social link updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this social link?")) return;
    await fetch(`/api/admin/sections/social-links/${id}`, { method: "DELETE" });
    showFlash("Social link deleted");
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
            <Globe className="w-7 h-7 text-[#d4a853]" />
            Social Links
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage your social media links
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
            New Social Link
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Name</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">URL</label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
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

      {/* Table */}
      <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Name
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                URL
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
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
                          value={editForm.url}
                          onChange={(e) =>
                            setEditForm({ ...editForm, url: e.target.value })
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
                      <td className="px-5 py-3 text-white/80 font-medium">
                        {item.name}
                      </td>
                      <td className="px-5 py-3 text-white/40 truncate max-w-xs">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#d4a853] transition-colors"
                        >
                          {item.url}
                        </a>
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
            No social links yet
          </p>
        )}
      </div>
        </div>
        <MobilePreview label="Social Links">
          <div className="pt-6 space-y-2">
            {items.map((link) => (
              <div key={link._id || link.name} className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.04] rounded-lg border border-white/6">
                <div className="w-6 h-6 rounded-full bg-[#d4a853]/10 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#d4a853]">{(link.name || "?")[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold">{link.name}</p>
                  <p className="text-[8px] text-white/25 truncate">{link.url}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No links yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
