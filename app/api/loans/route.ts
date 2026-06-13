import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LoanProduct from "@/lib/models/LoanProduct";
import { withAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const filter: Record<string, unknown> = { isActive: true };
  if (type) filter.type = type;
  const loans = await LoanProduct.find(filter).sort({ featuredOrder: 1 }).lean();
  return NextResponse.json({ loans });
}

export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.slug || !body.type || !body.name) {
    return NextResponse.json({ error: "slug, type, and name are required" }, { status: 400 });
  }
  const loan = await LoanProduct.create(body);
  return NextResponse.json({ loan }, { status: 201 });
}, "admin");
