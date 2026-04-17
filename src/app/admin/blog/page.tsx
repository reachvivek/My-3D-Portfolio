"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  Heart,
  ExternalLink,
} from "lucide-react";

interface PostItem {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  views: number;
  claps: number;
  tags: string[];
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(slug);
    await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Blog Posts</h1>
          <p className="text-white/35 text-sm mt-1">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total,{" "}
            {published} published, {drafts} drafts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a853] text-black rounded-lg text-sm font-semibold hover:bg-[#d4a853]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Posts table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Views
                  </span>
                </th>
                <th className="text-right p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Claps
                  </span>
                </th>
                <th className="text-left p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right p-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/25">
                    No posts yet. Write your first one.
                  </td>
                </tr>
              )}
              {posts.map((post, i) => (
                <motion.tr
                  key={post._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 max-w-xs">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="text-white hover:text-[#d4a853] transition-colors font-medium line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 bg-white/[0.05] rounded text-white/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white/50 tabular-nums">
                    {(post.views || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-white/50 tabular-nums">
                    {(post.claps || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-white/35 text-xs whitespace-nowrap">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )
                      : "Not published"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {post.published && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
                          title="View live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="p-2 rounded-lg text-white/30 hover:text-[#d4a853] hover:bg-white/[0.05] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        disabled={deleting === post.slug}
                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === post.slug ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
