import Link from "next/link";
import { currentUser } from "@/constants/users";
import { getApplicationsByUser } from "@/constants/applications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet, TrendingUp, Target, Sparkles, TriangleAlert, Briefcase } from "lucide-react";

const userApps = getApplicationsByUser(currentUser.id);
const activeApps = userApps.filter(a => a.status === "active");
const totalInvested = userApps.reduce((sum, a) => sum + a.principalAmount, 0);
const totalMaturity = activeApps.reduce((sum, a) => sum + a.maturityAmount, 0);
const totalInterest = totalMaturity - activeApps.reduce((sum, a) => sum + a.principalAmount, 0);

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

const statCards = [
  { label: "Total Invested", value: `₹${fmt(totalInvested)}`, Icon: Wallet, color: "text-blue-700" },
  { label: "Active FDs", value: activeApps.length, Icon: TrendingUp, color: "text-green-600" },
  { label: "Expected Maturity", value: `₹${fmt(totalMaturity)}`, Icon: Target, color: "text-indigo-600" },
  { label: "Total Interest", value: `+₹${fmt(totalInterest)}`, Icon: Sparkles, color: "text-green-600" },
];

export default function UserDashboard() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s an overview of your fixed deposit portfolio.
          </p>
        </div>
        <Button asChild className="text-white" style={{ background: "var(--primary)" }}>
          <Link href="/fd">Invest More</Link>
        </Button>
      </div>

      {/* Stats */}
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

      {/* KYC Banner */}
      {currentUser.kycStatus !== "verified" && (
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

      {/* My FDs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-base font-semibold">My Fixed Deposits</CardTitle>
          <Link href="/applications" className="text-sm" style={{ color: "var(--primary)" }}>View All</Link>
        </CardHeader>
        <CardContent className="p-0">
          {userApps.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">No FDs yet</p>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Start your investment journey today.</p>
              <Button asChild className="text-white" style={{ background: "var(--primary)" }}>
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
                  {userApps.map(app => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.bankName}</div>
                        {app.fdNumber && (
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{app.fdNumber}</div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">₹{fmt(app.principalAmount)}</TableCell>
                      <TableCell className="font-bold text-green-600">{app.interestRate}%</TableCell>
                      <TableCell>{app.tenureLabel}</TableCell>
                      <TableCell className="text-muted-foreground">{app.maturityDate ?? "—"}</TableCell>
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
