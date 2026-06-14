import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PartnerInquiry from "@/lib/models/PartnerInquiry";
import { withAuth } from "@/lib/apiAuth";

// Public POST — anyone can submit a partner inquiry
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, mobile, profile } = body;
  if (!name || !mobile || !profile) {
    return NextResponse.json({ error: "name, mobile, and profile are required" }, { status: 400 });
  }
  const inquiry = await PartnerInquiry.create(body);
  return NextResponse.json({ inquiry }, { status: 201 });
}

// Admin GET — list all inquiries with optional filters
export const GET = withAuth(async (req: NextRequest) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status  = searchParams.get("status");
  const profile = searchParams.get("profile");
  const filter: Record<string, unknown> = {};
  if (status)  filter.status  = status;
  if (profile) filter.profile = profile;
  const inquiries = await PartnerInquiry.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ inquiries });
}, "admin");
