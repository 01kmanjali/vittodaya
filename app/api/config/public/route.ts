import { NextResponse } from "next/server";
import { getConfig } from "@/lib/models/AppConfig";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const config = await getConfig();
  return NextResponse.json({ features: config.features });
}
