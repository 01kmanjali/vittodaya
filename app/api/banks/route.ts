import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bank from "@/lib/models/Bank";
import { withAuth } from "@/lib/apiAuth";

// GET /api/banks — public (add showAll=true to include inactive, for admin use)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const showAll = searchParams.get("showAll") === "true";
  const filter: Record<string, unknown> = showAll ? {} : { isActive: true };
  if (type) filter.type = type;
  const banks = await Bank.find(filter).sort({ name: 1 }).lean();
  return NextResponse.json({ banks });
}

// POST /api/banks — admin only
export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.slug || !body.name || !body.type) {
    return NextResponse.json({ error: "slug, name, and type are required" }, { status: 400 });
  }
  const bank = await Bank.create(body);
  return NextResponse.json({ bank }, { status: 201 });
}, "admin");
