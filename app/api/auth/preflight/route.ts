import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// Checks credentials and whether 2FA is required — called BEFORE signIn()
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");

    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await user.comparePassword(String(password));
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    if (user.status === "inactive") return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
    if (user.status === "pending")  return NextResponse.json({ error: "Please verify your email first" }, { status: 403 });

    return NextResponse.json({
      ok:                 true,
      twoFactorRequired:  !!user.twoFactorEnabled,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
