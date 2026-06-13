"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, KeyRound, ShieldCheck, Smartphone, ChevronRight } from "lucide-react";

const securityItems = [
  { label: "Change Password", Icon: KeyRound },
  { label: "Two-Factor Authentication", Icon: ShieldCheck },
  { label: "Linked Devices", Icon: Smartphone },
];

export default function ProfilePage() {
  const { user } = useAuthStore();

  const kycSteps = [
    { step: 1, label: "Email Verified", done: true },
    { step: 2, label: "Mobile OTP Verified", done: !!user?.phone },
    { step: 3, label: "PAN Card Uploaded", done: !!user?.panNumber },
    { step: 4, label: "Aadhaar Verified", done: !!user?.aadharNumber },
    { step: 5, label: "Bank Account Linked", done: false },
  ];

  const kycComplete = kycSteps.filter(s => s.done).length;
  const kycPercent = Math.round((kycComplete / kycSteps.length) * 100);

  if (!user) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Profile & KYC</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
                style={{ background: "var(--primary)" }}
              >
                {user.name?.charAt(0) ?? "U"}
              </div>
              <h2 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge
                variant={user.isSeniorCitizen ? "secondary" : "outline"}
                className="mt-2"
              >
                {user.isSeniorCitizen ? "Senior Citizen" : "Regular Investor"}
              </Badge>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-2 text-sm">
              {[
                { label: "Phone", value: user.phone ?? "—" },
                { label: "Status", value: user.status ?? "active" },
                { label: "Role", value: user.role ?? "user" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-5 w-full" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-base font-semibold">KYC Status</CardTitle>
              <Badge variant={user.kycStatus === "verified" ? "default" : "secondary"}>
                {user.kycStatus === "verified" ? "Verified" : "Pending"}
              </Badge>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                  <span>KYC Completion</span>
                  <span className="font-semibold">{kycPercent}%</span>
                </div>
                <Progress value={kycPercent} className="h-2" />
              </div>

              <div className="space-y-3">
                {kycSteps.map(step => (
                  <div key={step.step} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    {step.done
                      ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    }
                    <span
                      className="text-sm font-medium"
                      style={{ color: step.done ? "var(--text-primary)" : "var(--text-secondary)" }}
                    >
                      {step.label}
                    </span>
                    {!step.done && (
                      <Button size="sm" className="ml-auto text-white h-7 text-xs" style={{ background: "var(--primary)" }}>
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-semibold">Security</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {securityItems.map(({ label, Icon }) => (
                <Button key={label} variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
