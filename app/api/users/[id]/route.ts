import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";

// GET /api/users/:id
export const GET = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  const { id } = await ctx.params;
  if (auth.role !== "admin" && auth.userId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
});

// PUT /api/users/:id — admin can update all fields; user can update own profile fields
export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  const { id } = await ctx.params;
  if (auth.role !== "admin" && auth.userId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();

  // Users cannot escalate their own role or status
  if (auth.role !== "admin") {
    delete body.role;
    delete body.status;
    delete body.kycStatus;
  }
  delete body.password; // password changes handled separately

  const user = await User.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
});

// DELETE /api/users/:id — admin only
export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  if (auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  await connectDB();
  const user = await User.findByIdAndDelete(id).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ message: "User deleted" });
});
