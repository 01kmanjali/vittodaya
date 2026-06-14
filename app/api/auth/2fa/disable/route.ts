import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withAuth, JWTPayload } from "@/lib/apiAuth";
import speakeasy from "speakeasy";

export const POST = withAuth(async (req: NextRequest, _ctx, auth: JWTPayload) => {
  const { token } = await req.json() as { token: string };

  if (!token) {
    return NextResponse.json({ error: "Authenticator code required to disable 2FA." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(auth.userId).select("+twoFactorSecret");
  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA is not enabled on this account." }, { status: 400 });
  }

  const isValid = speakeasy.totp.verify({
    secret:   user.twoFactorSecret,
    encoding: "base32",
    token:    token.trim(),
    window:   1,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid authenticator code." }, { status: 400 });
  }

  await User.findByIdAndUpdate(auth.userId, {
    twoFactorEnabled: false,
    $unset: { twoFactorSecret: "" },
  });

  return NextResponse.json({ message: "Two-factor authentication disabled." });
});
