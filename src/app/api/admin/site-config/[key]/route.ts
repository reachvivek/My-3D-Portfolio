import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  await connectDB();
  const { key } = await params;
  const doc = await SiteConfig.findOne({ key }).lean();
  return NextResponse.json(doc ? JSON.parse(JSON.stringify(doc.value)) : null);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  await connectDB();
  const { key } = await params;
  const body = await request.json();
  await SiteConfig.updateOne({ key }, { $set: { value: body } }, { upsert: true });
  return NextResponse.json({ success: true });
}
