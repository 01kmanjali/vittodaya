import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { withAuth, JWTPayload } from "@/lib/apiAuth";
import { sendOTPEmail } from "@/lib/mailer";
import crypto from "crypto";

const COOLDOWN_SECONDS = 60;
const OTP_TTL_MINUTES  = 10;

function generateOTP(): string {
  return String(crypto.randomInt(100000, 999999));
}

export const POST = withAuth(async (req: NextRequest, _ctx, auth: JWTPayload) => {
  const { type } = await req.json() as { type: "phone" | "aadhaar" | "pan" | "2fa_setup" };

  const validTypes = ["phone", "aadhaar", "pan", "2fa_setup"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid OTP type" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Rate limit: block if an unexpired, unused OTP of same type was sent recently
  const recent = await OTP.findOne({
    userId:    user._id,
    type,
    used:      false,
    expiresAt: { $gt: new Date(Date.now() - (OTP_TTL_MINUTES * 60 - COOLDOWN_SECONDS) * 1000) },
  });

  if (recent) {
    return NextResponse.json(
      { error: `Please wait ${COOLDOWN_SECONDS} seconds before requesting another OTP.` },
      { status: 429 }
    );
  }

  await OTP.deleteMany({ userId: user._id, type, used: false });

  const code      = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await OTP.create({ userId: user._id, type, code, expiresAt });

  await sendOTPEmail(user.email, user.name, code, type);

  return NextResponse.json({
    message:  `OTP sent to ${user.email}`,
    sentTo:   user.email,
    expiresIn: OTP_TTL_MINUTES * 60,
  });
});
