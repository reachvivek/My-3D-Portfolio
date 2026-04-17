"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Trash2,
  Clock,
  Loader2,
  Eye,
  X,
  Download,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

interface OrderAsset {
  name: string;
  size: number;
  type: string;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  selectedPackage: string;
  selectedTier: string;
  vision: string;
  references: string;
  assets: OrderAsset[];
  status: string;
  createdAt: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-500/15", text: "text-blue-400", label: "New" },
  contacted: { bg: "bg-yellow-500/15", text: "text-yellow-400", label: "Contacted" },
  "in-progress": { bg: "bg-[#d4a853]/15", text: "text-[#d4a853]", label: "In Progress" },
  completed: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Completed" },
  cancelled: { bg: "bg-red-500/15", text: "text-red-400", label: "Cancelled" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusColors[status] || statusColors.new;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} border border-current/20`}>
      {s.label}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [detailData, setDetailData] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
    if (detailData?._id === id) {
      setDetailData({ ...detailData, status });
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o._id !== id));
    if (detailData?._id === id) {
      setSelected(null);
      setDetailData(null);
    }
  };

  const viewDetail = async (order: Order) => {
    setSelected(order);
    // Fetch full detail including assets
    const res = await fetch(`/api/orders/${order._id}`);
    const data = await res.json();
    setDetailData(data);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  const newCount = orders.filter((o) => o.status === "new").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-white/40 mt-1">
            Submissions from the pricing configurator
          </p>
        </div>
        {newCount > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
            {newCount} new
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No orders yet</p>
          <p className="text-xs text-white/20 mt-1">Orders will appear here when visitors submit from the pricing page</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className={`rounded-xl border p-5 transition-colors ${
                  order.status === "new"
                    ? "bg-white/[0.04] border-blue-500/20"
                    : "bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="font-medium text-sm">{order.name}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-white/40">{order.email}{order.phone ? ` · ${order.phone}` : ""}</p>
                    {order.company && (
                      <p className="text-xs text-white/30 mt-0.5">{order.company}</p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#d4a853]/60" />
                        <span className="text-xs text-[#d4a853]/80 font-medium">
                          {order.selectedPackage} — {order.selectedTier}
                        </span>
                      </div>
                      {order.assets?.length > 0 && (
                        <span className="text-[10px] text-white/25">
                          {order.assets.length} file{order.assets.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {order.vision && (
                      <p className="text-xs text-white/40 mt-2 line-clamp-1">{order.vision}</p>
                    )}

                    <div className="flex items-center gap-1.5 mt-2.5 text-white/20">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => viewDetail(order)}
                      className="p-2 rounded-lg text-white/30 hover:text-[#d4a853] hover:bg-[#d4a853]/10 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {order.status === "new" && (
                      <button
                        onClick={() => updateStatus(order._id, "contacted")}
                        className="p-2 rounded-lg text-white/30 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                        title="Mark as contacted"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setSelected(null); setDetailData(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] p-6"
              style={{ background: "#141414" }}
              onClick={(e) => e.stopPropagation()}
            >
              {!detailData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-[#d4a853]" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold">{detailData.name}</h2>
                      <p className="text-xs text-white/40 mt-0.5">{detailData.email}{detailData.phone ? ` · ${detailData.phone}` : ""}</p>
                      {detailData.company && <p className="text-xs text-white/30">{detailData.company}</p>}
                    </div>
                    <button onClick={() => { setSelected(null); setDetailData(null); }} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Package */}
                  <div className="rounded-xl p-4 mb-4 border border-[#d4a853]/15" style={{ background: "rgba(212,168,83,0.04)" }}>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Selected Package</p>
                    <p className="text-sm font-semibold text-[#d4a853]">{detailData.selectedPackage} — {detailData.selectedTier}</p>
                  </div>

                  {/* Status selector */}
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(statusColors).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => updateStatus(detailData._id, key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                            detailData.status === key
                              ? `${val.bg} ${val.text} border-current/30`
                              : "text-white/30 border-white/[0.06] hover:border-white/15"
                          }`}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vision */}
                  {detailData.vision && (
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Project Vision</p>
                      <p className="text-sm text-white/60 leading-relaxed">{detailData.vision}</p>
                    </div>
                  )}

                  {/* References */}
                  {detailData.references && (
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">Reference Sites</p>
                      <p className="text-sm text-white/50">{detailData.references}</p>
                    </div>
                  )}

                  {/* Assets */}
                  {detailData.assets && detailData.assets.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">Uploaded Assets</p>
                      <div className="space-y-1.5">
                        {detailData.assets.map((a, i) => (
                          <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                            <Download className="w-3.5 h-3.5 text-[#d4a853]/50" />
                            <span className="text-xs text-white/60 truncate flex-1">{a.name}</span>
                            <span className="text-[10px] text-white/25">{formatSize(a.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-white/20 pt-2 border-t border-white/[0.05]">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px]">Submitted {formatDate(detailData.createdAt)}</span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
