import Link from "next/link";
import Image from "next/image";
import {
  Target, Users, TrendingUp, Building2, ShieldCheck,
  Award, ArrowRight, Mail,
} from "lucide-react";

const team = [
  { name: "Vikram Joshi",  role: "CEO & Co-Founder",          bio: "15+ years in financial services and fintech.", seed: "vikram-joshi",  color: "#0f4c81", bg: "#eff6ff" },
  { name: "Deepa Nair",   role: "CTO",                        bio: "Ex-HDFC Bank technology lead, building digital-first banking.", seed: "deepa-nair",   color: "#7c3aed", bg: "#ede9fe" },
  { name: "Amit Gupta",   role: "Chief Investment Officer",   bio: "Former portfolio manager with expertise in fixed income.", seed: "amit-gupta",   color: "#059669", bg: "#d1fae5" },
  { name: "Sonal Mehta",  role: "Head of Compliance",         bio: "CA with deep expertise in SEBI and RBI regulatory frameworks.", seed: "sonal-mehta",  color: "#b45309", bg: "#fef3c7" },
];

const stats = [
  { value: "2019",     label: "Year Founded",              icon: <Building2 className="w-5 h-5" />,   color: "#0f4c81", bg: "#eff6ff" },
  { value: "25,000+", label: "Investors Served",           icon: <Users className="w-5 h-5" />,       color: "#7c3aed", bg: "#ede9fe" },
  { value: "₹500 Cr+",label: "Investments Facilitated",   icon: <TrendingUp className="w-5 h-5" />,  color: "#059669", bg: "#d1fae5" },
  { value: "8+",       label: "Partner Institutions",      icon: <Award className="w-5 h-5" />,       color: "#b45309", bg: "#fef3c7" },
];

const compliance = [
  { badge: "SEBI Registered", color: "#059669", bg: "#d1fae5" },
  { badge: "RBI Compliant",   color: "#0f4c81", bg: "#eff6ff" },
  { badge: "DICGC Insured",   color: "#7c3aed", bg: "#ede9fe" },
  { badge: "ISO 27001",       color: "#b45309", bg: "#fef3c7" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-light)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
                <Target className="w-4 h-4" /> Our Story
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Building the Future of<br />
                <span style={{ color: "var(--secondary-light)" }}>Indian Finance</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Vittodaya Financial Services Pvt. Ltd. is on a mission to democratize fixed deposit
                investments and credit access for every Indian.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "2019", label: "Founded" },
                  { value: "25K+", label: "Investors" },
                  { value: "₹500Cr+", label: "Facilitated" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero image */}
            <div className="hidden lg:block relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image src="/images/about.jpeg" alt="Vittodaya team" width={600} height={420} className="w-full object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-md" style={{ border: `1.5px solid ${s.bg}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* ── Mission ── */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#eff6ff", color: "var(--primary)" }}>
              Our Purpose
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>What We Stand For</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
            <div className="lg:grid lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#eff6ff", color: "var(--primary)" }}>
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Our Mission</h3>
                <p className="leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  At Vittodaya, we believe every Indian deserves access to the best investment options. We built this platform
                  to simplify fixed deposit investments — helping you compare rates from 50+ institutions, calculate returns
                  instantly, and invest with full confidence.
                </p>
                <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  The name &ldquo;Vittodaya&rdquo; (वित्तोदय) comes from Sanskrit — meaning the <em>rise of wealth</em>. We live by
                  this every day, helping our customers build lasting wealth through safe, high-yield fixed deposits.
                </p>
                <Link
                  href="/fd"
                  className="inline-flex items-center gap-2 mt-6 text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Explore Fixed Deposits <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative h-64 lg:h-auto">
                <Image src="https://picsum.photos/seed/finance-team-meeting/800/600" alt="Our team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Team ── */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#ede9fe", color: "#7c3aed" }}>
              Leadership
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>The People Behind Vittodaya</h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>Experienced leaders committed to your financial growth</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {team.map(member => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 flex items-start gap-4 transition-all duration-200 hover:shadow-md"
                style={{ border: `1.5px solid var(--border)` }}
              >
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <Image src={`https://picsum.photos/seed/${member.seed}/200/200`} alt={member.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
                      <p className="text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block" style={{ background: member.bg, color: member.color }}>
                        {member.role}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0 mt-0.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: member.bg, color: member.color }}>
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Compliance ── */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3" style={{ background: "#d1fae5", color: "#059669" }}>
              Trust & Safety
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Regulatory Compliance</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "1.5px solid var(--border)" }}>
            <div className="lg:grid lg:grid-cols-2">
              <div className="p-8 lg:p-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "#d1fae5", color: "#059669" }}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  Vittodaya Financial Services Pvt. Ltd. is a SEBI-registered investment advisor operating in full compliance
                  with all applicable RBI and SEBI guidelines. All partner banks are RBI-regulated, and deposits up to ₹5 lakhs
                  are insured under the DICGC scheme.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {compliance.map(c => (
                    <div key={c.badge} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: c.bg }}>
                      <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: c.color }} />
                      <span className="text-xs font-semibold" style={{ color: c.color }}>{c.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <Image src="https://picsum.photos/seed/financial-compliance/800/600" alt="Compliance" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── CTA ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6fba 100%)" }}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
          <div className="relative z-10 p-8 sm:p-12 text-center text-white">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white/15 backdrop-blur">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Start Growing Your Wealth Today</h3>
            <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
              Join 25,000+ investors who trust Vittodaya for safe, high-yield fixed deposits. Get started in minutes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/fd" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90" style={{ background: "var(--secondary)", color: "white" }}>
                Explore FD Rates <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/15 backdrop-blur hover:bg-white/25 border border-white/30 transition-colors">
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
