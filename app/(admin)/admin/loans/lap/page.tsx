"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoanApplications, useUpdateLoanStatus } from "@/lib/queries/useLoanApplications";

const statusColors: Record<string, { bg: string; text: string }> = {
  approved:     { bg: "#f0fdf4", text: "#16a34a" },
  under_review: { bg: "#fef9c3", text: "#ca8a04" },
  submitted:    { bg: "#eff6ff", text: "#2563eb" },
  rejected:     { bg: "#fef2f2", text: "#dc2626" },
  cancelled:    { bg: "#f3f4f6", text: "#6b7280" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function AdminLAPPage() {
  const { data: loans = [], isLoading } = useLoanApplications({ type: "lap" });
  const updateStatus = useUpdateLoanStatus();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = loans.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch = !search ||
      (l.userName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.city ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Loan Against Property</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{loans.length} total applications</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: loans.length, color: "var(--primary)" },
          { label: "Approved", value: loans.filter(l => l.status === "approved").length, color: "#16a34a" },
          { label: "Under Review", value: loans.filter(l => l.status === "under_review").length, color: "#ca8a04" },
          { label: "Rejected", value: loans.filter(l => l.status === "rejected").length, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-4 flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
        <input type="text" placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48" style={{ borderColor: "var(--border)" }} />
        <div className="flex flex-wrap gap-2">
          {["all", "approved", "under_review", "submitted", "rejected"].map(s => (
            <Button key={s} type="button" size="sm" onClick={() => setFilter(s)}
              variant={filter === s ? "primary" : "neutral"}
              className="rounded-full capitalize">
              {s === "all" ? "All" : s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {isLoading ? (
          <div className="p-8 text-sm text-center" style={{ color: "var(--text-secondary)" }}>Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["Applicant", "Amount", "Rate", "Tenure", "City", "Applied On", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filtered.map(loan => {
                  const sc = statusColors[loan.status] ?? statusColors.cancelled;
                  return (
                    <tr key={loan._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{loan.userName ?? "—"}</td>
                      <td className="px-5 py-4 font-semibold">₹{fmt(loan.amount)}</td>
                      <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{loan.interestRate ? `${loan.interestRate}%` : "—"}</td>
                      <td className="px-5 py-4">{loan.tenure ?? "—"}</td>
                      <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{loan.city ?? "—"}</td>
                      <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                        {loan.createdAt ? new Date(String(loan.createdAt)).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.text }}>
                          {loan.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {loan.status === "under_review" && (
                            <>
                              <Button type="button" size="sm" variant="success" onClick={() => updateStatus.mutate({ id: loan._id, status: "approved" })}>Approve</Button>
                              <Button type="button" size="sm" variant="danger" onClick={() => updateStatus.mutate({ id: loan._id, status: "rejected" })}>Reject</Button>
                            </>
                          )}
                          {loan.status === "submitted" && (
                            <Button type="button" size="sm" variant="warning" onClick={() => updateStatus.mutate({ id: loan._id, status: "under_review" })}>Review</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={8} className="px-5 py-8 text-sm text-center" style={{ color: "var(--text-secondary)" }}>No applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
