import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminRole, isSuperAdmin, type UserRole } from "@/lib/permissions";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export type AuthedHandler = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> },
  user: JWTPayload
) => Promise<NextResponse | Response>;

/**
 * requiredRole:
 *  "admin"       → any admin role (backward-compat)
 *  "super-admin" → super-admin / legacy admin only
 *  UserRole[]    → must be one of the listed roles
 *  undefined     → any authenticated user
 */
export function withAuth(
  handler: AuthedHandler,
  requiredRole?: "admin" | "super-admin" | UserRole[]
) {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const role = session.user.role;

    if (requiredRole === "admin" && !isAdminRole(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (requiredRole === "super-admin" && !isSuperAdmin(role)) {
      return NextResponse.json({ error: "Forbidden — super-admin only" }, { status: 403 });
    }
    if (Array.isArray(requiredRole) && !requiredRole.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload: JWTPayload = {
      userId: session.user.id,
      email:  session.user.email!,
      role,
    };
    return handler(req, ctx, payload);
  };
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
