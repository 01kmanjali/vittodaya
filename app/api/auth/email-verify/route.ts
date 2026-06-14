import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.status === "active") {
      return NextResponse.json({ message: "Email already verified" });
    }

    const otp = await OTP.findOne({
      userId: user._id,
      type:   "email_verify",
      used:   false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    otp.attempts += 1;
    if (otp.attempts > 5) {
      await otp.deleteOne();
      return NextResponse.json({ error: "Too many attempts. Please register again." }, { status: 429 });
    }

    if (otp.code !== String(code)) {
      await otp.save();
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    otp.used = true;
    await otp.save();

    user.status = "active";
    await user.save();

    return NextResponse.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("[email-verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Resend OTP
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.status === "active") return NextResponse.json({ message: "Already verified" });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await OTP.deleteMany({ userId: user._id, type: "email_verify" });
    await OTP.create({
      userId:    user._id,
      type:      "email_verify",
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const { sendOTPEmail } = await import("@/lib/mailer");
    await sendOTPEmail(user.email, user.name, code, "email_verify");

    return NextResponse.json({ message: "New OTP sent to your email." });
  } catch (err) {
    console.error("[email-verify resend]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
