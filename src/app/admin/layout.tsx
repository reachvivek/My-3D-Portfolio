"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  FileText,
  BarChart2,
  Type,
  Compass,
  TrendingUp,
  Users,
  Award,
  Folder,
  Calendar,
  Layers,
  Settings,
  Quote,
  Globe,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: BarChart2 },
      { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/hero", label: "Hero", icon: Type },
      { href: "/admin/nav-links", label: "Navigation", icon: Compass },
      { href: "/admin/stats", label: "Stats", icon: TrendingUp },
      { href: "/admin/companies", label: "Companies", icon: Users },
      { href: "/admin/flagship", label: "Flagship", icon: Award },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projects", icon: Folder },
      { href: "/admin/experience", label: "Experience", icon: Calendar },
      { href: "/admin/process", label: "Process", icon: Layers },
      { href: "/admin/services", label: "Services", icon: Settings },
    ],
  },
  {
    label: "Social",
    items: [
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/social-links", label: "Social Links", icon: Globe },
    ],
  },
  {
    label: "Blog",
    items: [
      { href: "/admin/blog", label: "Posts", icon: FileText },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items);

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("admin_auth", "true");
      onAuth();
    } else {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4a853]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#d4a853]/[0.015] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-[#d4a853]/10 border border-[#d4a853]/20 flex items-center justify-center mx-auto mb-5"
          >
            <Shield className="w-6 h-6 text-[#d4a853]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold tracking-tight"
          >
            Admin Access
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white/30 mt-2"
          >
            Enter your password to continue
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-sm text-white placeholder:text-white/25 outline-none transition-all ${
                error
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/8 focus:border-[#d4a853]/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              {show ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-red-400/80"
            >
              Incorrect password. Try again.
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 rounded-xl bg-[#d4a853] text-black text-sm font-semibold hover:bg-[#d4a853]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="text-xs text-white/20 hover:text-white/40 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to site
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "true") {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[#d4a853]" />
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/6 bg-white/[0.02] backdrop-blur-xl">
        <div className="p-6 border-b border-white/6">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d4a853]" />
            <span className="text-lg font-semibold">Admin CMS</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] uppercase tracking-widest text-white/20 font-medium px-4 mb-2">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20"
                          : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.03] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/6 space-y-2">
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              setAuthed(false);
            }}
            className="w-full text-xs text-white/25 hover:text-red-400 transition-colors text-center py-1"
          >
            Sign Out
          </button>
          <p className="text-[10px] text-white/15 text-center">
            reachvivek.vercel.app
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/6">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#d4a853]" />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            {allNavItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-[#d4a853] bg-[#d4a853]/10"
                      : "text-white/40 hover:text-white/60"
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </Link>
              );
            })}
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setAuthed(false);
              }}
              className="p-2 rounded-lg text-white/25 hover:text-red-400 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen md:overflow-y-auto">
        <div className="pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
