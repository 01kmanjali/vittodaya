import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";
import { withAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const filter: Record<string, unknown> = { isActive: true };
  if (category && category !== "all") filter.category = category;
  const faqs = await FAQ.find(filter).sort({ order: 1 }).lean();
  return NextResponse.json({ faqs });
}

export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.question || !body.answer || !body.category) {
    return NextResponse.json({ error: "question, answer, and category are required" }, { status: 400 });
  }
  const faq = await FAQ.create(body);
  return NextResponse.json({ faq }, { status: 201 });
}, "admin");
