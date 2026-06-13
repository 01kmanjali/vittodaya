"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const dummyLoans = [
  { id: "LAP-2025-001", name: "Dilip Joshi", propertyType: "Residential", propertyValue: 8000000, loanAmount: 4500000, ltv: "56%", status: "under_review", appliedOn: "01 Jun 2025", city: "Mumbai" },
  { id: "LAP-2025-002", name: "Manish Shah", propertyType: "Commercial", propertyValue: 15000000, loanAmount: 8000000, ltv: "53%", status: "approved", appliedOn: "28 May 2025", city: "Ahmedabad" },
  { id: "LAP-2025-003", name: "Geeta Pillai", propertyType: "Residential", propertyValue: 6000000, loanAmount: 3200000, ltv: "53%", status: "disbursed", appliedOn: "20 May 2025", city: "Bengaluru" },
  { id: "LAP-2025-004", name: "Arjun Reddy", propertyType: "Industrial", propertyValue: 25000000, loanAmount: 12000000, ltv: "48%", status: "under_review", appliedOn: "15 May 2025", city: "Hyderabad" },
  { id: "LAP-2025-005", name: "Kavita Nair", propertyType: "Residential", propertyValue: 5000000, loanAmount: 2800000, ltv: "56%", status: "rejected", appliedOn: "10 May 2025", city: "Kochi" },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  approved: { bg: "#f0fdf4", text: "#15803d", label: "Approved" },
  under_review: { bg: "#fef9c3", text: "#b45309", label: "Under Review" },
  rejected: { bg: "#fef2f2", text: "#dc2626", label: "Rejected" },
  disbursed: { bg: "#eff6ff", text: "#1d4ed8", label: "Disbursed" },
};

const propTypeColor: Record<string, { bg: string; text: string }> = {
  Residential: { bg: "#eff6ff", text: "#1d4ed8" },
  Commercial: { bg: "#fdf4ff", text: "#7e22ce" },
  Industrial: { bg: "#fff7ed", text: "#c2410c" },
};

function fmt(n: number) { return "₹" + new Intl.NumberFormat("en-IN").format(n); }

export default function AdminLAPPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = dummyLoans.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Applications", value: dummyLoans.length, color: "#7c3aed" },
    { label: "Under Review", value: dummyLoans.filter(l => l.status === "under_review").length, color: "#b45309" },
    { label: "Approved", value: dummyLoans.filter(l => l.status === "approved").length, color: "#15803d" },
    { label: "Total Loan Value", value: "₹3.05Cr", color: "#7c3aed" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Loan Against Property</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage all LAP applications</p>
        </div>
        <Button type="button" variant="outline" className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50" style={{ color: "#7c3aed", borderColor: "#7c3aed" }}>
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
        <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48" style={{ borderColor: "var(--border)" }} />
        <div className="flex flex-wrap gap-2">
          {["all", "under_review", "approved", "disbursed", "rejected"].map(s => (
            <Button type="button" key={s} onClick={() => setFilter(s)} className="text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all" style={filter === s ? { background: "#7c3aed", color: "white", borderColor: "#7c3aed" } : { color: "var(--text-primary)", borderColor: "var(--border)" }}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["App. ID", "Applicant", "Property Type", "Property Value", "Loan Amount", "LTV", "City", "Applied On", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(loan => {
                const sc = statusConfig[loan.status];
                const pc = propTypeColor[loan.propertyType] ?? propTypeColor.Residential;
                return (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{loan.id}</td>
                    <td className="px-4 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{loan.name}</td>
                    <td className="px-4 py-4"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.text }}>{loan.propertyType}</span></td>
                    <td className="px-4 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{fmt(loan.propertyValue)}</td>
                    <td className="px-4 py-4 font-semibold">{fmt(loan.loanAmount)}</td>
                    <td className="px-4 py-4 font-medium" style={{ color: "#7c3aed" }}>{loan.ltv}</td>
                    <td className="px-4 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.city}</td>
                    <td className="px-4 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.appliedOn}</td>
                    <td className="px-4 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>View</Button>
                        {loan.status === "under_review" && <Button type="button" className="text-xs font-medium px-2.5 py-1 rounded-lg text-white" style={{ background: "#7c3aed" }}>Approve</Button>}
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
