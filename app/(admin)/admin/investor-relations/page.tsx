"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInvestorRecords, useDeleteInvestorRecord } from "@/lib/queries/useInvestorRelations";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";

export default function AdminInvestorRelationsPage() {
  const { canView, canWrite } = usePageRole("investor-relations");
  const { data: records = [], isLoading } = useInvestorRecords();
  const deleteRecord = useDeleteInvestorRecord();
  const [activeTab, setActiveTab] = useState<"results" | "reports" | "board">("results");
  const [showAddResult, setShowAddResult] = useState(false);

  const financialResults = records.filter(r => r.type === "financial_result");
  const annualReports = records.filter(r => r.type === "annual_report");
  const boardMembers = records.filter(r => r.type === "board_member");

  if (!canView) return <AccessDenied page="Investor Relations" />;
  return (
    <div>
      {!canWrite && <ReadOnlyBanner />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Investor Relations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage financial results, annual reports, and board information</p>
        </div>
        <Button type="button" variant="gold" size="md" disabled={!canWrite} onClick={() => setShowAddResult(!showAddResult)}>
          + Add Record
        </Button>
      </div>

      <div className="flex border-b mb-6" style={{ borderColor: "var(--border)" }}>
        {(["results", "reports", "board"] as const).map(tab => (
          <Button type="button" key={tab} onClick={() => setActiveTab(tab)} className="px-5 py-3 text-sm font-medium border-b-2 transition-colors" style={activeTab === tab ? { color: "var(--primary)", borderColor: "var(--primary)" } : { color: "var(--text-secondary)", borderColor: "transparent" }}>
            {tab === "reports" ? "Annual Reports" : tab === "board" ? "Board of Directors" : "Financial Results"}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "var(--bg-light)" }} />
          ))}
        </div>
      )}

      {!isLoading && activeTab === "results" && (
        <div>
          {showAddResult && (
            <div className="bg-white rounded-2xl border shadow-sm p-5 mb-5" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Add Financial Result</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["Title", "Year", "Published Date"].map(label => (
                  <div key={label}>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
                    <input type="text" placeholder={`Enter ${label.toLowerCase()}...`} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: "var(--border)" }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="primary" size="md" disabled={!canWrite}>Save</Button>
                <Button type="button" variant="neutral" size="md" onClick={() => setShowAddResult(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["Title", "Year", "Published", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {financialResults.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>{r.title}</td>
                    <td className="px-5 py-4">{r.year ?? "—"}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {r.publishedDate ? new Date(String(r.publishedDate)).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="primaryOutline" size="sm">Edit</Button>
                        <Button type="button" variant="dangerOutline" size="sm" onClick={() => deleteRecord.mutate(r._id)} disabled={deleteRecord.isPending}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!financialResults.length && (
                  <tr><td colSpan={4} className="px-5 py-4 text-sm text-center" style={{ color: "var(--text-secondary)" }}>No financial results yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && activeTab === "reports" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {annualReports.map(r => (
            <div key={r._id} className="bg-white rounded-2xl border p-5 shadow-sm text-center" style={{ borderColor: "var(--border)" }}>
              <div className="text-3xl mb-2">📄</div>
              <p className="font-bold mb-1" style={{ color: "var(--primary)" }}>{r.year ?? r.title}</p>
              <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                {r.publishedDate ? new Date(String(r.publishedDate)).toLocaleDateString("en-IN") : "—"}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="primaryOutline" size="sm" className="flex-1">Replace</Button>
                <Button type="button" variant="dangerOutline" size="sm" className="flex-1" onClick={() => deleteRecord.mutate(r._id)} disabled={deleteRecord.isPending}>Remove</Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Upload New Report</span>
          </Button>
        </div>
      )}

      {!isLoading && activeTab === "board" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {boardMembers.map(m => (
            <div key={m._id} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: m.imageColor ?? "var(--primary)" }}>
                    {m.imageInitial ?? m.title.charAt(0)}
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{m.title}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="primaryOutline" size="sm">Edit</Button>
                  <Button type="button" variant="dangerOutline" size="sm" onClick={() => deleteRecord.mutate(m._id)} disabled={deleteRecord.isPending}>Remove</Button>
                </div>
              </div>
              {m.description && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{m.description}</p>}
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center hover:bg-gray-50" style={{ borderColor: "var(--border)" }}>
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Add Board Member</span>
          </Button>
        </div>
      )}
    </div>
  );
}
