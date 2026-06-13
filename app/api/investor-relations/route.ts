import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import InvestorRelation from "@/lib/models/InvestorRelation";
import { withAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const filter: Record<string, unknown> = { isActive: true };
  if (type) filter.type = type;
  const records = await InvestorRelation.find(filter).sort({ order: 1, publishedDate: -1 }).lean();
  return NextResponse.json({ records });
}

export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.type || !body.title || !body.publishedDate) {
    return NextResponse.json({ error: "type, title, and publishedDate are required" }, { status: 400 });
  }
  const record = await InvestorRelation.create(body);
  return NextResponse.json({ record }, { status: 201 });
}, "admin");
