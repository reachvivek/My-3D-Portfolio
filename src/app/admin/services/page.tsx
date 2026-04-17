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
  Brain,
  Globe,
  Smartphone,
  Cloud,
  TrendingUp,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface Service {
  _id?: string;
  icon: string;
  title: string;
  desc: string;
  order: number;
}

const ICON_OPTIONS = ["ai", "web", "mobile", "cloud", "fintech", "dashboard"];

const iconMap: Record<string, React.ElementType> = {
  ai: Brain,
  web: Globe,
  mobile: Smartphone,
  cloud: Cloud,
  fintech: TrendingUp,
  dashboard: LayoutDashboard,
};

const empty: Service = {
  icon: "web",
  title: "",
  desc: "",
  order: 0,
};

export default function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Service>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Service | null>(null);

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2000);
  }

  async function fetchItems() {
    const res = await fetch("/api/admin/sections/services");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleCreate() {
    setSaving(true);
    await fetch("/api/admin/sections/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...empty });
    setShowAdd(false);
    setSaving(false);
    showFlash("Service created");
    fetchItems();
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/admin/sections/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm(null);
    setSaving(false);
    showFlash("Service updated");
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/sections/services/${id}`, { method: "DELETE" });
    showFlash("Service deleted");
    fetchItems();
  }

  function renderFields(data: Service, onChange: (s: Service) => void) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Icon</label>
          <select
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.icon}
            onChange={(e) => onChange({ ...data, icon: e.target.value })}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1a1a1a]">
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1 block">Title</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/40 mb-1 block">
            Description
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white outline-none focus:border-[#d4a853]/50 resize-none"
            value={data.desc}
            onChange={(e) => onChange({ ...data, desc: e.target.value })}
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

  function getIcon(key: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon: any = iconMap[key] || Globe;
    return <Icon className="w-5 h-5 text-[#d4a853]" />;
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
            <Settings className="w-7 h-7 text-[#d4a853]" />
            Services
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage the services you offer
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
            New Service
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

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5"
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
                    <div className="w-10 h-10 rounded-lg bg-[#d4a853]/10 border border-[#d4a853]/20 flex items-center justify-center">
                      {getIcon(item.icon)}
                    </div>
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
                  <h3 className="text-sm font-semibold text-white/90">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </>
              )}
            </motion.div>
          ))}
      </div>

      {items.length === 0 && (
        <p className="text-white/20 text-sm text-center py-12">
          No services yet
        </p>
      )}
        </div>
        <MobilePreview label="Services">
          <div className="pt-4 space-y-3">
            {items.map((svc) => (
              <div key={svc._id || svc.title} className="bg-white/[0.04] rounded-lg p-3 border border-white/6">
                <p className="text-xs font-semibold">{svc.title}</p>
                <p className="text-[9px] text-white/30 mt-1">{svc.desc}</p>
              </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-white/20 text-center py-8">No services yet</p>}
          </div>
        </MobilePreview>
      </div>
    </div>
  );
}
