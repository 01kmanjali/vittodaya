import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_ROUTES = ["/admin"];
const USER_ROUTES = ["/dashboard", "/applications", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

async function getSession(req: NextRequest): Promise<{ role: "admin" | "user" } | null> {
  const token = req.cookies.get("vf_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return { role: payload.role as "admin" | "user" };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSession(req);
  const role = session?.role ?? null;

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === "admin") return NextResponse.next();
    if (role === "user") return NextResponse.redirect(new URL("/unauthorized", req.url));
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (USER_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role !== null) return NextResponse.next();
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.includes(pathname)) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "user") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
