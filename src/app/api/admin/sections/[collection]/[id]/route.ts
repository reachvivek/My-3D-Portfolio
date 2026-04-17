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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  await connectDB();
  const { collection, id } = await params;
  const Model = models[collection];
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  await Model.findByIdAndUpdate(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  await connectDB();
  const { collection, id } = await params;
  const Model = models[collection];
  if (!Model) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await Model.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
