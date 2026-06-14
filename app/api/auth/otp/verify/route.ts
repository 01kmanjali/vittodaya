import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";

const MAX_ATTEMPTS = 5;

export const POST = withAuth(async (req: NextRequest, _ctx, auth: JWTPayload) => {
  const { type, code, value } = await req.json() as {
    type: "phone" | "aadhaar" | "pan";
    code: string;
    value?: string; // the actual field value to save (panNumber, aadharNumber)
  };

  if (!type || !code) {
    return NextResponse.json({ error: "type and code are required" }, { status: 400 });
  }

  await connectDB();

  const otpDoc = await OTP.findOne({
    userId: auth.userId,
    type,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
  }

  otpDoc.attempts += 1;

  if (otpDoc.attempts > MAX_ATTEMPTS) {
    await otpDoc.deleteOne();
    return NextResponse.json({ error: "Too many incorrect attempts. Please request a new OTP." }, { status: 429 });
  }

  if (otpDoc.code !== code.trim()) {
    await otpDoc.save();
    const remaining = MAX_ATTEMPTS - otpDoc.attempts;
    return NextResponse.json({ error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` }, { status: 400 });
  }

  // Mark OTP as used
  otpDoc.used = true;
  await otpDoc.save();

  // Update user fields based on type
  const updateFields: Record<string, unknown> = {};

  if (type === "phone") {
    updateFields.phoneVerified = true;
  } else if (type === "pan") {
    updateFields.panVerified = true;
    if (value) updateFields.panNumber = value.trim().toUpperCase();
  } else if (type === "aadhaar") {
    updateFields.aadhaarVerified = true;
    if (value) updateFields.aadharNumber = value.trim();
  }

  // Recalculate kycStatus based on verified fields
  const user = await User.findByIdAndUpdate(
    auth.userId,
    { $set: updateFields },
    { new: true }
  );

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Auto-upgrade kycStatus to "pending" (awaiting admin approval) once all steps done
  const allVerified = user.phoneVerified && user.panVerified && user.aadhaarVerified;
  if (allVerified && user.kycStatus === "not_started") {
    await User.findByIdAndUpdate(auth.userId, { kycStatus: "pending" });
  }

  return NextResponse.json({ message: "Verified successfully", user });
});
