import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
    template: "%s | Vivek Kumar Singh",
  },
  description:
    "Top full-stack developer and AI engineer based in Abu Dhabi, UAE. Building AI voice agents for Audi, Porsche & Volkswagen. Fintech platforms for BSE & NSDL. Expert in Next.js, React, Node.js, Python, and AI/ML. Available for freelance and contract work across Dubai, Abu Dhabi, and the UAE.",
  keywords: [
    "full stack developer Dubai",
    "full stack developer UAE",
    "full stack developer Abu Dhabi",
    "AI developer Dubai",
    "AI developer Abu Dhabi",
    "AI developer UAE",
    "AI voice agent developer UAE",
    "best web developer Dubai",
    "best web developer UAE",
    "Next.js developer Dubai",
    "React developer Dubai",
    "React developer UAE",
    "React developer Abu Dhabi",
    "web developer Abu Dhabi",
    "web developer Dubai",
    "freelance developer Dubai",
    "freelance developer UAE",
    "freelance web developer Dubai",
    "freelance web developer Abu Dhabi",
    "software engineer Dubai",
    "software engineer Abu Dhabi",
    "software engineer UAE",
    "fintech developer Dubai",
    "fintech developer UAE",
    "Node.js developer Dubai",
    "Node.js developer UAE",
    "Python developer Dubai",
    "Three.js developer UAE",
    "hire developer Dubai",
    "hire AI engineer UAE",
    "hire full stack developer Dubai",
    "hire web developer Abu Dhabi",
    "web app development Dubai",
    "web application development UAE",
    "mobile app developer UAE",
    "SaaS developer Dubai",
    "startup developer Dubai",
    "startup CTO Dubai",
    "Vivek Kumar Singh",
    "Vivek Kumar Singh developer",
    "Vivek Kumar Singh Dubai",
    "Vivek Singh developer UAE",
    "Indian developer in Dubai",
    "Indian developer in UAE",
    "MERN stack developer Dubai",
    "TypeScript developer Dubai",
    "Angular developer UAE",
    ".NET developer Dubai",
  ],
  authors: [{ name: "Vivek Kumar Singh", url: "https://viveksingh.dev" }],
  creator: "Vivek Kumar Singh",
  publisher: "Vivek Kumar Singh",
  metadataBase: new URL("https://viveksingh.dev"),
  openGraph: {
    title:
      "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
    description:
      "Top-rated full-stack developer in Dubai, UAE. Engineering AI voice agents for Audi, Porsche & VW. Building fintech platforms for BSE & NSDL. 20+ systems delivered. Available for hire.",
    type: "website",
    locale: "en_US",
    siteName: "Vivek Kumar Singh | Full-Stack Developer Dubai",
    url: "https://viveksingh.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Vivek Kumar Singh | Full-Stack Developer & AI Engineer in Dubai, UAE",
    description:
      "Top full-stack developer in Dubai. AI voice agents for Audi, Porsche & VW. Fintech for BSE & NSDL. 20+ systems delivered. Hire me.",
    images: ["/og-image.png"],
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
  category: "technology",
  verification: {
    // Add Google Search Console verification when available
    // google: "your-verification-code",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://viveksingh.dev/#person",
  name: "Vivek Kumar Singh",
  givenName: "Vivek",
  familyName: "Singh",
  jobTitle: "Full-Stack Developer & AI Engineer",
  url: "https://viveksingh.dev",
  image: "https://viveksingh.dev/og-image.png",
  email: "mailto:reachviveksingh@gmail.com",
  sameAs: [
    "https://github.com/reachvivek",
    "https://linkedin.com/in/reachvivek",
    "https://instagram.com/rogerthatvivek",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressRegion: "Abu Dhabi",
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
  alumniOf: [
    {
      "@type": "Organization",
      name: "Oneture Technologies",
    },
    {
      "@type": "Organization",
      name: "CMS Info Systems",
    },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "AI Voice Agents",
    "Full-Stack Development",
    "Next.js",
    "React",
    "Angular",
    "Node.js",
    "Python",
    ".NET Core",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Fintech Development",
    "Web Development",
    "Mobile App Development",
    "SaaS Development",
    "Three.js",
    "WebRTC",
    "Machine Learning",
  ],
  description:
    "Top full-stack developer and AI engineer based in Abu Dhabi, UAE. 4+ years building production systems across AI, fintech, healthcare, and SaaS. 20+ systems delivered for clients including BSE, NSDL, Audi, Porsche, and Volkswagen. Expert in Next.js, React, Node.js, Python, and AI/ML.",
  nationality: {
    "@type": "Country",
    name: "India",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://viveksingh.dev/#website",
  url: "https://viveksingh.dev",
  name: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer",
  description:
    "Portfolio of Vivek Kumar Singh, a top full-stack developer and AI engineer based in Dubai/Abu Dhabi, UAE.",
  publisher: {
    "@id": "https://viveksingh.dev/#person",
  },
  inLanguage: "en-US",
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://viveksingh.dev/#profilepage",
  url: "https://viveksingh.dev",
  name: "Vivek Kumar Singh | Full-Stack Developer & AI Engineer",
  mainEntity: {
    "@id": "https://viveksingh.dev/#person",
  },
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://viveksingh.dev",
      },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://viveksingh.dev/#service",
  name: "Vivek Kumar Singh - Full-Stack Development & AI Engineering",
  description:
    "Freelance full-stack developer and AI engineer offering web development, AI integration, fintech solutions, and mobile app development services in Dubai, Abu Dhabi, and across the UAE.",
  url: "https://viveksingh.dev",
  image: "https://viveksingh.dev/og-image.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressRegion: "Abu Dhabi",
    addressCountry: "AE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.4539,
    longitude: 54.3773,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Dubai",
    },
    {
      "@type": "City",
      name: "Abu Dhabi",
    },
    {
      "@type": "Country",
      name: "United Arab Emirates",
    },
  ],
  serviceType: [
    "Full-Stack Web Development",
    "AI & Machine Learning Engineering",
    "Mobile App Development",
    "Fintech Development",
    "SaaS Development",
    "UI/UX Design",
  ],
  founder: {
    "@id": "https://viveksingh.dev/#person",
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="geo.region" content="AE-AZ" />
        <meta name="geo.placename" content="Abu Dhabi" />
        <meta name="geo.position" content="24.4539;54.3773" />
        <meta name="ICBM" content="24.4539, 54.3773" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              personSchema,
              websiteSchema,
              profilePageSchema,
              localBusinessSchema,
            ]),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased grain`}>
        {children}
      </body>
    </html>
  );
}
