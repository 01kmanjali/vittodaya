"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const dummyLoans = [
  { id: "EV-2025-001", name: "Anita Rao", vehicle: "Ola S1 Pro", vehicleType: "2-Wheeler", amount: 110000, rate: 9.49, tenure: "36M", status: "disbursed", appliedOn: "03 Jun 2025", city: "Bengaluru" },
  { id: "EV-2025-002", name: "Mohan Das", vehicle: "Tata Nexon EV", vehicleType: "4-Wheeler", amount: 1200000, rate: 9.99, tenure: "60M", status: "approved", appliedOn: "01 Jun 2025", city: "Chennai" },
  { id: "EV-2025-003", name: "Ravi Verma", vehicle: "Bajaj Chetak", vehicleType: "2-Wheeler", amount: 90000, rate: 8.99, tenure: "24M", status: "under_review", appliedOn: "28 May 2025", city: "Pune" },
  { id: "EV-2025-004", name: "Sita Nair", vehicle: "Mahindra XUV400", vehicleType: "4-Wheeler", amount: 1500000, rate: 10.5, tenure: "72M", status: "under_review", appliedOn: "25 May 2025", city: "Kochi" },
  { id: "EV-2025-005", name: "Suresh Babu", vehicle: "Piaggio E-Rickshaw", vehicleType: "3-Wheeler", amount: 220000, rate: 9.49, tenure: "48M", status: "disbursed", appliedOn: "20 May 2025", city: "Hyderabad" },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  approved: { bg: "#f0fdf4", text: "#15803d", label: "Approved" },
  under_review: { bg: "#fef9c3", text: "#b45309", label: "Under Review" },
  rejected: { bg: "#fef2f2", text: "#dc2626", label: "Rejected" },
  disbursed: { bg: "#eff6ff", text: "#1d4ed8", label: "Disbursed" },
};

const vehicleTypeColor: Record<string, { bg: string; text: string }> = {
  "2-Wheeler": { bg: "#ecfdf5", text: "#059669" },
  "3-Wheeler": { bg: "#fdf4ff", text: "#7e22ce" },
  "4-Wheeler": { bg: "#eff6ff", text: "#1d4ed8" },
};

function fmt(n: number) { return "₹" + new Intl.NumberFormat("en-IN").format(n); }

export default function AdminEVLoansPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = dummyLoans.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.vehicle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Applications", value: dummyLoans.length, color: "#059669" },
    { label: "Disbursed", value: dummyLoans.filter(l => l.status === "disbursed").length, color: "#1d4ed8" },
    { label: "Under Review", value: dummyLoans.filter(l => l.status === "under_review").length, color: "#b45309" },
    { label: "2-Wheelers", value: dummyLoans.filter(l => l.vehicleType === "2-Wheeler").length, color: "#059669" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Electric Vehicle Loans</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage all EV loan applications</p>
        </div>
        <Button type="button" variant="outline" className="px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50" style={{ color: "#059669", borderColor: "#059669" }}>
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
        <input type="text" placeholder="Search by name or vehicle..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48" style={{ borderColor: "var(--border)" }} />
        <div className="flex flex-wrap gap-2">
          {["all", "under_review", "approved", "disbursed", "rejected"].map(s => (
            <Button type="button" key={s} onClick={() => setFilter(s)} className="text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all" style={filter === s ? { background: "#059669", color: "white", borderColor: "#059669" } : { color: "var(--text-primary)", borderColor: "var(--border)" }}>
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
                {["App. ID", "Applicant", "Vehicle", "Type", "City", "Amount", "Rate", "Tenure", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(loan => {
                const sc = statusConfig[loan.status];
                const vc = vehicleTypeColor[loan.vehicleType] ?? vehicleTypeColor["2-Wheeler"];
                return (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{loan.id}</td>
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{loan.name}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.vehicle}</td>
                    <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: vc.bg, color: vc.text }}>{loan.vehicleType}</span></td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{loan.city}</td>
                    <td className="px-5 py-4 font-semibold">{fmt(loan.amount)}</td>
                    <td className="px-5 py-4 font-bold" style={{ color: "#059669" }}>{loan.rate}%</td>
                    <td className="px-5 py-4">{loan.tenure}</td>
                    <td className="px-5 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>View</Button>
                        {loan.status === "under_review" && <Button type="button" className="text-xs font-medium px-2.5 py-1 rounded-lg text-white" style={{ background: "#059669" }}>Approve</Button>}
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
