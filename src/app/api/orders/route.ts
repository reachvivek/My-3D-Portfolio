import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select("-assets.data") // exclude base64 data from listing
      .lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    const selectedPackage = formData.get("selectedPackage") as string;
    const selectedTier = formData.get("selectedTier") as string;
    const vision = formData.get("vision") as string;
    const references = formData.get("references") as string;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Process uploaded files (store as base64, max 5MB each)
    const assets: { name: string; size: number; type: string; data: string }[] =
      [];
    const files = formData.getAll("assets") as File[];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue; // skip files > 5MB
      const buffer = Buffer.from(await file.arrayBuffer());
      assets.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: buffer.toString("base64"),
      });
    }

    await connectDB();

    const order = await Order.create({
      name,
      email,
      phone,
      company,
      selectedPackage,
      selectedTier,
      vision,
      references,
      assets,
    });

    return NextResponse.json({ success: true, id: order._id }, { status: 201 });
  } catch (err) {
    console.error("Order submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit order" },
      { status: 500 }
    );
  }
}
