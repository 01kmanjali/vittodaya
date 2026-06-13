"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { annualReports, financialResults, boardMembers, keyFinancialHighlights } from "@/constants/investorRelations";

export default function AdminInvestorRelationsPage() {
  const [activeTab, setActiveTab] = useState<"highlights" | "results" | "reports" | "board">("highlights");
  const [showAddResult, setShowAddResult] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Investor Relations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage financial results, annual reports, and board information</p>
        </div>
        <Button type="button" onClick={() => setShowAddResult(!showAddResult)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
          + Add Result
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: "var(--border)" }}>
        {(["highlights", "results", "reports", "board"] as const).map(tab => (
          <Button type="button" key={tab} onClick={() => setActiveTab(tab)} className="px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize" style={activeTab === tab ? { color: "var(--primary)", borderColor: "var(--primary)" } : { color: "var(--text-secondary)", borderColor: "transparent" }}>
            {tab === "reports" ? "Annual Reports" : tab === "board" ? "Board of Directors" : tab === "results" ? "Financial Results" : "Key Highlights"}
          </Button>
        ))}
      </div>

      {/* Highlights */}
      {activeTab === "highlights" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>As of Q3 FY2024–25</p>
            <Button type="button" variant="outline" className="text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit All</Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFinancialHighlights.map(h => (
              <div key={h.label} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{h.label}</p>
                  <Button type="button" variant="ghost" size="sm" className="text-xs h-auto p-0" style={{ color: "var(--primary)" }}>Edit</Button>
                </div>
                <p className="text-xl font-bold mb-1" style={{ color: "var(--primary)" }}>{h.value}</p>
                <p className="text-xs font-medium" style={{ color: "var(--success)" }}>{h.change}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Results */}
      {activeTab === "results" && (
        <div>
          {showAddResult && (
            <div className="bg-white rounded-2xl border shadow-sm p-5 mb-5" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Add Financial Result</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["Quarter / Period", "Revenue", "Net Profit", "Net NPA", "Published Date"].map(label => (
                  <div key={label}>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
                    <input type="text" placeholder={`Enter ${label.toLowerCase()}...`} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: "var(--border)" }} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Result Type</label>
                  <select className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: "var(--border)" }}>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" className="px-5 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "var(--primary)" }}>Save Result</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddResult(false)} className="px-5 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["Period", "Type", "Revenue", "Net Profit", "Net NPA", "Published", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {financialResults.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>{r.quarter}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={r.type === "annual" ? { background: "#fef3c7", color: "#92400e" } : { background: "#eff6ff", color: "#1d4ed8" }}>
                        {r.type === "annual" ? "Annual" : "Quarterly"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{r.revenue}</td>
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--success)" }}>{r.netProfit}</td>
                    <td className="px-5 py-4">{r.npa}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>{r.publishedDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit</Button>
                        <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Annual Reports */}
      {activeTab === "reports" && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {annualReports.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border p-5 shadow-sm text-center" style={{ borderColor: "var(--border)" }}>
                <div className="text-3xl mb-2">📄</div>
                <p className="font-bold mb-1" style={{ color: "var(--primary)" }}>{r.year}</p>
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{r.publishedDate}</p>
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>{r.fileSize}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1 text-xs font-medium px-2 py-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Replace</Button>
                  <Button type="button" variant="outline" className="flex-1 text-xs font-medium px-2 py-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Remove</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)" }}>
              <span className="text-3xl mb-2">+</span>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Upload New Report</span>
            </Button>
          </div>
        </div>
      )}

      {/* Board */}
      {activeTab === "board" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {boardMembers.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "var(--primary)" }}>{m.imageInitial}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                    <p className="text-xs" style={{ color: "var(--secondary)" }}>{m.designation}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>Edit</Button>
                  <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>Remove</Button>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{m.experience}</p>
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)" }}>
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Add Board Member</span>
          </Button>
        </div>
      )}
    </div>
  );
}
