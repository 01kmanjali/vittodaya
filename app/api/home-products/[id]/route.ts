import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HomeProduct from "@/lib/models/HomeProduct";
import { withAuth } from "@/lib/apiAuth";

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  try {
    const { id } = await ctx.params;
    await connectDB();
    const body = await req.json();
    const product = await HomeProduct.findByIdAndUpdate(id, body, { new: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  try {
    const { id } = await ctx.params;
    await connectDB();
    await HomeProduct.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}, "admin");
