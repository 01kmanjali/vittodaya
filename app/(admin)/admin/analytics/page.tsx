"use client";

import { useState } from "react";
import { useAnalytics } from "@/lib/queries/useAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";
import {
  TrendingUp, Wallet, FileText, CheckCircle, Zap,
  Activity, Shield, RefreshCw, Download, Loader2,
} from "lucide-react";

const disbursalChartConfig: ChartConfig = {
  personal: { label: "Personal", color: "hsl(var(--chart-1))" },
  msme:     { label: "MSME",     color: "hsl(var(--chart-2))" },
  ev:       { label: "EV",       color: "hsl(var(--chart-3))" },
  lap:      { label: "LAP",      color: "hsl(var(--chart-4))" },
};

const periods = ["This Month", "Last 3 Months", "Last 6 Months", "This Year"];

export default function AdminAnalyticsPage() {
  const { canView, canWrite } = usePageRole("analytics");
  const [period, setPeriod] = useState("Last 6 Months");
  const { data: stats, isLoading } = useAnalytics();

  const kpiCards = stats ? [
    { label: "Total Applications", value: stats.applications.total, Icon: FileText, color: "text-blue-700" },
    { label: "Approved", value: stats.applications.approved, Icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Review", value: stats.applications.pending, Icon: Zap, color: "text-amber-600" },
    { label: "Active FDs", value: stats.applications.active, Icon: Activity, color: "text-indigo-600" },
    { label: "Registered Users", value: stats.users.total, Icon: Wallet, color: "text-violet-600" },
    { label: "KYC Pending", value: stats.users.pendingKYC, Icon: Shield, color: "text-orange-600" },
    { label: "FD Schemes", value: stats.products.fdSchemes, Icon: RefreshCw, color: "text-sky-600" },
    { label: "Loan Products", value: stats.products.loanProducts, Icon: TrendingUp, color: "text-teal-600" },
  ] : [];

  const byType: Record<string, number> = {};
  if (stats?.applications?.byType) {
    for (const entry of stats.applications.byType as Array<{ _id: string; count: number }>) {
      byType[entry._id] = entry.count;
    }
  }

  const loanMixData = [
    { label: "Personal Loan", value: byType["personal"] ?? 0, color: "hsl(var(--chart-1))" },
    { label: "MSME Loan",     value: byType["msme"] ?? 0,     color: "hsl(var(--chart-2))" },
    { label: "EV Loan",       value: byType["ev"] ?? 0,       color: "hsl(var(--chart-3))" },
    { label: "LAP",           value: byType["lap"] ?? 0,      color: "hsl(var(--chart-4))" },
  ];

  const byStatus: Record<string, number> = {};
  if (stats?.applications?.byStatus) {
    for (const entry of stats.applications.byStatus as Array<{ _id: string; count: number }>) {
      byStatus[entry._id] = entry.count;
    }
  }

  const applicationFunnel = [
    { stage: "Total Applications", count: stats?.applications.total ?? 0 },
    { stage: "Submitted",          count: byStatus["submitted"] ?? 0 },
    { stage: "Under Review",       count: byStatus["under_review"] ?? 0 },
    { stage: "Approved",           count: stats?.applications.approved ?? 0 },
    { stage: "Active",             count: stats?.applications.active ?? 0 },
  ];
  const maxFunnel = applicationFunnel[0].count || 1;

  const disbursalByType = [
    { type: "Personal", count: byType["personal"] ?? 0 },
    { type: "MSME",     count: byType["msme"] ?? 0 },
    { type: "EV",       count: byType["ev"] ?? 0 },
    { type: "LAP",      count: byType["lap"] ?? 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  if (!canView) return <AccessDenied page="Analytics" />;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Analytics</h1>
          <p className="text-sm mt-1 text-muted-foreground">Live platform statistics from MongoDB</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {periods.map(p => (
            <Button key={p} size="sm" variant={period === p ? "primary" : "neutral"} onClick={() => setPeriod(p)}>
              {p}
            </Button>
          ))}
          <Button size="sm" variant="primaryOutline">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(({ label, value, Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <Icon className={`h-4 w-4 mb-3 ${color}`} />
              <p className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Applications by type bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications by Loan Type</CardTitle>
            <CardDescription>Total applications per product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={disbursalChartConfig} className="h-52 w-full">
              <BarChart data={disbursalByType}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-personal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Loan Portfolio Mix */}
        <Card>
          <CardHeader><CardTitle>Loan Portfolio Mix</CardTitle></CardHeader>
          <CardContent>
            {(() => {
              const total = loanMixData.reduce((s, d) => s + d.value, 0) || 1;
              return (
                <>
                  <div className="flex rounded-lg overflow-hidden h-5 mb-5">
                    {loanMixData.map(d => (
                      <div key={d.label} style={{ width: `${(d.value / total) * 100}%`, background: d.color }} title={`${d.label}: ${d.value}`} />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {loanMixData.map(d => (
                      <div key={d.label}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                            <span className="text-xs font-medium">{d.label}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted">
                          <div className="h-1.5 rounded-full" style={{ width: `${(d.value / total) * 100}%`, background: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Application Funnel */}
      <Card className="mb-5">
        <CardHeader><CardTitle>Application Status Funnel</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {applicationFunnel.map((f, i) => (
            <div key={f.stage}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: "var(--primary)", opacity: 1 - i * 0.12 }}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{f.stage}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                  {f.count.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div className="h-2.5 rounded-full" style={{ width: `${(f.count / maxFunnel) * 100}%`, background: "var(--primary)", opacity: 1 - i * 0.1 }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest 10 across all products</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["Applicant", "Bank / Product", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {(stats?.recentApplications ?? []).map((app: Record<string, unknown>) => (
                  <tr key={String(app._id)} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{String(app.userName ?? "—")}</td>
                    <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>{String(app.bankName ?? app.type ?? "—")}</td>
                    <td className="px-5 py-3 font-semibold">
                      {app.principalAmount ? `₹${Number(app.principalAmount).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {String(app.status ?? "").replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {app.createdAt ? new Date(String(app.createdAt)).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
                {!stats?.recentApplications?.length && (
                  <tr><td colSpan={5} className="px-5 py-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>No applications yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
