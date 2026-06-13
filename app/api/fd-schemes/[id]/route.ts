import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FDScheme from "@/lib/models/FDScheme";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const scheme = await FDScheme.findOne({ $or: [{ _id: id }, { slug: id }] }).lean();
  if (!scheme) return NextResponse.json({ error: "FD Scheme not found" }, { status: 404 });
  return NextResponse.json({ scheme });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const scheme = await FDScheme.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!scheme) return NextResponse.json({ error: "FD Scheme not found" }, { status: 404 });
  return NextResponse.json({ scheme });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const scheme = await FDScheme.findByIdAndDelete(id).lean();
  if (!scheme) return NextResponse.json({ error: "FD Scheme not found" }, { status: 404 });
  return NextResponse.json({ message: "FD Scheme deleted" });
}, "admin");
