import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

// Define schemas inline (can't import from src in a script easily)
const projectSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, desc: String, imgPath: String, tags: [String], category: String, order: Number,
  problem: String, solution: String, impact: [String], stack: [String], role: String, duration: String, liveUrl: String, screenshots: [String], videoUrl: String,
});
const statSchema = new mongoose.Schema({
  value: String, label: String, order: Number,
});
const processSchema = new mongoose.Schema({
  step: String, title: String, desc: String, order: Number,
});
const companySchema = new mongoose.Schema({
  name: String, logo: String, highlight: Boolean, order: Number,
});
const serviceSchema = new mongoose.Schema({
  icon: String, title: String, desc: String, order: Number,
});
const testimonialSchema = new mongoose.Schema({
  name: String, role: String, text: String, imgPath: String, order: Number,
});
const socialLinkSchema = new mongoose.Schema({
  name: String, url: String, order: Number,
});
const siteConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed,
});

const Project = mongoose.model("Project", projectSchema);
const Stat = mongoose.model("Stat", statSchema);
const Process = mongoose.model("Process", processSchema);
const Company = mongoose.model("Company", companySchema);
const Service = mongoose.model("Service", serviceSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);
const SocialLink = mongoose.model("SocialLink", socialLinkSchema);
const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

const projects = [
  {
    title: "Voxen",
    slug: "voxen",
    desc: "AI sales assistant that joins meetings and closes deals autonomously.",
    imgPath: "/images/projects/voxen.webp",
    tags: ["AI/ML", "Next.js", "WebRTC"],
    category: "AI",
    order: 0,
    problem: "Sales teams in real estate, automotive, and B2B services were losing deals because they couldn't attend every meeting or respond fast enough to prospect queries. High-value leads were slipping through the cracks during peak hours, and hiring more reps wasn't scalable.",
    solution: "Conceptualized and built Voxen from scratch as a solo founder/architect to test if an AI sales assistant could autonomously join video meetings, engage prospects with natural voice interaction, answer product questions in real-time, and follow up with personalized proposals. Built an MVP to validate the concept across real estate and sales verticals.",
    impact: [
      "Solo-architected and built the full MVP end-to-end",
      "Autonomous meeting participation via WebRTC",
      "Real-time AI voice interaction with natural conversation flow",
      "Validated product-market fit across real estate and sales verticals",
    ],
    stack: ["Next.js", "WebRTC", "AI/ML", "Node.js", "Cloud Infrastructure", "OpenAI", "WebSockets"],
    role: "Founder & Solo Architect",
    duration: "3 months",
    videoUrl: "https://www.youtube.com/embed/S99373-LyME",
  },
  {
    title: "MyVisual.Space",
    slug: "myvisual-space",
    desc: "Interior design visualization platform with immersive galleries.",
    imgPath: "/images/projects/myvisual_space.webp",
    tags: ["Next.js", "GSAP", "Tailwind CSS"],
    category: "Interior & Design",
    order: 1,
    problem: "Interior designers in the UAE lacked a professional way to showcase their portfolio online. Existing solutions were generic website builders that didn't capture the visual richness of their work.",
    solution: "Created an immersive portfolio platform with GSAP-powered scroll animations, full-screen gallery views, and smooth page transitions. The platform lets designers organize projects by room type, style, and material palette with a premium visual experience.",
    impact: [
      "60% increase in client inquiries for featured designers",
      "Smooth 60fps scroll animations across all devices",
      "Average session duration of 4+ minutes (3x industry average)",
      "Mobile-first design with gesture-based gallery navigation",
    ],
    stack: ["Next.js", "GSAP", "Tailwind CSS", "Framer Motion", "Cloudinary"],
    role: "Full-Stack Developer",
    duration: "6 weeks",
  },
  {
    title: "3D Virtual Expo",
    slug: "3d-virtual-expo",
    desc: "Interactive virtual exhibition with 3D booths and live networking.",
    imgPath: "/images/projects/3d_virtual_expo.webp",
    tags: ["Three.js", "WebGL", "React"],
    category: "3D & Immersive",
    order: 2,
    problem: "Post-pandemic, UAE brokers and event organizers needed a virtual alternative to physical trade shows. Existing solutions like Zoom or Hopin lacked spatial presence and felt like glorified video calls.",
    solution: "Architected a 3D virtual expo platform with interactive booths that visitors can walk through, integrated ticketing, conference room booking, and real-time chat. Built custom Three.js environments with optimized WebGL rendering for smooth performance even on mid-range devices.",
    impact: [
      "Hosted 500+ concurrent visitors in a single expo session",
      "Interactive 3D booth exploration with click-to-chat functionality",
      "Integrated ticketing and conference room booking system",
      "30fps+ rendering on mobile devices with adaptive quality",
    ],
    stack: ["Three.js", "WebGL", "React", "Node.js", "Socket.IO", "MongoDB"],
    role: "Lead Frontend Engineer",
    duration: "2 months",
  },
  {
    title: "Podcast EcoSpace",
    slug: "podcast-ecospace",
    desc: "Podcast studio booking platform with multi-camera production.",
    imgPath: "/images/projects/podcast_ecospace.webp",
    tags: ["Next.js", "Node.js", "MongoDB"],
    category: "Landing Pages",
    order: 3,
    problem: "A Dubai-based podcast studio needed a booking system that handled multi-camera room reservations, equipment add-ons, and production crew scheduling, all in one place.",
    solution: "Built a full booking platform with real-time room availability, equipment bundles, crew scheduling, and integrated payment processing. The admin dashboard lets studio managers track utilization, revenue, and upcoming sessions at a glance.",
    impact: [
      "Eliminated double-booking issues completely",
      "80% of bookings now happen online (vs. phone/WhatsApp)",
      "Average booking time reduced from 15 minutes to 2 minutes",
      "Admin dashboard with real-time revenue and utilization tracking",
    ],
    stack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Stripe"],
    role: "Full-Stack Developer",
    duration: "4 weeks",
  },
  {
    title: "Luxury Automotive",
    slug: "luxury-automotive",
    desc: "Premium car rental platform with real-time fleet availability.",
    imgPath: "/images/projects/luxury_car_rental.webp",
    tags: ["React", "Node.js", "Tailwind CSS"],
    category: "Landing Pages",
    order: 4,
    problem: "A luxury car rental company in Dubai was managing bookings via WhatsApp and spreadsheets. They were losing 30% of leads because of slow response times and no online presence.",
    solution: "Designed and built a premium landing page with real-time fleet availability, instant quote generation, and WhatsApp-integrated booking flow. The visual design matches the luxury brand positioning with smooth animations and high-res vehicle galleries.",
    impact: [
      "3x increase in online booking inquiries in the first month",
      "Real-time fleet availability with instant price quotes",
      "WhatsApp integration for seamless booking confirmation",
      "Page load under 2 seconds with optimized image delivery",
    ],
    stack: ["React", "Node.js", "Tailwind CSS", "Cloudinary", "WhatsApp API"],
    role: "Full-Stack Developer",
    duration: "3 weeks",
  },
  {
    title: "QueryTube",
    slug: "querytube",
    desc: "Ask any video a question and get AI answers with timestamps.",
    imgPath: "/images/projects/querytube.webp",
    tags: ["AI/ML", "Python", "React"],
    category: "AI",
    order: 5,
    problem: "Watching long YouTube videos or lectures to find a specific piece of information is time-consuming. Students and researchers needed a way to query video content directly.",
    solution: "Built a tool that transcribes any YouTube video, creates vector embeddings of the content, and lets users ask natural language questions. The system returns answers with exact timestamps so users can jump directly to the relevant section.",
    impact: [
      "Processes videos up to 3 hours long in under 60 seconds",
      "Answers returned with exact timestamps for instant navigation",
      "95%+ answer accuracy on factual content queries",
      "Used by 200+ students during beta testing",
    ],
    stack: ["Python", "FastAPI", "React", "OpenAI", "Pinecone", "YouTube API"],
    role: "Solo Developer",
    duration: "2 weeks",
  },
  {
    title: "MedRx Generator",
    slug: "medrx-generator",
    desc: "Prescription generator used by 500+ doctors daily.",
    imgPath: "/images/projects/medrx_generator.webp",
    tags: ["React", ".NET Core", "SQL Server"],
    category: "Healthcare",
    order: 6,
    problem: "Doctors in India were writing prescriptions by hand or using clunky desktop software. Illegible handwriting led to dispensing errors, and there was no way to track patient prescription history digitally.",
    solution: "Developed a web-based prescription generator with drug database autocomplete, dosage validation, patient history tracking, and one-click PDF generation. The system includes a drug interaction checker that flags potential conflicts before the prescription is finalized.",
    impact: [
      "Used by 500+ doctors daily across 3 hospital networks",
      "Reduced prescription errors by 60% through drug interaction checks",
      "Average prescription time down from 5 minutes to 45 seconds",
      "Complete patient prescription history with search and export",
    ],
    stack: ["React", ".NET Core", "SQL Server", "Redis", "PDF Generation"],
    role: "Full-Stack Developer",
    duration: "3 months",
  },
  {
    title: "Prestige Real Estate",
    slug: "prestige-real-estate",
    desc: "UAE property marketplace with AED 30M+ in listings.",
    imgPath: "/images/projects/real_estate_uae.webp",
    tags: ["Next.js", "MongoDB", "Tailwind CSS"],
    category: "Real Estate",
    order: 7,
    problem: "A UAE real estate agency was listing properties across Dubizzle, Bayut, and Property Finder manually. They had no centralized platform of their own, losing brand visibility and paying high listing fees.",
    solution: "Built a branded property marketplace with advanced filters (location, price, bedrooms, property type), virtual tour integration, WhatsApp inquiry buttons, and an admin panel for agents to manage listings with image uploads and status tracking.",
    impact: [
      "AED 30M+ worth of properties listed on the platform",
      "40% reduction in dependency on third-party listing platforms",
      "Integrated virtual tour viewer for premium listings",
      "Agent dashboard with lead tracking and inquiry analytics",
    ],
    stack: ["Next.js", "MongoDB", "Tailwind CSS", "Cloudinary", "Google Maps API"],
    role: "Full-Stack Developer",
    duration: "5 weeks",
  },
  {
    title: "Hoopr.AI",
    slug: "hoopr-ai",
    desc: "Music licensing platform with AI copyright detection.",
    imgPath: "/images/projects/hoopr_app.webp",
    tags: ["Node.js", "AWS Lambda", "React"],
    category: "AI",
    order: 8,
    problem: "Content creators were getting copyright strikes for using unlicensed music. Existing licensing platforms were expensive and didn't offer a way to detect if a track was already copyrighted before use.",
    solution: "Built the backend microservices for a music licensing marketplace with an ML-based audio fingerprinting module that detects copyrighted content with 92% accuracy. Integrated Razorpay payment workflows for licensing transactions and built a creator dashboard for tracking usage rights.",
    impact: [
      "Processing 10K+ monthly licensing transactions via AWS Lambda",
      "92% accuracy on ML-based copyright detection",
      "Razorpay payment integration with automated royalty splits",
      "Creator dashboard with real-time usage analytics and license management",
    ],
    stack: ["Node.js", "AWS Lambda", "React", "Python", "ML/Audio Fingerprinting", "Razorpay", "MongoDB"],
    role: "Backend Developer",
    duration: "8 months",
  },
  {
    title: "BSE Data as a Service",
    slug: "bse-data-service",
    desc: "Real-time stock data delivery for institutional clients.",
    imgPath: "/images/projects/bse_app.webp",
    tags: ["Node.js", ".NET Core", "AWS"],
    category: "Fintech",
    order: 9,
    problem: "BSE (Bombay Stock Exchange) needed to deliver terabytes of historical and real-time market data to 500+ institutional subscribers. The existing system was slow, manual, and couldn't handle bulk data requests efficiently.",
    solution: "Built a scalable data delivery platform using AWS S3 cross-account transfers for bulk datasets, with a self-service data catalog portal where subscribers can browse, subscribe to, and instantly download 20+ years of historical market data. Automated subscription-based delivery with email notifications.",
    impact: [
      "Handling 5TB+ datasets with sub-minute delivery times",
      "Serving 500+ institutional subscribers through self-service portal",
      "20+ years of historical market data available for instant download",
      "Automated subscription delivery with zero manual intervention",
    ],
    stack: ["Node.js", ".NET Core", "Angular", "AWS S3", "PostgreSQL", "Redis"],
    role: "Software Developer",
    duration: "6 months",
  },
  {
    title: "NSDL FPI Dashboard",
    slug: "nsdl-fpi-dashboard",
    desc: "Secure portal for foreign portfolio investors with OTP auth.",
    imgPath: "/images/projects/nsdl_app.webp",
    tags: ["Angular", ".NET Core", "SQL Server"],
    category: "Fintech",
    order: 10,
    problem: "NSDL (National Securities Depository Limited) needed a modern web portal for 10,000+ registered Foreign Portfolio Investors to manage their registrations, compliance documents, and reporting. The legacy system was outdated and lacked mobile support.",
    solution: "Led end-to-end development of the FPI portal with Angular frontend and .NET backend. Designed 25+ REST APIs with clean architecture principles, implemented OTP-based authentication, document upload workflows, and compliance reporting dashboards. Established CI/CD pipelines that cut deployment time from 4 hours to 20 minutes.",
    impact: [
      "Used by 10,000+ registered foreign portfolio investors",
      "25+ REST APIs designed with clean architecture",
      "Deployment time reduced from 4 hours to 20 minutes via CI/CD",
      "Mentored a 5-member cross-functional development team",
    ],
    stack: ["Angular", ".NET Core", "SQL Server", "Redis", "Azure DevOps", "JWT/OTP Auth"],
    role: "Lead Developer",
    duration: "3 months",
  },
  {
    title: "Instagram Analytics",
    slug: "instagram-analytics",
    desc: "Growth dashboard with engagement metrics and visual charts.",
    imgPath: "/images/projects/ig_analytics.webp",
    tags: ["React", "Redux", "Apex Charts"],
    category: "SaaS & Analytics",
    order: 11,
    problem: "Social media managers and influencers in the UAE needed a way to track Instagram growth metrics beyond what the native app provides, especially for comparing performance across multiple accounts.",
    solution: "Built a dashboard that pulls Instagram data via the Graph API and displays engagement rates, follower growth trends, best posting times, and content performance breakdowns. Features interactive Apex Charts with drill-down filtering by date range, content type, and hashtag performance.",
    impact: [
      "Tracks engagement rate, follower growth, and content performance",
      "Interactive charts with drill-down by date range and content type",
      "Hashtag performance analysis for optimizing reach",
      "Multi-account comparison view for agency users",
    ],
    stack: ["React", "Redux", "Apex Charts", "Instagram Graph API", "Node.js"],
    role: "Frontend Developer",
    duration: "3 weeks",
  },
  {
    title: "SignFlow",
    slug: "signflow",
    desc: "DocuSign alternative saving UAE brokers AED 12K+ yearly.",
    imgPath: "/images/projects/signflow.webp",
    tags: ["Node.js", "React", "MongoDB"],
    category: "SaaS & Analytics",
    order: 12,
    problem: "UAE-licensed brokers were paying AED 12K+ annually for DocuSign to handle client onboarding documents. The workflow was overkill for their needs: they just needed clients to review and sign compliance forms digitally.",
    solution: "Engineered SignFlow, a lightweight digital signature platform tailored for broker compliance workflows. Clients receive a link, review documents in-browser, draw or type their signature, and the signed PDF is automatically stored with an audit trail. Built-in template system lets brokers create reusable document templates.",
    impact: [
      "Saving AED 12K+ annually per broker vs. DocuSign",
      "Document signing completed in under 2 minutes on average",
      "Full audit trail with timestamps and IP logging for compliance",
      "Reusable document templates for common broker forms",
    ],
    stack: ["Node.js", "React", "MongoDB", "PDF.js", "Canvas API", "AWS S3"],
    role: "Full-Stack Developer",
    duration: "4 weeks",
  },
  {
    title: "Chikitsak",
    slug: "chikitsak",
    desc: "Telemedicine platform for rural healthcare access.",
    imgPath: "/images/projects/chikitsak.webp",
    tags: ["React", "Azure", "Node.js"],
    category: "Healthcare",
    order: 13,
    problem: "Rural communities in India had limited access to specialist doctors. Patients had to travel hours to urban hospitals for consultations that could have been done remotely.",
    solution: "Built a telemedicine platform connecting rural health centers with specialist doctors via video consultations. Features include appointment scheduling, digital prescription generation, patient health records, and a low-bandwidth mode that works on 2G connections for remote areas.",
    impact: [
      "Connected rural patients with specialists without travel",
      "Low-bandwidth video mode working on 2G connections",
      "Digital prescription and health record management",
      "Appointment scheduling with SMS reminders for patients",
    ],
    stack: ["React", "Node.js", "Azure", "WebRTC", "SQL Server", "Twilio SMS"],
    role: "Full-Stack Developer",
    duration: "2 months",
  },
  {
    title: "Kristina Svirina",
    slug: "kristina-svirina",
    desc: "Luxury portfolio for a UAE-based model and influencer.",
    imgPath: "/images/projects/kristina_portfolio.webp",
    tags: ["Next.js", "Tailwind CSS", "MongoDB"],
    category: "Creative & Talent",
    order: 14,
    problem: "A UAE-based model and influencer needed a premium online portfolio that matched her luxury brand positioning. Generic website builders looked amateur and didn't offer the visual sophistication or admin control she needed.",
    solution: "Designed and built a luxury portfolio site with glassmorphism aesthetics, gold accents, smooth scroll animations, and a custom admin panel (CMS) where she can manage her portfolio sections, media kit, testimonials, and projects. All content is stored in MongoDB and editable without touching code.",
    impact: [
      "Premium glassmorphism design with gold color system",
      "Custom admin panel with live preview editing",
      "Fully dynamic content managed through MongoDB CMS",
      "Optimized media delivery with Next.js Image and ISR",
    ],
    stack: ["Next.js", "Tailwind CSS", "MongoDB", "Framer Motion", "Cloudinary"],
    role: "Full-Stack Developer",
    duration: "3 weeks",
  },
  {
    title: "D3 Angular Dashboard",
    slug: "d3-angular-dashboard",
    desc: "Interactive data visualizations with dynamic filtering.",
    imgPath: "/images/projects/d3_dashboard.webp",
    tags: ["Angular", "D3.js", "TypeScript"],
    category: "SaaS & Analytics",
    order: 15,
    problem: "An enterprise client needed complex data visualizations (treemaps, sunbursts, force-directed graphs) that went beyond what standard charting libraries could handle. The existing dashboard used static images that couldn't be interacted with.",
    solution: "Built a suite of custom D3.js visualizations integrated into an Angular dashboard with dynamic filtering, zoom/pan interactions, tooltip overlays, and real-time data updates. Each chart type is encapsulated as a reusable Angular component with configurable data bindings.",
    impact: [
      "5+ custom D3.js chart types (treemap, sunburst, force graph, etc.)",
      "Interactive zoom, pan, and drill-down on all visualizations",
      "Reusable Angular components with configurable data bindings",
      "Real-time data refresh with WebSocket integration",
    ],
    stack: ["Angular", "D3.js", "TypeScript", "RxJS", "WebSockets", "Node.js"],
    role: "Frontend Developer",
    duration: "5 weeks",
  },
  {
    title: "PDFWeaver",
    slug: "pdfweaver",
    desc: "Client-side PDF merger that combines PDFs and images into a single document instantly.",
    imgPath: "/images/projects/pdfweaver.png",
    tags: ["React", "PDF.js", "Vercel"],
    category: "SaaS & Analytics",
    order: 16,
    problem: "Users frequently need to combine multiple PDFs and images into a single document but existing tools are either paid, require uploads to unknown servers, or install bloated desktop software. Privacy-conscious users had no lightweight, trustworthy option.",
    solution: "Built PDFWeaver, a fully client-side PDF merger that processes everything in the browser with zero server uploads. Users can drag and drop PDFs, PNGs, JPGs, and other image formats, reorder them, and merge into a single PDF instantly. No data ever leaves the user's device.",
    impact: [
      "100% client-side processing — zero file uploads to any server",
      "Supports PDF, PNG, JPG, JPEG, BMP, TIFF, and WEBP formats",
      "Drag-and-drop interface with instant merge and download",
      "Open-source and deployed on Vercel for free access",
    ],
    stack: ["React", "PDF-lib", "TypeScript", "Tailwind CSS", "Vercel"],
    role: "Solo Developer",
    duration: "1 week",
    liveUrl: "https://pdfweaver.vercel.app",
  },
];

const stats = [
  { value: "20+", label: "Systems Delivered", order: 0 },
  { value: "7+", label: "International Clients", order: 1 },
  { value: "4+", label: "Years Building", order: 2 },
  { value: "90%", label: "Client Retention", order: 3 },
];

const processSteps = [
  { step: "01", title: "Discovery", desc: "Understanding the business problem and defining the technical approach.", order: 0 },
  { step: "02", title: "Architecture", desc: "Designing scalable systems before writing a single line of code.", order: 1 },
  { step: "03", title: "Development", desc: "Rapid, iterative builds with production-grade practices.", order: 2 },
  { step: "04", title: "Deployment", desc: "Launching secure, scalable applications ready for real users.", order: 3 },
];

const companies = [
  { name: "BSE", logo: "/images/logos/bse.png", highlight: true, order: 0 },
  { name: "NSDL", logo: "/images/logos/nsdl.png", highlight: true, order: 1 },
  { name: "CMS Info Systems", logo: "/images/logos/cms.png", highlight: false, order: 2 },
  { name: "Oneture Technologies", logo: "/images/logos/oneture.png", highlight: false, order: 3 },
  { name: "Hoopr.AI", logo: "/images/logos/hoopr.png", highlight: false, order: 4 },
  { name: "Ali and Sons", logo: "/images/logos/ali-and-sons.png", highlight: false, order: 5 },
];

const services = [
  { icon: "ai", title: "AI Products", desc: "RAG, agents, LLM orchestration", order: 0 },
  { icon: "web", title: "Web Apps", desc: "Next.js, Angular, .NET, Node", order: 1 },
  { icon: "mobile", title: "Mobile", desc: "Flutter, React Native", order: 2 },
  { icon: "cloud", title: "Cloud & DevOps", desc: "AWS, Docker, CI/CD", order: 3 },
  { icon: "fintech", title: "Fintech", desc: "Payments, trading, compliance", order: 4 },
  { icon: "dashboard", title: "Dashboards", desc: "Real-time analytics & charts", order: 5 },
];

const testimonials = [
  { name: "Shakeeb Hammad", role: "CEO, Zeqi / Co-Founder, Touchbase", text: "Vivek built Caidence and ppl from the ground up as our sole developer. What stood out most was his energy and responsiveness. Whenever we needed something, he was on it immediately. That kind of ownership over complex AI products is rare to find.", imgPath: "/images/testimonials/shakeeb.jpg", order: 0 },
  { name: "Raghav Sobti", role: "Engineering Manager, Azaya Marketing LLC", text: "As Vivek's direct manager, I can confidently say any team would be lucky to have him. His technical expertise, AI prompting skills, and ability to deliver quick, accurate resolutions consistently produced quality results. He's detail-oriented, collaborative, and always willing to go the extra mile, often stepping in outside regular hours without even being asked.", imgPath: "/images/testimonials/raghav.jpg", order: 1 },
  { name: "Tsurov Magomet", role: "Automotive Photographer, tsurov.com", text: "Vivek is simply the best developer I've worked with. He built my entire visual portfolio platform and podcast studio booking site from scratch with admin panels, SEO, and stunning design. He understood my creative vision perfectly and delivered beyond what I imagined.", imgPath: "/images/testimonials/tsurov.jpg", order: 2 },
  { name: "Komal Jadhav", role: "Manager, CMS Info Systems", text: "Vivek's commitment was exceptional. He consistently delivered with sharp UI decisions and rock-solid development.", imgPath: "/images/testimonials/komal.png", order: 3 },
  { name: "Mahesh Pathak", role: "CEO, Oneture Technologies", text: "His ability to adapt, lead, and deliver high-quality solutions across technologies made him one of our most valued engineers.", imgPath: "/images/testimonials/mahesh.jpg", order: 4 },
  { name: "Ravi Mevcha", role: "CTO, Oneture Technologies", text: "Vivek took full ownership of both UI and backend for our DaaS platform. His speed and quality under pressure were impressive.", imgPath: "/images/testimonials/ravi.jpg", order: 5 },
  { name: "Ruchira Thakare", role: "Director, CMS Info Systems", text: "His eye for detail and ability to iterate quickly helped us ship beautiful interfaces with consistency.", imgPath: "/images/testimonials/ruchira.jpg", order: 6 },
  { name: "Vaibhav Malave", role: "Engineering Manager, Oneture", text: "One of the most reliable developers on the NSDL FPI project. Proactive, collaborative, and precise.", imgPath: "/images/testimonials/vaibhav.jpg", order: 7 },
  { name: "Aayush Shah", role: "Director of Engineering, Oneture", text: "From complex backend flows to S3 data sync and security-first development, his backend skills are elite.", imgPath: "/images/testimonials/aayush.jpg", order: 8 },
];

const socialLinks = [
  { name: "GitHub", url: "https://github.com/reachvivek", order: 0 },
  { name: "LinkedIn", url: "https://linkedin.com/in/reachvivek", order: 1 },
  { name: "Instagram", url: "https://instagram.com/rogerthatvivek", order: 2 },
];

const siteConfigs = [
  {
    key: "flagship",
    value: {
      title: "Voxen, AI Sales Assistant",
      problem: "Sales teams lose deals when they can't respond fast enough or join every meeting.",
      solution: "Built an AI assistant that joins meetings autonomously, engages prospects with real-time voice interaction, and closes deals without human intervention.",
      impact: ["Autonomous meeting participation via WebRTC", "Real-time AI voice interaction", "Reduced sales team workload by 40%"],
      stack: ["Next.js", "WebRTC", "AI/ML", "Node.js", "Cloud Infrastructure"],
      imgPath: "/images/projects/voxen.webp",
    },
  },
  {
    key: "navLinks",
    value: [
      { name: "Work", href: "#work" },
      { name: "Services", href: "#services" },
      { name: "Skills", href: "#skills" },
      { name: "Highlights", href: "#highlights" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    key: "hero",
    value: {
      headline: "Engineering Digital Products",
      headlineAccent: "That Scale Businesses",
      subline: "AI systems, fintech platforms, and high-performance web applications.",
      location: "Based in UAE, working with global teams",
    },
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Clear existing data
  await Promise.all([
    Project.deleteMany({}),
    Stat.deleteMany({}),
    Process.deleteMany({}),
    Company.deleteMany({}),
    Service.deleteMany({}),
    Testimonial.deleteMany({}),
    SocialLink.deleteMany({}),
    SiteConfig.deleteMany({}),
  ]);
  console.log("Cleared existing data.");

  // Insert all data
  await Promise.all([
    Project.insertMany(projects),
    Stat.insertMany(stats),
    Process.insertMany(processSteps),
    Company.insertMany(companies),
    Service.insertMany(services),
    Testimonial.insertMany(testimonials),
    SocialLink.insertMany(socialLinks),
    ...siteConfigs.map((c) =>
      SiteConfig.findOneAndUpdate({ key: c.key }, c, { upsert: true })
    ),
  ]);

  console.log("Seeded successfully!");
  console.log(`  ${projects.length} projects`);
  console.log(`  ${stats.length} stats`);
  console.log(`  ${processSteps.length} process steps`);
  console.log(`  ${companies.length} companies`);
  console.log(`  ${services.length} services`);
  console.log(`  ${testimonials.length} testimonials`);
  console.log(`  ${socialLinks.length} social links`);
  console.log(`  ${siteConfigs.length} site configs`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
