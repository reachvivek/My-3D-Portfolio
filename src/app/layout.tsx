import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
  description:
    "Top full-stack developer and AI engineer based in Abu Dhabi, UAE. Building AI voice agents for Audi, Porsche & Volkswagen. Fintech platforms for BSE & NSDL. Hire the best web developer in Dubai for Next.js, React, Node.js, and AI projects.",
  keywords: [
    "full stack developer Dubai",
    "full stack developer UAE",
    "AI developer Dubai",
    "AI developer Abu Dhabi",
    "AI voice agent developer UAE",
    "best web developer Dubai",
    "Next.js developer Dubai",
    "React developer Dubai",
    "React developer UAE",
    "web developer Abu Dhabi",
    "freelance developer Dubai",
    "freelance developer UAE",
    "software engineer Dubai",
    "software engineer Abu Dhabi",
    "fintech developer Dubai",
    "fintech developer UAE",
    "Node.js developer Dubai",
    "Three.js developer UAE",
    "hire developer Dubai",
    "hire AI engineer UAE",
    "web app development Dubai",
    "mobile app developer UAE",
    "SaaS developer Dubai",
    "startup developer Dubai",
    "Vivek Kumar Singh",
    "Vivek Kumar Singh developer",
    "full stack developer San Francisco",
    "AI engineer San Francisco",
    "web developer USA",
  ],
  authors: [{ name: "Vivek Kumar Singh" }],
  creator: "Vivek Kumar Singh",
  metadataBase: new URL("https://viveksingh.dev"),
  openGraph: {
    title: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
    description:
      "Top-rated full-stack developer in Dubai, UAE. Engineering AI voice agents for Audi, Porsche & VW. Building fintech platforms for BSE & NSDL. Available for hire.",
    type: "website",
    locale: "en_US",
    siteName: "Vivek Kumar Singh | Developer Dubai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
    description:
      "Top full-stack developer in Dubai. AI voice agents for Audi, Porsche & VW. Fintech for BSE & NSDL. Hire me.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://viveksingh.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vivek Kumar Singh",
              jobTitle: "Full-Stack Developer & AI Engineer",
              url: "https://viveksingh.dev",
              sameAs: [
                "https://github.com/reachvivek",
                "https://linkedin.com/in/reachvivek",
                "https://instagram.com/rogerthatvivek",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Abu Dhabi",
                addressCountry: "AE",
              },
              worksFor: {
                "@type": "Organization",
                name: "Ali and Sons",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Abu Dhabi",
                  addressCountry: "AE",
                },
              },
              knowsAbout: [
                "AI Voice Agents",
                "Full-Stack Development",
                "Next.js",
                "React",
                "Node.js",
                "Fintech",
                "Web Development Dubai",
                "AI Development UAE",
              ],
              description:
                "Top full-stack developer and AI engineer based in Abu Dhabi, UAE. Building AI voice agents for Audi, Porsche & Volkswagen dealerships. Fintech platforms for BSE & NSDL.",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased grain`}>
        {children}
      </body>
    </html>
  );
}
