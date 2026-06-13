"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard, FolderOpen, User, PlusCircle,
  ChevronLeft, ChevronRight, LogOut, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",       href: "/dashboard",     Icon: LayoutDashboard },
  { label: "My Applications", href: "/applications",  Icon: FolderOpen },
  { label: "Profile & KYC",  href: "/profile",       Icon: User },
];

function clearCookies() {
  document.cookie = "vf_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "vf_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearCookies();
    router.push("/login");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "shrink-0 h-screen border-r bg-white flex flex-col overflow-hidden transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b shrink-0 justify-between" style={{ borderColor: "var(--border)" }}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: "var(--primary)" }}>
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>Vittodaya</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 shrink-0", collapsed && "mx-auto")}
            onClick={() => setCollapsed(v => !v)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            const link = (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  collapsed && "justify-center px-0",
                  isActive ? "text-white" : "hover:bg-gray-100"
                )}
                style={isActive ? { background: "var(--primary)", color: "white" } : { color: "var(--text-primary)" }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : link;
          })}

          <Separator className="my-3" />

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/fd" className="flex items-center justify-center px-0 py-2.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "var(--primary)" }}>
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Invest in FD</TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/fd" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors" style={{ color: "var(--primary)" }}>
              <PlusCircle className="h-4 w-4 shrink-0" />
              Invest in FD
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-3 border-t shrink-0 bg-white space-y-1" style={{ borderColor: "var(--border)" }}>
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-9" asChild>
                    <Link href="/"><Home className="h-4 w-4" /></Link>
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
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-xs gap-1.5" asChild>
                <Link href="/"><Home className="h-3.5 w-3.5" /> Site</Link>
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
