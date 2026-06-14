import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import EMICalculator from "@/components/loans/EMICalculator";
import EligibilityCalculator from "@/components/loans/EligibilityCalculator";
import { connectDB } from "@/lib/mongodb";
import LoanProductModel from "@/lib/models/LoanProduct";
import { Package, Settings, Store, Laptop, Truck, HardHat, Factory, TrendingUp, Check } from "lucide-react";

interface LoanProduct {
  rateFrom: number;
  heroDesc: string;
  features: Array<{ title: string; desc: string }>;
  eligibility: Array<{ label: string; value: string }>;
  documents: Array<{ category: string; items: string[] }>;
}

const useCases = [
  { icon: "📦", title: "Working Capital", desc: "Finance day-to-day operations, raw material procurement, and inventory." },
  { icon: "⚙️", title: "Machinery Purchase", desc: "Upgrade equipment and production capacity with easy term financing." },
  { icon: "🏪", title: "Business Expansion", desc: "Open new outlets, renovate premises, or enter new markets." },
  { icon: "💻", title: "Technology Upgrade", desc: "Invest in software, hardware, and digital tools to modernise your business." },
  { icon: "🚛", title: "Supply Chain Finance", desc: "Bridge cash flow gaps between payment cycles and receivables." },
  { icon: "🏗️", title: "Project Finance", desc: "Fund large capital expenditure projects with structured term loans." },
];

function mapUseCaseIcon(e?: string) {
  switch (e) {
    case "📦": return <Package className="w-7 h-7" />;
    case "⚙️": return <Settings className="w-7 h-7" />;
    case "🏪": return <Store className="w-7 h-7" />;
    case "💻": return <Laptop className="w-7 h-7" />;
    case "🚛": return <Truck className="w-7 h-7" />;
    case "🏗️": return <HardHat className="w-7 h-7" />;
    case "🏭": return <Factory className="w-7 h-7" />;
    case "📈": return <TrendingUp className="w-7 h-7" />;
    default: return e ?? null;
  }
}

export default async function MSMELoanPage() {
  await connectDB();
  const raw = await LoanProductModel.findOne({ type: "msme", isActive: true }).lean();
  if (!raw) notFound();
  const loan = JSON.parse(JSON.stringify(raw)) as LoanProduct;

  return (
    <>
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Collateral-free loans up to ₹50 Lakhs
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                MSME / Business Loan<br />
                <span style={{ color: "var(--secondary-light)" }}>Up to ₹1 Crore</span>
              </h1>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">{loan.heroDesc}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Loan Amount", value: "₹1L – ₹1Cr" },
                  { label: "Interest Rate", value: `${loan.rateFrom}% p.a.` },
                  { label: "Tenure", value: "12 – 84 Months" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>Apply Now</Link>
                <a href="#calculators" className="px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/30">Calculate EMI</a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 items-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image src="/images/loans-hero.jpeg" alt="MSME business loan" width={600} height={420} className="w-full object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {loan.features.slice(0, 2).map(f => (
                    <div key={f.title} className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30">
                      <div className="font-semibold text-xs text-white mb-0.5">{f.title}</div>
                      <div className="text-xs text-blue-100 leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>What Can You Use It For?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map(u => (
              <div key={u.title} className="bg-white rounded-2xl border p-6 card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="text-3xl mb-3">{mapUseCaseIcon(u.icon)}</div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{u.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculators" className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Business Loan Calculators</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <EMICalculator title="Business Loan EMI Calculator" defaultAmount={1000000} minAmount={100000} maxAmount={10000000} defaultRate={14} defaultTenure={36} maxTenure={84} loanType="personal" />
            <EligibilityCalculator title="Business Loan Eligibility Calculator" loanType="business" />
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Eligibility Criteria</h2>
              <div className="space-y-3">
                {loan.eligibility.map(e => (
                  <div key={e.label} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "var(--secondary)" }} />
                    <div>
                      <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{e.label}: </span>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{e.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Documents Required</h2>
              <div className="space-y-4">
                {loan.documents.map(doc => (
                  <div key={doc.category} className="rounded-xl border p-4 bg-white" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--primary)" }}>{doc.category}</h3>
                    <ul className="space-y-1.5">
                      {doc.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <Check className="w-4 h-4 text-green-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Grow Your Business Today</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>Apply for Business Loan</Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl font-semibold border hover:bg-gray-50" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>Talk to an Expert</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const dynamic = "force-dynamic";
