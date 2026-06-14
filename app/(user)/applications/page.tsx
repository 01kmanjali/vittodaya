"use client";

import Link from "next/link";
import { useApplications } from "@/lib/queries/useApplications";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, Car, Home, Briefcase, User, PiggyBank } from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; colorBg: string }> = {
  fd:       { label: "Fixed Deposit",      icon: PiggyBank, color: "#2563eb", colorBg: "#eff6ff" },
  personal: { label: "Personal Loan",      icon: User,      color: "#C9A84C", colorBg: "#fdf7ee" },
  msme:     { label: "Business Loan",      icon: Briefcase, color: "#0a3460", colorBg: "#eff6ff" },
  ev:       { label: "EV Loan",            icon: Car,       color: "#059669", colorBg: "#ecfdf5" },
  lap:      { label: "Loan Against Prop.", icon: Home,      color: "#7c3aed", colorBg: "#f5f3ff" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active:       { bg: "#f0fdf4", text: "#16a34a" },
  under_review: { bg: "#fef9c3", text: "#ca8a04" },
  matured:      { bg: "#eff6ff", text: "#2563eb" },
  submitted:    { bg: "#ecfdf5", text: "#059669" },
  draft:        { bg: "#f3f4f6", text: "#6b7280" },
  cancelled:    { bg: "#fef2f2", text: "#dc2626" },
  rejected:     { bg: "#fef2f2", text: "#dc2626" },
  approved:     { bg: "#f0fdf4", text: "#16a34a" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

function isFD(type: string) {
  return type === "fd";
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();

  const fdApps   = applications.filter(a => a.type === "fd");
  const loanApps = applications.filter(a => a.type !== "fd");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Applications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {applications.length} total — {fdApps.length} FD{fdApps.length !== 1 ? "s" : ""}, {loanApps.length} loan{loanApps.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/loans/apply?type=personal">Apply for Loan</Link>
          </Button>
          <Button asChild size="sm" className="text-white" style={{ background: "var(--primary)" }}>
            <Link href="/fd">+ New FD</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: "var(--border)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1">No applications yet</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Apply for a loan or invest in fixed deposits to get started.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button asChild variant="outline" size="sm">
              <Link href="/loans/apply?type=personal">Apply for Loan</Link>
            </Button>
            <Button asChild size="sm" className="text-white" style={{ background: "var(--primary)" }}>
              <Link href="/fd">Browse FD Schemes</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">

          {/* ── Loan Applications ── */}
          {loanApps.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <TrendingUp className="h-4 w-4" /> Loan Applications
              </h2>
              <div className="space-y-3">
                {loanApps.map(app => {
                  const tc = TYPE_CONFIG[String(app.type)] ?? TYPE_CONFIG.personal;
                  const sc = STATUS_STYLES[app.status] ?? STATUS_STYLES.draft;
                  const Icon = tc.icon;
                  return (
                    <div key={String(app._id)} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: tc.colorBg }}>
                            <Icon className="h-5 w-5" style={{ color: tc.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{tc.label}</h3>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: sc.bg, color: sc.text }}>
                                {app.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                              Applied {new Date(String(app.createdAt ?? Date.now())).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            {app.loanNumber && (
                              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>Ref: {String(app.loanNumber)}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl p-3" style={{ background: "var(--bg-light)" }}>
                          <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>Loan Amount</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>₹{fmt(app.principalAmount ?? 0)}</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: "var(--bg-light)" }}>
                          <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>Tenure</p>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            {app.tenureMonths ? `${app.tenureMonths} months` : "—"}
                          </p>
                        </div>
                        <div className="rounded-xl p-3 col-span-2 sm:col-span-1" style={{ background: "var(--bg-light)" }}>
                          <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>Status</p>
                          <p className="text-sm font-semibold capitalize" style={{ color: sc.text }}>
                            {app.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      {app.remarks && (
                        <p className="mt-3 text-xs px-3 py-2 rounded-lg leading-relaxed" style={{ background: "#f1f5f9", color: "#475569" }}>
                          {String(app.remarks)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── FD Applications ── */}
          {fdApps.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <PiggyBank className="h-4 w-4" /> Fixed Deposit Investments
              </h2>
              <div className="space-y-3">
                {fdApps.map(app => {
                  const sc = STATUS_STYLES[app.status] ?? STATUS_STYLES.draft;
                  return (
                    <div key={String(app._id)} className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0" style={{ background: "var(--primary)" }}>
                            {app.bankName?.charAt(0) ?? "F"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{String(app.bankName ?? "—")}</h3>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                              {String(app.schemeName ?? "")} · Applied {new Date(String(app.createdAt ?? Date.now())).toLocaleDateString("en-IN")}
                            </p>
                            {app.fdNumber && (
                              <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-secondary)" }}>{String(app.fdNumber)}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0" style={{ background: sc.bg, color: sc.text }}>
                          {app.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Principal",       value: `₹${fmt(app.principalAmount ?? 0)}` },
                          { label: "Rate",            value: app.interestRate ? `${String(app.interestRate)}% p.a.` : "—" },
                          { label: "Tenure",          value: app.tenureMonths ? `${app.tenureMonths} months` : "—" },
                          { label: "Maturity Amount", value: app.maturityAmount ? `₹${fmt(app.maturityAmount)}` : "—" },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-3" style={{ background: "var(--bg-light)" }}>
                            <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
                            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
                          </div>
                        ))}
                      </div>

                      {app.maturityAmount && app.principalAmount && (
                        <div className="mt-3 flex items-center text-xs" style={{ color: "var(--text-secondary)" }}>
                          <span>Interest Earned: <strong style={{ color: "#16a34a" }}>+₹{fmt(app.maturityAmount - app.principalAmount)}</strong></span>
                        </div>
                      )}

                      {app.remarks && !isFD(String(app.type)) && (
                        <p className="mt-2 text-xs px-3 py-2 rounded-lg" style={{ background: "#fef9c3", color: "#92400e" }}>
                          ⚠️ {String(app.remarks)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
