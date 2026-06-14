import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { ADMIN_ROLES } from "@/lib/permissions";

// GET /api/admin/accounts — list all admin accounts (super-admin only)
export const GET = withAuth(async () => {
  await connectDB();
  const admins = await User.find({ role: { $in: ADMIN_ROLES } })
    .select("-password -twoFactorSecret")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ admins });
}, "super-admin");

// POST /api/admin/accounts — create new admin account (super-admin only)
export const POST = withAuth(async (req: NextRequest) => {
  await connectDB();
  const body = await req.json();
  const { name, email, phone, password, role } = body;

  if (!name || !email || !phone || !password || !role) {
    return NextResponse.json({ error: "name, email, phone, password, and role are required" }, { status: 400 });
  }
  if (!ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid admin role" }, { status: 400 });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role,
    status: "active",
    kycStatus: "not_started",
  });

  const { password: _p, twoFactorSecret: _t, ...safe } = user.toObject();
  void _p; void _t;
  return NextResponse.json({ admin: safe }, { status: 201 });
}, "super-admin");
