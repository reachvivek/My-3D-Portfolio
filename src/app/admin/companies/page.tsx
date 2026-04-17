"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  Save,
  CheckCircle,
  Users,
  Plus,
  Trash2,
  Pencil,
  X,
  Star,
} from "lucide-react";
import MobilePreview from "../components/MobilePreview";

interface CompanyItem {
  _id?: string;
  name: string;
  logo: string;
  highlight: boolean;
  order: number;
}

const emptyCompany: CompanyItem = {
  name: "",
  logo: "",
  highlight: false,
  order: 0,
};

export default function CompaniesAdminPage() {
  const [items, setItems] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CompanyItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/admin/sections/companies");
    const data = await res.json();
    setItems(
      Array.isArray(data)
        ? data.sort((a: CompanyItem, b: CompanyItem) => a.order - b.order)
        : []
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setEditing({ ...emptyCompany, order: items.length });
    setIsNew(true);
  };

  const openEdit = (item: CompanyItem) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setSaved(false);

    if (isNew) {
      await fetch("/api/admin/sections/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch(`/api/admin/sections/companies/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    closeForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/sections/companies/${id}`, { method: "DELETE" });
    fetchItems();
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
              <Users className="w-5 h-5 text-[#d4a853]" />
              <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
            </div>
            <p className="text-sm text-white/40 mt-1 ml-8">
              Manage company logos displayed on your portfolio
            </p>
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/8 text-sm font-medium hover:bg-white/[0.1] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        </div>

        {/* Edit/Add Form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white/[0.03] backdrop-blur border border-[#d4a853]/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#d4a853]">
                    {isNew ? "Add New Company" : "Edit Company"}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2">
                      Logo Path
                    </label>
                    <input
                      type="text"
                      value={editing.logo}
                      onChange={(e) =>
                        setEditing({ ...editing, logo: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                      placeholder="/logos/company.svg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={editing.order}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/8 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#d4a853]/50 transition-colors"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          highlight: !editing.highlight,
                        })
                      }
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        editing.highlight
                          ? "bg-[#d4a853]/10 border-[#d4a853]/30 text-[#d4a853]"
                          : "bg-white/[0.04] border-white/8 text-white/40"
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${editing.highlight ? "fill-[#d4a853]" : ""}`}
                      />
                      Highlighted
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving || !editing.name}
                    className="px-5 py-2.5 rounded-lg bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isNew ? "Add" : "Update"}
                  </button>
                  <button
                    onClick={closeForm}
                    className="px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    Cancel
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        {items.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No companies yet</p>
            <button
              onClick={openAdd}
              className="mt-4 text-xs text-[#d4a853] hover:underline"
            >
              Add your first company
            </button>
          </div>
        ) : (
          <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-medium px-5 py-3">
                    Name
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-medium px-5 py-3">
                    Logo
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-medium px-5 py-3">
                    Highlight
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-widest text-white/30 font-medium px-5 py-3">
                    Order
                  </th>
                  <th className="text-right text-[10px] uppercase tracking-widest text-white/30 font-medium px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-white/80">
                      {item.name}
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-xs font-mono truncate max-w-[180px]">
                      {item.logo}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.highlight ? (
                        <Star className="w-4 h-4 text-[#d4a853] fill-[#d4a853]" />
                      ) : (
                        <Star className="w-4 h-4 text-white/15" />
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-white/40">{item.order}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg text-white/30 hover:text-[#d4a853] hover:bg-[#d4a853]/10 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => item._id && handleDelete(item._id)}
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      </div>
      <MobilePreview label="Companies">
        <div className="pt-6">
          <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mb-4">Trusted by</p>
          <div className="space-y-2">
            {items.map((c) => (
              <div key={c._id || c.name} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg">
                {c.logo && <img src={c.logo} alt={c.name} className="w-5 h-5 object-contain opacity-60" />}
                <span className="text-[10px] text-white/40">{c.name}</span>
                {c.highlight && <span className="text-[8px] text-[#d4a853]/60 ml-auto">★</span>}
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-[10px] text-white/20 text-center py-8">No companies yet</p>
            )}
          </div>
        </div>
      </MobilePreview>
      </div>
    </div>
  );
}
