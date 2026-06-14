import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FDCalculator from "@/components/fd/FDCalculator";
import { connectDB } from "@/lib/mongodb";
import FDSchemeModel from "@/lib/models/FDScheme";
import LoanProductModel from "@/lib/models/LoanProduct";
import { ArrowRight, Shield, Zap, Award, Headphones, TrendingUp, FileText, HelpCircle, User, Factory, Car, Home } from "lucide-react";

const stats = [
  { label: "Customers Served", value: "50,000+" },
  { label: "Loans Disbursed", value: "₹1,250 Cr+" },
  { label: "Partner Banks & NBFCs", value: "8+" },
  { label: "Branches Across India", value: "150+" },
];

const whyUs = [
  { icon: Award, title: "Best Rates Guaranteed", desc: "Competitive rates on all loan and deposit products, benchmarked daily against the market." },
  { icon: Shield, title: "RBI Registered NBFC", desc: "Fully regulated by the Reserve Bank of India. Your funds and data are always safe." },
  { icon: Zap, title: "Quick Digital Process", desc: "Apply for any product in minutes with our fully digital, paperless onboarding." },
  { icon: Headphones, title: "Dedicated Support", desc: "Our relationship managers guide you from application to disbursal and beyond." },
];

const loanConfig: Record<string, { color: string; bg: string; Icon: React.ElementType }> = {
  personal: { color: "#0f4c81", bg: "#eff6ff", Icon: User },
  msme:     { color: "#7c3aed", bg: "#fdf4ff", Icon: Factory },
  ev:       { color: "#059669", bg: "#ecfdf5", Icon: Car },
  lap:      { color: "#b45309", bg: "#fff7ed", Icon: Home },
};

const quickLinks = [
  { href: "/investor-relations", icon: TrendingUp, label: "Investor Relations", desc: "Annual reports, financial results, board information" },
  { href: "/news-media", icon: FileText, label: "News & Media", desc: "Press releases, awards, media coverage" },
  { href: "/faq", icon: HelpCircle, label: "FAQs", desc: "Answers to common questions about our products" },
];

function getMaxRate(scheme: { tenureRates: Array<{ regularRate: number }> }) {
  return Math.max(...scheme.tenureRates.map(r => r.regularRate), 0);
}

export default async function HomePage() {
  type TopScheme = {
    _id: string; slug: string; bankName: string; bankType: string; rating: string;
    ratingAgency: string; tags: string[]; minAmount: number;
    tenureRates: Array<{ regularRate: number }>;
  };
  type LoanProduct = { _id: string; slug: string; type: string; name: string; tagline: string; rateFrom: number; };

  let topSchemes: TopScheme[] = [];
  let loanProducts: LoanProduct[] = [];

  try {
    await connectDB();
    const [topSchemesRaw, loanProductsRaw] = await Promise.all([
      FDSchemeModel.find({ isActive: true, featuredOrder: { $gt: 0 } }).sort({ featuredOrder: 1 }).limit(3).lean(),
      LoanProductModel.find({ isActive: true }).lean(),
    ]);
    topSchemes  = JSON.parse(JSON.stringify(topSchemesRaw))  as TopScheme[];
    loanProducts = JSON.parse(JSON.stringify(loanProductsRaw)) as LoanProduct[];
  } catch (err) {
    console.error("[HomePage] DB error:", err);
  }

  return (
    <>
      <section className="gradient-hero text-white py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <Badge className="mb-6 bg-white/15 text-white border-0 hover:bg-white/20 gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                RBI Registered NBFC · Trusted by 50,000+ customers
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
                Smart Financial<br />
                <span className="text-gradient-animate">Products for Every Need</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Loans, Fixed Deposits, and more — all under one roof. Quick approvals,
                competitive rates, and dedicated support from Vittodaya Financial Services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-white shadow-lg animate-pulse-glow" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
                  <Link href="/loans/personal">Apply for a Loan <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20">
                  <Link href="/fd">Explore FD Rates</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <div key={s.label} className={`animate-count-up stagger-${i + 1}`}>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-blue-200 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:flex lg:justify-end animate-slide-right">
              <div className="max-w-sm mx-auto lg:max-w-none w-full lg:w-96">
                <FDCalculator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loanProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-up">
              <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Our Loan Products</Badge>
              <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Tailored Financing Solutions</h2>
              <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
                From personal needs to business expansion — we have a loan for every purpose.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {loanProducts.map((loan, i) => {
                const cfg = loanConfig[loan.type] ?? loanConfig.personal;
                return (
                  <Link key={String(loan._id)} href={`/loans/${loan.type}`} className={`animate-fade-up stagger-${i + 1}`}>
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {topSchemes.length > 0 && (
        <section className="py-16" style={{ background: "var(--bg-light)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="animate-fade-up">
                <Badge variant="outline" className="mb-2 text-blue-700 border-blue-200">Fixed Deposits</Badge>
                <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Top FD Picks</h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Highest rated & best-performing Fixed Deposits</p>
              </div>
              <Button variant="outline" asChild className="border-blue-800 text-blue-800 hover:bg-blue-50">
                <Link href="/fd">View All <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {topSchemes.map((scheme, i) => (
                <Card key={String(scheme._id)} className={`hover-lift animate-fade-up stagger-${i + 1}`}>
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
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <Badge variant="outline" className="mb-3 text-blue-700 border-blue-200">Why Us</Badge>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Why Choose Vittodaya?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <Card key={item.title} className={`hover-lift animate-fade-up stagger-${i + 1}`}>
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#eff6ff" }}>
                    <item.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--bg-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-5">
            {quickLinks.map((ql, i) => (
              <Link key={ql.href} href={ql.href} className={`animate-fade-up stagger-${i + 1}`}>
                <Card className="hover-lift cursor-pointer group">
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
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center animate-fade-up">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Ready to Get Started?</h2>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Apply for a loan or open a Fixed Deposit in minutes. Join 50,000+ customers who trust Vittodaya.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}>
              <Link href="/loans/personal">Apply for a Loan</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50">
              <Link href="/fd">Explore FD Rates</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export const dynamic = "force-dynamic";
