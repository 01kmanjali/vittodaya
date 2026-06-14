import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/apiAuth";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const POST = withAuth(async (_req: NextRequest, _ctx, auth: JWTPayload) => {
  await connectDB();

  const user = await User.findById(auth.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is already enabled." }, { status: 400 });
  }

  const secret = speakeasy.generateSecret({
    name:   `Vittodaya Financial (${user.email})`,
    length: 20,
  });

  await User.findByIdAndUpdate(auth.userId, { twoFactorSecret: secret.base32 });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!, { width: 240, margin: 2 });

  return NextResponse.json({ secret: secret.base32, qrCode: qrCodeDataUrl });
});
