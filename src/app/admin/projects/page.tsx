"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Folder,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface Project {
  _id?: string;
  title: string;
  slug: string;
  desc: string;
  imgPath: string;
  tags: string[];
  category: string;
  order: number;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
  role: string;
  duration: string;
  liveUrl: string;
  screenshots: string[];
  videoUrl: string;
}

const CATEGORIES = ["AI", "Web", "Mobile", "SaaS", "Fintech"];

const empty: Project = {
  title: "",
  slug: "",
  desc: "",
  imgPath: "",
  tags: [],
  category: "Web",
  order: 0,
  problem: "",
  solution: "",
  impact: [],
  stack: [],
  role: "",
  duration: "",
  liveUrl: "",
  screenshots: [],
  videoUrl: "",
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Project>({ ...empty });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Project | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/projects");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Project created");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setExpandedId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Project updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/sections/projects/${id}`, { method: "DELETE" });
    showFlash("Project deleted");
    fetchItems();
  }

  function renderFields(
    data: Project,
    onChange: (p: Project) => void
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Title</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Slug</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.slug}
            onChange={(e) => onChange({ ...data, slug: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">Description</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.desc}
            onChange={(e) => onChange({ ...data, desc: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Image Path</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.imgPath}
            onChange={(e) => onChange({ ...data, imgPath: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Category</label>
          <select
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.category}
            onChange={(e) => onChange({ ...data, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#1a1a1a]">
                {c}
              </option>
            ))}
          </select>
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
          <label className="text-xs text-white/40 mb-1 block">Problem</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.problem}
            onChange={(e) => onChange({ ...data, problem: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">Solution</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.solution}
            onChange={(e) => onChange({ ...data, solution: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">
            Impact (one per line)
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.impact.join("\n")}
            onChange={(e) =>
              onChange({
                ...data,
                impact: e.target.value.split("\n").filter(Boolean),
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">
            Stack (comma-separated)
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.stack.join(", ")}
            onChange={(e) =>
              onChange({
                ...data,
                stack: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
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
        <div>
          <label className="text-xs text-white/40 mb-1 block">Duration</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.duration}
            onChange={(e) => onChange({ ...data, duration: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Live URL</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.liveUrl}
            onChange={(e) => onChange({ ...data, liveUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">
            Screenshots (comma-separated paths)
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.screenshots.join(", ")}
            onChange={(e) =>
              onChange({
                ...data,
                screenshots: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Video URL</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.videoUrl}
            onChange={(e) => onChange({ ...data, videoUrl: e.target.value })}
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
          <div className="flex items-center gap-3 mb-1">
            <Folder className="w-5 h-5 text-[#d4a853]" />
            <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
          </div>
          <p className="text-white/35 text-sm mt-1 ml-8">
            Manage your portfolio projects
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
            New Project
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

      {/* Table */}
      <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Title
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Category
              </th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Order
              </th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <motion.tr
                  key={item._id}
                  layout
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td colSpan={4} className="p-0">
                    <div
                      className="flex items-center cursor-pointer hover:bg-white/[0.02] transition-colors px-5 py-3"
                      onClick={() => {
                        if (expandedId === item._id) {
                          setExpandedId(null);
                          setEditForm(null);
                        } else {
                          setExpandedId(item._id!);
                          setEditForm({ ...item });
                        }
                      }}
                    >
                      <span className="flex-1 text-white/80 font-medium">
                        {item.title}
                      </span>
                      <span className="w-24 text-white/40">{item.category}</span>
                      <span className="w-16 text-white/40 tabular-nums">
                        {item.order}
                      </span>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(item._id!);
                            setEditForm({ ...item });
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#d4a853] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id!);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expandedId === item._id ? (
                          <ChevronUp className="w-4 h-4 text-white/20" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                    </div>

                    {expandedId === item._id && editForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 space-y-4 border-t border-white/[0.04]"
                      >
                        <div className="pt-4">
                          {renderFields(editForm, setEditForm)}
                        </div>
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
                              setExpandedId(null);
                              setEditForm(null);
                            }}
                            className="px-5 py-2 rounded-xl border border-white/8 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-white/20 text-sm text-center py-12">
            No projects yet
          </p>
        )}
      </div>
        </div>
        <MobilePreview label="Projects">
          <div className="pt-4 space-y-3">
            {items.map((p) => (
              <div key={p._id || p.title} className="bg-white/[0.04] rounded-lg p-3 border border-white/6">
                <p className="text-xs font-semibold truncate">{p.title}</p>
                <p className="text-[9px] text-white/30 mt-1 line-clamp-2">{p.desc}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tags.slice(0, 3).map((t: string) => (
                      <span key={t} className="text-[8px] px-1.5 py-0.5 bg-white/[0.06] text-white/40 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No projects yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
