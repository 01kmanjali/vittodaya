"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, BarChart2, User, Factory, Car, Home, FileText,
  LayoutGrid, Building2, Newspaper, HelpCircle, TrendingUp, Users,
  ChevronDown, ChevronLeft, ChevronRight, LogOut, Globe, Settings,
  UserCog, ShieldCheck, PackageOpen, HandshakeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPageAccess, ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ElementType;
  page: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",  href: "/admin",           Icon: LayoutDashboard, page: "dashboard"  },
      { label: "Analytics",  href: "/admin/analytics", Icon: BarChart2,       page: "analytics"  },
    ],
  },
  {
    section: "Loan Products",
    items: [
      { label: "Personal Loans",        href: "/admin/loans/personal", Icon: User,    page: "loans" },
      { label: "MSME / Business Loans", href: "/admin/loans/msme",     Icon: Factory, page: "loans" },
      { label: "EV Loans",              href: "/admin/loans/ev",       Icon: Car,     page: "loans" },
      { label: "Loan Against Property", href: "/admin/loans/lap",      Icon: Home,    page: "loans" },
      { label: "Applications",          href: "/admin/applications",   Icon: FileText, page: "applications" },
    ],
  },
  {
    section: "Fixed Deposits",
    items: [
      { label: "FD Schemes",    href: "/admin/fd-schemes", Icon: LayoutGrid, page: "fd-schemes" },
      { label: "Banks & NBFCs", href: "/admin/banks",      Icon: Building2,  page: "banks"      },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Home Products", href: "/admin/home-products", Icon: PackageOpen, page: "home-products" },
      { label: "News & Media",  href: "/admin/news-media",    Icon: Newspaper,   page: "news-media"    },
      { label: "FAQs",          href: "/admin/faqs",          Icon: HelpCircle,  page: "faqs"          },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Investor Relations", href: "/admin/investor-relations", Icon: TrendingUp, page: "investor-relations" },
    ],
  },
  {
    section: "Partners",
    items: [
      { label: "Partner Inquiries", href: "/admin/partners", Icon: HandshakeIcon, page: "partners" },
    ],
  },
  {
    section: "Users",
    items: [
      { label: "Users", href: "/admin/users", Icon: Users, page: "users" },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Admin Accounts", href: "/admin/accounts", Icon: UserCog,  page: "accounts" },
      { label: "Configuration",  href: "/admin/config",   Icon: Settings, page: "config"   },
    ],
  },
];

function clearCookies() {
  document.cookie = "vf_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "vf_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role ?? "admin";
  const userName = session?.user?.name ?? "Admin";
  const userEmail = session?.user?.email ?? "";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  async function handleLogout() {
    await signOut({ redirect: false });
    clearCookies();
    router.push("/login");
  }

  function toggleSection(section: string) {
    setCollapsedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  }

  const visibleSections = navSections
    .map(s => ({ ...s, items: s.items.filter(item => hasPageAccess(role, item.page)) }))
    .filter(s => s.items.length > 0);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative shrink-0 h-screen">
        {/* Collapse toggle — floats on the right edge of the sidebar */}
        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          className="absolute top-5 -right-3 z-50 w-6 h-6 rounded-full bg-white border shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          style={{ borderColor: "var(--border)" }}
        >
          {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5 text-gray-500" /> : <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />}
        </button>

      <aside
        className={cn(
          "h-full border-r bg-white flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          {sidebarCollapsed ? (
            <Link href="/admin" className="mx-auto">
              <Logo variant="icon" height={30} />
            </Link>
          ) : (
            <Link href="/admin">
              <Logo height={34} />
            </Link>
          )}
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
              <ShieldCheck className="h-3 w-3" />
              {ROLE_LABELS[role] ?? "Admin"}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 min-h-0 py-2 px-2 overflow-y-auto space-y-1">
          {visibleSections.map(({ section, items }) => {
            const isSectionCollapsed = collapsedSections.includes(section);

            if (sidebarCollapsed) {
              return (
                <div key={section} className="space-y-0.5 mb-1">
                  {items.map(({ label, href, Icon }) => {
                    const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                    return (
                      <Tooltip key={href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center justify-center py-2.5 rounded-lg transition-all",
                              isActive ? "text-white" : "hover:bg-gray-100"
                            )}
                            style={isActive ? { background: "var(--primary)" } : { color: "var(--text-primary)" }}
                          >
                            <Icon className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                      </Tooltip>
                    );
                  })}
                  <Separator className="my-1" />
                </div>
              );
            }

            return (
              <div key={section}>
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section}
                  </span>
                  <ChevronDown
                    className={cn("h-3 w-3 text-muted-foreground transition-transform", isSectionCollapsed && "-rotate-90")}
                  />
                </button>

                {!isSectionCollapsed && (
                  <div className="space-y-0.5 mb-2">
                    {items.map(({ label, href, Icon }) => {
                      const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            isActive ? "text-white" : "hover:bg-gray-100"
                          )}
                          style={isActive ? { background: "var(--primary)", color: "white" } : { color: "var(--text-primary)" }}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer — real user info */}
        <div className="mt-auto p-3 border-t shrink-0 bg-white" style={{ borderColor: "var(--border)" }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "var(--primary)" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{userName}</div>
                <div className="text-xs truncate text-muted-foreground">{userEmail}</div>
              </div>
            </div>
          )}

          {sidebarCollapsed ? (
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-9" asChild>
                    <Link href="/"><Globe className="h-4 w-4" /></Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Back to Site</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-9 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Log Out</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-xs gap-1.5" asChild>
                <Link href="/"><Globe className="h-3.5 w-3.5" /> Site</Link>
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 text-xs gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" /> Log Out
              </Button>
            </div>
          )}
        </div>
      </aside>
      </div>
    </TooltipProvider>
  );
}
