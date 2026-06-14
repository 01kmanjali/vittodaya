import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth, JWTPayload } from "@/lib/apiAuth";
import speakeasy from "speakeasy";
import { send2FASetupEmail } from "@/lib/mailer";

export const POST = withAuth(async (req: NextRequest, _ctx, auth: JWTPayload) => {
  const { token } = await req.json() as { token: string };

  if (!token || token.length !== 6) {
    return NextResponse.json({ error: "Enter the 6-digit code from your authenticator app." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(auth.userId).select("+twoFactorSecret");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA setup not initiated. Call /api/auth/2fa/setup first." }, { status: 400 });
  }

  const isValid = speakeasy.totp.verify({
    secret:   user.twoFactorSecret,
    encoding: "base32",
    token:    token.trim(),
    window:   1,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid code. Please check your authenticator app and try again." }, { status: 400 });
  }

  await User.findByIdAndUpdate(auth.userId, { twoFactorEnabled: true });

  try {
    await send2FASetupEmail(user.email, user.name);
  } catch {
    // email failure is non-fatal
  }

  return NextResponse.json({ message: "Two-factor authentication enabled successfully." });
});
