import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    if (user.status === "inactive") {
      return NextResponse.json({ error: "Account is deactivated. Contact support." }, { status: 403 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set("vf_token", token, cookieOptions());
    res.cookies.set("vf_auth", "1", { ...cookieOptions(), httpOnly: false });
    res.cookies.set("vf_role", user.role, { ...cookieOptions(), httpOnly: false });
    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
