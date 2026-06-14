"use client";

import { useSession } from "next-auth/react";
import { ShieldOff, Eye } from "lucide-react";
import { hasPageAccess, hasWriteAccess, ROLE_LABELS } from "@/lib/permissions";

// ─── AccessDenied — full page block ──────────────────────────────────────────

export function AccessDenied({ page }: { page: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "";

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldOff className="h-12 w-12 mb-4 text-red-300" />
      <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        Access Denied
      </h2>
      <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
        Your role (<strong>{ROLE_LABELS[role] ?? role}</strong>) does not have permission to view the <strong>{page}</strong> page.
        Contact a Super Admin if you need access.
      </p>
    </div>
  );
}

// ─── ReadOnlyBanner — shown to auditors / read-only roles ────────────────────

export function ReadOnlyBanner() {
  return (
    <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl border text-sm"
      style={{ background: "#fffbeb", borderColor: "#fbbf24", color: "#92400e" }}>
      <Eye className="h-4 w-4 shrink-0" />
      <span>You have <strong>read-only</strong> access to this page. Create, edit, and delete actions are disabled.</span>
    </div>
  );
}

// ─── usePageRole — hook for page-level permission checks ─────────────────────

export function usePageRole(page: string) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "";

  return {
    role,
    canView:  hasPageAccess(role, page),
    canWrite: hasWriteAccess(role, page),
    isLoading: !session,
  };
}
