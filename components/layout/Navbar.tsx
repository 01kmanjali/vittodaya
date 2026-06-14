"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronDown, LogOut, Menu, Zap, User, Factory, Home,
  Building2, TrendingUp, Newspaper, HelpCircle, Briefcase,
  Info, Phone, ArrowRight, Shield, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlags, isFDAvailable } from "@/lib/queries/useFeatureFlags";

type SessionInfo = { name: string; email: string; role: string };

const loanProducts = [
  {
    label: "Personal Loan",
    href: "/loans/personal",
    Icon: User,
    desc: "Up to ₹25L · from 10.5% p.a.",
    badge: "Popular",
    badgeClass: "bg-amber-100 text-amber-700",
    iconBg: "#eff6ff",
    iconColor: "var(--primary)",
  },
  {
    label: "MSME / Business Loan",
    href: "/loans/msme",
    Icon: Factory,
    desc: "Up to ₹1Cr · from 11% p.a.",
    badge: null,
    badgeClass: "",
    iconBg: "#fdf4ff",
    iconColor: "#7c3aed",
  },
  {
    label: "Electric Vehicle Loan",
    href: "/loans/ev",
    Icon: Zap,
    desc: "Up to 90% LTV · from 8.99% p.a.",
    badge: "Green",
    badgeClass: "bg-green-100 text-green-700",
    iconBg: "#ecfdf5",
    iconColor: "#059669",
  },
  {
    label: "Loan Against Property",
    href: "/loans/lap",
    Icon: Home,
    desc: "Up to ₹5Cr · from 9.5% p.a.",
    badge: null,
    badgeClass: "",
    iconBg: "#fff7ed",
    iconColor: "#b45309",
  },
];

const investmentProducts = [
  {
    label: "Fixed Deposits",
    href: "/fd",
    Icon: Building2,
    desc: "Earn up to 9.10% p.a. returns",
    badge: "9.10%",
    badgeClass: "bg-green-100 text-green-700",
    iconBg: "#ecfdf5",
    iconColor: "#059669",
  },
];

const companyLinks = [
  { label: "Investor Relations", href: "/investor-relations", Icon: TrendingUp },
  { label: "News & Media",       href: "/news-media",         Icon: Newspaper },
  { label: "Careers",            href: "/careers",            Icon: Briefcase },
  { label: "FAQ",                href: "/faq",                Icon: HelpCircle },
  { label: "About Us",           href: "/about",              Icon: Info },
  { label: "Contact",            href: "/contact",            Icon: Phone },
];

/* ─── Dropdown ─────────────────────────────────────────────────── */
function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-all",
          open ? "bg-blue-50 text-blue-800" : "hover:bg-gray-50 text-gray-700"
        )}
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        /* pt-2 creates an invisible bridge so the gap between trigger and panel
           doesn't fire onMouseLeave before the cursor reaches the dropdown */
        <div
          className="absolute top-full left-0 pt-2 z-50"
          style={{ minWidth: "300px" }}
        >
          <div
            className="bg-white rounded-2xl border shadow-2xl overflow-hidden animate-fade-down"
            style={{ borderColor: "var(--border)" }}
            onClick={() => setOpen(false)}
          >
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-light))" }} />
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ───────────────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: nextAuthSession } = useSession();
  const pathname = usePathname();
  const { data: features } = useFeatureFlags();
  const fdAvailable = isFDAvailable(features);

  const session: SessionInfo | null = nextAuthSession?.user
    ? {
        role:  nextAuthSession.user.role,
        email: nextAuthSession.user.email ?? "",
        name:  nextAuthSession.user.name  ?? "",
      }
    : null;

  async function handleLogout() {
    setMobileOpen(false);
    await signOut({ callbackUrl: "/login" });
  }

  const initials = session?.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() ?? "";

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────────────── */}
      <div className="text-white text-xs text-center py-1.5 px-4 font-medium hidden sm:block" style={{ background: "var(--primary-dark)" }}>
        <span className="opacity-80">RBI Registered NBFC</span>
        <span className="mx-3 opacity-40">|</span>
        Fixed Deposits up to <span className="font-bold text-amber-300">9.10% p.a.</span>
        <span className="mx-3 opacity-40">|</span>
        <Link href="/loans/personal" className="underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">
          Apply for a Loan →
        </Link>
      </div>

      {/* ── Main navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm" style={{ borderColor: "var(--border)" }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setMobileOpen(false)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-light) 100%)" }}
            >
              <span className="text-white font-extrabold text-sm tracking-tight">V</span>
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base tracking-tight" style={{ color: "var(--primary)" }}>
                Vittodaya
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
                Financial Services
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

            {/* Loans dropdown */}
            <Dropdown label="Loans">
              <div className="p-3">
                <p className="text-[10px] font-bold px-2 py-1.5 uppercase tracking-widest text-muted-foreground mb-1">
                  Loan Products
                </p>
                <div className="grid gap-0.5">
                  {loanProducts.map(p => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110"
                        style={{ background: p.iconBg }}
                      >
                        <p.Icon className="h-4 w-4" style={{ color: p.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.label}</span>
                          {p.badge && (
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", p.badgeClass)}>{p.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-1 group-hover/item:translate-x-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </Dropdown>

            {/* Investments dropdown — hidden when FD is disabled */}
            {fdAvailable && <Dropdown label="Investments">
              <div className="p-3">
                <p className="text-[10px] font-bold px-2 py-1.5 uppercase tracking-widest text-muted-foreground mb-1">
                  Investment Products
                </p>
                {investmentProducts.map(p => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110"
                      style={{ background: p.iconBg }}
                    >
                      <p.Icon className="h-4 w-4" style={{ color: p.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.label}</span>
                        {p.badge && (
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", p.badgeClass)}>{p.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-1 group-hover/item:translate-x-0" />
                  </Link>
                ))}

                <Separator className="my-2" />
                <div
                  className="mx-2 rounded-xl p-3 flex items-center gap-2.5"
                  style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
                >
                  <Shield className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                  <p className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                    RBI regulated NBFC — your investments are protected
                  </p>
                </div>
              </div>
            </Dropdown>}

            {/* Company dropdown */}
            <Dropdown label="Company">
              <div className="p-3">
                <p className="text-[10px] font-bold px-2 py-1.5 uppercase tracking-widest text-muted-foreground mb-1">
                  Company
                </p>
                <div className="grid grid-cols-2 gap-0.5">
                  {companyLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium",
                        pathname.startsWith(link.href) ? "bg-blue-50 text-blue-800" : "text-gray-700"
                      )}
                    >
                      <link.Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Dropdown>
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {session ? (
              <div
                className="flex items-center gap-2.5 rounded-2xl border px-3 py-1.5 shadow-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <Avatar className="h-8 w-8 ring-2 ring-offset-1" style={{ "--tw-ring-color": "var(--primary)" } as React.CSSProperties}>
                  <AvatarFallback
                    className="text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))" }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate max-w-25" style={{ color: "var(--text-primary)" }}>
                      {session.name}
                    </p>
                    <Badge
                      className="h-4 text-[9px] px-1.5 uppercase font-bold"
                      style={session.role === "admin"
                        ? { background: "#fef3c7", color: "#92400e" }
                        : { background: "#eff6ff", color: "var(--primary)" }}
                    >
                      {session.role}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate max-w-30">{session.email}</p>
                </div>
                <div className="flex items-center gap-1 ml-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                    <Link href={session.role === "admin" ? "/admin" : "/dashboard"}>
                      <User className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-sm font-medium"
                  style={{ color: "var(--primary)" }}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="text-white font-semibold shadow-md gap-1.5 px-5"
                  style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
                >
                  <Link href="/register">
                    <Zap className="h-3.5 w-3.5" />
                    Apply Now
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] p-0 flex flex-col">
              {/* Sheet header */}
              <SheetHeader className="px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
                <SheetTitle className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))" }}
                  >
                    <span className="text-white font-extrabold text-xs">V</span>
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm block" style={{ color: "var(--primary)" }}>Vittodaya</span>
                    <span className="text-[10px] text-muted-foreground">Financial Services</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">

                {/* Logged-in user card */}
                {session && (
                  <div
                    className="mb-3 rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}
                  >
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback
                        className="text-sm font-bold text-white"
                        style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))" }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{session.name}</p>
                        <Badge
                          className="h-4 text-[9px] px-1.5 uppercase font-bold shrink-0"
                          style={session.role === "admin"
                            ? { background: "#fef3c7", color: "#92400e" }
                            : { background: "var(--primary)", color: "white" }}
                        >
                          {session.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{session.email}</p>
                    </div>
                  </div>
                )}

                {/* Loans */}
                <p className="text-[10px] font-bold px-3 pt-2 pb-1 uppercase tracking-widest text-muted-foreground">Loans</p>
                {loanProducts.map(p => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.iconBg }}>
                      <p.Icon className="h-4 w-4" style={{ color: p.iconColor }} />
                    </div>
                    <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>{p.label}</span>
                    {p.badge && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0", p.badgeClass)}>{p.badge}</span>
                    )}
                  </Link>
                ))}

                <Separator className="my-2" />

                {/* Investments */}
                <p className="text-[10px] font-bold px-3 pt-1 pb-1 uppercase tracking-widest text-muted-foreground">Investments</p>
                {investmentProducts.map(p => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.iconBg }}>
                      <p.Icon className="h-4 w-4" style={{ color: p.iconColor }} />
                    </div>
                    <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>{p.label}</span>
                    {p.badge && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0", p.badgeClass)}>{p.badge}</span>
                    )}
                  </Link>
                ))}

                <Separator className="my-2" />

                {/* Company links */}
                <p className="text-[10px] font-bold px-3 pt-1 pb-1 uppercase tracking-widest text-muted-foreground">Company</p>
                <div className="grid grid-cols-2 gap-1">
                  {companyLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium",
                        pathname.startsWith(link.href) ? "bg-blue-50 text-blue-800" : "text-gray-700"
                      )}
                    >
                      <link.Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Dashboard shortcut if logged in */}
                {session && (
                  <>
                    <Separator className="my-2" />
                    <Link
                      href={session.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                      style={{ color: "var(--primary)" }}
                    >
                      <User className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-semibold">My {session.role === "admin" ? "Admin Panel" : "Dashboard"}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                    </Link>
                  </>
                )}
              </div>

              {/* Footer CTAs */}
              <div className="p-4 border-t shrink-0 space-y-2" style={{ borderColor: "var(--border)" }}>
                {session ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full font-semibold"
                      style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                    >
                      <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full gap-2 font-semibold text-white shadow-md"
                      style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
                    >
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Zap className="h-4 w-4" /> Apply Now
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  );
}
