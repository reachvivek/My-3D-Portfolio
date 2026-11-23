import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Enquiry } from "@/lib/models";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  await Enquiry.findByIdAndUpdate(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  await Enquiry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
