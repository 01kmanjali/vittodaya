import type { NextAuthConfig } from "next-auth";
import { isAdminRole } from "@/lib/permissions";

const ADMIN_ROUTES = ["/admin"];
const USER_ROUTES  = ["/dashboard", "/applications", "/profile"];
const AUTH_ROUTES  = ["/login", "/register", "/verify-email"];

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id   = token.id   as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user.role = (token.role as any);
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role       = auth?.user?.role ?? null;
      const pathname   = nextUrl.pathname;

      if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
        if (!isLoggedIn)
          return Response.redirect(new URL(`/login?redirect=${pathname}`, nextUrl));
        if (!isAdminRole(role))
          return Response.redirect(new URL("/unauthorized", nextUrl));
        return true;
      }

      if (USER_ROUTES.some(r => pathname.startsWith(r))) {
        if (!isLoggedIn)
          return Response.redirect(new URL(`/login?redirect=${pathname}`, nextUrl));
        return true;
      }

      if (AUTH_ROUTES.includes(pathname) && isLoggedIn) {
        return Response.redirect(new URL(isAdminRole(role) ? "/admin" : "/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
};
