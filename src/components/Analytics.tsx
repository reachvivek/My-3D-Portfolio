"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * First-party, cookieless visit analytics (modelled on the Shru access dashboard).
 * Every second the page is visible and in use, the section filling most of the screen earns a second;
 * every 5 s (and when the page is hidden) those seconds, the deepest scroll and any clicks are sent.
 * Nothing personal is collected: a random visitor id in localStorage, a session id in sessionStorage.
 * Skipped for: the admin area, the owner's browser, automated browsers, Do Not Track / Global Privacy Control.
 */

const BEAT_MS = 5000;
const IDLE_MS = 60_000;

const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => (b % 36).toString(36)).join("");

function stored(store: Storage, key: string): { value: string; existed: boolean } {
  try {
    const v = store.getItem(key);
    if (v) return { value: v, existed: true };
    const n = rid();
    store.setItem(key, n);
    return { value: n, existed: false };
  } catch {
    return { value: rid(), existed: false };
  }
}

type Click = { k: string; l: string; h?: string };

function classify(el: Element): Click | null {
  const a = el.closest("a, button");
  if (!a) return null;
  const label = (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80) || a.tagName.toLowerCase();
  const href = a instanceof HTMLAnchorElement ? a.getAttribute("href") || "" : "";
  const k = !href
    ? "button"
    : href.startsWith("/projects/")
      ? "project"
      : href.includes("calendly.com")
        ? "book-call"
        : href.includes("resume")
          ? "resume"
          : href.includes("wa.me")
            ? "whatsapp"
            : href.startsWith("mailto:")
              ? "email"
              : /linkedin|github|instagram/.test(href)
                ? "social"
                : href.startsWith("/blog")
                  ? "blog"
                  : href.startsWith("#")
                    ? "nav"
                    : /^https?:/.test(href)
                      ? "external"
                      : "link";
  return { k, l: label, h: href.slice(0, 200) || undefined };
}

/** The section taking up most of the viewport; inside the showcase, which stage of it. */
function currentSection(): string | null {
  const vh = window.innerHeight;
  let best: Element | null = null;
  let bestPx = 0;
  document.querySelectorAll("section[id]").forEach((s) => {
    const r = s.getBoundingClientRect();
    const px = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (px > bestPx) {
      bestPx = px;
      best = s;
    }
  });
  if (!best) return null;
  const el = best as HTMLElement;
  return el.id === "showcase" ? `showcase/${el.dataset.stage || "intro"}` : el.id;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (navigator.webdriver) return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    try {
      if (localStorage.getItem("rv_owner") === "1") return;
    } catch {}

    const visitor = stored(localStorage, "rv_vid");
    const session = stored(sessionStorage, "rv_sid");
    const params = new URLSearchParams(location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"].reduce<Record<string, string>>((o, k) => {
      const v = params.get(k);
      if (v) o[k.slice(4)] = v.slice(0, 60);
      return o;
    }, {});

    let dwell: Record<string, number> = {};
    let clicks: Click[] = [];
    let scroll = 0;
    let first = true;
    let lastInput = Date.now();

    const payload = () => ({
      sid: session.value,
      vid: visitor.value,
      ret: visitor.existed,
      path: pathname,
      pv: first,
      ref: first && !session.existed ? document.referrer.slice(0, 300) : undefined,
      utm: first && Object.keys(utm).length ? utm : undefined,
      sw: window.screen?.width,
      d: dwell,
      s: Math.round(scroll),
      ev: clicks,
    });

    const flush = (beacon: boolean) => {
      if (!first && !Object.keys(dwell).length && !clicks.length) return;
      const body = JSON.stringify(payload());
      first = false;
      dwell = {};
      clicks = [];
      try {
        if (beacon && navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
        else fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      } catch {}
    };

    const onInput = () => (lastInput = Date.now());
    const onScroll = () => {
      lastInput = Date.now();
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      scroll = Math.max(scroll, max > 0 ? (window.scrollY / max) * 100 : 100);
    };
    const onClick = (e: MouseEvent) => {
      const c = e.target instanceof Element ? classify(e.target) : null;
      if (c && clicks.length < 20) clicks.push(c);
    };
    const onHide = () => document.visibilityState === "hidden" && flush(true);
    const onPageHide = () => flush(true);

    const tick = setInterval(() => {
      if (document.visibilityState !== "visible" || Date.now() - lastInput > IDLE_MS) return;
      const key = currentSection();
      if (key) dwell[key] = (dwell[key] || 0) + 1000;
    }, 1000);
    const beat = setInterval(() => flush(false), BEAT_MS);

    flush(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    window.addEventListener("mousemove", onInput, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      flush(true);
      clearInterval(tick);
      clearInterval(beat);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("mousemove", onInput);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [pathname]);

  return null;
}
