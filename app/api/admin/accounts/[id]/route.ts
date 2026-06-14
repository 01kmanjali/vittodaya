import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { ADMIN_ROLES, type AdminRole } from "@/lib/permissions";

// PUT /api/admin/accounts/[id] — update role / status (super-admin only)
export const PUT = withAuth(async (req: NextRequest, ctx, caller) => {
  const { id } = await ctx.params;
  await connectDB();

  // prevent self-demotion
  if (id === caller.userId) {
    return NextResponse.json({ error: "You cannot modify your own account here" }, { status: 400 });
  }

  const body = await req.json();
  const allowed = ["name", "phone", "role", "status"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  if (update.role && !ADMIN_ROLES.includes(update.role as AdminRole)) {
    return NextResponse.json({ error: "Invalid admin role" }, { status: 400 });
  }

  const admin = await User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
    .select("-password -twoFactorSecret")
    .lean();
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  return NextResponse.json({ admin });
}, "super-admin");

// DELETE /api/admin/accounts/[id] — delete admin account (super-admin only)
export const DELETE = withAuth(async (_req: NextRequest, ctx, caller) => {
  const { id } = await ctx.params;
  await connectDB();

  if (id === caller.userId) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const admin = await User.findOneAndDelete({ _id: id, role: { $in: ADMIN_ROLES } }).lean();
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  return NextResponse.json({ message: "Account deleted" });
}, "super-admin");

// PATCH /api/admin/accounts/[id] — reset password (super-admin only)
export const PATCH = withAuth(async (req: NextRequest, ctx, caller) => {
  const { id } = await ctx.params;
  await connectDB();

  if (id === caller.userId) {
    return NextResponse.json({ error: "Use profile settings to change your own password" }, { status: 400 });
  }

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const admin = await User.findOne({ _id: id, role: { $in: ADMIN_ROLES } }).select("+password");
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  admin.password = password;
  await admin.save();

  return NextResponse.json({ message: "Password reset successfully" });
}, "super-admin");
