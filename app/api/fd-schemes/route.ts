import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FDScheme from "@/lib/models/FDScheme";
import { withAuth } from "@/lib/apiAuth";

// GET /api/fd-schemes — public (pass ?all=true for admin to get inactive too)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const bankType = searchParams.get("bankType");
  const taxSaver = searchParams.get("taxSaver");
  const all      = searchParams.get("all") === "true";
  const filter: Record<string, unknown> = {};
  if (!all) filter.isActive = true;
  if (bankType) filter.bankType = bankType;
  if (taxSaver === "true") filter.taxSaverFD = true;
  const schemes = await FDScheme.find(filter).sort({ featuredOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ schemes });
}

// POST /api/fd-schemes — admin only
export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.slug || !body.bankId || !body.schemeName) {
    return NextResponse.json({ error: "slug, bankId, and schemeName are required" }, { status: 400 });
  }
  const scheme = await FDScheme.create(body);
  return NextResponse.json({ scheme }, { status: 201 });
}, "admin");
