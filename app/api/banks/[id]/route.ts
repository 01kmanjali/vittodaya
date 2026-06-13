import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bank from "@/lib/models/Bank";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const bank = await Bank.findById(id).lean();
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  return NextResponse.json({ bank });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const bank = await Bank.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  return NextResponse.json({ bank });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const bank = await Bank.findByIdAndDelete(id).lean();
  if (!bank) return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  return NextResponse.json({ message: "Bank deleted" });
}, "admin");
