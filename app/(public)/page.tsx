import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { connectDB } from "@/lib/mongodb";
import FDSchemeModel from "@/lib/models/FDScheme";
import LoanProductModel from "@/lib/models/LoanProduct";
import { getConfig } from "@/lib/models/AppConfig";
import HomeProductModel from "@/lib/models/HomeProduct";
import {
  ArrowRight, Shield, Zap, Award, Headphones, TrendingUp, FileText, HelpCircle,
  User, Factory, Car, Home, CheckCircle2, Users, Building2, Landmark, HandshakeIcon,
  Quote,
} from "lucide-react";
import {
  FadeUp, FadeIn, SlideRight, SlideLeft,
  StaggerGrid, StaggerItem,
  FloatingCoin, FloatingGraph, FloatingHome,
  CountUp, HeroContent, AnimatedCircles, SectionBgCircles,
} from "@/components/motion";
import { LapLottie } from "@/components/lap-lottie";

export const dynamic = "force-dynamic";

// ─── Static data ────────────────────────────────────────────────────────────

const stats = [
  { label: "Customers Served",      value: "50,000+" },
  { label: "Loans Disbursed",       value: "₹1,250 Cr+" },
  { label: "Partner Banks & NBFCs", value: "8+" },
  { label: "Branches Across India", value: "150+" },
];

const highlights = [
  { icon: Home,          title: "Loan Against Property",         desc: "Residential & Commercial properties accepted." },
  { icon: Zap,           title: "Fast & Transparent Approvals",  desc: "Streamlined process with no hidden charges." },
  { icon: Building2,     title: "Business Loan",                 desc: "Secured & unsecured options for every business." },
  { icon: Users,         title: "DSA & Partner Support",         desc: "Strong support system for our partner network." },
  { icon: Landmark,      title: "Wide Bank & NBFC Network",      desc: "Access to multiple lending partners across India." },
  { icon: TrendingUp,    title: "Competitive Interest Rates",    desc: "Flexible structures benchmarked to the market." },
];

const lapFeatures = [
  { title: "Residential & Commercial Properties", desc: "Self-occupied, rented or leased — houses, flats, offices, shops, commercial buildings." },
  { title: "High-Value Loan Amounts",             desc: "Business expansion, working capital, debt consolidation, or personal investments." },
  { title: "Competitive Rate of Interest",        desc: "Market-aligned rates via multiple bank & NBFC partnerships with transparent pricing." },
  { title: "Flexible Repayment Tenure",           desc: "Customizable loan duration reducing monthly EMI burden and ensuring stability." },
  { title: "Quick Processing & Disbursement",     desc: "Experienced credit team with streamlined documentation and timely fund access." },
];

const whyUs = [
  { icon: Award,      title: "Customer-First Approach",         desc: "Solution-oriented thinking that puts your financial goals at the centre." },
  { icon: Shield,     title: "Ethical & Compliant Processes",   desc: "Fully transparent, RBI-compliant operations with no hidden fees." },
  { icon: Users,      title: "Experienced Team",                desc: "Seasoned credit, sales & operations professionals at your service." },
  { icon: Landmark,   title: "Strong Banking Network",          desc: "Multiple bank & NBFC partnerships ensuring the best fit for you." },
  { icon: Headphones, title: "Post-Disbursal Support",          desc: "Reliable relationship managers who stay with you beyond disbursal." },
];

const partnerBenefits = [
  "Competitive & Transparent Payouts",
  "Fast Credit Decisions and Turnaround Time",
  "Dedicated Relationship Manager",
  "Access to Multiple Bank & NBFC Products",
  "End-to-End Partner Support",
];

const loanConfig: Record<string, { color: string; bg: string; Icon: React.ElementType }> = {
  personal: { color: "#0f4c81", bg: "#eff6ff", Icon: User },
  msme:     { color: "#7c3aed", bg: "#fdf4ff", Icon: Factory },
  ev:       { color: "#059669", bg: "#ecfdf5", Icon: Car },
  lap:      { color: "#b45309", bg: "#fff7ed", Icon: Home },
};

const quickLinks = [
  { href: "/investor-relations", icon: TrendingUp, label: "Investor Relations", desc: "Annual reports, financial results, board information" },
  { href: "/news-media",         icon: FileText,   label: "News & Media",        desc: "Press releases, awards, media coverage" },
  { href: "/faq",                icon: HelpCircle, label: "FAQs",                desc: "Answers to common questions about our products" },
];

function getMaxRate(scheme: { tenureRates: Array<{ regularRate: number }> }) {
  return Math.max(...scheme.tenureRates.map(r => r.regularRate), 0);
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  type TopScheme = {
    _id: string; slug: string; bankName: string; bankType: string; rating: string;
    ratingAgency: string; tags: string[]; minAmount: number;
    tenureRates: Array<{ regularRate: number }>;
  };
  type LoanProduct = { _id: string; slug: string; type: string; name: string; tagline: string; rateFrom: number; };
  type HomeProduct = { _id: string; title: string; description: string; image: string; order: number; };

  let topSchemes: TopScheme[]     = [];
  let loanProducts: LoanProduct[] = [];
  let homeProducts: HomeProduct[] = [];
  let fdEnabled = false;

  try {
    await connectDB();
    const [topSchemesRaw, loanProductsRaw, homeProductsRaw, config] = await Promise.all([
      FDSchemeModel.find({ isActive: true, featuredOrder: { $gt: 0 } }).sort({ featuredOrder: 1 }).limit(3).lean(),
      LoanProductModel.find({ isActive: true }).lean(),
      HomeProductModel.find({ isActive: true }).sort({ order: 1 }).lean(),
      getConfig(),
    ]);
    topSchemes    = JSON.parse(JSON.stringify(topSchemesRaw))    as TopScheme[];
    loanProducts  = JSON.parse(JSON.stringify(loanProductsRaw))  as LoanProduct[];
    homeProducts  = JSON.parse(JSON.stringify(homeProductsRaw))  as HomeProduct[];
    fdEnabled     = config.features.fixedDeposits.enabled && config.features.fixedDeposits.status !== "disabled";
  } catch (err) {
    console.error("[HomePage] DB error:", err);
  }

  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="text-white py-16 lg:py-24 overflow-hidden relative" style={{ background: "#0a3460" }}>
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/1.png"
            alt=""
            fill
            className="object-cover object-right opacity-40"
            priority
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, #0a3460 35%, #0a346099 65%, transparent 100%)" }} />

        {/* Floating decorative elements */}
        <FloatingCoin className="absolute right-[12%] top-[18%] w-14 h-14 opacity-60 hidden lg:block" />
        <FloatingGraph className="absolute right-[6%] bottom-[22%] w-24 h-16 opacity-70 hidden lg:block" />
        <FloatingHome className="absolute right-[22%] bottom-[15%] w-12 h-12 opacity-50 hidden xl:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <HeroContent>
              <Badge className="mb-6 bg-white/15 text-white border-0 hover:bg-white/20 gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                RBI Registered NBFC · Trusted by 50,000+ customers
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Your Growth.<br />
                <span className="text-gradient-animate">Our Commitment.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-3 font-medium">Empowering your financial future.</p>
              <p className="text-base text-blue-200 mb-8 leading-relaxed max-w-2xl">
                Reliable, transparent, and growth-focused financial solutions designed to empower
                individuals, businesses, and partners through trusted lending support. Specialized in
                Loan Against Property (LAP) — backed by strong bank &amp; NBFC partnerships with fast
                approvals and ethical processes.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Button asChild size="lg" className="text-white shadow-lg animate-pulse-glow" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                  <Link href="/applications">Apply Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20">
                  <Link href="/partner">Become a Partner</Link>
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <div key={s.label} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="text-2xl font-bold">
                      <CountUp value={s.value} />
                    </div>
                    <div className="text-xs text-blue-200 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </HeroContent>
          </div>
        </div>
      </section>

      {/* ── GROUP 1: Sections 2–5 (white/light) ─────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "var(--bg-light)" }}>
        <SectionBgCircles variant="A" />

        {/* ── 2. KEY HIGHLIGHTS ──────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-12">
              <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">What We Offer</Badge>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Built for Every Financial Need</h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                A comprehensive platform for loans, deposits, and partner growth — all under one roof.
              </p>
            </FadeUp>
            <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {highlights.map((item) => (
                <StaggerItem key={item.title}>
                  <Card className="hover-lift border-0 shadow-sm h-full">
                    <CardContent className="p-6 flex gap-4 items-start">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                        <item.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* ── 3. OUR PRODUCTS ────────────────────────────────────────────── */}
        {homeProducts.length > 0 && (
          <section className="py-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeUp className="text-center mb-12">
                <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Our Products</Badge>
                <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Loan Against Property (LAP)
                </h2>
                <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                  Unlock the value of your property with flexible financing solutions tailored to your needs.
                </p>
              </FadeUp>
              <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeProducts.map((p) => (
                  <StaggerItem key={p._id}>
                    <Card className="hover-lift group overflow-hidden border-0 shadow-sm h-full">
                      {p.image && (
                        <div className="relative h-44 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </section>
        )}

        {/* ── 4. ABOUT ───────────────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <SlideRight>
                <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">About Us</Badge>
                <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  A Reliable Financial Services Platform You Can Trust
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  Vittodaya Financial Services Private Limited is a professionally managed NBFC services
                  platform specialising in Loan Against Property (LAP) solutions. We bridge financial
                  gaps through structured, secure, and scalable funding — empowering individuals and
                  businesses with integrity, transparency, and customer-centric values.
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  Our strong network of banks and NBFCs, combined with an experienced credit and
                  operations team, ensures every client receives the best possible financial solution
                  with minimal friction and maximum support.
                </p>
                <Button asChild className="text-white" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}>
                  <Link href="/about">Know More About Us <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </SlideRight>

              <SlideLeft>
                <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <Image
                    src="/home-about.png"
                    alt="Vittodaya team discussing financial solutions"
                    width={600}
                    height={400}
                    className="w-full h-72 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 grid grid-cols-2 gap-3 translate-y-0 group-hover:translate-y-full transition-transform duration-400">
                    {[
                      { value: "50,000+", label: "Happy Customers" },
                      { value: "₹1,250 Cr+", label: "Loans Disbursed" },
                      { value: "8+", label: "Banking Partners" },
                      { value: "150+", label: "Branches" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
                        <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/30 backdrop-blur-[2px]">
                    <h3 className="text-white text-xl font-bold mb-2">About Vittodaya</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      A professionally managed NBFC platform bridging financial gaps through structured, secure, and scalable funding — with integrity and transparency at our core.
                    </p>
                    <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full text-white border border-white/60 hover:bg-white/20 transition-colors">
                      Know More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </SlideLeft>
            </div>
          </div>
        </section>

        {/* ── 5. LOAN PRODUCTS (dynamic) ─────────────────────────────────── */}
        {loanProducts.length > 0 && (
          <section className="py-16 relative z-10">
            <div className="absolute left-0 top-0 bottom-0 w-44 xl:w-56 pointer-events-none hidden xl:flex items-center overflow-hidden">
              <div className="relative w-full h-64 rounded-r-3xl overflow-hidden shadow-inner opacity-70">
                <Image src="/images/3.png" alt="" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-(--bg-light)" />
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-44 xl:w-56 pointer-events-none hidden xl:flex items-center overflow-hidden">
              <div className="relative w-full h-72 rounded-l-3xl overflow-hidden shadow-inner opacity-70">
                <Image src="/images/4.jpg" alt="" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-linear-to-l from-transparent to-(--bg-light)" />
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <FadeUp className="text-center mb-12">
                <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Our Loan Products</Badge>
                <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Tailored Financing Solutions</h2>
                <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                  From personal needs to business expansion — we have a loan for every purpose.
                </p>
              </FadeUp>
              <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {loanProducts.map((loan) => {
                  const cfg = loanConfig[loan.type] ?? loanConfig.personal;
                  return (
                    <StaggerItem key={String(loan._id)}>
                      <Link href={`/loans/${loan.type}`} className="block h-full">
                        <Card className="h-full hover-lift cursor-pointer border group transition-all duration-300 hover:border-blue-200">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: cfg.bg }}>
                              <cfg.Icon className="h-5 w-5" style={{ color: cfg.color }} />
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{loan.name}</h3>
                            <p className="text-xs mb-3 leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{loan.tagline}</p>
                            <Separator className="mb-3" />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold" style={{ color: cfg.color }}>From {loan.rateFrom}% p.a.</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: cfg.color }} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerGrid>
            </div>
          </section>
        )}
      </div>{/* end Group 1 */}

      {/* ── 6. LAP DEEP-DIVE ─────────────────────────────────────────────── */}
      <section className="py-16 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0a3460 0%, #1e3a8a 60%, #0a3460 100%)" }}>

        {/* Animated background circles */}
        <AnimatedCircles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left — text + features on dark bg */}
            <SlideRight>
              <Badge className="mb-4 bg-white/15 text-white border-0">Loan Against Property</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
                Unlock the Value<br />of Your Property
              </h2>
              <p className="text-sm leading-relaxed mb-7 text-blue-200">
                Flexible financing solutions tailored to your needs — whether for business growth,
                working capital, or personal milestones.
              </p>

              <StaggerGrid className="space-y-3 mb-8">
                {lapFeatures.map((f) => (
                  <StaggerItem key={f.title} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#C9A84C22", border: "1px solid #C9A84C66" }}>
                      <CheckCircle2 className="h-3 w-3" style={{ color: "#C9A84C" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{f.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed text-blue-300">{f.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>

              <Button asChild size="lg" className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                <Link href="/loans/lap">Explore LAP <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </SlideRight>

            {/* Right — Lottie animation, bigger */}
            <SlideLeft className="relative flex items-center justify-center">
              <LapLottie className="w-full max-w-2xl" />
            </SlideLeft>

          </div>
        </div>
      </section>

      {/* ── GROUP 2: Sections 7–9 (white/light) ─────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "var(--bg-light)" }}>
        <SectionBgCircles variant="B" />

        {/* ── 7. WHY CHOOSE US ───────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <Image
                    src="/home-why.jpg"
                    alt="Trust and partnership in finance"
                    width={600}
                    height={420}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/30 backdrop-blur-[2px]">
                    <h3 className="text-white text-xl font-bold mb-2">Built on Trust</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Our ethical, transparent processes and strong banking partnerships ensure every client gets the best solution — backed by a team that truly cares.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <SlideLeft>
                <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Why Us</Badge>
                <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>What Sets Us Apart</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  We combine expertise, ethics, and efficiency to deliver financial solutions that truly work.
                </p>
                <StaggerGrid className="space-y-4">
                  {whyUs.map((item) => (
                    <StaggerItem key={item.title} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                        <item.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </SlideLeft>
            </div>
          </div>
        </section>

        {/* ── 8. PARTNER / DSA ───────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <SlideRight>
                <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Partner With Us</Badge>
                <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  Grow With Vittodaya Financial Services
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  Join our growing network of DSAs and channel partners. We offer transparent,
                  performance-driven collaboration with dedicated support every step of the way.
                </p>
                <ul className="space-y-3 mb-8">
                  {partnerBenefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--secondary)" }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                  <Link href="/partner">
                    <HandshakeIcon className="h-4 w-4 mr-2" />
                    Become a Partner
                  </Link>
                </Button>
              </SlideRight>

              <SlideLeft>
                <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <Image
                    src="/home-partner.png"
                    alt="Vittodaya partner team collaboration"
                    width={600}
                    height={420}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-8 py-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/30 backdrop-blur-[2px]">
                    <div className="text-4xl font-bold mb-0.5" style={{ color: "#C9A84C" }}>8+</div>
                    <div className="text-sm mb-4 text-white/80">Banking &amp; NBFC Partners</div>
                    <div className="text-4xl font-bold mb-0.5" style={{ color: "#C9A84C" }}>150+</div>
                    <div className="text-sm mb-4 text-white/80">Partner Locations Across India</div>
                    <div className="text-4xl font-bold mb-0.5" style={{ color: "#C9A84C" }}>₹1,250 Cr+</div>
                    <div className="text-sm mb-4 text-white/80">Loans Disbursed Through Partners</div>
                    <Separator className="bg-white/20 mb-4" />
                    <p className="text-xs text-white/75 leading-relaxed">
                      Competitive payouts, fast decisions, and a dedicated RM for every partner — that&apos;s the Vittodaya promise.
                    </p>
                  </div>
                </div>
              </SlideLeft>
            </div>
          </div>
        </section>

        {/* ── 9. FOUNDER'S MESSAGE ───────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <FadeUp className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Founder&apos;s Message</Badge>
            <Quote className="h-10 w-10 mx-auto mb-4" style={{ color: "#C9A84C" }} />
            <blockquote className="text-lg font-medium leading-relaxed mb-6" style={{ color: "var(--text-primary)" }}>
              &ldquo;At Vittodaya, we believe financial growth should be accessible, transparent, and
              trustworthy. Our mission is to bridge the gap between individuals, businesses, and the
              financial opportunities they deserve — ensuring every client receives reliable,
              ethical, and empowering support to build a stronger financial future.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: "linear-gradient(135deg, #1a2e6b, #C9A84C)" }}>
                AB
              </div>
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Ankit Bharti</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Founder &amp; Director, Vittodaya Financial Services</div>
              </div>
            </div>
          </FadeUp>
        </section>
      </div>{/* end Group 2 */}

      {/* ── GROUP 3: Sections 10–12 (white/light) ───────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "var(--bg-light)" }}>
        <SectionBgCircles variant="C" />

        {/* ── 10. TOP FD PICKS (dynamic) ─────────────────────────────────── */}
        {fdEnabled && topSchemes.length > 0 && (
          <section className="py-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <FadeUp>
                  <Badge variant="outline" className="mb-2 text-blue-700 border-blue-200">Fixed Deposits</Badge>
                  <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Top FD Picks</h2>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Highest rated &amp; best-performing Fixed Deposits</p>
                </FadeUp>
                <Button variant="outline" asChild className="border-blue-800 text-blue-800 hover:bg-blue-50">
                  <Link href="/fd">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
              </div>
              <StaggerGrid className="grid md:grid-cols-3 gap-6">
                {topSchemes.map((scheme) => (
                  <StaggerItem key={String(scheme._id)}>
                    <Card className="hover-lift h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--primary)" }}>
                            {scheme.bankName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{scheme.bankName}</div>
                            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{scheme.bankType}</div>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-bold" style={{ color: "var(--success)" }}>{getMaxRate(scheme).toFixed(2)}</span>
                          <span className="font-medium" style={{ color: "var(--success)" }}>% p.a.</span>
                        </div>
                        <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                          Min ₹{scheme.minAmount.toLocaleString("en-IN")} · {scheme.rating} ({scheme.ratingAgency})
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {scheme.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <Button asChild className="w-full text-white" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                          <Link href={`/fd/${scheme.slug}`}>Invest Now</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </section>
        )}

        {/* ── 11. QUICK LINKS ────────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerGrid className="grid sm:grid-cols-3 gap-5">
              {quickLinks.map((ql) => (
                <StaggerItem key={ql.href}>
                  <Link href={ql.href} className="block h-full">
                    <Card className="hover-lift cursor-pointer group h-full">
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                          <ql.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1 group-hover:text-blue-800 transition-colors" style={{ color: "var(--text-primary)" }}>{ql.label}</h3>
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{ql.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* ── 12. FINAL CTA ──────────────────────────────────────────────── */}
        <section className="py-16 relative z-10">
          <FadeUp className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Ready to Get Started?</h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Apply for a loan or explore our financial products in minutes. Join 50,000+ customers who trust Vittodaya.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                <Link href="/applications">Apply for a Loan</Link>
              </Button>
              {fdEnabled && (
                <Button asChild size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50">
                  <Link href="/fd">Explore FD Rates</Link>
                </Button>
              )}
            </div>
          </FadeUp>
        </section>
      </div>{/* end Group 3 */}
    </>
  );
}
