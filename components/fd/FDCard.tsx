import Link from "next/link";
import type { FDScheme as FDSchemeDoc } from "@/lib/queries/useFDSchemes";

export type { FDSchemeDoc };

interface Props {
  scheme: FDSchemeDoc;
  selectedMonths?: number;
  isSenior?: boolean;
}

const ratingColor: Record<string, string> = {
  AAA: "#059669",
  "AA+": "#059669",
  "AA-": "#0ea5e9",
  "A+": "#f59e0b",
  A: "#f59e0b",
};

function getBestRate(scheme: FDSchemeDoc, months?: number, isSenior = false): { rate: number; label: string } {
  if (months) {
    const found = scheme.tenureRates.find(r => r.tenureMonths === months);
    if (found) return { rate: isSenior ? found.seniorRate : found.regularRate, label: found.tenureLabel };
  }
  const best = [...scheme.tenureRates].sort((a, b) =>
    (isSenior ? b.seniorRate - a.seniorRate : b.regularRate - a.regularRate)
  )[0];
  return { rate: isSenior ? best.seniorRate : best.regularRate, label: best.tenureLabel };
}

export default function FDCard({ scheme, selectedMonths, isSenior = false }: Props) {
  const { rate, label } = getBestRate(scheme, selectedMonths, isSenior);
  const isHighlighted = scheme.tags.includes("Highest Rate") || scheme.tags.includes("Top Pick");
  const href = `/fd/${scheme.slug ?? scheme.id ?? scheme._id}`;

  return (
    <div
      className={`bg-white rounded-2xl border card-hover ${isHighlighted ? "ring-2 ring-amber-400" : ""}`}
      style={{ borderColor: isHighlighted ? "var(--accent)" : "var(--border)" }}
    >
      {isHighlighted && (
        <div className="text-center text-xs font-bold text-white py-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
          ⭐ HIGHEST RATE
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ background: "var(--primary)" }}>
              {scheme.bankName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{scheme.bankName}</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{scheme.bankType}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: ratingColor[scheme.rating] || "var(--text-secondary)", background: `${ratingColor[scheme.rating] ?? "#6b7280"}18` }}>
              {scheme.rating} ({scheme.ratingAgency})
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{selectedMonths ? `Rate for ${label}` : "Best Rate"}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold" style={{ color: "var(--success)" }}>{rate.toFixed(2)}</span>
              <span className="text-base font-medium" style={{ color: "var(--success)" }}>% p.a.</span>
            </div>
            {isSenior && <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>+0.50% for senior citizens</p>}
          </div>
          <div className="text-right">
            <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>Min. Amount</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>₹{scheme.minAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {scheme.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#eff6ff", color: "#2563eb" }}>{tag}</span>
          ))}
          {scheme.taxSaverFD && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#f0fdf4", color: "#16a34a" }}>Tax Saver</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          {[
            { label: "Premature", value: scheme.prematureWithdrawal },
            { label: "Loan Against", value: scheme.loanAgainstFD },
            { label: "Auto Renew", value: scheme.autoRenewal },
          ].map(({ label, value }) => (
            <div key={label} className="py-2 rounded-lg" style={{ background: "var(--bg-light)" }}>
              <div className="text-sm">{value ? "✓" : "✗"}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</div>
            </div>
          ))}
        </div>

        <Link href={href} className="block w-full text-center text-sm font-semibold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
          Invest Now
        </Link>
      </div>
    </div>
  );
}
