import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Stat, Company, Service, Process, Testimonial, SocialLink, Experience, Project } from "@/lib/models";

const models: Record<string, any> = {
  stats: Stat,
  companies: Company,
  services: Service,
  process: Process,
  testimonials: Testimonial,
  "social-links": SocialLink,
  experience: Experience,
  projects: Project,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  await connectDB();
  const { collection } = await params;
  const Model = models[collection];
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const docs = await Model.find({}).sort({ order: 1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(docs)));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  await connectDB();
  const { collection } = await params;
  const Model = models[collection];
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  const doc = await Model.create(body);
  return NextResponse.json(JSON.parse(JSON.stringify(doc)));
}
