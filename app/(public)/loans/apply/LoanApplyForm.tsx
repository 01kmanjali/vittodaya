"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CheckCircle2, Loader2, ArrowLeft, User, Phone, Mail,
  Briefcase, IndianRupee, Clock, FileText, Building2,
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────

const LOAN_CONFIG = {
  personal: {
    label: "Personal Loan",
    color: "#C9A84C",
    colorBg: "#fdf7ee",
    amountRange: "₹50,000 – ₹25,00,000",
    tenureOptions: ["12", "24", "36", "48", "60"],
    employmentTypes: ["Salaried", "Self Employed", "Business Owner", "Government Employee"],
    description: "Quick personal loan for any purpose — travel, medical, education, or home renovation.",
  },
  msme: {
    label: "MSME / Business Loan",
    color: "#0a3460",
    colorBg: "#eff6ff",
    amountRange: "₹1,00,000 – ₹50,00,000",
    tenureOptions: ["12", "24", "36", "48", "60", "84"],
    employmentTypes: ["Proprietorship", "Partnership", "Private Limited", "LLP", "Other"],
    description: "Business loans for MSMEs to fuel growth, working capital, or expansion.",
  },
  ev: {
    label: "EV Loan",
    color: "#059669",
    colorBg: "#ecfdf5",
    amountRange: "₹50,000 – ₹15,00,000",
    tenureOptions: ["12", "24", "36", "48", "60"],
    employmentTypes: ["Salaried", "Self Employed", "Business Owner", "Government Employee"],
    description: "Finance your electric vehicle purchase with attractive rates and flexible tenure.",
  },
  lap: {
    label: "Loan Against Property",
    color: "#7c3aed",
    colorBg: "#f5f3ff",
    amountRange: "₹5,00,000 – ₹5,00,00,000",
    tenureOptions: ["12", "24", "36", "48", "60", "84", "120", "180", "240"],
    employmentTypes: ["Salaried", "Self Employed", "Business Owner", "Government Employee"],
    description: "Unlock the value of your property for business or personal needs.",
  },
} as const;

type LoanType = keyof typeof LOAN_CONFIG;

const EMPLOYMENT_LABELS: Record<string, string> = {
  personal: "Employment Type",
  msme: "Business Type",
  ev: "Employment Type",
  lap: "Employment Type",
};

// ─── Form ────────────────────────────────────────────────────────────────────

export default function LoanApplyForm() {
  const params    = useSearchParams();
  const router    = useRouter();
  const { data: session, status: authStatus } = useSession();

  const rawType = params.get("type") ?? "personal";
  const loanType: LoanType = (rawType in LOAN_CONFIG ? rawType : "personal") as LoanType;
  const config = LOAN_CONFIG[loanType];

  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId]       = useState("");

  const [form, setForm] = useState({
    fullName:       session?.user?.name ?? "",
    mobile:         "",
    email:          session?.user?.email ?? "",
    employmentType: "",
    monthlyIncome:  "",
    loanAmount:     "",
    tenureMonths:   "",
    purpose:        "",
    remarks:        "",
  });

  function set(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }));
  }

  // ── Not logged in — show login prompt ──
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-light)" }}>
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: config.colorBg }}>
            <IndianRupee className="h-7 w-7" style={{ color: config.color }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Login to Apply</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Please sign in to your account to apply for a {config.label}.
          </p>
          <Button asChild className="w-full text-white font-semibold" style={{ background: config.color }}>
            <Link href={`/login?redirect=/loans/apply?type=${loanType}`}>Sign In</Link>
          </Button>
          <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold" style={{ color: config.color }}>Register here</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ──
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-light)" }}>
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#ecfdf5", border: "2px solid #16a34a" }}>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Application Submitted!</h2>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            Your {config.label} application has been received. Our team will contact you within 24 business hours.
          </p>
          {refId && (
            <p className="text-xs font-mono mt-2 px-3 py-1.5 rounded-lg inline-block" style={{ background: "var(--bg-light)", color: "var(--text-secondary)" }}>
              Ref: {refId}
            </p>
          )}
          <div className="flex flex-col gap-2 mt-6">
            <Button asChild className="w-full text-white" style={{ background: config.color }}>
              <Link href="/applications">View My Applications</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.fullName.trim())     return toast.error("Full name is required.");
    if (!form.mobile.trim())       return toast.error("Mobile number is required.");
    if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ""))) return toast.error("Enter a valid 10-digit mobile number.");
    if (!form.employmentType)      return toast.error("Please select your employment type.");
    if (!form.loanAmount)          return toast.error("Please enter the loan amount.");
    if (!form.tenureMonths)        return toast.error("Please select a tenure.");

    const amount = Number(form.loanAmount.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) return toast.error("Enter a valid loan amount.");

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: loanType,
          schemeName: config.label,
          principalAmount: amount,
          tenureMonths: Number(form.tenureMonths),
          remarks: [
            `Name: ${form.fullName}`,
            `Mobile: ${form.mobile}`,
            form.email ? `Email: ${form.email}` : "",
            `Employment: ${form.employmentType}`,
            form.monthlyIncome ? `Monthly Income: ₹${form.monthlyIncome}` : "",
            form.purpose ? `Purpose: ${form.purpose}` : "",
            form.remarks ? `Notes: ${form.remarks}` : "",
          ].filter(Boolean).join(" | "),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Submission failed");
      }

      const data = await res.json();
      setRefId(data.application?._id?.slice(-8)?.toUpperCase() ?? "");
      setSubmitted(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-light)" }}>
      {/* Header strip */}
      <div className="py-10 text-white" style={{ background: `linear-gradient(135deg, ${config.color} 0%, #0a3460 100%)` }}>
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm opacity-80 hover:opacity-100 mb-4 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-bold">{config.label} Application</h1>
          <p className="text-sm mt-1 opacity-80">{config.description}</p>
          <p className="text-xs mt-2 opacity-60">Loan range: {config.amountRange}</p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border p-8 space-y-6" style={{ borderColor: "var(--border)" }}>

          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <User className="h-4 w-4" /> Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="As per PAN card"
                    value={form.fullName}
                    onChange={e => set("fullName", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold mb-1.5 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Employment & Income */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <Briefcase className="h-4 w-4" /> Employment & Income
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">{EMPLOYMENT_LABELS[loanType]} *</Label>
                <Select value={form.employmentType} onValueChange={v => set("employmentType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.employmentTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  {loanType === "msme" ? "Monthly Turnover (₹)" : "Monthly Income (₹)"}
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. 50000"
                    value={form.monthlyIncome}
                    onChange={e => set("monthlyIncome", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          {/* Loan Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <IndianRupee className="h-4 w-4" /> Loan Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Loan Amount (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="e.g. 500000"
                    value={form.loanAmount}
                    onChange={e => set("loanAmount", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>Range: {config.amountRange}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Tenure *</Label>
                <Select value={form.tenureMonths} onValueChange={v => set("tenureMonths", v)}>
                  <SelectTrigger>
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.tenureOptions.map(t => (
                      <SelectItem key={t} value={t}>{t} months ({Math.round(Number(t) / 12)} yr{Number(t) >= 24 ? "s" : ""})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold mb-1.5 block">Purpose of Loan</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder={loanType === "msme" ? "e.g. Working capital, Equipment purchase" : loanType === "ev" ? "Vehicle model you want to buy" : "e.g. Home renovation, Medical, Education"}
                    value={form.purpose}
                    onChange={e => set("purpose", e.target.value)}
                  />
                </div>
              </div>
              {loanType === "msme" && (
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold mb-1.5 block">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Registered business name"
                      value={form.remarks}
                      onChange={e => set("remarks", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {loanType !== "msme" && (
            <>
              <hr style={{ borderColor: "var(--border)" }} />
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Additional Notes (Optional)</Label>
                <Textarea
                  rows={3}
                  placeholder="Any additional information you'd like to share…"
                  value={form.remarks}
                  onChange={e => set("remarks", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Disclaimer */}
          <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ background: "var(--bg-light)", color: "var(--text-secondary)" }}>
            By submitting this form, you authorize Vittodaya Financial Services to contact you regarding your loan application. Approval is subject to credit assessment and documentation verification.
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full text-white font-semibold text-base"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, #0a3460 100%)` }}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
