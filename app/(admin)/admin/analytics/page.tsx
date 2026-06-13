"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Area, AreaChart,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, FileText, CheckCircle, Zap,
  Activity, Shield, RefreshCw, Download,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const disbursalTrend = [
  { month: "Jan", personal: 42, msme: 18, ev: 8, lap: 12 },
  { month: "Feb", personal: 55, msme: 22, ev: 11, lap: 14 },
  { month: "Mar", personal: 48, msme: 30, ev: 14, lap: 18 },
  { month: "Apr", personal: 61, msme: 26, ev: 17, lap: 22 },
  { month: "May", personal: 70, msme: 35, ev: 21, lap: 25 },
  { month: "Jun", personal: 65, msme: 40, ev: 19, lap: 28 },
];

const loanMixData = [
  { label: "Personal Loan", value: 38, color: "hsl(var(--chart-1))", amount: "₹4.7Cr" },
  { label: "MSME Loan", value: 28, color: "hsl(var(--chart-2))", amount: "₹3.5Cr" },
  { label: "EV Loan", value: 17, color: "hsl(var(--chart-3))", amount: "₹2.1Cr" },
  { label: "Loan vs Property", value: 17, color: "hsl(var(--chart-4))", amount: "₹2.1Cr" },
];

const applicationFunnel = [
  { stage: "Applications Received", count: 1240, pct: 100 },
  { stage: "Documents Verified", count: 1018, pct: 82 },
  { stage: "Credit Assessed", count: 810, pct: 65 },
  { stage: "Approved", count: 620, pct: 50 },
  { stage: "Disbursed", count: 568, pct: 46 },
];

const topBranches = [
  { branch: "Mumbai – Andheri", disbursed: "₹2.4Cr", count: 148, growth: "+18%" },
  { branch: "Pune – Wakad", disbursed: "₹1.8Cr", count: 112, growth: "+24%" },
  { branch: "Bengaluru – Indiranagar", disbursed: "₹1.5Cr", count: 94, growth: "+31%" },
  { branch: "Ahmedabad – SG Highway", disbursed: "₹1.2Cr", count: 81, growth: "+12%" },
  { branch: "Hyderabad – Gachibowli", disbursed: "₹0.9Cr", count: 63, growth: "+19%" },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 41.2 },
  { month: "Feb", revenue: 43.8 },
  { month: "Mar", revenue: 47.1 },
  { month: "Apr", revenue: 44.5 },
  { month: "May", revenue: 49.3 },
  { month: "Jun", revenue: 48.6 },
];

const kpiCards = [
  { label: "Total AUM", value: "₹1,250 Cr", change: "+22%", up: true, Icon: TrendingUp },
  { label: "Loans Disbursed (MTD)", value: "₹12.4 Cr", change: "+15%", up: true, Icon: Wallet },
  { label: "New Applications (MTD)", value: "284", change: "+8%", up: true, Icon: FileText },
  { label: "Approval Rate", value: "50.2%", change: "-1.3%", up: false, Icon: CheckCircle },
  { label: "Avg. Disbursal Time", value: "26 hrs", change: "-4 hrs", up: true, Icon: Zap },
  { label: "Gross NPA", value: "2.8%", change: "-0.3%", up: true, Icon: Activity },
  { label: "Net NPA", value: "1.8%", change: "-0.5%", up: true, Icon: Shield },
  { label: "Collections Efficiency", value: "97.4%", change: "+0.6%", up: true, Icon: RefreshCw },
];

const periods = ["This Month", "Last 3 Months", "Last 6 Months", "This Year"];

const disbursalChartConfig: ChartConfig = {
  personal: { label: "Personal", color: "hsl(var(--chart-1))" },
  msme:     { label: "MSME",     color: "hsl(var(--chart-2))" },
  ev:       { label: "EV",       color: "hsl(var(--chart-3))" },
  lap:      { label: "LAP",      color: "hsl(var(--chart-4))" },
};

const revenueChartConfig: ChartConfig = {
  revenue: { label: "Revenue (₹ Cr)", color: "hsl(var(--chart-1))" },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("Last 6 Months");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Analytics</h1>
          <p className="text-sm mt-1 text-muted-foreground">Portfolio performance and business intelligence</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {periods.map(p => (
            <Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)} className="text-xs">
              {p}
            </Button>
          ))}
          <Button size="sm" variant="outline" className="text-xs gap-1">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(({ label, value, change, up, Icon }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Badge variant={up ? "default" : "destructive"} className="text-xs px-1.5 py-0 gap-0.5">
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {change}
                </Badge>
              </div>
              <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>{value}</p>
              <p className="text-xs mt-0.5 text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disbursal Trend</CardTitle>
            <CardDescription>Number of loans disbursed per month by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={disbursalChartConfig} className="h-52 w-full">
              <BarChart data={disbursalTrend}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="personal" fill="var(--color-personal)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="msme"     fill="var(--color-msme)"     radius={[3, 3, 0, 0]} />
                <Bar dataKey="ev"       fill="var(--color-ev)"       radius={[3, 3, 0, 0]} />
                <Bar dataKey="lap"      fill="var(--color-lap)"      radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-lg overflow-hidden h-5 mb-5">
              {loanMixData.map(d => (
                <div key={d.label} style={{ width: `${d.value}%`, background: d.color }} title={`${d.label}: ${d.value}%`} />
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
                    <div className="text-right">
                      <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
                      <span className="text-xs ml-2 text-muted-foreground">{d.amount}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-1.5 rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Interest income (₹ Cr)</CardDescription>
              </div>
              <Badge variant="default" className="gap-1 text-xs">
                <TrendingUp className="h-3 w-3" /> 18%
              </Badge>
            </div>
            <p className="text-2xl font-bold pt-1" style={{ color: "var(--primary)" }}>₹48.6 Cr</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-36 w-full">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="revenue" stroke="var(--color-revenue)" fill="url(#revGrad)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-revenue)" }} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {applicationFunnel.map((f, i) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: "var(--primary)", opacity: 1 - i * 0.12 }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm">{f.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                      {f.count.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs w-10 text-right text-muted-foreground">{f.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${f.pct}%`, background: "var(--primary)", opacity: 1 - i * 0.1 }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs mt-2 text-muted-foreground">
              Overall conversion: <strong style={{ color: "var(--primary)" }}>45.8%</strong>
              {" · "}
              Drop-off at document stage: <strong className="text-destructive">18%</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Branches */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Top Performing Branches</CardTitle>
          <CardDescription>Ranked by disbursement volume (current month)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {["#", "Branch", "Disbursed (Cr)", "Loan Count", "MoM Growth"].map(h => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {topBranches.map((b, i) => (
                <TableRow key={b.branch}>
                  <TableCell>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i === 0 ? "#b45309" : i === 1 ? "#6b7280" : i === 2 ? "#92400e" : "hsl(var(--muted))",
                        color: i < 3 ? "white" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {i + 1}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{b.branch}</TableCell>
                  <TableCell className="font-bold" style={{ color: "var(--primary)" }}>{b.disbursed}</TableCell>
                  <TableCell>{b.count}</TableCell>
                  <TableCell>
                    <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border-0">
                      {b.growth}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs mt-4 text-right text-muted-foreground">
        Data shown is indicative / dummy. Connect to API for live analytics.
      </p>
    </div>
  );
}
