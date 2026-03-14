import mongoose from "mongoose";

const MONGODB_URI =
  "REDACTED";

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  date: String,
  location: String,
  highlights: [String],
  tags: [String],
  order: { type: Number, default: 0 },
});

const Experience =
  mongoose.models.Experience ||
  mongoose.model("Experience", experienceSchema);

const experiences = [
  {
    title: "Full-Stack Developer & AI Engineer",
    company: "Ali and Sons",
    date: "Jan 2026 – Present",
    location: "Abu Dhabi, UAE",
    highlights: [
      "Building AI-powered internal tools and voice agents for Audi, Porsche & VW dealerships, automating 60%+ of routine customer queries.",
      "Architecting full-stack applications with Next.js, MongoDB, and Tailwind CSS, delivering MVPs in under 2 weeks.",
      "Developing luxury portfolio sites with integrated admin panels, CRM, and analytics dashboards serving 10+ group brands.",
    ],
    tags: ["Next.js", "MongoDB", "AI", "Tailwind CSS"],
    order: 0,
  },
  {
    title: "Lead Full-Stack Engineer",
    company: "Azaya Marketing",
    date: "Oct 2025 – Jan 2026",
    location: "Dubai, UAE",
    highlights: [
      "Led architecture and delivery of production-grade MT5 trading platforms with 99.9% uptime for UAE-licensed brokers.",
      "Integrated three regional payment gateways (e& Payments, N-Genius, MyFatoorah), reducing deposit processing from 2 hours to 15 minutes.",
      "Engineered SignFlow, a DocuSign alternative for broker compliance, saving AED 12K+ annually.",
      "Architected a 3D Virtual Expo platform with interactive booths, ticketing, and conference room booking.",
    ],
    tags: ["MT5", "React", "Node.js", "Payment Gateways", "Three.js"],
    order: 1,
  },
  {
    title: "Software Developer",
    company: "Indian Clearing Corporation Limited (ICCL)",
    date: "Jul 2025 – Oct 2025",
    location: "Mumbai, India",
    highlights: [
      "Revamped critical clearing systems (EFDR, EPN, Trade APIs) processing ₹2L+ Cr daily transaction volume.",
      "Designed scalable APIs with microservices and event-driven architecture, reducing API response times by 35%.",
      "Migrated 3 legacy applications to cloud-native architectures with containerized deployments on AWS.",
    ],
    tags: [".NET Core", "Angular", "Microservices", "AWS"],
    order: 2,
  },
  {
    title: "Software Developer",
    company: "Bombay Stock Exchange (BSE)",
    date: "Jan 2025 – Oct 2025",
    location: "Mumbai, India",
    highlights: [
      "Built data delivery platform for BSE Data Services, handling 5TB+ datasets with sub-minute delivery via AWS S3 cross-account transfers.",
      "Developed data catalog portal serving 500+ institutional subscribers with Node.js, Angular, and PostgreSQL.",
      "Enabled instant download of 20+ years of historical market data with subscription-based automated delivery.",
    ],
    tags: ["Node.js", "Angular", "AWS S3", "PostgreSQL"],
    order: 3,
  },
  {
    title: "Software Developer",
    company: "NSDL (National Securities Depository Limited)",
    date: "Feb 2025 – Apr 2025",
    location: "Mumbai, India",
    highlights: [
      "Led end-to-end development of the FPI (Foreign Portfolio Investors) Portal used by 10,000+ registered foreign investors.",
      "Designed 25+ REST APIs with modular components adhering to clean architecture principles.",
      "Established CI/CD pipelines cutting deployment time from 4 hours to 20 minutes; mentored a 5-member dev team.",
    ],
    tags: ["Angular", ".NET", "CI/CD", "Clean Architecture"],
    order: 4,
  },
  {
    title: "Software Developer",
    company: "CMS Info Systems (via Oneture Technologies)",
    date: "Apr 2024 – Jun 2025",
    location: "Mumbai, India",
    highlights: [
      "Built Clearpay Portal from scratch, consolidating ₹50Cr+ in partner bank penalties and reducing reconciliation time by 70%.",
      "Developed Fleet Management System tracking 2,000+ vehicles with approval workflows, Fastag expenses, and fuel analytics.",
      "Created data processing tools automating Excel/CSV extraction into MySQL dashboards, saving 15+ manual hours weekly.",
    ],
    tags: [".NET Core", "Angular", "MySQL", "AWS"],
    order: 5,
  },
  {
    title: "Software Developer",
    company: "Oneture Technologies",
    date: "Apr 2024 – Oct 2025",
    location: "Mumbai, India",
    highlights: [
      "Delivered 8+ production applications for enterprise clients (BSE, NSDL, CMS, ICCL) using .NET Core, Angular, and AWS.",
      "Maintained 95%+ code quality scores with seamless frontend-backend integration across all projects.",
      "Managed 3-4 concurrent client engagements, collaborating with cross-functional teams of 15+ members.",
    ],
    tags: [".NET Core", "Angular", "AWS", "Enterprise"],
    order: 6,
  },
  {
    title: "Full-Stack Developer",
    company: "Blackcurrant Labs Pvt. Ltd.",
    date: "Nov 2021 – Mar 2024",
    location: "Mumbai, India",
    highlights: [
      "Built microservices for Hoopr.AI music licensing platform, processing 10K+ monthly transactions via AWS Lambda.",
      "Developed Emit timesheet app with hashtag-based task clustering, adopted by 200+ employees across 3 companies.",
      "Created ML-based audio recognition module achieving 92% accuracy for copyright detection at Hoopr.AI.",
      "Developed responsive Angular components for Azmeel Contracting's ₹500Cr+ enterprise platform.",
    ],
    tags: ["AWS Lambda", "Angular", "Node.js", "ML", "Microservices"],
    order: 7,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Experience.deleteMany({});
  console.log("Cleared existing experiences");

  await Experience.insertMany(experiences);
  console.log(`Seeded ${experiences.length} experiences`);

  // Update navLinks to include Experience
  const SiteConfig =
    mongoose.models.SiteConfig ||
    mongoose.model(
      "SiteConfig",
      new mongoose.Schema({
        key: { type: String, unique: true },
        value: mongoose.Schema.Types.Mixed,
      })
    );

  const navDoc = await SiteConfig.findOne({ key: "navLinks" });
  if (navDoc) {
    const links = navDoc.value as Array<{ name: string; href: string }>;
    const hasExperience = links.some((l) => l.name === "Experience");
    if (!hasExperience) {
      // Insert Experience after Work
      const workIdx = links.findIndex((l) => l.name === "Work");
      const insertAt = workIdx >= 0 ? workIdx + 1 : links.length - 1;
      links.splice(insertAt, 0, { name: "Experience", href: "#experience" });
      await SiteConfig.updateOne({ key: "navLinks" }, { value: links });
      console.log("Added Experience to navLinks");
    }
  }

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch(console.error);
