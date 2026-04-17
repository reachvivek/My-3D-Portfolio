"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Minimal utility icons (only functional, not decorative)            */
/* ------------------------------------------------------------------ */

const Ico = {
  back: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>,
  check: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>,
  file: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  x: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  send: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>,
  sparkle: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
  chev: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>,
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Pkg = { name: string; persona: string; price: string; note?: string; recommended?: boolean; includes: string[] };
type Col = { id: string; label: string; short: string; packages: Pkg[]; footer?: string };

const collections: Col[] = [
  { id: "websites", label: "Websites", short: "Sites", packages: [
    { name: "Starter", persona: "For founders & MVPs", price: "3,500", note: "up to 4 pages", includes: ["Responsive design", "Scroll animations", "Contact form", "SEO setup", "Mobile-first", "1 revision"] },
    { name: "Professional", persona: "For growing brands", price: "7,500", note: "up to 6 pages", recommended: true, includes: ["Includes Starter +", "GSAP cinematics", "Page transitions", "Blog section", "Analytics", "2 revisions"] },
    { name: "Flagship", persona: "For high-end experiences", price: "14,000", note: "up to 10 pages", includes: ["Includes Pro +", "3D hero scene", "Parallax effects", "Multi-language", "Self-edit CMS", "3 revisions"] },
  ], footer: "Beyond 10 pages: bespoke quote." },
  { id: "website-cms", label: "Website + Admin", short: "Site+CMS", packages: [
    { name: "Starter + Admin", persona: "For solo operators", price: "8,000", note: "up to 4 pages", includes: ["Full Starter site", "Content editor", "Enquiry inbox", "Basic analytics", "Secure login", "1 revision"] },
    { name: "Pro + Admin", persona: "For teams", price: "15,000", note: "up to 6 pages", recommended: true, includes: ["Full Pro site", "Full CMS", "Enquiry system", "Charts & reports", "Media uploads", "2 revisions"] },
    { name: "Flagship + Admin", persona: "For enterprises", price: "22,000", note: "up to 10 pages", includes: ["Full Flagship site", "CMS + team roles", "Blog manager", "Analytics suite", "Email alerts", "3 revisions"] },
  ], footer: "Includes database, APIs, and deployment." },
  { id: "ecommerce", label: "E-Commerce", short: "Shop", packages: [
    { name: "Starter Store", persona: "For first-time sellers", price: "10,000", note: "50 products", includes: ["Product catalog", "Cart & checkout", "Stripe / Tabby", "Order emails", "Mobile-ready", "1 revision"] },
    { name: "Growth Store", persona: "For scaling businesses", price: "18,000", note: "200 products", recommended: true, includes: ["Includes Starter +", "Admin panel", "Promo codes", "Customer accounts", "Shipping calc", "2 revisions"] },
    { name: "Enterprise", persona: "For established brands", price: "30,000", note: "unlimited", includes: ["Includes Growth +", "Multi-currency", "Inventory sync", "Sales dashboard", "Subscriptions", "3 revisions"] },
  ], footer: "Shopify, WooCommerce, or fully custom." },
  { id: "creative", label: "Creative & 3D", short: "3D", packages: [
    { name: "Motion Pack", persona: "For visual polish", price: "2,500", includes: ["Scroll animations", "Page transitions", "Hover effects", "Parallax layers", "SVG animations"] },
    { name: "3D Experience", persona: "For immersive sites", price: "6,000", recommended: true, includes: ["3D scenes", "Product viewer", "Custom lighting", "Mobile fallback", "Perf optimized"] },
    { name: "Cinematic", persona: "For award-level work", price: "9,000", includes: ["Motion narrative", "3D hero + products", "Brand reveal", "Video layers", "GSAP timelines"] },
  ], footer: "3D configurator: from 8,000 AED." },
  { id: "apps", label: "Apps & AI", short: "Apps", packages: [
    { name: "Web App", persona: "For SaaS founders", price: "12,000", note: "from", includes: ["Auth & accounts", "Core features", "Admin panel", "Database", "APIs", "Deployment"] },
    { name: "Mobile App", persona: "For consumer products", price: "15,000", note: "from", recommended: true, includes: ["iOS + Android", "8-12 screens", "Push notifs", "API connected", "App Store pub", "2 revisions"] },
    { name: "AI-Powered", persona: "For smart products", price: "6,000", note: "from", includes: ["AI chatbot", "LLM integration", "Document Q&A", "Custom training", "API delivery"] },
  ], footer: "SaaS with billing: from 18,000 AED." },
  { id: "aftercare", label: "Aftercare", short: "Care", packages: [
    { name: "Quick Fix", persona: "For one-off updates", price: "500", note: "per request", includes: ["Text / image swaps", "Color changes", "Bug fixes", "Layout tweaks", "Same-day"] },
    { name: "Feature Add", persona: "For upgrades", price: "1,500", note: "from", recommended: true, includes: ["New page/section", "Integrations", "Animation upgrade", "SEO pass", "Payment setup"] },
    { name: "Monthly Plan", persona: "For ongoing care", price: "3,500", note: "/month", includes: ["10 hrs dedicated", "Priority support", "Unlimited tweaks", "Perf monitoring", "Security updates"] },
  ], footer: "Extra revisions: 500 AED each." },
];

const techStack = [
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Three.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
  { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
  { name: "GSAP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Framer", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg" },
];

const trustItems = [
  "End-to-end tested",
  "Free bug fixes post-launch",
  "20+ projects shipped",
  "You own the code",
  "Direct contact only",
  "No vendor lock-in",
];

const steps = ["Intro Call", "Proposal", "Design", "Kickoff", "Build", "Launch"];

const faqs = [
  { q: "How long does a typical project take?", a: "Websites: 2-3 weeks. Apps & stores: 4-8 weeks. Confirmed in your proposal." },
  { q: "Do I pay everything upfront?", a: "No. 50% to start, 50% on delivery." },
  { q: "Can I update the site myself?", a: "Yes, with any Admin Panel package. Simple dashboard, no code needed." },
  { q: "What about issues after launch?", a: "Anything that breaks within delivered scope gets fixed free. No time limits." },
  { q: "Can I combine packages?", a: "Absolutely. We bundle pricing for combinations." },
];

/* ── Wizard ── */
type WStep = { id: string; q: string; sub: string; opts: { l: string; v: string }[] };
const wizSteps: WStep[] = [
  { id: "type", q: "What do you need?", sub: "Pick the closest match.", opts: [
    { l: "A website", v: "website" }, { l: "Website I can edit", v: "website-admin" }, { l: "Online store", v: "ecommerce" },
    { l: "Web or mobile app", v: "app" }, { l: "Animations or 3D", v: "creative" }, { l: "Not sure yet", v: "unsure" },
  ]},
  { id: "scale", q: "How big is it?", sub: "Helps us estimate.", opts: [
    { l: "Small (1-4 pages)", v: "small" }, { l: "Medium (5-8)", v: "medium" }, { l: "Large (10+)", v: "large" }, { l: "Not sure", v: "unsure" },
  ]},
  { id: "extras", q: "Anything extra?", sub: "Pick all that apply.", opts: [
    { l: "Animations", v: "animations" }, { l: "3D elements", v: "3d" }, { l: "Admin panel", v: "cms" }, { l: "Payments", v: "payments" },
    { l: "Multi-language", v: "i18n" }, { l: "Blog", v: "blog" }, { l: "User login", v: "auth" }, { l: "AI features", v: "ai" },
  ]},
];

function getRec(a: Record<string, string | string[]>) {
  const t = a.type as string, s = a.scale as string, x = (a.extras || []) as string[], b = a.budget as string;
  const big = s === "large" || b === "30k" || b === "15-30k";
  const mid = s === "medium" || b === "5-15k";
  const f = (id: string, i: number) => ({ ...collections.find(c => c.id === id)!.packages[i], collection: collections.find(c => c.id === id)!.label });
  if (t === "ecommerce" || (x.includes("payments") && t !== "app")) return f("ecommerce", big ? 2 : mid ? 1 : 0);
  if (t === "app") return x.includes("ai") ? f("apps", 2) : f("apps", big ? 0 : 1);
  if (t === "creative") return f("creative", big ? 2 : mid || x.includes("3d") ? 1 : 0);
  if (t === "website-admin" || x.includes("cms")) return f("website-cms", big || x.includes("3d") ? 2 : mid ? 1 : 0);
  return f("websites", big || x.includes("3d") ? 2 : mid ? 1 : 0);
}

/* ------------------------------------------------------------------ */
/*  Reusable components                                                */
/* ------------------------------------------------------------------ */

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* Card with cursor-tracking glow + 3D tilt */
function GlowCard({ children, className = "", recommended }: { children: React.ReactNode; className?: string; recommended?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 200, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    // 3D tilt: max 4deg
    rotateY.set(((x / rect.width) - 0.5) * 8);
    rotateX.set(((y / rect.height) - 0.5) * -8);
  };

  const handleLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className={`relative rounded-2xl p-5 flex flex-col overflow-hidden noise-subtle group border border-white/[0.06] bg-white/[0.02] ${className}`}
    >
      {/* Cursor-following glow */}
      <motion.div
        className="pointer-events-none absolute w-[250px] h-[250px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          x: mouseX, y: mouseY,
          translateX: "-50%", translateY: "-50%",
          background: recommended
            ? "radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 60%)"
            : "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </motion.div>
  );
}

/* Animated counter */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(value.replace(/,/g, ""));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const duration = 800;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * num);
      setDisplay(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);

  return <span ref={ref}>{display}</span>;
}

function UploadZone({ files, onAdd, onRemove }: { files: File[]; onAdd: (f: FileList) => void; onRemove: (i: number) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const fmt = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;
  return (
    <div>
      <label className="text-xs text-white/50 mb-1.5 block">Upload assets</label>
      <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files); }} onClick={() => ref.current?.click()} className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${over ? "border-gold/50 bg-gold/[0.04]" : "border-white/10 hover:border-white/20"}`}>
        <div className="text-gold/40 flex justify-center mb-1">{Ico.upload}</div>
        <p className="text-xs text-white/40">Drop files or tap to browse</p>
        <input ref={ref} type="file" multiple accept="image/*,.pdf,.ai,.svg" className="hidden" onChange={(e) => e.target.files && onAdd(e.target.files)} />
      </div>
      {files.length > 0 && <div className="mt-2 space-y-1">{files.map((f, i) => (
        <div key={`${f.name}-${i}`} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/[0.02]">
          <span className="text-gold/50">{Ico.file}</span><span className="text-xs text-white/60 truncate flex-1">{f.name}</span><span className="text-[10px] text-white/30">{fmt(f.size)}</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(i); }} className="text-white/20 hover:text-white/50 cursor-pointer">{Ico.x}</button>
        </div>
      ))}</div>}
    </div>
  );
}

function ChatBubble({ onGuide, waNumber }: { onGuide: () => void; waNumber: string }) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  useEffect(() => { const t1 = setTimeout(() => setTyping(true), 2000); const t2 = setTimeout(() => { setTyping(false); setShowMsg(true); }, 3500); return () => { clearTimeout(t1); clearTimeout(t2); }; }, []);
  useEffect(() => { if (!showMsg || open) return; const t = setTimeout(() => setShowMsg(false), 10000); return () => clearTimeout(t); }, [showMsg, open]);

  return (
    <>
      <AnimatePresence>{typing && !open && <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="fixed bottom-7 right-20 z-[60] rounded-xl px-4 py-3 border border-white/[0.08] shadow-lg" style={{ background: "#161616" }}><div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "0ms" }} /><span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "300ms" }} /></div></motion.div>}</AnimatePresence>
      <AnimatePresence>{showMsg && !open && <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="fixed bottom-6 right-20 z-[60] rounded-xl px-4 py-3 max-w-[240px] border border-white/[0.08] cursor-pointer shadow-lg" style={{ background: "#161616" }} onClick={() => { setShowMsg(false); setOpen(true); }}><p className="text-xs text-white/70"><span className="inline-block animate-[wave_1.5s_ease-in-out_2]" style={{ transformOrigin: "70% 70%" }}>👋</span> Need help picking a package?</p></motion.div>}</AnimatePresence>
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2.5">
        <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="rounded-2xl w-[280px] overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50" style={{ background: "#141414" }}>
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]" style={{ background: "#1a1a1a" }}><div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-[10px] font-bold text-gold">V</div><div><p className="text-xs font-semibold text-white">Vivek</p><div className="flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><p className="text-[10px] text-white/40">Online</p></div></div></div><button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 cursor-pointer p-1">{Ico.x}</button></div></div>
          <div className="p-4 space-y-3" style={{ background: "#111" }}><div className="flex items-start gap-2"><div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center text-[8px] font-bold text-gold flex-shrink-0 mt-0.5">V</div><div className="rounded-xl rounded-tl-sm px-3 py-2.5" style={{ background: "#1c1c1c" }}><p className="text-xs text-white/70">Hi! How can I help?</p></div></div>
          <div className="space-y-1.5 pl-7">
            <button onClick={() => { setOpen(false); onGuide(); }} className="w-full px-3 py-2.5 rounded-xl text-xs text-gold text-left cursor-pointer border border-gold/20 hover:bg-gold/[0.06]" style={{ background: "rgba(212,168,83,0.04)" }}>Help me pick a package</button>
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hi Vivek, I'd like to discuss a project.")}`} target="_blank" rel="noopener noreferrer" className="block w-full px-3 py-2.5 rounded-xl text-xs text-gold text-left border border-gold/20 hover:bg-gold/[0.06]" style={{ background: "rgba(212,168,83,0.04)" }}>Talk to an expert (free)</a>
            <a href="/#contact" className="block w-full px-3 py-2.5 rounded-xl text-xs text-gold text-left border border-gold/20 hover:bg-gold/[0.06]" style={{ background: "rgba(212,168,83,0.04)" }}>Get a free quote</a>
          </div></div>
        </motion.div>}</AnimatePresence>
        <button onClick={() => { setOpen(!open); setShowMsg(false); setTyping(false); }} className="w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20 hover:bg-gold-light transition-colors cursor-pointer">{open ? Ico.x : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}</button>
      </div>
    </>
  );
}

interface TData { _id: string; name: string; role: string; text: string; imgPath?: string }
function TestimonialMarquee() {
  const [items, setItems] = useState<TData[]>([]);
  useEffect(() => { fetch("/api/admin/sections/testimonials").then(r => r.json()).then(d => setItems(d)).catch(() => {}); }, []);
  if (items.length === 0) return null;
  const d = [...items, ...items];
  return (
    <div className="overflow-hidden py-1">
      <div className="flex gap-4 animate-marquee-slow" style={{ width: `${d.length * 300}px` }}>
        {d.map((t, i) => (
          <div key={`${t._id}-${i}`} className="rounded-xl p-4 w-[280px] flex-shrink-0 transition-all border border-white/[0.04] hover:border-gold/15" style={{ background: "rgba(255,255,255,0.015)" }}>
            <p className="text-xs text-white/45 leading-relaxed line-clamp-3 mb-3 italic">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              {t.imgPath ? <img src={t.imgPath} alt={t.name} className="w-6 h-6 rounded-full object-cover border border-white/10" /> : <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[9px] font-bold text-gold">{t.name.charAt(0)}</div>}
              <div><p className="text-[11px] font-medium text-white/70">{t.name}</p><p className="text-[9px] text-white/25">{t.role}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scroll-activated process timeline */
function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.8", "end 0.5"] });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="mt-12 sm:mt-24" ref={containerRef}>
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/15 mb-8">How It Works</p>

      {/* Desktop: horizontal with scroll-activated line */}
      <div className="hidden sm:block max-w-3xl mx-auto">
        <div className="relative">
          {/* Background track */}
          <div className="absolute top-[5px] left-0 right-0 h-px bg-white/[0.04]" />
          {/* Animated fill line */}
          <motion.div className="absolute top-[5px] left-0 h-px bg-gradient-to-r from-gold/40 via-gold/30 to-gold/10" style={{ width: lineWidth }} />

          <div className="relative flex justify-between">
            {steps.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="flex flex-col items-center group"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.6 }}
                  className="w-[10px] h-[10px] rounded-full bg-gold/40 mb-3 cursor-default transition-shadow"
                  style={{ animation: isInView ? `dot-glow 3s ease-in-out ${i * 0.5}s infinite` : "none" }}
                />
                <span className="text-[11px] text-white/20 font-medium text-center whitespace-nowrap group-hover:text-gold/50 transition-colors">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden relative pl-8 ml-4">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.04]" />
        <motion.div className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold/40 to-gold/10" style={{ height: lineWidth }} />
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 relative py-2"
          >
            <motion.div
              className="absolute -left-[32px] w-2 h-2 rounded-full bg-gold/40"
              style={{ animation: `dot-glow 3s ease-in-out ${i * 0.5}s infinite` }}
            />
            <span className="text-xs text-white/30 font-medium">{s}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3.5 text-left cursor-pointer group">
        <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors pr-4">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gold/40 flex-shrink-0">{Ico.chev}</motion.span>
      </button>
      <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"><p className="text-xs text-white/35 pb-3 leading-relaxed">{a}</p></motion.div>}</AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

type View = | { m: "browse" } | { m: "guided"; step: number } | { m: "rec" } | { m: "form"; collection: string; tier: string; price: string; includes: string[] } | { m: "done" };

export default function MenuPage() {
  const [tab, setTab] = useState("websites");
  const [view, setView] = useState<View>({ m: "browse" });
  const [sending, setSending] = useState(false);
  const [wa, setWa] = useState<Record<string, string | string[]>>({});
  const [fn, setFn] = useState(""); const [em, setEm] = useState(""); const [ph, setPh] = useState(""); const [co, setCo] = useState("");
  const [vi, setVi] = useState(""); const [rf, setRf] = useState(""); const [fi, setFi] = useState<File[]>([]);
  const [waNumber, setWaNumber] = useState("971501480042"); // fallback

  // Fetch WhatsApp number from social links (stored in DB)
  useEffect(() => {
    fetch("/api/admin/sections/social-links")
      .then(r => r.json())
      .then((links: { name: string; url: string }[]) => {
        const wa = links.find(l => /whatsapp/i.test(l.name));
        if (!wa?.url) return;
        // Extract digits from url like https://wa.me/971501480042 or tel:+971501480042
        const digits = wa.url.replace(/\D/g, "");
        if (digits.length >= 10) setWaNumber(digits);
      })
      .catch(() => {});
  }, []);

  const col = collections.find(c => c.id === tab)!;
  const wStep = view.m === "guided" ? wizSteps[view.step] : null;
  const isMulti = wStep?.id === "extras";
  const rec = view.m === "rec" ? getRec(wa) : null;

  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const commission = (c: string, p: Pkg) => setView({ m: "form", collection: c, tier: p.name, price: p.price, includes: p.includes });
  const addF = useCallback((fl: FileList) => setFi(p => [...p, ...Array.from(fl)]), []);
  const rmF = useCallback((i: number) => setFi(p => p.filter((_, j) => j !== i)), []);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!fn.trim() || !em.trim() || view.m !== "form") return; setSending(true); try { const fd = new FormData(); fd.append("name", fn); fd.append("email", em); fd.append("phone", ph); fd.append("company", co); fd.append("selectedPackage", view.collection); fd.append("selectedTier", view.tier); fd.append("vision", vi); fd.append("references", rf); fi.forEach(f => fd.append("assets", f)); await fetch("/api/orders", { method: "POST", body: fd }); } catch {} setSending(false); setView({ m: "done" }); };
  const reset = () => { setView({ m: "browse" }); setWa({}); setFn(""); setEm(""); setPh(""); setCo(""); setVi(""); setRf(""); setFi([]); };
  const finishWizard = async (answers: Record<string, string | string[]>) => {
    // Infer recommendation for record-keeping
    const r = getRec(answers);
    const typeLabel = wizSteps[0].opts.find(o => o.v === answers.type)?.l || String(answers.type || "");
    const scaleLabel = wizSteps[1].opts.find(o => o.v === answers.scale)?.l || String(answers.scale || "");
    const extrasArr = (answers.extras || []) as string[];
    const extrasLabels = extrasArr.map(v => wizSteps[2].opts.find(o => o.v === v)?.l || v).join(", ");

    // Save to DB (best-effort, non-blocking)
    try {
      const fd = new FormData();
      fd.append("name", "Lead from Guide Me");
      fd.append("email", "pending@whatsapp.lead");
      fd.append("selectedPackage", r.collection);
      fd.append("selectedTier", r.name);
      fd.append("vision", `Type: ${typeLabel}\nScale: ${scaleLabel}\nExtras: ${extrasLabels || "None"}`);
      fd.append("references", "");
      fetch("/api/orders", { method: "POST", body: fd }).catch(() => {});
    } catch {}

    // Build WhatsApp message
    const msg = [
      `Hi Vivek! I would like to discuss a project.`,
      ``,
      `*What I need:* ${typeLabel}`,
      `*Size:* ${scaleLabel}`,
      extrasLabels ? `*Extras:* ${extrasLabels}` : `*Extras:* None`,
      ``,
      `Suggested package: *${r.collection} — ${r.name}* (${r.price} AED)`,
    ].join("\n");
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    // Show "Connecting you" screen for a few seconds before WhatsApp opens
    setTimeout(() => { window.open(url, "_blank"); }, 4000);
  };

  const pickWiz = (val: string) => {
    if (!wStep) return;
    if (isMulti) {
      const p = (wa[wStep.id] || []) as string[];
      setWa({ ...wa, [wStep.id]: p.includes(val) ? p.filter(v => v !== val) : [...p, val] });
    } else {
      const next = { ...wa, [wStep.id]: val };
      setWa(next);
      setTimeout(() => {
        if (view.m === "guided" && view.step < wizSteps.length - 1) {
          setView({ m: "guided", step: view.step + 1 });
        } else {
          setView({ m: "done" });
          finishWizard(next);
        }
      }, 200);
    }
  };
  const wizBack = () => { if (view.m === "guided" && view.step > 0) setView({ m: "guided", step: view.step - 1 }); else if (view.m === "rec") setView({ m: "guided", step: wizSteps.length - 1 }); else setView({ m: "browse" }); };
  const handleBack = () => { if (view.m === "done") return reset(); if (view.m === "guided" || view.m === "rec") return wizBack(); if (view.m === "form") return setView({ m: "browse" }); reset(); };
  const backText = view.m === "guided" ? (view.step === 0 ? "Back" : "Previous") : view.m === "rec" ? "Previous" : view.m === "form" ? "Back" : view.m === "done" ? "Start over" : "";
  const overlay = view.m !== "browse";

  // Input style
  const inp = "w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-gold/30 transition-colors";

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">

      {/* Parallax ambient orbs */}
      <motion.div style={{ y: orbY }} className="fixed top-[-10%] left-[40%] w-[600px] h-[400px] bg-gold/[0.02] rounded-full blur-[150px] pointer-events-none animate-float" />
      <motion.div style={{ y: orb2Y }} className="fixed bottom-[5%] right-[-5%] w-[350px] h-[350px] bg-gold/[0.015] rounded-full blur-[120px] pointer-events-none animate-float-delay" />

      {/* ═══ OVERLAY MODES ═══ */}
      <AnimatePresence>
        {overlay && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 sm:px-6">
              <div className="pt-4 sm:pt-6 pb-2 flex-shrink-0">
                <button onClick={handleBack} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-gold transition-colors cursor-pointer mb-2">{Ico.back} <span>{backText}</span></button>
                <h1 className="text-xl sm:text-2xl font-bold text-center tracking-tight"><span className="gradient-text">Build Your Digital Presence</span></h1>
              </div>
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                  {view.m === "guided" && wStep && (
                    <motion.div key={`w-${view.step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col items-center justify-center px-2">
                      <div className="flex items-center gap-2 mb-5">{wizSteps.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === view.step ? "w-6 bg-gold" : i < view.step ? "w-3 bg-gold/40" : "w-3 bg-white/10"}`} />)}</div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-1.5">Step {view.step + 1} / {wizSteps.length}</p>
                      <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-1">{wStep.q}</h2>
                      <p className="text-xs text-white/30 text-center mb-5">{wStep.sub}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                        {wStep.opts.map(o => { const sel = isMulti ? ((wa[wStep.id] || []) as string[]).includes(o.v) : wa[wStep.id] === o.v; return (
                          <motion.button key={o.v} whileTap={{ scale: 0.97 }} onClick={() => pickWiz(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-all cursor-pointer border ${sel ? "bg-gold/10 border-gold/30 text-gold" : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:border-white/15"}`}>
                            <div className="flex items-center gap-2.5"><div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${sel ? "border-gold bg-gold/20" : "border-white/20"}`}>{sel && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}</div>{o.l}</div>
                          </motion.button>); })}
                      </div>
                      {isMulti && <button onClick={() => { if (view.m === "guided" && view.step < wizSteps.length - 1) setView({ m: "guided", step: view.step + 1 }); else { setView({ m: "done" }); finishWizard(wa); } }} className="mt-5 px-6 py-2.5 rounded-xl bg-gold text-black text-xs font-semibold hover:bg-gold-light cursor-pointer">{((wa.extras as string[]) || []).length === 0 ? "Skip" : "Continue"}</button>}
                    </motion.div>
                  )}
                  {view.m === "rec" && rec && (
                    <motion.div key="rec" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-3">Your recommendation</p>
                      <GlowCard recommended className="max-w-lg w-full neon-glow">
                        <div className="flex items-center justify-between mb-3"><div><p className="text-[10px] uppercase tracking-wider text-white/30">{rec.collection}</p><h3 className="text-lg font-bold text-white">{rec.name}</h3></div><div className="text-right"><span className="text-2xl font-bold text-gold tabular-nums">{rec.price}</span><span className="text-xs text-white/30 ml-1">AED</span></div></div>
                        <div className="h-px bg-white/5 mb-3" />
                        <ul className="space-y-1.5 mb-5">{rec.includes.map(item => <li key={item} className="flex items-start gap-2 text-xs text-white/50"><span className="text-gold/60 mt-0.5 flex-shrink-0">{Ico.check}</span>{item}</li>)}</ul>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setView({ m: "form", collection: rec.collection, tier: rec.name, price: rec.price, includes: rec.includes })} className="w-full py-3 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold-light cursor-pointer">Proceed</motion.button>
                      </GlowCard>
                      <button onClick={() => { setWa({}); setView({ m: "browse" }); }} className="mt-4 text-xs text-white/30 hover:text-white/50 cursor-pointer">Or browse manually</button>
                    </motion.div>
                  )}
                  {view.m === "form" && (
                    <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4 max-w-2xl mx-auto w-full">
                      <div className="rounded-xl p-4 mb-4 flex items-center justify-between border border-gold/15" style={{ background: "rgba(212,168,83,0.03)" }}><div><p className="text-[10px] uppercase tracking-wider text-white/30">Selection</p><p className="text-sm font-semibold text-white mt-0.5">{view.collection} &mdash; {view.tier}</p></div><div className="text-right"><span className="text-xl font-bold text-gold tabular-nums">{view.price}</span><span className="text-xs text-white/30 ml-1">AED</span></div></div>
                      <form onSubmit={submit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="text-xs text-white/50 mb-1 block">Name <span className="text-gold/60">*</span></label><input type="text" required value={fn} onChange={e => setFn(e.target.value)} placeholder="John Smith" className={inp} /></div><div><label className="text-xs text-white/50 mb-1 block">Email <span className="text-gold/60">*</span></label><input type="email" required value={em} onChange={e => setEm(e.target.value)} placeholder="john@company.com" className={inp} /></div></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="text-xs text-white/50 mb-1 block">Phone</label><input type="tel" value={ph} onChange={e => setPh(e.target.value)} placeholder="+971 50 123 4567" className={inp} /></div><div><label className="text-xs text-white/50 mb-1 block">Company</label><input type="text" value={co} onChange={e => setCo(e.target.value)} placeholder="Acme Corp" className={inp} /></div></div>
                        <div><label className="text-xs text-white/50 mb-1 block">About your project</label><textarea value={vi} onChange={e => setVi(e.target.value)} rows={2} placeholder="What you need, audience, inspiration..." className={`${inp} resize-none`} /></div>
                        <div><label className="text-xs text-white/50 mb-1 block">Sites you like</label><input type="text" value={rf} onChange={e => setRf(e.target.value)} placeholder="apple.com, stripe.com" className={inp} /></div>
                        <UploadZone files={fi} onAdd={addF} onRemove={rmF} />
                        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={sending || !fn.trim() || !em.trim()} className="w-full py-3 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold-light cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">{sending ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>{Ico.send} Place Order</>}</motion.button>
                        <p className="text-[10px] text-white/20 text-center">No payment now. We will reach out within 24 hours.</p>
                      </form>
                    </motion.div>
                  )}
                  {view.m === "done" && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-md mx-auto px-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="relative flex justify-center mb-5">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="text-gold/50">{Ico.sparkle}</motion.div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-gold/10 animate-pulse" style={{ animationDuration: "2s" }} />
                          </div>
                        </motion.div>
                        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold gradient-text mb-2">Connecting You to Our Expert</motion.h2>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/50 text-sm leading-relaxed mb-2">Opening WhatsApp with your details prefilled.</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/30 text-xs leading-relaxed mb-7">Our consultant will review your needs and send you a personalized quotation. Free, no commitment.</motion.p>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button onClick={reset} className="px-6 py-2.5 rounded-xl btn-shimmer text-xs font-semibold cursor-pointer">Explore More</button>
                          <Link href="/" className="px-6 py-2.5 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/60 transition-colors">Back to Portfolio</Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ BROWSE ═══ */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6">

        {/* Hero */}
        <Reveal>
          <div className="pt-4 sm:pt-6 pb-3 sm:pb-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/" className="text-xs text-white/30 hover:text-gold transition-colors">&larr; Portfolio</Link>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/15">VKS</span>
            </div>
            <h1 className="text-[28px] sm:text-5xl font-bold text-center tracking-tight leading-[1.1] px-2">
              <span className="gradient-text">Build Your Digital Presence</span>
            </h1>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.1}>
          {/* Tabs */}
          <div className="mb-4 -mx-4 px-4">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1.5 sm:justify-center">
              {collections.map(c => (
                <motion.button key={c.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(c.id)} className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${tab === c.id ? "text-gold border border-gold/20 bg-gold/[0.06]" : "text-white/25 hover:text-white/50 border border-transparent"}`}><span className="hidden sm:inline">{c.label}</span><span className="sm:hidden">{c.short}</span></motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {col.packages.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                <GlowCard recommended={p.recommended} className={p.recommended ? "border-gold/20 glow-breathe" : ""}>
                  {p.recommended && <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/20">Popular</span>}
                  <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                  <p className="text-[10px] text-gold/50 mt-0.5">{p.persona}</p>
                  <div className="flex items-baseline gap-1.5 mt-2.5">
                    {p.note && <span className="text-[9px] uppercase tracking-wider text-white/25">{p.note}</span>}
                    <span className="text-3xl sm:text-4xl font-bold text-gold tabular-nums"><CountUp value={p.price} /></span>
                    <span className="text-xs text-white/25">AED</span>
                  </div>
                  <div className="h-px bg-white/5 my-3" />
                  <ul className="space-y-1.5 flex-1">
                    {p.includes.map(item => <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/35"><span className="text-gold/40 mt-0.5 flex-shrink-0">{Ico.check}</span>{item}</li>)}
                  </ul>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => commission(col.label, p)} className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold text-center cursor-pointer btn-shimmer">Get This Package</motion.button>
                </GlowCard>
              </motion.div>
            ))}

            {/* Custom card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <GlowCard className="border-dashed border-white/[0.06]">
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="w-12 h-12 rounded-full border border-gold/15 flex items-center justify-center mb-4" style={{ background: "rgba(212,168,83,0.04)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gold/40"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Not sure where to start?</h3>
                  <p className="text-xs text-white/30 leading-relaxed max-w-[180px]">Let us guide you, or talk to us directly. Free, on us.</p>
                </div>
                <div className="space-y-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setWa({}); setView({ m: "guided", step: 0 }); }} className="w-full py-2.5 rounded-xl btn-gold-shimmer text-xs font-semibold text-center cursor-pointer">Help Me Pick</motion.button>
                  <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hi Vivek, I need help deciding which package is right for me.")}`} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl btn-shimmer text-xs font-semibold text-center block">Talk to Us Free</a>
                </div>
              </GlowCard>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {col.footer && <p className="text-center text-[10px] text-white/15 mt-3">{col.footer}</p>}

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center gap-2 mt-10 sm:mt-12"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/20">More below</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-gold/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
          </motion.div>
        </motion.div>

        {/* ── Visual Journey: Idea > Design > Build > Launch ── */}
        <Reveal>
          <section className="mt-14 sm:mt-36">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/15 mb-10">From Idea to Live Product</p>
            <div className="max-w-3xl mx-auto">
              {/* Connected flow */}
              <div className="hidden sm:block relative">
                {/* Connecting line - spans between icon centers (first col center to last col center) */}
                {/* Each col is 25% wide, so centers are at 12.5%, 37.5%, 62.5%, 87.5%. Line goes from first center to last. */}
                <div className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-white/[0.04]" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold/30 via-gold/20 to-gold/10 origin-left"
                />
                <div className="relative grid grid-cols-4 gap-4">
                  {[
                    { label: "Idea", sub: "We define your vision", icon: <svg viewBox="0 0 32 32" className="w-7 h-7"><circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M13 20h6M14 23h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg> },
                    { label: "Design", sub: "We craft the experience", icon: <svg viewBox="0 0 32 32" className="w-7 h-7"><rect x="8" y="6" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1" /><line x1="8" y1="11" x2="24" y2="11" stroke="currentColor" strokeWidth="0.8" /><rect x="11" y="14" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.2" /></svg> },
                    { label: "Build", sub: "We bring it to life", icon: <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M10 10l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg> },
                    { label: "Launch", sub: "You go live", icon: <svg viewBox="0 0 32 32" className="w-7 h-7"><path d="M10 24 L14 16 L19 19 L24 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0.4" /></svg> },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.2 }}
                      className="flex flex-col items-center text-center group cursor-default"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, borderColor: "rgba(212,168,83,0.3)" }}
                        className="w-14 h-14 rounded-2xl border border-white/[0.06] flex items-center justify-center mb-3 text-white/20 group-hover:text-gold/50 transition-all"
                        style={{ background: "rgba(255,255,255,0.015)" }}
                      >
                        {s.icon}
                      </motion.div>
                      <span className="text-xs text-white/40 font-medium mb-0.5 group-hover:text-white/60 transition-colors">{s.label}</span>
                      <span className="text-[10px] text-white/15 group-hover:text-gold/40 transition-colors">{s.sub}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile: vertical connected */}
              <div className="sm:hidden relative pl-10 ml-2">
                <div className="absolute left-[14px] top-2 bottom-2 w-px bg-white/[0.04]" />
                <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="absolute left-[14px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/30 to-gold/10 origin-top" />
                {[
                  { label: "Idea", sub: "We define your vision" },
                  { label: "Design", sub: "We craft the experience" },
                  { label: "Build", sub: "We bring it to life" },
                  { label: "Launch", sub: "You go live" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="py-3 relative">
                    <div className="absolute -left-[32px] top-[18px] w-2.5 h-2.5 rounded-full bg-gold/30 border-2 border-background" style={{ animation: `dot-glow 3s ease-in-out ${i * 0.5}s infinite` }} />
                    <p className="text-xs text-white/40 font-medium">{s.label}</p>
                    <p className="text-[10px] text-white/20">{s.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Tech credibility strip ── */}
        <Reveal>
          <div className="mt-12 sm:mt-24">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/15 mb-5">Built with</p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.15, borderColor: "rgba(212,168,83,0.2)" }}
                  className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/[0.04] cursor-default transition-all group"
                  style={{ background: "rgba(255,255,255,0.01)" }}
                >
                  <img src={t.icon} alt={t.name} className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0" />
                  <span className="text-[9px] text-white/15 font-medium group-hover:text-white/40 transition-colors">{t.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Trust strip ── */}
        <Reveal>
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-2">
            {trustItems.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(212,168,83,0.2)" }}
                className="rounded-full px-3.5 py-1.5 text-[10px] text-white/30 font-medium border border-white/[0.04] cursor-default transition-all"
                style={{ background: "rgba(255,255,255,0.01)" }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </Reveal>

        {/* ── Process timeline with scroll-activated glow ── */}
        <Reveal>
          <ProcessTimeline />
        </Reveal>

        {/* ── Testimonials ── */}
        <Reveal>
          <section className="mt-12 sm:mt-24">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/15 mb-6">Trusted By</p>
            <TestimonialMarquee />
          </section>
        </Reveal>

        {/* ── FAQ ── */}
        <Reveal>
          <section className="mt-12 sm:mt-24 max-w-xl mx-auto">
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/15 mb-6">Questions</p>
            <div className="rounded-2xl px-5 border border-white/[0.04]" style={{ background: "rgba(255,255,255,0.015)" }}>{faqs.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}</div>
          </section>
        </Reveal>

        {/* ── Cinematic CTA ── */}
        <Reveal>
          <section className="mt-12 sm:mt-24 mb-14">
            <div className="relative rounded-2xl p-8 sm:p-12 text-center overflow-hidden border border-gold/10">
              {/* Animated gradient bg */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.04) 0%, rgba(0,0,0,0) 40%, rgba(212,168,83,0.03) 70%, rgba(0,0,0,0) 100%)", backgroundSize: "200% 200%", animation: "gradient-shift 8s ease infinite" }} />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to build something great?</h2>
                <p className="text-xs text-white/25 mb-6">Get a custom plan in one call. Start your project in 48 hours.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setWa({}); setView({ m: "guided", step: 0 }); }} className="px-6 py-3 rounded-xl btn-gold-shimmer font-semibold text-sm cursor-pointer">Start Your Project</motion.button>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl btn-shimmer text-sm font-medium">WhatsApp Us</a>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <p className="text-center text-[10px] text-white/10 pb-8">Pricing exclusive of VAT. Final scope confirmed during consultation.</p>
      </div>

      <ChatBubble onGuide={() => { setWa({}); setView({ m: "guided", step: 0 }); }} waNumber={waNumber} />
    </main>
  );
}
