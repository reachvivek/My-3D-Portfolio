import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Digital Presence | Pricing & Packages",
  description:
    "Transparent pricing for websites, e-commerce stores, web apps, and AI integration in Dubai & UAE. Starting from 3,500 AED. Free consultation, 50/50 payment, free post-launch fixes.",
  keywords: [
    "website pricing Dubai",
    "website pricing UAE",
    "web development cost Dubai",
    "e-commerce development Dubai",
    "app development pricing UAE",
    "AI integration cost",
    "freelance developer pricing UAE",
    "agency pricing Dubai",
    "affordable website Dubai",
    "website packages UAE",
  ],
  openGraph: {
    title: "Build Your Digital Presence | Pricing & Packages",
    description:
      "Websites from 3,500 AED, e-commerce from 10,000 AED, full apps from 12,000 AED. Free consultation, transparent pricing. UAE-based.",
    type: "website",
    url: "https://reachvivek.vercel.app/menu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vivek Kumar Singh - Build Your Digital Presence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Digital Presence | Pricing & Packages",
    description:
      "Websites, e-commerce, apps & AI integration. Transparent pricing in AED. Free consultation.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://reachvivek.vercel.app/menu",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
