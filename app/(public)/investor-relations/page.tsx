"use client";

import { useState } from "react";
import { useInvestorRecords } from "@/lib/queries/useInvestorRelations";

export default function InvestorRelationsPage() {
  const { data: records = [], isLoading } = useInvestorRecords({ active: "true" });
  const [activeTab, setActiveTab] = useState<"annual-reports" | "results" | "board">("annual-reports");

  const annualReports = records.filter(r => r.type === "annual_report");
  const financialResults = records.filter(r => r.type === "financial_result");
  const boardMembers = records.filter(r => r.type === "board_member");

  return (
    <>
      <section className="gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/15 mb-4">
              Investor Relations
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Investor Relations</h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Annual reports, financial results, and board information for Vittodaya Financial Services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 border-b mb-8" style={{ borderColor: "var(--border)" }}>
          {(["annual-reports", "results", "board"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 text-sm font-medium border-b-2 transition-colors"
              style={activeTab === tab
                ? { color: "var(--primary)", borderColor: "var(--primary)" }
                : { color: "var(--text-secondary)", borderColor: "transparent" }
              }
            >
              {tab === "annual-reports" ? "Annual Reports" : tab === "results" ? "Financial Results" : "Board of Directors"}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--bg-light)" }} />
            ))}
          </div>
        )}

        {!isLoading && activeTab === "annual-reports" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {annualReports.map(r => (
              <div key={r._id} className="bg-white rounded-2xl border p-5 text-center card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="text-4xl mb-3">📄</div>
                <p className="font-bold mb-1" style={{ color: "var(--primary)" }}>{r.year ?? r.title}</p>
                {r.publishedDate && (
                  <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                    {new Date(String(r.publishedDate)).toLocaleDateString("en-IN")}
                  </p>
                )}
                {r.fileUrl ? (
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: "var(--primary)" }}>
                    Download PDF
                  </a>
                ) : <span className="text-xs" style={{ color: "var(--text-secondary)" }}>—</span>}
              </div>
            ))}
            {!annualReports.length && (
              <p className="col-span-4 text-center py-10 text-sm" style={{ color: "var(--text-secondary)" }}>No annual reports available yet.</p>
            )}
          </div>
        )}

        {!isLoading && activeTab === "results" && (
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["Period / Title", "Year", "Published", "Document"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {financialResults.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{r.title}</td>
                    <td className="px-5 py-4">{r.year ?? "—"}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {r.publishedDate ? new Date(String(r.publishedDate)).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {r.fileUrl ? (
                        <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline" style={{ color: "var(--primary)" }}>View PDF</a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
                {!financialResults.length && (
                  <tr><td colSpan={4} className="px-5 py-10 text-sm text-center" style={{ color: "var(--text-secondary)" }}>No financial results available yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && activeTab === "board" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boardMembers.map(m => (
              <div key={m._id} className="bg-white rounded-2xl border p-5 card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0" style={{ background: m.imageColor ?? "var(--primary)" }}>
                    {m.imageInitial ?? m.title.charAt(0)}
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{m.title}</p>
                </div>
                {m.description && (
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.description}</p>
                )}
              </div>
            ))}
            {!boardMembers.length && (
              <p className="col-span-3 text-center py-10 text-sm" style={{ color: "var(--text-secondary)" }}>No board members listed yet.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
