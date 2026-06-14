import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await User.create({
      name, email, phone, password,
      role: "user", status: "pending",
    });

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await OTP.deleteMany({ userId: user._id, type: "email_verify" });
    await OTP.create({
      userId:    user._id,
      type:      "email_verify",
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    await sendOTPEmail(user.email, user.name, code, "email_verify");

    return NextResponse.json(
      { message: "OTP sent to your email. Please verify to continue.", email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
