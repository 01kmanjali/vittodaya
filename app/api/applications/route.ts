import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/lib/models/Application";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";

// GET /api/applications — admin: all; user: own
export const GET = withAuth(async (req: NextRequest, _ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  const filter: Record<string, unknown> = {};
  if (auth.role !== "admin") filter.userId = auth.userId;
  if (status) filter.status = status;
  if (type) filter.type = type;

  const [applications, total] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Application.countDocuments(filter),
  ]);
  return NextResponse.json({ applications, total, page, limit });
});

// POST /api/applications — authenticated user applies
export const POST = withAuth(async (req: NextRequest, _ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  await connectDB();
  const body = await req.json();
  const user = await User.findById(auth.userId).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const application = await Application.create({
    ...body,
    userId: auth.userId,
    userName: user.name,
    userEmail: user.email,
    status: "submitted",
  });
  return NextResponse.json({ application }, { status: 201 });
});
