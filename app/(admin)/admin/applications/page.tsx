"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplications, useUpdateApplicationStatus } from "@/lib/queries/useApplications";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";

const statusColors: Record<string, { bg: string; text: string }> = {
  active:       { bg: "#f0fdf4", text: "#16a34a" },
  under_review: { bg: "#fef9c3", text: "#ca8a04" },
  matured:      { bg: "#eff6ff", text: "#2563eb" },
  submitted:    { bg: "#f0fdf4", text: "#16a34a" },
  draft:        { bg: "#f3f4f6", text: "#6b7280" },
  cancelled:    { bg: "#fef2f2", text: "#dc2626" },
  rejected:     { bg: "#fef2f2", text: "#dc2626" },
  approved:     { bg: "#f0fdf4", text: "#16a34a" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

const statuses = ["all", "active", "under_review", "matured", "submitted", "cancelled"];

export default function AdminApplicationsPage() {
  const { canView, canWrite } = usePageRole("applications");
  const { data: applications = [], isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = applications.filter(a => {
    const matchesStatus = filter === "all" || a.status === filter;
    const matchesSearch = !search ||
      String(a.userName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      String(a.bankName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!canView) return <AccessDenied page="Applications" />;
  return (
    <div>
      {!canWrite && <ReadOnlyBanner />}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Applications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage all FD applications across the platform</p>
        </div>
        <Button variant="primaryOutline" size="md">Export CSV</Button>
      </div>

      <div className="bg-white rounded-2xl border p-4 mb-5 flex flex-wrap gap-3 items-center shadow-sm" style={{ borderColor: "var(--border)" }}>
        <input
          type="text"
          placeholder="Search by name or bank..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48"
          style={{ borderColor: "var(--border)" }}
        />
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <Button key={s} type="button" size="sm" onClick={() => setFilter(s)} variant={filter === s ? "primary" : "neutral"} className="rounded-full capitalize">
              {s === "all" ? "All" : s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-3 border-b text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          {isLoading ? "Loading…" : <><strong>{filtered.length}</strong> applications</>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Applicant", "Bank / Scheme", "Amount", "Rate", "Tenure", "Applied On", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(app => {
                const sc = statusColors[app.status ?? ""] ?? statusColors.draft;
                return (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{String(app.userName ?? "—")}</td>
                    <td className="px-5 py-4">
                      <div style={{ color: "var(--text-primary)" }}>{String(app.bankName ?? "—")}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{String(app.schemeName ?? "—")}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold">₹{fmt(app.principalAmount)}</td>
                    <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{app.interestRate}%</td>
                    <td className="px-5 py-4">{app.tenureMonths ? `${app.tenureMonths}M` : "—"}</td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                      {app.createdAt ? new Date(String(app.createdAt)).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.text }}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button variant="primaryOutline" size="sm">View</Button>
                        {app.status === "under_review" && (
                          <Button variant="success" size="sm" onClick={() => updateStatus.mutate({ id: app._id, status: "approved" })}>
                            Approve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
