/**
 * Upserts "The Rufescent · Private Invitations" case study into the Projects collection,
 * at order -1 so it leads the grid. Leaves every other project untouched.
 *
 * Images it expects (commit and deploy these first):
 *   public/images/projects/the_rufescent.webp
 *   public/images/projects/screenshots/the-rufescent-*.webp
 *   public/videos/the-rufescent-demo.{html,mp4} and -poster.jpg
 *
 * Run once: `npx tsx scripts/add-rufescent-project.ts`
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

const rufescent = {
  "title": "The Rufescent · Private Invitations",
  "slug": "the-rufescent-private-invitations",
  "desc": "Members' club concept for Dubai: invite by name or private link, break a wax seal, receive a live pass, check in at the door.",
  "imgPath": "/images/projects/the_rufescent.webp",
  "tags": [
    "React",
    "TypeScript",
    "Mobile-first",
    "Luxury Hospitality"
  ],
  "category": "Luxury & Hospitality",
  "order": -1,
  "problem": "Guests of an invitation-only Dubai club met a generic web form: no host, no house identity, and no pass until it was filled.",
  "solution": "One mobile-first app for member, guest and host stand, built on the club's own identity.",
  "impact": [
    "3 surfaces · member, guest, host stand",
    "2 invite modes · named guest or single-use link",
    "30 s rotating QR + Code 128 barcode",
    "4 live states · sent → viewed → confirmed → checked in",
    "50 automated UI checks · phone and laptop",
    "2 days · research to deployed prototype"
  ],
  "stack": [
    "React 18",
    "TypeScript",
    "Vite",
    "CSS animation",
    "QR and Code 128",
    "Vercel"
  ],
  "role": "Self-initiated concept · not affiliated with The Rufescent",
  "duration": "2 days · November 2026",
  "liveUrl": "https://therufescent.vercel.app",
  "screenshots": [
    "/images/projects/screenshots/the-rufescent-choreography.webp",
    "/images/projects/screenshots/the-rufescent-system.webp",
    "/images/projects/screenshots/the-rufescent-anatomy.webp",
    "/images/projects/screenshots/the-rufescent-2.webp",
    "/images/projects/screenshots/the-rufescent-4.webp",
    "/images/projects/screenshots/the-rufescent-5.webp",
    "/images/projects/screenshots/the-rufescent-6.webp"
  ],
  "videoUrl": "/videos/the-rufescent-demo.html"
};

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Project.updateOne({ slug: rufescent.slug }, { $set: rufescent }, { upsert: true });
  console.log(`Upserted ${rufescent.slug}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
