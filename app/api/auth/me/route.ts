import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/auth";

export const GET = withAuth(async (_req: NextRequest, _ctx: { params: Promise<Record<string, string>> }, user: JWTPayload) => {
  await connectDB();
  const doc = await User.findById(user.userId).lean();
  if (!doc) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user: doc });
});
