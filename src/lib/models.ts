import mongoose, { Schema } from "mongoose";

// ── Projects ──
const projectSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  desc: String,
  imgPath: String,
  tags: [String],
  category: String,
  order: { type: Number, default: 0 },
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
export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

// ── Stats ──
const statSchema = new Schema({
  value: String,
  label: String,
  order: { type: Number, default: 0 },
});
export const Stat =
  mongoose.models.Stat || mongoose.model("Stat", statSchema);

// ── Process ──
const processSchema = new Schema({
  step: String,
  title: String,
  desc: String,
  order: { type: Number, default: 0 },
});
export const Process =
  mongoose.models.Process || mongoose.model("Process", processSchema);

// ── Companies ──
const companySchema = new Schema({
  name: String,
  logo: String,
  highlight: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});
export const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

// ── Services ──
const serviceSchema = new Schema({
  icon: String,
  title: String,
  desc: String,
  order: { type: Number, default: 0 },
});
export const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

// ── Testimonials ──
const testimonialSchema = new Schema({
  name: String,
  role: String,
  text: String,
  imgPath: String,
  order: { type: Number, default: 0 },
});
export const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);

// ── Social Links ──
const socialLinkSchema = new Schema({
  name: String,
  url: String,
  order: { type: Number, default: 0 },
});
export const SocialLink =
  mongoose.models.SocialLink ||
  mongoose.model("SocialLink", socialLinkSchema);

// ── Experience ──
const experienceSchema = new Schema({
  title: String,
  company: String,
  date: String,
  location: String,
  highlights: [String],
  tags: [String],
  order: { type: Number, default: 0 },
});
export const Experience =
  mongoose.models.Experience || mongoose.model("Experience", experienceSchema);

// ── Site Config (hero text, nav links, flagship, etc.) ──
const siteConfigSchema = new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed,
});
export const SiteConfig =
  mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", siteConfigSchema);

// ── Blog Posts ──
const blogPostSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String, // markdown content
  coverImage: String,
  tags: [String],
  published: { type: Boolean, default: false },
  publishedAt: Date,
  readTime: String,
  claps: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});
export const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);

// -- Enquiries --
const enquirySchema = new Schema({
  name: String,
  email: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
export const Enquiry =
  mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

// -- Orders --
const orderSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  selectedPackage: String,
  selectedTier: String,
  vision: String,
  references: String,
  assets: [
    {
      name: String,
      size: Number,
      type: String,
      data: String, // base64
    },
  ],
  status: { type: String, default: "new" },
  createdAt: { type: Date, default: Date.now },
});
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

// -- Admin Config --
const adminConfigSchema = new Schema({
  key: { type: String, unique: true },
  value: String,
});
export const AdminConfig =
  mongoose.models.AdminConfig || mongoose.model("AdminConfig", adminConfigSchema);
