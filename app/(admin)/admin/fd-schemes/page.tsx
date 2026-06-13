"use client";

import { Button } from "@/components/ui/button";
import { useFDSchemes } from "@/lib/queries/useFDSchemes";

function getMaxRate(scheme: { tenureRates?: Array<{ regularRate: number; seniorRate?: number }> }, senior = false) {
  if (!scheme.tenureRates?.length) return 0;
  return Math.max(...scheme.tenureRates.map(r => senior ? (r.seniorRate ?? r.regularRate) : r.regularRate));
}

export default function AdminFDSchemesPage() {
  const { data: schemes = [], isLoading } = useFDSchemes();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>FD Schemes</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage fixed deposit schemes from partner institutions</p>
        </div>
        <Button variant="primary" size="md">+ Add Scheme</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Schemes", value: schemes.length },
          { label: "Active", value: schemes.filter(s => s.isActive).length },
          { label: "Tax Saver Available", value: schemes.filter(s => s.taxSaverFD).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "var(--bg-light)" }} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Institution", "Type", "Best Rate (Regular)", "Best Rate (Senior)", "Min Amount", "Rating", "Tax Saver", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {schemes.map(scheme => (
                <tr key={scheme._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{scheme.bankName}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{scheme.schemeName}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{scheme.bankType}</span>
                  </td>
                  <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{getMaxRate(scheme, false).toFixed(2)}%</td>
                  <td className="px-5 py-4 font-bold" style={{ color: "#b45309" }}>{getMaxRate(scheme, true).toFixed(2)}%</td>
                  <td className="px-5 py-4">₹{(scheme.minAmount ?? 0).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold" style={{ color: "#059669" }}>{scheme.rating}</span>
                    <span className="text-xs ml-1" style={{ color: "var(--text-secondary)" }}>({scheme.ratingAgency})</span>
                  </td>
                  <td className="px-5 py-4 text-center">{scheme.taxSaverFD ? "✅" : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scheme.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {scheme.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="primaryOutline" size="sm">Edit</Button>
                      <Button variant={scheme.isActive ? "dangerOutline" : "success"} size="sm">
                        {scheme.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
