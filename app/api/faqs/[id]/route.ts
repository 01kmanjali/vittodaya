import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const faq = await FAQ.findById(id).lean();
  if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  return NextResponse.json({ faq });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const faq = await FAQ.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  return NextResponse.json({ faq });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const faq = await FAQ.findByIdAndDelete(id).lean();
  if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  return NextResponse.json({ message: "FAQ deleted" });
}, "admin");
