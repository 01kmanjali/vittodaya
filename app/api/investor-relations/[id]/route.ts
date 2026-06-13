import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InvestorRelation from "@/lib/models/InvestorRelation";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const record = await InvestorRelation.findById(id).lean();
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  return NextResponse.json({ record });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const record = await InvestorRelation.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  return NextResponse.json({ record });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const record = await InvestorRelation.findByIdAndDelete(id).lean();
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  return NextResponse.json({ message: "Record deleted" });
}, "admin");
