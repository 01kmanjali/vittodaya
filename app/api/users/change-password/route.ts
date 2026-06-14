import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";

export const PUT = withAuth(async (req: NextRequest, _ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  await connectDB();
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both fields required" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }
  const user = await User.findById(auth.userId).select("+password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!(await user.comparePassword(currentPassword))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }
  user.password = newPassword;
  await user.save();
  return NextResponse.json({ message: "Password updated" });
});
