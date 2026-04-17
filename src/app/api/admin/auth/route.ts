import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { AdminConfig } from "@/lib/models";

export async function POST(request: Request) {
  await connectDB();
  const { password } = await request.json();

  const config = await AdminConfig.findOne({ key: "admin_password" }).lean();
  if (!config) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const valid = await bcrypt.compare(password, (config as { value: string }).value);
  if (valid) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
