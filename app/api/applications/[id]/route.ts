import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Application from "@/lib/models/Application";
import { withAuth } from "@/lib/apiAuth";
import { JWTPayload } from "@/lib/auth";

export const GET = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  const { id } = await ctx.params;
  await connectDB();
  const app = await Application.findById(id).lean();
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (auth.role !== "admin" && app.userId.toString() !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ application: app });
});

// PUT — admin updates status/remarks; user can only cancel their own
export const PUT = withAuth(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  const { id } = await ctx.params;
  await connectDB();
  const app = await Application.findById(id);
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const body = await req.json();

  if (auth.role !== "admin") {
    if (app.userId.toString() !== auth.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // Users can only cancel their own submitted/draft applications
    if (body.status && body.status !== "cancelled") {
      return NextResponse.json({ error: "You can only cancel your own application" }, { status: 403 });
    }
    if (body.status === "cancelled" && !["submitted", "draft"].includes(app.status)) {
      return NextResponse.json({ error: "Cannot cancel an application in its current state" }, { status: 400 });
    }
    Object.assign(app, { status: body.status });
  } else {
    if (body.status === "approved") body.approvedAt = new Date();
    Object.assign(app, body);
  }

  await app.save();
  return NextResponse.json({ application: app });
});

export const DELETE = withAuth(async (_req: NextRequest, ctx: { params: Promise<Record<string, string>> }, auth: JWTPayload) => {
  if (auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await ctx.params;
  await connectDB();
  const app = await Application.findByIdAndDelete(id).lean();
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  return NextResponse.json({ message: "Application deleted" });
});
