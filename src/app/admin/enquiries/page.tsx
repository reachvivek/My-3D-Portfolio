"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MailOpen, Trash2, Clock, Loader2 } from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = useCallback(async () => {
    const res = await fetch("/api/enquiries");
    const data = await res.json();
    setEnquiries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const markAsRead = async (id: string) => {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setEnquiries((prev) =>
      prev.map((e) => (e._id === id ? { ...e, read: true } : e))
    );
  };

  const deleteEnquiry = async (id: string) => {
    await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
  };

  const unreadCount = enquiries.filter((e) => !e.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
          <p className="text-sm text-white/40 mt-1">
            Messages from your contact form
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d4a853]/15 text-[#d4a853] border border-[#d4a853]/25">
            {unreadCount} unread
          </span>
        )}
      </div>

      {enquiries.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {enquiries.map((enquiry) => (
              <motion.div
                key={enquiry._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className={`rounded-xl border p-5 transition-colors ${
                  enquiry.read
                    ? "bg-white/[0.02] border-white/[0.06]"
                    : "bg-white/[0.04] border-[#d4a853]/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {enquiry.read ? (
                        <MailOpen className="w-4 h-4 text-white/30 shrink-0" />
                      ) : (
                        <Mail className="w-4 h-4 text-[#d4a853] shrink-0" />
                      )}
                      <span className="font-medium text-sm truncate">
                        {enquiry.name}
                      </span>
                      {!enquiry.read && (
                        <span className="w-2 h-2 rounded-full bg-[#d4a853] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 mb-2">{enquiry.email}</p>
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                      {enquiry.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-white/25">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">
                        {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!enquiry.read && (
                      <button
                        onClick={() => markAsRead(enquiry._id)}
                        className="p-2 rounded-lg text-white/30 hover:text-[#d4a853] hover:bg-[#d4a853]/10 transition-colors"
                        title="Mark as read"
                      >
                        <MailOpen className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteEnquiry(enquiry._id)}
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
    </div>
  );
}
