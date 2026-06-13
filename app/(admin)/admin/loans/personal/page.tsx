"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const dummyLoans = [
  { id: "PL-2025-001", name: "Rahul Sharma", amount: 500000, rate: 12.5, tenure: "36 Months", status: "approved", appliedOn: "01 Jun 2025", city: "Mumbai" },
  { id: "PL-2025-002", name: "Priya Mehta", amount: 250000, rate: 13.0, tenure: "24 Months", status: "under_review", appliedOn: "28 May 2025", city: "Pune" },
  { id: "PL-2025-003", name: "Amit Patel", amount: 750000, rate: 11.5, tenure: "48 Months", status: "approved", appliedOn: "25 May 2025", city: "Ahmedabad" },
  { id: "PL-2025-004", name: "Sunita Joshi", amount: 150000, rate: 14.0, tenure: "12 Months", status: "rejected", appliedOn: "20 May 2025", city: "Bengaluru" },
  { id: "PL-2025-005", name: "Vikram Singh", amount: 1000000, rate: 11.0, tenure: "60 Months", status: "disbursed", appliedOn: "18 May 2025", city: "Delhi" },
  { id: "PL-2025-006", name: "Neha Gupta", amount: 300000, rate: 12.0, tenure: "36 Months", status: "under_review", appliedOn: "15 May 2025", city: "Mumbai" },
  { id: "PL-2025-007", name: "Rajesh Kumar", amount: 200000, rate: 13.5, tenure: "24 Months", status: "draft", appliedOn: "10 May 2025", city: "Hyderabad" },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  approved: { bg: "#f0fdf4", text: "#15803d", label: "Approved" },
  under_review: { bg: "#fef9c3", text: "#b45309", label: "Under Review" },
  rejected: { bg: "#fef2f2", text: "#dc2626", label: "Rejected" },
  disbursed: { bg: "#eff6ff", text: "#1d4ed8", label: "Disbursed" },
  draft: { bg: "#f3f4f6", text: "#6b7280", label: "Draft" },
};

function fmt(n: number) {
  return "₹" + new Intl.NumberFormat("en-IN").format(n);
}

export default function AdminPersonalLoansPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = dummyLoans.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Applications", value: dummyLoans.length, color: "var(--primary)" },
    { label: "Approved", value: dummyLoans.filter(l => l.status === "approved").length, color: "#15803d" },
    { label: "Under Review", value: dummyLoans.filter(l => l.status === "under_review").length, color: "#b45309" },
    { label: "Disbursed", value: dummyLoans.filter(l => l.status === "disbursed").length, color: "#1d4ed8" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Personal Loans</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage all personal loan applications</p>
        </div>
        <Button type="button" variant="outline" className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
          + Add Application
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-4 flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48"
          style={{ borderColor: "var(--border)" }}
        />
        <div className="flex flex-wrap gap-2">
          {["all", "under_review", "approved", "disbursed", "rejected", "draft"].map(s => (
            <Button
              type="button"
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all"
              style={filter === s ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { color: "var(--text-primary)", borderColor: "var(--border)" }}
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
                {["App. ID", "Applicant", "City", "Amount", "Rate", "Tenure", "Applied On", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(loan => {
                const sc = statusConfig[loan.status];
                return (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{loan.id}</td>
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{loan.name}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.city}</td>
                    <td className="px-5 py-4 font-semibold">{fmt(loan.amount)}</td>
                    <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{loan.rate}%</td>
                    <td className="px-5 py-4">{loan.tenure}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.appliedOn}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>View</Button>
                        {loan.status === "under_review" && (
                          <Button type="button" className="text-xs font-medium px-2.5 py-1 rounded-lg text-white" style={{ background: "var(--success)" }}>Approve</Button>
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
