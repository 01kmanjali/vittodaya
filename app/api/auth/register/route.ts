import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, cookieOptions } from "@/lib/auth";

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

    const user = await User.create({ name, email, phone, password, role: "user", status: "pending" });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const res = NextResponse.json(
      { message: "Registered successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
    res.cookies.set("vf_token", token, cookieOptions());
    res.cookies.set("vf_auth", "1", { ...cookieOptions(), httpOnly: false });
    res.cookies.set("vf_role", user.role, { ...cookieOptions(), httpOnly: false });
    return res;
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
