import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Career from "@/lib/models/Career";
import { withAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");
  const type = searchParams.get("type");
  const filter: Record<string, unknown> = { isActive: true };
  if (department) filter.department = department;
  if (type) filter.type = type;
  const careers = await Career.find(filter).sort({ isFeatured: -1, postedDate: -1 }).lean();
  return NextResponse.json({ careers });
}

export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  if (!body.title || !body.department || !body.location || !body.type) {
    return NextResponse.json({ error: "title, department, location, and type are required" }, { status: 400 });
  }
  const career = await Career.create(body);
  return NextResponse.json({ career }, { status: 201 });
}, "admin");
