import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PartnerInquiry from "@/lib/models/PartnerInquiry";
import { withAuth } from "@/lib/apiAuth";

export const PATCH = withAuth(async (req: NextRequest, ctx) => {
  await connectDB();
  const { id } = await ctx.params;
  const body = await req.json();
  const inquiry = await PartnerInquiry.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ inquiry });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx) => {
  await connectDB();
  const { id } = await ctx.params;
  await PartnerInquiry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}, "admin");
