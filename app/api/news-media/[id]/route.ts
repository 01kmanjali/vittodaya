import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewsArticle from "@/lib/models/NewsArticle";
import { withAuth } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) {
  const { id } = await ctx.params;
  await connectDB();
  const article = await NewsArticle.findById(id).lean();
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  return NextResponse.json({ article });
}

export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const article = await NewsArticle.findByIdAndUpdate(id, { $set: await req.json() }, { new: true, runValidators: true }).lean();
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  return NextResponse.json({ article });
}, "admin");

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
  const { id } = await ctx.params;
  await connectDB();
  const article = await NewsArticle.findByIdAndDelete(id).lean();
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  return NextResponse.json({ message: "Article deleted" });
}, "admin");
