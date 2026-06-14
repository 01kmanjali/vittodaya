import "next-auth";
import type { DefaultSession } from "next-auth";

type AdminRole = "super-admin" | "support-admin" | "operation-admin" | "auditor" | "admin";
type AppRole = AdminRole | "user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
  interface User {
    role: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}
