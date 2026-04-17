import Link from "next/link";
import { getBlogPosts } from "@/lib/queries";
import type { BlogPostData } from "@/lib/types";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Eye, Heart } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Vivek Kumar Singh",
  description:
    "Tech insights, engineering deep-dives, and lessons learned from building production systems across AI, fintech, and full-stack development. By Vivek Kumar Singh, developer in Dubai, UAE.",
  openGraph: {
    title: "Blog | Vivek Kumar Singh",
    description:
      "Tech insights, engineering deep-dives, and lessons learned from building production systems.",
    url: "https://reachvivek.vercel.app/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://reachvivek.vercel.app/blog",
  },
};

export default async function BlogPage() {
  const posts: BlogPostData[] = await getBlogPosts();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-sm font-medium text-white/60">
            vivek<span className="text-gold">.</span>blog
          </span>
        </div>
      </div>

      {/* Header */}
      <section className="pt-24 pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Blog<span className="text-gold">.</span>
          </h1>
          <p className="mt-4 text-base text-white/45 max-w-xl leading-relaxed">
            Engineering deep-dives, lessons from the trenches, and thoughts on
            building systems that matter.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-white/30 text-center py-20">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group py-8 first:pt-4 block"
                >
                  {/* Author + Date */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black text-[10px] font-bold">
                      V
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/35">
                      <span className="text-white/50 font-medium">
                        Vivek Kumar Singh
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold leading-snug group-hover:text-gold transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-2 text-sm text-white/35 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/35"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/25">
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
