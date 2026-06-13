"use client";

import Link from "next/link";
import { useApplications } from "@/lib/queries/useApplications";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#f0fdf4", text: "#16a34a" },
  under_review: { bg: "#fef9c3", text: "#ca8a04" },
  matured: { bg: "#eff6ff", text: "#2563eb" },
  submitted: { bg: "#f0fdf4", text: "#16a34a" },
  draft: { bg: "#f3f4f6", text: "#6b7280" },
  cancelled: { bg: "#fef2f2", text: "#dc2626" },
  rejected: { bg: "#fef2f2", text: "#dc2626" },
  approved: { bg: "#f0fdf4", text: "#16a34a" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>All your FD investment applications</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/fd">+ New FD</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: "var(--border)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1">No applications yet</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Explore and invest in high-yield fixed deposits.</p>
          <Button asChild variant="primary" size="md">
            <Link href="/fd">Browse FD Schemes</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const sc = statusColors[app.status] ?? statusColors.draft;
            return (
              <div key={String(app._id)} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0" style={{ background: "var(--primary)" }}>
                      {app.bankName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{String(app.bankName ?? "—")}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {String(app.schemeName ?? "")} · Applied {new Date(String(app.createdAt ?? Date.now())).toLocaleDateString("en-IN")}
                      </p>
                      {app.fdNumber && (
                        <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-secondary)" }}>{String(app.fdNumber)}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0" style={{ background: sc.bg, color: sc.text }}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Principal", value: `₹${fmt(app.principalAmount ?? 0)}` },
                    { label: "Rate", value: `${String(app.interestRate)}% p.a.` },
                    { label: "Tenure", value: app.tenureMonths ? `${app.tenureMonths} months` : "—" },
                    { label: "Maturity Amount", value: app.maturityAmount ? `₹${fmt(app.maturityAmount)}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: "var(--bg-light)" }}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {app.maturityAmount && app.principalAmount && (
                  <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span>Interest Earned: <strong style={{ color: "var(--success)" }}>+₹{fmt(app.maturityAmount - app.principalAmount)}</strong></span>
                  </div>
                )}

                {app.remarks && (
                  <p className="mt-2 text-xs px-3 py-2 rounded-lg" style={{ background: "#fef9c3", color: "#92400e" }}>
                    ⚠️ {String(app.remarks)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
