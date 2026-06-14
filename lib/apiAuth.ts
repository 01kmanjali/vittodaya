import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
}

export type AuthedHandler = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> },
  user: JWTPayload
) => Promise<NextResponse | Response>;

export function withAuth(handler: AuthedHandler, requiredRole?: "admin" | "user") {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    if (requiredRole === "admin" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const payload: JWTPayload = {
      userId: session.user.id,
      email:  session.user.email!,
      role:   session.user.role,
    };
    return handler(req, ctx, payload);
  };
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
