import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Enquiry } from "@/lib/models";

export async function POST(request: Request) {
  await connectDB();
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  await Enquiry.create({ name, email, message });
  return NextResponse.json({ success: true });
}

export async function GET() {
  await connectDB();
  const docs = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(JSON.parse(JSON.stringify(docs)));
}
