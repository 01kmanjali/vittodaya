import Link from "next/link";
import Image from "next/image";
import EMICalculator from "@/components/loans/EMICalculator";
import EligibilityCalculator from "@/components/loans/EligibilityCalculator";
import { getLoanByType } from "@/constants/loans";

const loan = getLoanByType("personal")!;

const steps = [
  { step: "01", title: "Fill Application", desc: "Complete the online form with personal and income details in under 5 minutes." },
  { step: "02", title: "Upload Documents", desc: "Upload KYC and income proof digitally. No branch visit required." },
  { step: "03", title: "Get Approval", desc: "Our credit team reviews and approves your application within 24 hours." },
  { step: "04", title: "Receive Funds", desc: "Loan amount is credited directly to your bank account within 24 hours of approval." },
];

export default function PersonalLoanPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Starting at {loan.rateFrom}% p.a.
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Personal Loan<br />
                <span style={{ color: "var(--secondary-light)" }}>Up to ₹25 Lakhs</span>
              </h1>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">{loan.heroDesc}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Loan Amount", value: "₹50K – ₹25L" },
                  { label: "Interest Rate", value: `${loan.rateFrom}% p.a.` },
                  { label: "Tenure", value: "12 – 60 Months" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                  Apply Now
                </Link>
                <a href="#emi-calculator" className="px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/30 transition-colors">
                  Calculate EMI
                </a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 items-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/images/loans-hero.jpeg"
                  alt="Personal loan – quick approval"
                  width={600}
                  height={420}
                  className="w-full object-cover"
                  priority
                />
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

      {/* Tags */}
      <div className="border-b py-3" style={{ background: "var(--bg-light)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3 flex-wrap">
          {loan.tags.map(t => (
            <span key={t} className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Calculators */}
      <section id="emi-calculator" className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#eff6ff", color: "var(--primary)" }}>Interactive Tools</span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Loan Calculators</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Plan your loan with our interactive tools</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <EMICalculator title="Personal Loan EMI Calculator" defaultAmount={500000} minAmount={50000} maxAmount={2500000} defaultRate={12} defaultTenure={36} maxTenure={60} loanType="personal" />
            <EligibilityCalculator title="Personal Loan Eligibility Calculator" loanType="personal" />
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-14">
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
                  <div key={doc.category} className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--primary)" }}>{doc.category}</h3>
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

      {/* How it Works */}
      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#d1fae5", color: "#059669" }}>Simple Process</span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>How It Works</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Get your loan in 4 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 z-0" style={{ background: "var(--border)" }} />
                )}
                <div className="bg-white rounded-2xl border p-6 relative z-10" style={{ borderColor: "var(--border)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white mb-4" style={{ background: "var(--primary)" }}>
                    {s.step}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="relative z-10 p-8 sm:p-12 text-center text-white">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/15 backdrop-blur">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
              Apply online in minutes. Our team will get back to you within 2 business hours.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90" style={{ background: "var(--secondary)", color: "white" }}>
                Apply for Personal Loan →
              </Link>
              <Link href="/faq" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/15 backdrop-blur hover:bg-white/25 border border-white/30 transition-colors">
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
