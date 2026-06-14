// Role definitions and permission helpers

export type UserRole =
  | "super-admin"
  | "support-admin"
  | "operation-admin"
  | "auditor"
  | "user"
  | "admin"; // legacy alias — treated as super-admin everywhere

export type AdminRole = Exclude<UserRole, "user">;

export const ADMIN_ROLES: AdminRole[] = [
  "super-admin",
  "support-admin",
  "operation-admin",
  "auditor",
  "admin", // legacy
];

export const ROLE_LABELS: Record<string, string> = {
  "super-admin":      "Super Admin",
  "support-admin":    "Support Admin",
  "operation-admin":  "Operations Admin",
  "auditor":          "Auditor",
  "admin":            "Super Admin", // legacy
  "user":             "User",
};

export const ROLE_COLORS: Record<string, string> = {
  "super-admin":     "bg-purple-100 text-purple-700 border-purple-200",
  "support-admin":   "bg-blue-100 text-blue-700 border-blue-200",
  "operation-admin": "bg-green-100 text-green-700 border-green-200",
  "auditor":         "bg-amber-100 text-amber-700 border-amber-200",
  "admin":           "bg-purple-100 text-purple-700 border-purple-200", // legacy
};

// Pages and which admin roles can VIEW them
export const PAGE_ACCESS: Record<string, AdminRole[]> = {
  "dashboard":          ["super-admin", "admin", "support-admin", "operation-admin", "auditor"],
  "analytics":          ["super-admin", "admin", "support-admin", "operation-admin", "auditor"],
  "applications":       ["super-admin", "admin", "support-admin", "operation-admin", "auditor"],
  "users":              ["super-admin", "admin", "support-admin", "operation-admin", "auditor"],
  "fd-schemes":         ["super-admin", "admin", "operation-admin", "auditor"],
  "banks":              ["super-admin", "admin", "operation-admin", "auditor"],
  "loans":              ["super-admin", "admin", "operation-admin", "auditor"],
  "news-media":         ["super-admin", "admin", "support-admin", "operation-admin"],
  "faqs":               ["super-admin", "admin", "support-admin", "operation-admin"],
  "investor-relations": ["super-admin", "admin", "operation-admin", "auditor"],
  "config":             ["super-admin", "admin"],
  "accounts":           ["super-admin", "admin"],
};

// Pages and which admin roles can WRITE (create/edit/delete)
export const WRITE_ACCESS: Record<string, AdminRole[]> = {
  "applications":       ["super-admin", "admin", "support-admin", "operation-admin"],
  "users":              ["super-admin", "admin", "support-admin", "operation-admin"],
  "fd-schemes":         ["super-admin", "admin", "operation-admin"],
  "banks":              ["super-admin", "admin", "operation-admin"],
  "loans":              ["super-admin", "admin", "operation-admin"],
  "news-media":         ["super-admin", "admin", "support-admin", "operation-admin"],
  "faqs":               ["super-admin", "admin", "support-admin", "operation-admin"],
  "investor-relations": ["super-admin", "admin", "operation-admin"],
  "config":             ["super-admin", "admin"],
  "accounts":           ["super-admin", "admin"],
};

export function isAdminRole(role: string | undefined | null): boolean {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function hasPageAccess(role: string | undefined | null, page: string): boolean {
  if (!role || role === "user") return false;
  const allowed = PAGE_ACCESS[page];
  if (!allowed) return role === "super-admin" || role === "admin";
  return allowed.includes(role as AdminRole);
}

export function hasWriteAccess(role: string | undefined | null, page: string): boolean {
  if (!role || role === "user") return false;
  const allowed = WRITE_ACCESS[page];
  if (!allowed) return role === "super-admin" || role === "admin";
  return allowed.includes(role as AdminRole);
}

export function isSuperAdmin(role: string | undefined | null): boolean {
  return role === "super-admin" || role === "admin";
}
