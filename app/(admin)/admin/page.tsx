import { applications, getApplicationStats } from "@/constants/applications";
import { fdSchemes } from "@/constants/fdSchemes";
import { users } from "@/constants/users";
import { banks } from "@/constants/banks";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText, CheckCircle, Clock, Users, Wallet, Target, LayoutGrid, Building2,
  Plus, ChevronRight
} from "lucide-react";

const stats = getApplicationStats();

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

const recentApplications = [...applications]
  .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
  .slice(0, 5);

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  under_review: "secondary",
  matured: "outline",
  submitted: "default",
  draft: "secondary",
  cancelled: "destructive",
  rejected: "destructive",
  approved: "default",
};

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Overview of Vittodaya platform activity</p>
      </div>

      {/* Primary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: "Total Applications", value: stats.total, Icon: FileText, color: "text-blue-700", href: "/admin/applications" },
          { label: "Active FDs", value: stats.active, Icon: CheckCircle, color: "text-green-600", href: "/admin/applications" },
          { label: "Under Review", value: stats.underReview, Icon: Clock, color: "text-amber-600", href: "/admin/applications" },
          { label: "Registered Users", value: users.filter(u => u.role === "user").length, Icon: Users, color: "text-violet-600", href: "/admin/users" },
        ].map(({ label, value, Icon, color, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className={`text-3xl font-bold mb-0.5 ${color}`}>{value}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Financial Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Invested", value: `₹${fmt(stats.totalInvested)}`, Icon: Wallet, color: "text-blue-700" },
          { label: "Total Maturity Value", value: `₹${fmt(stats.totalMaturity)}`, Icon: Target, color: "text-green-600" },
          { label: "FD Schemes", value: fdSchemes.filter(s => s.isActive).length, Icon: LayoutGrid, color: "text-sky-600" },
          { label: "Partner Banks", value: banks.filter(b => b.isActive).length, Icon: Building2, color: "text-violet-600" },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <Icon className={`h-5 w-5 mb-2 ${color}`} />
              <div className={`text-xl font-bold mb-0.5 ${color}`}>{value}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
            <Link href="/admin/applications" className="text-xs" style={{ color: "var(--primary)" }}>View All</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentApplications.map(app => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{app.userName}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {app.bankName} · ₹{fmt(app.principalAmount)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[app.status] ?? "secondary"} className="capitalize shrink-0">
                    {app.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {[
              { label: "Add New FD Scheme", Icon: Plus, href: "/admin/fd-schemes", color: "text-blue-700" },
              { label: "Review Pending Applications", Icon: Clock, href: "/admin/applications", color: "text-amber-600" },
              { label: "Manage Users", Icon: Users, href: "/admin/users", color: "text-violet-600" },
              { label: "Add Partner Bank", Icon: Building2, href: "/admin/banks", color: "text-green-600" },
            ].map(({ label, Icon, href, color }) => (
              <Button key={label} variant="ghost" asChild className="w-full justify-start gap-3 h-auto py-3">
                <Link href={href}>
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
