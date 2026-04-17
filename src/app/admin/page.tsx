"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  FileText,
  Eye,
  Heart,
  Mail,
  MailOpen,
  TrendingUp,
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalClaps: number;
  totalEnquiries: number;
  unreadEnquiries: number;
  viewsPerPost: { title: string; slug: string; views: number }[];
  topPosts: { title: string; slug: string; views: number }[];
  viewsOverTime: { month: string; views: number }[];
}

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/enquiries").then((r) => r.json()),
    ]).then(([statsData, enquiriesData]) => {
      setStats(statsData);
      setEnquiries(enquiriesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  const maxViews = Math.max(
    ...(stats?.viewsPerPost.map((p) => p.views) || [1]),
    1
  );

  const recentEnquiries = enquiries.slice(0, 5);
  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-white/35 text-sm mt-1">
          Overview of your portfolio analytics
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Posts",
            value: stats?.totalPosts || 0,
            icon: FileText,
            sub: `${stats?.publishedPosts || 0} published`,
            color: "text-[#d4a853]",
          },
          {
            label: "Total Views",
            value: stats?.totalViews || 0,
            icon: Eye,
            sub: "All time",
            color: "text-blue-400",
          },
          {
            label: "Total Claps",
            value: stats?.totalClaps || 0,
            icon: Heart,
            sub: "All time",
            color: "text-pink-400",
          },
          {
            label: "Enquiries",
            value: stats?.totalEnquiries || 0,
            icon: Mail,
            sub: unread > 0 ? `${unread} unread` : "All read",
            color: "text-emerald-400",
          },
          {
            label: "Engagement",
            value:
              stats && stats.totalViews > 0
                ? `${((stats.totalClaps / stats.totalViews) * 100).toFixed(1)}%`
                : "0%",
            icon: TrendingUp,
            sub: "Claps / views ratio",
            color: "text-purple-400",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-white/35 uppercase tracking-widest font-medium">
                {card.label}
              </span>
              <card.icon className={`w-4 h-4 ${card.color} opacity-60`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold">
              {typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value}
            </p>
            <p className="text-xs text-white/25 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Views per Post
            </h2>
            <Link
              href="/admin/blog"
              className="text-xs text-[#d4a853]/60 hover:text-[#d4a853] transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {stats && stats.viewsPerPost.length > 0 ? (
            <div className="flex items-end gap-3 h-44">
              {stats.viewsPerPost.map((post, i) => {
                const heightPercent =
                  maxViews > 0 ? (post.views / maxViews) * 100 : 0;
                return (
                  <div
                    key={post.slug}
                    className="flex flex-col items-center gap-2 min-w-[50px] flex-1"
                  >
                    <span className="text-xs text-white/40 font-medium tabular-nums">
                      {post.views.toLocaleString()}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${Math.max(heightPercent, 3)}%`,
                      }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-[#d4a853]/20 to-[#d4a853]/50 rounded-t-md min-h-[4px]"
                    />
                    <span
                      className="text-[9px] text-white/25 text-center truncate w-full"
                      title={post.title}
                    >
                      {post.title.length > 10
                        ? post.title.slice(0, 10) + "..."
                        : post.title}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/20 text-sm text-center py-12">
              No data yet
            </p>
          )}
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
              Recent Enquiries
              {unread > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {unread} new
                </span>
              )}
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs text-[#d4a853]/60 hover:text-[#d4a853] transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-12">
              No enquiries yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div className="mt-0.5">
                    {enq.read ? (
                      <MailOpen className="w-4 h-4 text-white/20" />
                    ) : (
                      <Mail className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white/70 truncate">
                        {enq.name}
                      </span>
                      <span className="text-[10px] text-white/20">
                        {new Date(enq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-white/30 truncate mt-0.5">
                      {enq.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/blog"
          className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5 hover:border-[#d4a853]/20 hover:bg-white/[0.05] transition-all group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-[#d4a853]/10 border border-[#d4a853]/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#d4a853]" />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:text-[#d4a853] transition-colors">
              Manage Blog Posts
            </p>
            <p className="text-xs text-white/30">
              {stats?.totalPosts || 0} posts, {stats?.publishedPosts || 0}{" "}
              published
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-[#d4a853] transition-colors" />
        </Link>

        <Link
          href="/admin/enquiries"
          className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5 hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:text-emerald-400 transition-colors">
              View Enquiries
            </p>
            <p className="text-xs text-white/30">
              {stats?.totalEnquiries || 0} total
              {unread > 0 ? `, ${unread} unread` : ""}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
