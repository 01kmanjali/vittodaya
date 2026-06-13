import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewsArticle from "@/lib/models/NewsArticle";
import { withAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  const articles = await NewsArticle.find(filter).sort({ publishedDate: -1 }).lean();
  return NextResponse.json({ articles });
}

export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.title || !body.category) {
    return NextResponse.json({ error: "title and category are required" }, { status: 400 });
  }
  const article = await NewsArticle.create(body);
  return NextResponse.json({ article }, { status: 201 });
}, "admin");
