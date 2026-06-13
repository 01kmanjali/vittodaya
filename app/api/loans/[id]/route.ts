import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LoanProduct from "@/lib/models/LoanProduct";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const loan =
    (await LoanProduct.findOne({ slug: id }).lean()) ??
    (await LoanProduct.findById(id).lean().catch(() => null));
  if (!loan) return NextResponse.json({ error: "Loan product not found" }, { status: 404 });
  return NextResponse.json({ loan });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const loan = await LoanProduct.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!loan) return NextResponse.json({ error: "Loan product not found" }, { status: 404 });
  return NextResponse.json({ loan });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const loan = await LoanProduct.findByIdAndDelete(id).lean();
  if (!loan) return NextResponse.json({ error: "Loan product not found" }, { status: 404 });
  return NextResponse.json({ message: "Loan product deleted" });
}, "admin");
