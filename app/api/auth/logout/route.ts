import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  const expired = cookieOptions(0);
  res.cookies.set("vf_token", "", expired);
  res.cookies.set("vf_auth", "", { ...expired, httpOnly: false });
  res.cookies.set("vf_role", "", { ...expired, httpOnly: false });
  return res;
}
