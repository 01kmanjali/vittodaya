import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import EMICalculator from "@/components/loans/EMICalculator";
import { connectDB } from "@/lib/mongodb";
import LoanProductModel from "@/lib/models/LoanProduct";
import { Home, Building, Factory, DollarSign, Calendar, Unlock } from "lucide-react";

interface LoanProduct {
  rateFrom: number;
  heroDesc: string;
  features: Array<{ title: string; desc: string; icon?: string }>;
  eligibility: Array<{ label: string; value: string }>;
  documents: Array<{ category: string; items: string[] }>;
}

function mapEmojiToIcon(e?: string) {
  switch (e) {
    case "🏠": return <Home className="w-8 h-8" />;
    case "🏢": return <Building className="w-8 h-8" />;
    case "🏭": return <Factory className="w-8 h-8" />;
    case "💰": return <DollarSign className="w-8 h-8" />;
    case "📅": return <Calendar className="w-8 h-8" />;
    case "🔓": return <Unlock className="w-8 h-8" />;
    default: return e ?? null;
  }
}

const propertyTypes = [
  { icon: "🏠", label: "Residential Property", desc: "Apartments, houses, villas, and row houses" },
  { icon: "🏢", label: "Commercial Property", desc: "Offices, shops, showrooms, and commercial complexes" },
  { icon: "🏭", label: "Industrial Property", desc: "Warehouses, factories, and industrial plots" },
];

const advantages = [
  { icon: "💰", title: "Lower Interest Rate", desc: "Being a secured loan, LAP attracts much lower rates than personal or business loans." },
  { icon: "📅", title: "Longer Tenure", desc: "Repay comfortably over 15 years with significantly lower monthly EMIs." },
  { icon: "🏠", title: "Retain Ownership", desc: "Your property remains yours — you can live in or continue to use it throughout the loan period." },
  { icon: "🔓", title: "Multipurpose Funds", desc: "Use the funds for any legal purpose — business, education, medical, or personal needs." },
];

export default async function LAPPage() {
  await connectDB();
  const raw = await LoanProductModel.findOne({ type: "lap", isActive: true }).lean();
  if (!raw) notFound();
  const loan = JSON.parse(JSON.stringify(raw)) as LoanProduct;

  return (
    <>
      <section className="text-white py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3b0764 0%, #4c1d95 60%, #7c3aed 100%)" }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-purple-300" />
                Starting at {loan.rateFrom}% p.a.
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Loan Against Property<br />
                <span className="text-purple-300">Unlock Hidden Value</span>
              </h1>
              <p className="text-lg text-purple-100 mb-6 leading-relaxed">{loan.heroDesc}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Loan Amount", value: "Up to ₹5 Cr" },
                  { label: "LTV Ratio", value: "Up to 60%" },
                  { label: "Tenure", value: "Up to 15 Yrs" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-purple-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>Apply Now</Link>
                <a href="#calculator" className="px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/30">Calculate EMI</a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 items-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image src="/images/loans-hero.jpeg" alt="Loan against property" width={600} height={420} className="w-full object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {loan.features.slice(0, 2).map(f => (
                    <div key={f.title} className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30">
                      <div className="font-semibold text-xs text-white mb-0.5">{f.title}</div>
                      <div className="text-xs text-purple-100 leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {loan.features.slice(2).map(f => (
                <div key={f.title} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 flex items-start gap-4 w-full max-w-md">
                  <span className="text-2xl">{mapEmojiToIcon(f.icon)}</span>
                  <div>
                    <div className="font-semibold text-sm mb-1">{f.title}</div>
                    <div className="text-xs text-purple-100">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Accepted Property Types</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {propertyTypes.map(p => (
              <div key={p.label} className="bg-white rounded-2xl border p-6 text-center card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="text-5xl mb-4">{mapEmojiToIcon(p.icon)}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{p.label}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Why Choose LAP?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map(a => (
              <div key={a.title} className="rounded-2xl border p-6 card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="text-3xl mb-3">{mapEmojiToIcon(a.icon)}</div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{a.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>LAP EMI Calculator</h2>
          </div>
          <EMICalculator title="Loan Against Property EMI Calculator" defaultAmount={3000000} minAmount={500000} maxAmount={50000000} defaultRate={10.5} defaultTenure={84} maxTenure={180} loanType="lap" />
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Eligibility Criteria</h2>
              <div className="space-y-3">
                {loan.eligibility.map(e => (
                  <div key={e.label} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#7c3aed" }} />
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
                  <div key={doc.category} className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: "#7c3aed" }}>{doc.category}</h3>
                    <ul className="space-y-1.5">
                      {doc.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span className="text-green-500">✓</span> {item}
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

      <section className="py-14" style={{ background: "#f5f3ff" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#3b0764" }}>Unlock the Power of Your Property</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "#7c3aed" }}>Apply for LAP</Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl font-semibold border border-purple-600 text-purple-700 hover:bg-purple-50">Talk to Our Expert</Link>
          </div>
        </div>
      </section>
    </>
  );
}
