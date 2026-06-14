import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { withAuth, JWTPayload } from "@/lib/apiAuth";
import AppConfig, { getConfig } from "@/lib/models/AppConfig";

export const GET = withAuth(async () => {
  await connectDB();
  const config = await getConfig();
  return NextResponse.json({ config });
}, "admin");

export const PUT = withAuth(async (req: NextRequest, _ctx, _auth: JWTPayload) => {
  await connectDB();
  const body = await req.json();

  const config = await getConfig();

  // Deep merge only allowed top-level sections
  const allowed = ["features", "fd", "loans", "app", "notifications"] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) {
      Object.assign(config[key] as object, body[key]);
    }
  }

  await config.save();
  return NextResponse.json({ config });
}, "admin");
