import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/Career";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const career = await Career.findById(id).lean();
  if (!career) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ career });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const career = await Career.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!career) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ career });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const career = await Career.findByIdAndDelete(id).lean();
  if (!career) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ message: "Job deleted" });
}, "admin");
