import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HomeProduct from "@/lib/models/HomeProduct";
import { withAuth } from "@/lib/apiAuth";

export async function GET() {
  try {
    await connectDB();
    const products = await HomeProduct.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const product = await HomeProduct.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}, "admin");
