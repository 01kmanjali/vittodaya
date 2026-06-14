"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, BarChart2, User, Factory, Car, Home, FileText,
  LayoutGrid, Building2, Newspaper, HelpCircle, TrendingUp, Users,
  ChevronDown, ChevronLeft, ChevronRight, LogOut, Globe, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ElementType;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",  href: "/admin",           Icon: LayoutDashboard },
      { label: "Analytics",  href: "/admin/analytics", Icon: BarChart2 },
    ],
  },
  {
    section: "Loan Products",
    items: [
      { label: "Personal Loans",        href: "/admin/loans/personal", Icon: User },
      { label: "MSME / Business Loans", href: "/admin/loans/msme",     Icon: Factory },
      { label: "EV Loans",              href: "/admin/loans/ev",       Icon: Car },
      { label: "Loan Against Property", href: "/admin/loans/lap",      Icon: Home },
      { label: "Applications",          href: "/admin/applications",   Icon: FileText },
    ],
  },
  {
    section: "Fixed Deposits",
    items: [
      { label: "FD Schemes",    href: "/admin/fd-schemes", Icon: LayoutGrid },
      { label: "Banks & NBFCs", href: "/admin/banks",      Icon: Building2 },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "News & Media", href: "/admin/news-media", Icon: Newspaper },
      { label: "FAQs",         href: "/admin/faqs",       Icon: HelpCircle },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Investor Relations", href: "/admin/investor-relations", Icon: TrendingUp },
    ],
  },
  {
    section: "Users",
    items: [
      { label: "Users", href: "/admin/users", Icon: Users },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Configuration", href: "/admin/config", Icon: Settings },
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

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "shrink-0 h-screen border-r bg-white flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b shrink-0 justify-between" style={{ borderColor: "var(--border)" }}>
          {!sidebarCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight" style={{ color: "var(--primary)" }}>Vittodaya</div>
                <div className="text-xs leading-tight text-muted-foreground">Admin Panel</div>
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 shrink-0", sidebarCollapsed && "mx-auto mt-0")}
            onClick={() => setSidebarCollapsed(v => !v)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 py-3 px-2 overflow-y-auto space-y-1">
          {navSections.map(({ section, items }) => {
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

        {/* Footer */}
        <div className="mt-auto p-3 border-t shrink-0 bg-white" style={{ borderColor: "var(--border)" }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--primary)" }}>
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">Admin User</div>
                <div className="text-xs truncate text-muted-foreground">admin@vfspl.in</div>
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
    </TooltipProvider>
  );
}
