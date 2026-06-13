import Link from "next/link";
import Image from "next/image";
import EMICalculator from "@/components/loans/EMICalculator";
import { getLoanByType } from "@/constants/loans";

const loan = getLoanByType("ev")!;

const evTypes = [
  { icon: "🛵", label: "Electric 2-Wheeler", desc: "E-scooters & e-bikes from leading brands", rate: "From 8.99%" },
  { icon: "🛺", label: "Electric 3-Wheeler", desc: "E-rickshaws & electric cargo vehicles", rate: "From 9.49%" },
  { icon: "🚗", label: "Electric Car", desc: "Passenger EVs for personal & commercial use", rate: "From 9.99%" },
];

const govtBenefits = [
  { title: "FAME II Subsidy", desc: "Upfront subsidy on qualifying electric vehicles reducing your loan principal." },
  { title: "State EV Policy", desc: "Additional state government incentives available in 20+ states across India." },
  { title: "Income Tax Benefits", desc: "Deduction of up to ₹1.5 Lakhs on EV loan interest under Section 80EEB." },
  { title: "Road Tax Exemption", desc: "Many states offer 100% road tax exemption on electric vehicles." },
];

export default function EVLoanPage() {
  return (
    <>
      {/* Hero */}
      <section className="text-white py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #059669 100%)" }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                Go Green · Save More
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Electric Vehicle Loan<br />
                <span className="text-green-300">Drive the Future</span>
              </h1>
              <p className="text-lg text-green-100 mb-6 leading-relaxed">{loan.heroDesc}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Interest Rate", value: "8.99% p.a." },
                  { label: "Max LTV", value: "90%" },
                  { label: "Tenure", value: "Up to 84M" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="font-bold text-sm">{s.value}</div>
                    <div className="text-xs text-green-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                  Apply Now
                </Link>
                <a href="#calculator" className="px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/30">
                  Calculate EMI
                </a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 items-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/images/loans-hero.jpeg"
                  alt="Electric vehicle loan"
                  width={600}
                  height={420}
                  className="w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {loan.features.slice(0, 2).map(f => (
                    <div key={f.title} className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 border border-white/30">
                      <div className="font-semibold text-xs text-white mb-0.5">{f.title}</div>
                      <div className="text-xs text-green-100 leading-snug">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EV Types */}
      <section className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>EV Loan For Every Vehicle</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Finance any electric vehicle with our tailored loan products</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {evTypes.map(ev => (
              <div key={ev.label} className="bg-white rounded-2xl border p-6 text-center card-hover" style={{ borderColor: "var(--border)" }}>
                <div className="text-5xl mb-4">{ev.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{ev.label}</h3>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{ev.desc}</p>
                <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: "#ecfdf5", color: "#059669" }}>{ev.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Benefits */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Government Benefits You Can Avail</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Make your EV purchase even more affordable with these incentives</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {govtBenefits.map(b => (
              <div key={b.title} className="rounded-2xl border p-5 card-hover" style={{ borderColor: "var(--border)", background: "#ecfdf5" }}>
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold mb-3">✓</div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "#065f46" }}>{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#047857" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-14" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>EV Loan EMI Calculator</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Calculate your monthly instalment before you apply</p>
          </div>
          <EMICalculator title="EV Loan EMI Calculator" defaultAmount={150000} minAmount={50000} maxAmount={5000000} defaultRate={9.99} defaultTenure={36} maxTenure={84} loanType="ev" />
        </div>
      </section>

      {/* Eligibility & Docs */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Eligibility Criteria</h2>
              <div className="space-y-3">
                {loan.eligibility.map(e => (
                  <div key={e.label} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#059669" }} />
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
                    <h3 className="font-semibold text-sm mb-3" style={{ color: "#059669" }}>{doc.category}</h3>
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

      {/* CTA */}
      <section className="py-14" style={{ background: "#ecfdf5" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#065f46" }}>Make the Switch to Electric</h2>
          <p className="text-sm mb-6" style={{ color: "#047857" }}>
            Join thousands of EV owners who financed their green vehicle with Vittodaya.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register" className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}>
              Apply for EV Loan
            </Link>
            <Link href="/faq" className="px-6 py-3 rounded-xl font-semibold border border-green-600 text-green-700 hover:bg-green-50">
              FAQs on EV Loan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
