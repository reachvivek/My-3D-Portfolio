import { connectDB } from "./mongodb";
import {
  Project,
  Stat,
  Process,
  Company,
  Service,
  Testimonial,
  SocialLink,
  SiteConfig,
  Experience,
  BlogPost,
} from "./models";

// Helper to serialize mongoose docs to plain objects
function serialize<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs));
}

function serializeOne<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getProjects() {
  await connectDB();
  const docs = await Project.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const doc = await Project.findOne({ slug }).lean();
  return doc ? serializeOne(doc) : null;
}

export async function getAllProjectSlugs() {
  await connectDB();
  const docs = await Project.find({}, { slug: 1 }).lean();
  return docs.map((d: Record<string, unknown>) => d.slug as string);
}

export async function getStats() {
  await connectDB();
  const docs = await Stat.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getProcess() {
  await connectDB();
  const docs = await Process.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getCompanies() {
  await connectDB();
  const docs = await Company.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getServices() {
  await connectDB();
  const docs = await Service.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getTestimonials() {
  await connectDB();
  const docs = await Testimonial.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getSocialLinks() {
  await connectDB();
  const docs = await SocialLink.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getExperiences() {
  await connectDB();
  const docs = await Experience.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getSiteConfig(key: string) {
  await connectDB();
  const doc = await SiteConfig.findOne({ key }).lean();
  return doc ? serializeOne(doc.value) : null;
}

export async function getBlogPosts() {
  await connectDB();
  const docs = await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).lean();
  return serialize(docs);
}

export async function getBlogPostBySlug(slug: string) {
  await connectDB();
  const doc = await BlogPost.findOne({ slug, published: true }).lean();
  return doc ? serializeOne(doc) : null;
}

export async function getAllBlogSlugs() {
  await connectDB();
  const docs = await BlogPost.find({ published: true }, { slug: 1 }).lean();
  return docs.map((d: Record<string, unknown>) => d.slug as string);
}

export async function getAllPageData() {
  await connectDB();

  const [projects, stats, process, companies, services, testimonials, socialLinks, experiences, navLinks, hero, flagship, blogPosts] =
    await Promise.all([
      getProjects(),
      getStats(),
      getProcess(),
      getCompanies(),
      getServices(),
      getTestimonials(),
      getSocialLinks(),
      getExperiences(),
      getSiteConfig("navLinks"),
      getSiteConfig("hero"),
      getSiteConfig("flagship"),
      getBlogPosts(),
    ]);

  return { projects, stats, process, companies, services, testimonials, socialLinks, experiences, navLinks, hero, flagship, blogPosts };
}
