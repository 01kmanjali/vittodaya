import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2, Shield, Landmark, Headphones,
  ClipboardList, FileText, HandshakeIcon, GraduationCap, TrendingUp,
  Building2, Home, Percent, RefreshCw, Banknote,
} from "lucide-react";
import {
  FadeUp, FadeIn, SlideRight, SlideLeft, StaggerGrid, StaggerItem, AnimatedCircles,
} from "@/components/motion";
import PartnerForm from "./PartnerForm";

// ─── Static data ─────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: Banknote,
    title: "Attractive & Transparent Payouts",
    desc: "Competitive commission structures with clear payout timelines and no hidden deductions.",
  },
  {
    icon: Landmark,
    title: "Strong Bank & NBFC Network",
    desc: "Access to multiple leading banks and NBFCs, enabling higher approval chances and structured solutions for diverse customer profiles.",
  },
  {
    icon: TrendingUp,
    title: "Fast Credit Decisions & Disbursement",
    desc: "Experienced internal credit team ensuring quick login, faster approvals, and smooth disbursement.",
  },
  {
    icon: Headphones,
    title: "Dedicated Relationship Support",
    desc: "Single point of contact for case tracking, coordination, and end-to-end support till disbursement.",
  },
  {
    icon: Shield,
    title: "Ethical & Compliant Processes",
    desc: "100% transparent dealings with regulatory-aligned documentation and long-term partnership focus.",
  },
];

const products = [
  { icon: Home,       label: "Loan Against Property (LAP)" },
  { icon: Building2,  label: "Residential & Commercial Property Loans" },
  { icon: Banknote,   label: "High-Value Ticket Size Funding" },
  { icon: Percent,    label: "Competitive ROI & Flexible Tenure" },
  { icon: RefreshCw,  label: "Balance Transfer & Top-Up Options" },
];

const onboardingSteps = [
  { step: 1, icon: ClipboardList, title: "Submit Partnership Request",       desc: "Fill out our quick partner registration form with your basic details." },
  { step: 2, icon: FileText,      title: "Share Basic KYC & Business Details", desc: "Provide required documents for verification and onboarding." },
  { step: 3, icon: HandshakeIcon, title: "Sign DSA Agreement",               desc: "Review and sign the Digital Service Agent agreement." },
  { step: 4, icon: GraduationCap, title: "Product & Process Orientation",    desc: "Get trained on our products, processes, and partner portal." },
  { step: 5, icon: TrendingUp,    title: "Start Sourcing Cases",             desc: "Begin referring clients and earning competitive payouts." },
];

const whoCanApply = [
  "Individual Direct Selling Agents (DSAs)",
  "Financial Advisors & Loan Consultants",
  "Real Estate Professionals",
  "Channel Partners & Brokers",
];

const expectations = [
  "Ethical and customer-focused sourcing",
  "Accurate and complete documentation",
  "Commitment to compliance and transparency",
  "Long-term partnership mindset",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PartnerPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative py-20 lg:py-28 overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0a3460 0%, #1e3a8a 60%, #0a3460 100%)" }}
      >
        <AnimatedCircles />
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/partner-hero.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #0a3460 40%, #0a346088 70%, #0a346044 100%)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <FadeUp>
              <Badge className="mb-5 bg-white/15 text-white border-0 gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Partner With Us
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Grow Your Business With a{" "}
                <span style={{ color: "#C9A84C" }}>Trusted Financial Partner</span>
              </h1>
              <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-xl">
                Partner with Vittodaya Financial Services Private Limited and unlock consistent
                growth opportunities through a transparent, supportive, and
                performance-driven partnership model.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #e2b96a 100%)" }}
                >
                  <Link href="#register">
                    <HandshakeIcon className="h-4 w-4 mr-2" />
                    Become a Partner
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 hover:bg-white/20"
                >
                  <Link href="#how-it-works">How It Works</Link>
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Why Us</Badge>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              Why Partner With Vittodaya?
            </h2>
            <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              We offer more than just commissions — we offer a complete growth ecosystem.
            </p>
          </FadeUp>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "#eff6ff" }}
                    >
                      <b.icon className="h-5 w-5" style={{ color: "#0a3460" }} />
                    </div>
                    <h3 className="font-bold mb-2 text-sm" style={{ color: "var(--text-primary)" }}>{b.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0a3460 0%, #1e3a8a 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideRight>
              <Badge className="mb-4 bg-white/15 text-white border-0">Products Available</Badge>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                What You Can Offer<br />
                <span style={{ color: "#C9A84C" }}>Your Clients</span>
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed mb-8">
                Our diverse product range ensures you always have the right solution for every customer profile.
              </p>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "#C9A84C22", border: "1px solid #C9A84C66" }}
                    >
                      <p.icon className="h-4 w-4" style={{ color: "#C9A84C" }} />
                    </div>
                    <span className="text-white text-sm font-medium">{p.label}</span>
                  </li>
                ))}
              </ul>
            </SlideRight>

            <SlideLeft>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/partner-handshake.jpg"
                  alt="Partnership and financial growth"
                  width={600}
                  height={420}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a3460cc 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex gap-4">
                    {[
                      { value: "8+", label: "Banking Partners" },
                      { value: "150+", label: "Locations" },
                      { value: "₹1,250 Cr+", label: "Disbursed" },
                    ].map((s) => (
                      <div key={s.label} className="text-center flex-1">
                        <div className="font-bold text-xl" style={{ color: "#C9A84C" }}>{s.value}</div>
                        <div className="text-xs text-white/80">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SlideLeft>
          </div>
        </div>
      </section>

      {/* ── ONBOARDING STEPS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Onboarding Process</Badge>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              Getting Started Is Simple
            </h2>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
              Five easy steps from registration to earning your first payout.
            </p>
          </FadeUp>

          <div className="relative">
            {/* Connector line */}
            <div
              className="absolute top-10 left-10 right-10 h-0.5 hidden lg:block"
              style={{ background: "linear-gradient(to right, #C9A84C, #0a3460, #C9A84C)" }}
            />
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {onboardingSteps.map((s) => (
                <StaggerItem key={s.step} className="relative flex flex-col items-center text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10"
                    style={{ background: "linear-gradient(135deg, #0a3460, #1e3a8a)", border: "3px solid #C9A84C" }}
                  >
                    <s.icon className="h-7 w-7 text-white" />
                    <span
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "#C9A84C" }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ───────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <SlideRight>
              <FadeIn>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/partner-team.png"
                    alt="Vittodaya partner team"
                    width={600}
                    height={420}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a3460bb 0%, transparent 50%)" }} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-semibold text-sm">
                      Join our growing network of 150+ partner locations across India
                    </p>
                  </div>
                </div>
              </FadeIn>
            </SlideRight>

            <SlideLeft>
              <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Partner Eligibility</Badge>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                Who Can Become a Partner?
              </h2>

              <div className="mb-8">
                <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Who Can Apply</h3>
                <ul className="space-y-2.5">
                  {whoCanApply.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#C9A84C" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-3 italic" style={{ color: "var(--text-secondary)" }}>
                  Prior experience in financial products is preferred but not mandatory.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>What We Expect</h3>
                <ul className="space-y-2.5">
                  {expectations.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#0a3460" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SlideLeft>
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ─────────────────────────────────────────────── */}
      <section
        id="register"
        className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a3460 0%, #1e3a8a 60%, #0a3460 100%)" }}
      >
        <AnimatedCircles />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp className="text-center mb-10">
            <Badge className="mb-4 bg-white/15 text-white border-0">Register Now</Badge>
            <h2 className="text-3xl font-bold text-white mb-2">Ready to Partner With Us?</h2>
            <p className="text-blue-200 text-sm">
              Fill in your details and our team will get in touch within 24 hours.
            </p>
          </FadeUp>

          <PartnerForm />
        </div>
      </section>
    </>
  );
}
