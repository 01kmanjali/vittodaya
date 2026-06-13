"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { applications } from "@/constants/applications";

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

const statuses = ["all", "active", "under_review", "matured", "submitted", "cancelled"];

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = applications.filter(a => {
    const matchesStatus = filter === "all" || a.status === filter;
    const matchesSearch = !search || a.userName.toLowerCase().includes(search.toLowerCase()) || a.bankName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Applications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage all FD applications across the platform</p>
        </div>
        <Button type="button" variant="outline" className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50 transition-colors" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
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
            <Button
              type="button"
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all"
              style={
                filter === s
                  ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                  : { background: "white", color: "var(--text-primary)", borderColor: "var(--border)" }
              }
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-3 border-b text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          Showing <strong>{filtered.length}</strong> applications
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
                const sc = statusColors[app.status] ?? statusColors.draft;
                return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{app.userName}</td>
                    <td className="px-5 py-4">
                      <div style={{ color: "var(--text-primary)" }}>{app.bankName}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{app.schemeName}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold">₹{fmt(app.principalAmount)}</td>
                    <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{app.interestRate}%</td>
                    <td className="px-5 py-4">{app.tenureLabel}</td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{app.appliedAt}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.text }}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
                          View
                        </Button>
                        {app.status === "under_review" && (
                          <Button type="button" className="text-xs font-medium px-2.5 py-1 rounded-lg text-white transition-opacity hover:opacity-80" style={{ background: "var(--success)" }}>
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
