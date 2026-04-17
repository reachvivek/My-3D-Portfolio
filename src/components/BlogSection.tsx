"use client";

import { motion } from "motion/react";
import { ArrowRight, Heart, Eye, Clock } from "lucide-react";
import type { BlogPostData } from "@/lib/types";

interface BlogSectionProps {
  readonly posts: BlogPostData[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            From the <span className="gradient-text">Blog</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base max-w-xl mx-auto">
            Engineering deep-dives, war stories, and lessons from building
            production systems.
          </p>
        </motion.div>

        {/* Medium-style Post Cards */}
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {posts.slice(0, 3).map((post, i) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group block glass glass-hover rounded-2xl p-6 sm:p-8 transition-all hover:border-gold/15"
            >
              {/* Author + Date row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black text-xs font-bold">
                  V
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="text-white/60 font-medium">Vivek Kumar Singh</span>
                  <span>·</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold leading-snug group-hover:text-gold transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-3 text-sm sm:text-base text-white/40 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              {/* Footer: Tags + Stats */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  {(post.claps ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.claps}
                    </span>
                  )}
                  {(post.views ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(post.views ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition-colors"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
