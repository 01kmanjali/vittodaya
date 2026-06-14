import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";

// GET /api/users — admin: all users; user: own profile
export const GET = withAuth(async (req: NextRequest, _ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  await connectDB();
  if (auth.role === "admin") {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Number(searchParams.get("limit") ?? 20));
    const search = searchParams.get("search") ?? "";
    const filter: Record<string, unknown> = {};
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
    const [users, total] = await Promise.all([
      User.find(filter).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return NextResponse.json({ users, total, page, limit });
  }
  const user = await User.findById(auth.userId).lean();
  return NextResponse.json({ user });
});
