"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Save,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    readTime: "",
    published: false,
  });

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value),
    }));
  }

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create post");
      }
      router.push("/admin");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">New Post</h1>
            <p className="text-white/40 text-sm mt-0.5">Create a new blog post</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white border border-white/6 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Editor
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Preview
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#d4a853] text-black rounded-lg text-sm font-semibold hover:bg-[#d4a853]/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Title */}
          <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
                className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white/60 placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Brief description of the post"
                rows={2}
                className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5">
            <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
              <FileText className="w-3 h-3 inline mr-1" />
              Content (Markdown)
            </label>
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your post content in markdown..."
              rows={16}
              className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors resize-y font-mono"
            />
          </div>

          {/* Meta */}
          <div className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => updateField("coverImage", e.target.value)}
                  placeholder="/blog/cover.jpg"
                  className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => updateField("readTime", e.target.value)}
                  placeholder="5 min read"
                  className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="nextjs, react, typescript"
                className="w-full bg-white/[0.03] border border-white/6 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4a853]/40 focus:ring-1 focus:ring-[#d4a853]/20 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider font-medium">
                  Published
                </label>
                <p className="text-[11px] text-white/20 mt-0.5">
                  Make this post visible on the blog
                </p>
              </div>
              <button
                onClick={() => updateField("published", !form.published)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.published ? "bg-[#d4a853]" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    form.published ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preview panel */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.03] backdrop-blur border border-white/6 rounded-xl p-6 h-fit sticky top-6"
          >
            <h3 className="text-xs text-white/40 uppercase tracking-wider font-medium mb-4">
              Markdown Preview
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              {form.title && (
                <h1 className="text-xl font-bold text-white mb-2">{form.title}</h1>
              )}
              {form.excerpt && (
                <p className="text-white/50 text-sm italic mb-4">{form.excerpt}</p>
              )}
              <div className="whitespace-pre-wrap text-white/70 text-sm leading-relaxed">
                {form.content || "Start writing to see a preview..."}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
