import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/queries";
import type { BlogPostData } from "@/lib/types";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock, Eye, Heart, Map, Brain, Radio, Newspaper, Shield, Database, Server, Cpu, Globe, Monitor } from "lucide-react";
import BlogInteractions from "./BlogInteractions";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: BlogPostData | null = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Blog | Vivek Kumar Singh`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Vivek Kumar Singh"],
      tags: post.tags,
      url: `https://reachvivek.vercel.app/blog/${slug}`,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `https://reachvivek.vercel.app/blog/${slug}`,
    },
  };
}

/* ── Visual Components for blog posts ── */
function DashboardFeatureCards() {
  const features = [
    { icon: Map, title: "Live Airspace Map", desc: "Real-time flight positions, NOTAMs, and weather zones over UAE airspace", color: "from-blue-500/20 to-blue-600/10" },
    { icon: Radio, title: "Threat Timeline", desc: "Verified geopolitical events from GDELT, chronologically plotted", color: "from-red-500/20 to-red-600/10" },
    { icon: Brain, title: "AI Advisory Chat", desc: "Ask natural language questions, get answers from live data sources", color: "from-purple-500/20 to-purple-600/10" },
    { icon: Shield, title: "Evacuation Routes", desc: "Multi-modal route planning and emergency shelter proximity mapping", color: "from-emerald-500/20 to-emerald-600/10" },
    { icon: Newspaper, title: "News + AI Summaries", desc: "Aggregated from WAM, Al Jazeera, and GNews with AI-distilled summaries", color: "from-amber-500/20 to-amber-600/10" },
  ];
  return (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((f) => (
        <div key={f.title} className={`rounded-xl bg-gradient-to-br ${f.color} border border-white/8 p-5 flex gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
            <f.icon className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">{f.title}</p>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechStackVisual() {
  const layers = [
    { label: "Frontend", items: ["Next.js 16.2", "React 19", "TypeScript", "Tailwind 4", "shadcn/ui"], icon: Monitor, color: "border-blue-500/30 bg-blue-500/5" },
    { label: "Maps", items: ["Leaflet", "MapLibre GL", "deck.gl (WebGL)"], icon: Globe, color: "border-emerald-500/30 bg-emerald-500/5" },
    { label: "Database", items: ["Turso (libSQL)", "8 tables", "Edge-distributed"], icon: Database, color: "border-purple-500/30 bg-purple-500/5" },
    { label: "Backend Worker", items: ["Express.js", "Railway", "6 scheduled collectors"], icon: Server, color: "border-amber-500/30 bg-amber-500/5" },
    { label: "AI", items: ["Groq (Llama 3.3 70B)", "GPT-4o mini", "SSE real-time"], icon: Cpu, color: "border-pink-500/30 bg-pink-500/5" },
  ];
  return (
    <div className="my-10 space-y-2">
      {layers.map((layer) => (
        <div key={layer.label} className={`rounded-xl border ${layer.color} p-4 flex items-center gap-4`}>
          <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
            <layer.icon className="w-4 h-4 text-white/50" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{layer.label}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {layer.items.map((item) => (
                <span key={item} className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] text-white/50">{item}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapPreviewVisual() {
  return (
    <div className="my-10 rounded-xl border border-white/8 overflow-hidden bg-[#0d1117]">
      {/* Simulated map header */}
      <div className="px-4 py-2.5 border-b border-white/8 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-blue-400/70" />
          <span className="text-xs font-medium text-white/50">UAE Airspace Monitor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400/70">LIVE</span>
        </div>
      </div>
      {/* Simulated map area */}
      <div className="relative h-[280px] bg-gradient-to-br from-[#0d1117] to-[#161b22]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Simulated flight dots */}
        <div className="absolute top-[30%] left-[25%] w-2.5 h-2.5 rounded-full bg-blue-400/80 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          <span className="absolute -top-5 -left-3 text-[8px] text-blue-400/60 font-mono whitespace-nowrap">EK231</span>
        </div>
        <div className="absolute top-[45%] left-[55%] w-2.5 h-2.5 rounded-full bg-blue-400/80 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          <span className="absolute -top-5 -left-3 text-[8px] text-blue-400/60 font-mono whitespace-nowrap">EY405</span>
        </div>
        <div className="absolute top-[60%] left-[40%] w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]">
          <span className="absolute -top-5 -left-3 text-[8px] text-emerald-400/60 font-mono whitespace-nowrap">FZ127</span>
        </div>
        <div className="absolute top-[35%] left-[70%] w-2 h-2 rounded-full bg-amber-400/60" />
        <div className="absolute top-[55%] left-[30%] w-2 h-2 rounded-full bg-amber-400/60" />
        {/* UAE label */}
        <div className="absolute top-[48%] left-[42%] text-[10px] font-mono text-white/15 uppercase tracking-widest">UAE</div>
        {/* Airport markers */}
        <div className="absolute bottom-[25%] left-[35%] flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-[6px] text-white/40">A</span>
          <span className="text-[8px] text-white/25 font-mono">AUH</span>
        </div>
        <div className="absolute bottom-[35%] left-[60%] flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center text-[6px] text-white/40">D</span>
          <span className="text-[8px] text-white/25 font-mono">DXB</span>
        </div>
        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur rounded-lg px-3 py-2 space-y-1">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[9px] text-white/40">Active flights</span></div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] text-white/40">NOTAM zones</span></div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] text-white/40">On approach</span></div>
        </div>
      </div>
    </div>
  );
}

function DataCollectorVisual() {
  const collectors = [
    { name: "Weather", interval: "10 min", status: "active" },
    { name: "Flight Positions", interval: "5 min", status: "active" },
    { name: "News Feeds", interval: "5 min", status: "active" },
    { name: "GDELT Events", interval: "15 min", status: "active" },
    { name: "Earthquakes", interval: "15 min", status: "active" },
    { name: "Shelter Locations", interval: "Daily", status: "idle" },
  ];
  return (
    <div className="my-10 rounded-xl border border-white/8 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/8 bg-white/[0.02] flex items-center gap-2">
        <Server className="w-4 h-4 text-amber-400/70" />
        <span className="text-xs font-medium text-white/50">Backend Worker: Scheduled Collectors</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {collectors.map((c) => (
          <div key={c.name} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-400" : "bg-white/20"}`} />
              <span className="text-sm text-white/60">{c.name}</span>
            </div>
            <span className="text-xs text-white/30 font-mono">{c.interval}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonsVisual() {
  const lessons = [
    { num: "01", title: "Verified data beats fast data", desc: "Every data source is official or peer-reviewed. FlightAware, USGS, FAA, WAM. If it can't be verified, it doesn't go on the dashboard." },
    { num: "02", title: "Edge databases are underrated", desc: "Turso's global distribution means the dashboard loads fast from anywhere in the Gulf. SQLite performance for reads is incredible." },
    { num: "03", title: "You don't need a team", desc: "One developer, one week. 18 components, 16 API routes, 14 custom hooks, and a full admin panel. Modern tooling makes this possible." },
    { num: "04", title: "Multiple map libraries can coexist", desc: "Leaflet for base tiles, MapLibre for vectors, deck.gl for heavy real-time data. They compose well when layered properly." },
  ];
  return (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {lessons.map((l) => (
        <div key={l.num} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <span className="text-[#d4a853] font-mono text-xs font-bold">{l.num}</span>
          <p className="text-sm font-semibold text-white/90 mt-2">{l.title}</p>
          <p className="text-xs text-white/40 mt-2 leading-relaxed">{l.desc}</p>
        </div>
      ))}
    </div>
  );
}

const VISUAL_COMPONENTS: Record<string, () => React.ReactNode> = {
  "dashboard-features": () => <DashboardFeatureCards />,
  "tech-stack": () => <TechStackVisual />,
  "map-preview": () => <MapPreviewVisual />,
  "data-collectors": () => <DataCollectorVisual />,
  "lessons": () => <LessonsVisual />,
};

/* ── Markdown renderer ── */
function renderMarkdown(content: string) {
  const blocks = content.split("\n\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Visual component marker
    const componentMatch = trimmed.match(/^<!-- component:(\S+) -->$/);
    if (componentMatch && VISUAL_COMPONENTS[componentMatch[1]]) {
      elements.push(<div key={i++}>{VISUAL_COMPONENTS[componentMatch[1]]()}</div>);
      continue;
    }

    // Code block
    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const code = lines
        .slice(1, lines[lines.length - 1] === "```" ? -1 : undefined)
        .join("\n");
      elements.push(
        <pre
          key={i++}
          className="my-8 rounded-xl bg-[#111] border border-white/8 p-6 overflow-x-auto"
        >
          {lang && (
            <span className="block text-[11px] uppercase tracking-wider text-gold/60 mb-4 font-mono">
              {lang}
            </span>
          )}
          <code className="text-sm text-white/80 font-mono leading-relaxed">
            {code}
          </code>
        </pre>
      );
      continue;
    }

    // H2
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={i++}
          className="text-2xl sm:text-3xl font-bold mt-14 mb-5 text-white tracking-tight"
        >
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={i++}
          className="text-xl sm:text-2xl font-semibold mt-10 mb-4 text-white/90"
        >
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
      elements.push(
        <ol
          key={i++}
          className="my-6 space-y-3 text-white/65 leading-[1.8] text-lg"
        >
          {items.map((item, j) => (
            <li key={j} className="flex gap-3">
              <span className="text-gold font-semibold shrink-0">
                {j + 1}.
              </span>
              <span>{renderInline(item.replace(/^\d+\.\s/, ""))}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
      elements.push(
        <ul key={i++} className="my-6 space-y-3 text-white/65 leading-[1.8] text-lg">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3">
              <span className="text-gold mt-2.5 shrink-0">
                <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
              </span>
              <span>{renderInline(item.trim().slice(2))}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Blockquote-style (lines starting with >)
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={i++}
          className="my-8 pl-6 border-l-2 border-gold/40 text-white/50 text-lg italic leading-relaxed"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // CTA link
    if (/^\[.+\]\(.+\)$/.test(trimmed)) {
      const match = trimmed.match(/^\[(.+)\]\((.+)\)$/);
      if (match) {
        elements.push(
          <p key={i++} className="my-8">
            <a
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold text-black font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]"
            >
              {match[1]} <ArrowRight className="w-4 h-4" />
            </a>
          </p>
        );
        continue;
      }
    }

    // Paragraph
    elements.push(
      <p key={i++} className="my-5 text-white/65 text-lg leading-[1.85]">
        {renderInline(trimmed)}
      </p>
    );
  }

  return elements;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={key++} className="text-white font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-white/8 text-gold/80 text-[0.9em] font-mono"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      parts.push(
        <a
          key={key++}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-4 decoration-gold/30 hover:decoration-gold transition-colors"
        >
          {match[6]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post: BlogPostData | null = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage
      ? `https://reachvivek.vercel.app${post.coverImage}`
      : undefined,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      "@id": "https://reachvivek.vercel.app/#person",
      name: "Vivek Kumar Singh",
      url: "https://reachvivek.vercel.app",
    },
    publisher: {
      "@type": "Person",
      name: "Vivek Kumar Singh",
      url: "https://reachvivek.vercel.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://reachvivek.vercel.app/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://reachvivek.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://reachvivek.vercel.app/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://reachvivek.vercel.app/blog/${slug}` },
    ],
  };

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]),
        }}
      />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Blog
            </Link>

            <div className="flex items-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {(post.views ?? 0).toLocaleString()} views
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                {post.claps ?? 0} claps
              </span>
            </div>
          </div>
        </div>

        <article className="pt-24 pb-20 px-6">
          <div className="max-w-[680px] mx-auto">
            {/* ── Author Block ── */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black text-lg font-bold">
                V
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    Vivek Kumar Singh
                  </span>
                  <a
                    href="https://linkedin.com/in/reachvivek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-0.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                  >
                    Follow
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/35 mt-0.5">
                  <span>{publishedDate}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Title ── */}
            <h1 className="text-3xl sm:text-[2.75rem] font-bold tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>

            {/* ── Subtitle/Excerpt ── */}
            <p className="text-lg sm:text-xl text-white/45 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* ── Action Bar ── */}
            <BlogInteractions
              slug={slug}
              initialClaps={post.claps ?? 0}
              views={post.views ?? 0}
            />

            {/* ── Cover Image ── */}
            {post.coverImage && (
              <div className="mt-8 rounded-xl overflow-hidden border border-white/8">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* ── Content ── */}
            <div className="mt-10">{renderMarkdown(post.content)}</div>

            {/* ── Tags ── */}
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-4 py-2 rounded-full bg-white/5 text-white/50 hover:bg-white/8 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Bottom Action Bar ── */}
            <BlogInteractions
              slug={slug}
              initialClaps={post.claps ?? 0}
              views={post.views ?? 0}
            />

            {/* ── Divider ── */}
            <hr className="my-12 border-white/8" />

            {/* ── Author Card ── */}
            <div className="flex items-start gap-5 p-6 rounded-2xl glass">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black text-2xl font-bold shrink-0">
                V
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-base font-semibold">
                    Written by Vivek Kumar Singh
                  </span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed mb-3">
                  Full-stack developer & AI engineer in Abu Dhabi, UAE. Building
                  AI voice agents for automotive giants and fintech platforms for
                  stock exchanges. 20+ production systems shipped.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com/in/reachvivek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-4 py-1.5 rounded-full bg-gold text-black font-semibold hover:bg-gold-light transition-colors"
                  >
                    Follow on LinkedIn
                  </a>
                  <a
                    href="https://github.com/reachvivek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="mt-12 rounded-2xl glass border border-gold/10 p-8 sm:p-10 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Let&apos;s build something{" "}
                <span className="gradient-text">together</span>
              </h3>
              <p className="text-white/40 text-sm sm:text-base mb-6 max-w-md mx-auto">
                Interested in working together or have a project in mind?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://calendly.com/rogerthatvivek/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gold text-black font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]"
                >
                  Book a Call <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-sm font-medium hover:border-gold/30 hover:text-gold transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
