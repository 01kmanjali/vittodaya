"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { useApplications } from "@/lib/queries/useApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet, TrendingUp, Target, Sparkles, TriangleAlert, Briefcase, Loader2 } from "lucide-react";

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

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { data: applications = [], isLoading } = useApplications({ limit: "10" });

  const activeApps = applications.filter(a => a.status === "active");
  const totalInvested = applications.reduce((sum, a) => sum + (a.principalAmount ?? 0), 0);
  const totalMaturity = activeApps.reduce((sum, a) => sum + (a.maturityAmount ?? 0), 0);
  const totalInterest = totalMaturity - activeApps.reduce((sum, a) => sum + (a.principalAmount ?? 0), 0);

  const statCards = [
    { label: "Total Invested", value: `₹${fmt(totalInvested)}`, Icon: Wallet, color: "text-blue-700" },
    { label: "Active FDs", value: activeApps.length, Icon: TrendingUp, color: "text-green-600" },
    { label: "Expected Maturity", value: `₹${fmt(totalMaturity)}`, Icon: Target, color: "text-indigo-600" },
    { label: "Total Interest", value: `+₹${fmt(totalInterest)}`, Icon: Sparkles, color: "text-green-600" },
  ];

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s an overview of your fixed deposit portfolio.
          </p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link href="/fd">Invest More</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${color}`}>{value}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.kycStatus !== "verified" && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <TriangleAlert className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Complete Your KYC</AlertTitle>
          <AlertDescription className="text-amber-700 flex items-center justify-between">
            <span>KYC verification is required to invest. It takes only 5 minutes.</span>
            <Button asChild size="sm" className="ml-4 bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/profile">Complete KYC</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-base font-semibold">My Fixed Deposits</CardTitle>
          <Link href="/applications" className="text-sm" style={{ color: "var(--primary)" }}>View All</Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">No FDs yet</p>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Start your investment journey today.</p>
              <Button asChild variant="primary" size="md">
                <Link href="/fd">Explore FDs</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Bank", "Amount", "Rate", "Tenure", "Maturity Date", "Status"].map(h => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={String(app._id)}>
                      <TableCell>
                        <div className="font-medium">{String(app.bankName ?? "—")}</div>
                        {app.fdNumber && (
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{String(app.fdNumber)}</div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">₹{fmt(app.principalAmount ?? 0)}</TableCell>
                      <TableCell className="font-bold text-green-600">{String(app.interestRate)}%</TableCell>
                      <TableCell>{app.tenureMonths ? `${app.tenureMonths} months` : "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.approvedAt ? new Date(String(app.approvedAt)).toLocaleDateString("en-IN") : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[app.status] ?? "secondary"} className="capitalize">
                          {app.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
