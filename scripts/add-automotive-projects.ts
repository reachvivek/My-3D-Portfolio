/**
 * Upserts Automotive category + XPENG UAE + Porsche Voice Agent projects
 * without wiping the rest of the MongoDB collection.
 *
 * Also migrates the existing "Luxury Automotive" entry from the "Landing Pages"
 * category into the new "Automotive" category and bumps subsequent project
 * orders by +2 so the new entries slot in after Podcast EcoSpace (order 3).
 *
 * Run once: `npx tsx scripts/add-automotive-projects.ts`
 * Idempotent: safe to re-run.
 */
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const projectSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  desc: String,
  imgPath: String,
  tags: [String],
  category: String,
  order: Number,
  problem: String,
  solution: String,
  impact: [String],
  stack: [String],
  role: String,
  duration: String,
  liveUrl: String,
  screenshots: [String],
  videoUrl: String,
});

const Project = mongoose.model("Project", projectSchema);

const xpengProject = {
  title: "XPENG UAE",
  slug: "xpeng-uae",
  desc:
    "Production retail site for XPENG (NYSE: XPEV) × Ali & Sons. Model pricing, trim toggles, EMI calculator, multi-location showroom listings, Arabic RTL mirror.",
  imgPath: "/images/projects/xpeng_uae.webp",
  tags: ["Static HTML", "Webflow", "JavaScript", "RTL/i18n"],
  category: "Automotive",
  order: 4,
  problem:
    "Ali & Sons (Gulf Star Motors) needed rapid, reliable updates to the UAE-facing XPENG marketing and lead-gen site — a legacy Webflow-generated HTML/JS codebase with no framework, no component system, and hundreds of deep-nested selectors. Updates came as high-pressure business-team asks: new model-year pricing, layout consolidation, trim removals, showroom additions — all expected to ship same-day without breaking the live site.",
  solution:
    "Operated as the on-call engineer for the brand. Shipped changes surgically across static HTML pages: full 2026/2027 pricing refresh across 4 model pages (X9, P7+, G6 Pro, G9 Pro) synced with trim toggles + EMI calculators, consolidated the new X9 layout into a single source file, removed marketing videos + EMI section on request, locked per-page test-drive car-selector dropdowns, added a second Abu Dhabi showroom with embedded Google Map. Each workstream shipped on its own feature branch with stakeholder-facing change logs and staged deploys.",
  impact: [
    "7 variant prices updated across 4 product pages + deployed live",
    "X9 page consolidated from two duplicate files to one canonical source",
    "Rapid same-day turnaround on multi-stakeholder requests (Jason — product, Amalee — regional ops)",
    "Feature-branch-per-request discipline with tracked pending work (PRICING_PENDING.md)",
    "Arabic RTL mirror site maintained in parallel",
  ],
  stack: [
    "Static HTML",
    "Webflow-generated CSS",
    "Vanilla JavaScript",
    "Google Maps Embed",
    "jQuery",
    "Ant Design form patterns",
  ],
  role: "On-call Developer",
  duration: "Ongoing",
};

const porscheProject = {
  title: "Porsche Voice Booking Agent",
  slug: "porsche-voice-agent",
  desc:
    "AI voice agent for dealership booking flows. Natural conversation, calendar integration, CRM handoff. Built for Ali & Sons × Porsche.",
  imgPath: "/images/projects/porsche_voice_agent.webp",
  tags: ["AI/ML", "Voice", "Next.js", "WebRTC"],
  category: "Automotive",
  order: 5,
  problem:
    "Porsche dealership (Ali & Sons) was handling test-drive bookings, service appointments, and sales inquiries via phone + WhatsApp — a human-heavy funnel that dropped leads outside business hours and across language barriers (English / Arabic).",
  solution:
    "Building an AI voice agent that answers inbound calls + web voice sessions, conducts a natural booking conversation, pulls real-time vehicle availability from the dealership CRM, offers slots aligned to the customer's emirate, and hands the confirmed booking back to the dealer's CRM with a transcript. Bilingual from day one. Designed for premium brand tone — not generic chatbot voice.",
  impact: [
    "24/7 booking coverage without additional human staffing",
    "Bilingual (English + Arabic) voice conversation flow",
    "Live CRM integration for slot availability and lead capture",
    "Brand-calibrated voice + tone matched to Porsche customer experience",
    "Designed to slot into Ali & Sons' existing dealership stack",
  ],
  stack: [
    "Next.js",
    "WebRTC",
    "OpenAI Realtime / Voice APIs",
    "Node.js",
    "CRM Integrations",
    "Twilio Voice",
  ],
  role: "Lead Engineer",
  duration: "In progress",
};

// Projects whose order shifts by +2 because XPENG (4) and Porsche (5) slot in
// after Podcast EcoSpace (order 3) and before the existing order-5 onwards.
// Luxury Automotive (was order 4) also moves to Automotive category + order 6.
const reorderMap: Record<string, { category?: string; order: number }> = {
  "luxury-automotive": { category: "Automotive", order: 6 },
  querytube: { order: 7 },
  "medrx-generator": { order: 8 },
  "prestige-real-estate": { order: 9 },
  "hoopr-ai": { order: 10 },
  "bse-data-service": { order: 11 },
  "nsdl-fpi-dashboard": { order: 12 },
  "instagram-analytics": { order: 13 },
  signflow: { order: 14 },
  chikitsak: { order: 15 },
  "kristina-svirina": { order: 16 },
  "d3-angular-dashboard": { order: 17 },
  pdfweaver: { order: 18 },
};

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected.");

  // Step 1: upsert the two new automotive projects
  for (const p of [xpengProject, porscheProject]) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
    console.log(`Upserted project: ${p.title} (order ${p.order})`);
  }

  // Step 2: reorder + re-categorize existing projects that now need to shift
  for (const [slug, changes] of Object.entries(reorderMap)) {
    const result = await Project.findOneAndUpdate({ slug }, changes, { new: true });
    if (result) {
      console.log(
        `Updated ${slug}: order=${changes.order}${changes.category ? `, category=${changes.category}` : ""}`
      );
    } else {
      console.log(`Skipped ${slug}: not found in DB`);
    }
  }

  // Report final state
  const all = await Project.find({}).sort({ order: 1 });
  console.log("\nFinal project order:");
  for (const p of all) {
    console.log(`  [${p.order}] ${p.title}  (${p.category})`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
