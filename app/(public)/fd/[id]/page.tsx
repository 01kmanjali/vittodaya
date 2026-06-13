import Link from "next/link";
import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import FDSchemeModel from "@/lib/models/FDScheme";
import FDCalculator from "@/components/fd/FDCalculator";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FDDetailPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const raw = await FDSchemeModel.findOne({ slug: id, isActive: true }).lean();
  if (!raw) notFound();

  const scheme = JSON.parse(JSON.stringify(raw)) as {
    _id: string;
    slug: string;
    bankName: string;
    bankType: string;
    schemeName: string;
    rating: string;
    ratingAgency: string;
    tags: string[];
    minAmount: number;
    compoundingFrequency: string;
    prematureWithdrawal: boolean;
    loanAgainstFD: boolean;
    autoRenewal: boolean;
    taxSaverFD: boolean;
    tenureRates: Array<{ tenureMonths: number; tenureLabel: string; regularRate: number; seniorRate: number }>;
  };

  return (
    <div style={{ background: "var(--bg-light)", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/fd" className="hover:underline">Fixed Deposits</Link>
          <span className="mx-2">/</span>
          <span style={{ color: "var(--text-primary)" }}>{scheme.bankName}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0" style={{ background: "var(--primary)" }}>
                  {scheme.bankName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{scheme.bankName}</h1>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{scheme.schemeName} · {scheme.bankType}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                      {scheme.rating} ({scheme.ratingAgency})
                    </span>
                    {scheme.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Min. Deposit", value: `₹${scheme.minAmount.toLocaleString("en-IN")}` },
                  { label: "Compounding", value: scheme.compoundingFrequency },
                  { label: "Premature Exit", value: scheme.prematureWithdrawal ? "Allowed" : "Not Allowed" },
                  { label: "Loan Against FD", value: scheme.loanAgainstFD ? "Available" : "Not Available" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "var(--bg-light)" }}>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Interest Rates by Tenure</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--bg-light)" }}>
                      <th className="text-left px-6 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Tenure</th>
                      <th className="text-right px-6 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Regular Rate</th>
                      <th className="text-right px-6 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Senior Citizen Rate</th>
                      <th className="text-right px-6 py-3 font-medium" style={{ color: "var(--text-secondary)" }}></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {scheme.tenureRates.map(r => (
                      <tr key={r.tenureMonths} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{r.tenureLabel}</td>
                        <td className="px-6 py-4 text-right font-bold" style={{ color: "var(--success)" }}>{r.regularRate.toFixed(2)}%</td>
                        <td className="px-6 py-4 text-right font-bold" style={{ color: "var(--accent-dark)" }}>{r.seniorRate.toFixed(2)}%</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href="/register"
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
                          >
                            Invest
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Scheme Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Premature Withdrawal", value: scheme.prematureWithdrawal },
                  { label: "Loan Against FD", value: scheme.loanAgainstFD },
                  { label: "Auto Renewal", value: scheme.autoRenewal },
                  { label: "Tax Saver (80C)", value: scheme.taxSaverFD },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-light)" }}>
                    <span>{value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/register"
                className="flex-1 text-center text-sm font-semibold py-3 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
              >
                Invest in This FD
              </Link>
              <Link href="/fd" className="px-6 text-sm font-semibold py-3 rounded-xl border transition-colors hover:bg-gray-50" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
                ← Back
              </Link>
            </div>
          </div>

          <div className="hidden xl:block w-80 shrink-0 sticky top-20">
            <FDCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
