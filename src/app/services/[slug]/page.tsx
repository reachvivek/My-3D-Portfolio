import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  Globe,
  Smartphone,
  Server,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
} from "lucide-react";

export const revalidate = 3600;

// ── Service Data ──
interface ServicePage {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroLine: string;
  heroAccent: string;
  intro: string;
  offerings: { title: string; desc: string }[];
  stack: string[];
  projects: { name: string; slug: string; oneLiner: string }[];
  icon: string;
}

const SERVICES: Record<string, ServicePage> = {
  "ai-developer-dubai": {
    title: "AI Developer in Dubai",
    metaTitle:
      "AI Developer in Dubai | Vivek Kumar Singh | Voice Agents, ML, NLP",
    metaDescription:
      "Hire a top AI developer in Dubai. I build AI voice agents for Audi, Porsche & VW, NLP pipelines, and intelligent automation systems. Based in Abu Dhabi, serving Dubai & the UAE.",
    heroLine: "AI Development",
    heroAccent: "in Dubai & the UAE",
    intro: "I design and ship production AI systems, not prototypes that live in Jupyter notebooks. From conversational voice agents handling thousands of calls daily for automotive giants, to NLP classifiers that process crisis intelligence in real-time, my AI work is built for scale, reliability, and real business outcomes. Based in Abu Dhabi, I work with companies across Dubai and the wider UAE.",
    offerings: [
      {
        title: "AI Voice Agents",
        desc: "End-to-end voice AI systems with natural conversation flow, intent recognition, and CRM integration. Currently powering call centers for Audi, Porsche, and Volkswagen dealerships.",
      },
      {
        title: "NLP & Text Intelligence",
        desc: "Custom text classification, sentiment analysis, and information extraction pipelines. Built for high-throughput, low-latency production environments.",
      },
      {
        title: "Intelligent Automation",
        desc: "Workflow automation that replaces manual processes with AI-driven decision making. Reduce headcount on repetitive tasks without sacrificing quality.",
      },
      {
        title: "ML Model Deployment",
        desc: "Taking models from research to production with proper MLOps: monitoring, A/B testing, versioning, and scaling on AWS or GCP.",
      },
    ],
    stack: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "OpenAI API",
      "LangChain",
      "FastAPI",
      "Redis",
      "AWS SageMaker",
      "Docker",
    ],
    projects: [
      {
        name: "Ali & Sons Voice Agent",
        slug: "ali-and-sons-voice-agent",
        oneLiner:
          "AI voice system handling 1000+ daily calls for Audi, Porsche & VW dealerships",
      },
      {
        name: "AegisUAE Crisis Dashboard",
        slug: "aegis-uae",
        oneLiner:
          "Real-time crisis intelligence with NLP-powered threat classification",
      },
    ],
    icon: "ai",
  },
  "full-stack-developer-uae": {
    title: "Full Stack Developer in UAE",
    metaTitle:
      "Full Stack Developer UAE | Vivek Kumar Singh | Next.js, React, Node.js",
    metaDescription:
      "Top-rated full stack developer in the UAE. 20+ production systems delivered for BSE, NSDL, Audi & more. Expert in Next.js, React, Node.js, Python. Available for hire in Dubai & Abu Dhabi.",
    heroLine: "Full-Stack Development",
    heroAccent: "Across the UAE",
    intro: "I'm a full-stack developer with 4+ years of production experience, based in Abu Dhabi and serving clients across the UAE. I've shipped 20+ systems spanning fintech platforms for stock exchanges, AI-powered dashboards for automotive groups, and SaaS products for startups. I own the entire stack, from database design to pixel-perfect frontends to deployment pipelines.",
    offerings: [
      {
        title: "Web Applications",
        desc: "High-performance web apps built with Next.js, React, and Node.js. Server-side rendering, real-time features, and scalable architecture from day one.",
      },
      {
        title: "API & Backend Systems",
        desc: "RESTful and GraphQL APIs with Node.js, Express, or .NET Core. Database design, caching strategies, and authentication that actually scales.",
      },
      {
        title: "SaaS Products",
        desc: "End-to-end SaaS development from MVP to scale. Multi-tenancy, billing integration, analytics dashboards, and the infrastructure to support growth.",
      },
      {
        title: "System Architecture",
        desc: "Designing systems that handle real traffic. Microservices, event-driven architecture, and cloud infrastructure on AWS or Azure.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      ".NET Core",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
    projects: [
      {
        name: "BSE StAR MF Platform",
        slug: "bse-star-mf",
        oneLiner:
          "Fintech platform processing mutual fund transactions for India's premier stock exchange",
      },
      {
        name: "Anonymous Command Center",
        slug: "anonymous-command-center",
        oneLiner:
          "Unified operations dashboard for a luxury automotive group",
      },
    ],
    icon: "web",
  },
  "web-developer-abu-dhabi": {
    title: "Web Developer in Abu Dhabi",
    metaTitle:
      "Web Developer Abu Dhabi | Vivek Kumar Singh | Modern Web Applications",
    metaDescription:
      "Professional web developer in Abu Dhabi building fast, accessible websites and web applications. Expert in Next.js, React, TypeScript. Serving Abu Dhabi businesses and government entities.",
    heroLine: "Web Development",
    heroAccent: "in Abu Dhabi",
    intro: "Abu Dhabi is where I live and work. I build modern, fast, and accessible web experiences for businesses across the capital, from corporate portals to customer-facing platforms. Every site I build is optimized for performance, SEO, and conversion, built on modern frameworks that scale with your business.",
    offerings: [
      {
        title: "Corporate Websites",
        desc: "Professional, fast-loading websites that rank well on Google and convert visitors. Built with Next.js for optimal SEO and performance.",
      },
      {
        title: "E-Commerce Platforms",
        desc: "Custom e-commerce solutions with payment integration, inventory management, and analytics. Tailored to UAE market requirements.",
      },
      {
        title: "Progressive Web Apps",
        desc: "App-like web experiences that work offline, send push notifications, and install on any device. One codebase, every platform.",
      },
      {
        title: "Performance Optimization",
        desc: "Audit and optimize slow websites. Core Web Vitals improvements, code splitting, image optimization, and caching strategies.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Vercel",
      "Cloudflare",
    ],
    projects: [
      {
        name: "Ali & Sons Intranet",
        slug: "ali-and-sons-intranet",
        oneLiner:
          "Enterprise intranet portal for a 2000+ employee automotive group",
      },
      {
        name: "Portfolio V2",
        slug: "portfolio-v2",
        oneLiner:
          "This very site: 3D elements, glass morphism, dark theme, 100 Lighthouse score",
      },
    ],
    icon: "globe",
  },
  "react-developer-dubai": {
    title: "React Developer in Dubai",
    metaTitle:
      "React Developer Dubai | Vivek Kumar Singh | React, Next.js, TypeScript",
    metaDescription:
      "Senior React developer in Dubai with 4+ years building complex SPAs, dashboards, and web apps. Expert in React 19, Next.js, TypeScript, and state management. Hire me for your next project.",
    heroLine: "React Development",
    heroAccent: "in Dubai",
    intro: "React is my primary frontend framework, and I've been building with it since the class component days. Today, I work with React 19, Server Components, and the latest Next.js App Router to build interfaces that are fast, accessible, and maintainable. From real-time dashboards to complex multi-step forms, I know how to architect React applications that don't fall apart at scale.",
    offerings: [
      {
        title: "Complex Dashboards",
        desc: "Data-heavy dashboards with real-time updates, charts, tables, and filtering. Built for performance with virtualization and memoization where it matters.",
      },
      {
        title: "Component Libraries",
        desc: "Reusable, accessible component systems with Storybook documentation. Design system implementation that your team can build on.",
      },
      {
        title: "Next.js Applications",
        desc: "Full Next.js applications with App Router, Server Components, ISR, and API routes. The framework I reach for when SEO and performance both matter.",
      },
      {
        title: "Migration & Modernization",
        desc: "Migrating legacy Angular, jQuery, or class-component React apps to modern React with hooks, TypeScript, and current best practices.",
      },
    ],
    stack: [
      "React 19",
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "Framer Motion",
      "Three.js",
      "Storybook",
    ],
    projects: [
      {
        name: "Anonymous Command Center",
        slug: "anonymous-command-center",
        oneLiner:
          "Multi-module operations dashboard with complex state management",
      },
      {
        name: "CMS Info Systems Dashboard",
        slug: "cms-dashboard",
        oneLiner:
          "ATM monitoring dashboard tracking 50,000+ machines nationwide",
      },
    ],
    icon: "code",
  },
  "nodejs-developer-uae": {
    title: "Node.js Developer in UAE",
    metaTitle:
      "Node.js Developer UAE | Vivek Kumar Singh | APIs, Microservices, Real-Time",
    metaDescription:
      "Experienced Node.js developer in the UAE building scalable APIs, microservices, and real-time systems. Expert in Express, NestJS, MongoDB, PostgreSQL. Available across Dubai & Abu Dhabi.",
    heroLine: "Node.js Development",
    heroAccent: "in the UAE",
    intro: "Node.js is the backbone of most systems I build. I use it for everything from REST APIs and WebSocket servers to background job processors and data pipelines. With experience building backends that serve automotive dealerships, stock exchanges, and crisis management systems, I know how to design Node.js services that handle real production load without falling over.",
    offerings: [
      {
        title: "API Development",
        desc: "RESTful and GraphQL APIs with Express or NestJS. Input validation, rate limiting, authentication, and comprehensive error handling built in.",
      },
      {
        title: "Real-Time Systems",
        desc: "WebSocket servers, Server-Sent Events, and pub/sub architectures for live dashboards, chat systems, and notification services.",
      },
      {
        title: "Microservices",
        desc: "Breaking monoliths into maintainable microservices with proper service boundaries, message queues, and distributed tracing.",
      },
      {
        title: "Database Architecture",
        desc: "MongoDB schema design, PostgreSQL optimization, Redis caching strategies, and data migration planning for growing applications.",
      },
    ],
    stack: [
      "Node.js",
      "Express",
      "NestJS",
      "TypeScript",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "AWS",
    ],
    projects: [
      {
        name: "BSE StAR MF Platform",
        slug: "bse-star-mf",
        oneLiner:
          "High-throughput API handling mutual fund transactions for BSE",
      },
      {
        name: "AegisUAE Backend",
        slug: "aegis-uae",
        oneLiner:
          "Real-time data ingestion pipeline processing 15+ intelligence sources",
      },
    ],
    icon: "server",
  },
  "fintech-developer-dubai": {
    title: "Fintech Developer in Dubai",
    metaTitle:
      "Fintech Developer Dubai | Vivek Kumar Singh | Payment Systems, Trading Platforms",
    metaDescription:
      "Fintech developer in Dubai with hands-on experience building platforms for BSE & NSDL. Payment processing, trading systems, regulatory compliance. Hire me for fintech projects in the UAE.",
    heroLine: "Fintech Development",
    heroAccent: "in Dubai & UAE",
    intro: "I've built production fintech systems for some of India's largest financial institutions, the Bombay Stock Exchange and National Securities Depository. That experience taught me what most developers learn the hard way: in fintech, there's no room for 'it works on my machine.' Every transaction matters. Every edge case is a potential regulatory issue. I bring that discipline to fintech projects in the UAE.",
    offerings: [
      {
        title: "Payment Processing",
        desc: "Payment gateway integrations, subscription billing, escrow systems, and reconciliation pipelines. PCI-DSS compliant architectures.",
      },
      {
        title: "Trading & Investment Platforms",
        desc: "Order management systems, portfolio tracking dashboards, and mutual fund platforms. Built for accuracy and audit compliance.",
      },
      {
        title: "Regulatory Reporting",
        desc: "Automated compliance reporting, KYC/AML workflows, and audit trail systems that meet UAE Central Bank and SCA requirements.",
      },
      {
        title: "Financial Dashboards",
        desc: "Real-time financial analytics dashboards with complex visualizations, drill-down capabilities, and export functionality.",
      },
    ],
    stack: [
      "Node.js",
      ".NET Core",
      "React",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "AWS",
      "Python",
    ],
    projects: [
      {
        name: "BSE StAR MF Platform",
        slug: "bse-star-mf",
        oneLiner:
          "Mutual fund distribution platform for the Bombay Stock Exchange",
      },
      {
        name: "NSDL E-Governance",
        slug: "nsdl-e-governance",
        oneLiner:
          "Digital governance platform for India's central securities depository",
      },
    ],
    icon: "fintech",
  },
};

const SLUGS = Object.keys(SERVICES);

const iconMap: Record<string, React.ReactNode> = {
  ai: <Brain className="w-8 h-8" />,
  web: <Globe className="w-8 h-8" />,
  mobile: <Smartphone className="w-8 h-8" />,
  server: <Server className="w-8 h-8" />,
  fintech: <CreditCard className="w-8 h-8" />,
  code: <Code2 className="w-8 h-8" />,
  globe: <Globe className="w-8 h-8" />,
};

// ── Static Params ──
export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

// ── Metadata ──
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const s = SERVICES[slug];
    if (!s) return { title: "Service Not Found" };
    return {
      title: s.metaTitle,
      description: s.metaDescription,
      openGraph: {
        title: s.metaTitle,
        description: s.metaDescription,
        type: "website",
        locale: "en_AE",
        siteName: "Vivek Kumar Singh",
        url: `https://reachvivek.vercel.app/services/${slug}`,
      },
      alternates: {
        canonical: `https://reachvivek.vercel.app/services/${slug}`,
      },
    };
  });
}

// ── Page ──
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = SERVICES[slug];

  if (!s) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link href="/" className="text-gold hover:underline">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.metaDescription,
    provider: {
      "@type": "Person",
      name: "Vivek Kumar Singh",
      url: "https://reachvivek.vercel.app",
    },
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    url: `https://reachvivek.vercel.app/services/${slug}`,
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <a
            href="https://calendly.com/rogerthatvivek/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8">
            {iconMap[s.icon] || <Globe className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {s.heroLine}
            <br />
            <span className="gradient-text">{s.heroAccent}</span>
          </h1>
          <p className="mt-6 text-white/50 text-base sm:text-lg leading-relaxed max-w-3xl">
            {s.intro}
          </p>
        </div>
      </section>

      {/* What I Offer */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            What I <span className="gradient-text">Offer</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.offerings.map((o) => (
              <div
                key={o.title}
                className="glass glass-hover rounded-xl p-6 transition-all hover:border-gold/15"
              >
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <h3 className="text-base font-semibold">{o.title}</h3>
                </div>
                <p className="text-sm text-white/40 ml-8">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {s.stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg glass text-sm text-white/60 border border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="glass glass-hover rounded-xl p-6 group transition-all hover:border-gold/15 card-lift block"
              >
                <h3 className="text-base font-semibold group-hover:text-gold transition-colors flex items-center gap-2">
                  {p.name}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-white/40 mt-1">{p.oneLiner}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 sm:p-14 border border-gold/10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to <span className="gradient-text">Start</span>?
            </h2>
            <p className="text-white/40 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Let&apos;s discuss your project. I typically respond within a few
              hours and can start within a week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://calendly.com/rogerthatvivek/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-[0_0_30px_rgba(212,168,83,0.3)]"
              >
                Book a Free Call
              </a>
              <Link
                href="/#contact"
                className="px-8 py-3.5 rounded-xl border border-white/10 text-sm font-medium hover:border-gold/30 hover:text-gold transition-all"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
