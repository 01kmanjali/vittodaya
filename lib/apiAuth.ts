import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "./auth";

export type AuthedHandler = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> },
  user: JWTPayload
) => Promise<NextResponse | Response>;

function extractToken(req: NextRequest): string | null {
  const cookie = req.cookies.get("vf_token")?.value;
  if (cookie) return cookie;
  const bearer = req.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7);
  return null;
}

export function withAuth(handler: AuthedHandler, requiredRole?: "admin" | "user") {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const token = extractToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    if (requiredRole === "admin" && payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ctx, payload);
  };
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
