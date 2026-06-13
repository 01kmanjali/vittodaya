import { fdSchemes, getMaxRate } from "@/constants/fdSchemes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminFDSchemesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>FD Schemes</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage fixed deposit schemes from partner institutions</p>
        </div>
        <Button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
          + Add Scheme
        </Button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Schemes", value: fdSchemes.length },
          { label: "Active", value: fdSchemes.filter(s => s.isActive).length },
          { label: "Tax Saver Available", value: fdSchemes.filter(s => s.taxSaverFD).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

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
              {fdSchemes.map(scheme => (
                <tr key={scheme.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{scheme.bankName}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{scheme.schemeName}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{scheme.bankType}</span>
                  </td>
                  <td className="px-5 py-4 font-bold" style={{ color: "var(--success)" }}>{getMaxRate(scheme, false).toFixed(2)}%</td>
                  <td className="px-5 py-4 font-bold" style={{ color: "var(--accent-dark)" }}>{getMaxRate(scheme, true).toFixed(2)}%</td>
                  <td className="px-5 py-4">₹{scheme.minAmount.toLocaleString("en-IN")}</td>
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
                      <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
                        Edit
                      </Button>
                      <Button type="button" variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--danger)" }}>
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
