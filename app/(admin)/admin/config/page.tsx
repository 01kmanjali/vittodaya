"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, Save, RotateCcw, LayoutGrid, Landmark, ShieldCheck,
  TrendingUp, Newspaper, Settings, Bell, Wrench, AlertTriangle,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

type FeatureStatus = "active" | "maintenance" | "upcoming" | "disabled";

interface FeatureCfg { enabled: boolean; status: FeatureStatus; label: string }

interface Config {
  features: {
    fixedDeposits:     FeatureCfg;
    loans:             FeatureCfg;
    kycVerification:   FeatureCfg;
    investorRelations: FeatureCfg;
    newsMedia:         FeatureCfg;
  };
  fd: {
    minAmount: number; maxAmount: number;
    tenures: number[]; seniorCitizenBonus: number;
  };
  loans: {
    personal: LoanCfg; msme: LoanCfg; ev: LoanCfg; lap: LoanCfg;
  };
  app: {
    maintenanceMode: boolean; maintenanceMessage: string;
    registrationOpen: boolean; supportEmail: string; supportPhone: string;
  };
  notifications: {
    welcomeEmail: boolean; otpEmail: boolean; applicationUpdates: boolean;
  };
}

interface LoanCfg {
  enabled: boolean; minAmount: number; maxAmount: number;
  minTenureMonths: number; maxTenureMonths: number;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTS: { value: FeatureStatus; label: string; color: string }[] = [
  { value: "active",      label: "Active",      color: "bg-green-100 text-green-700" },
  { value: "maintenance", label: "Maintenance",  color: "bg-amber-100 text-amber-700" },
  { value: "upcoming",    label: "Upcoming",     color: "bg-blue-100 text-blue-700"  },
  { value: "disabled",    label: "Disabled",     color: "bg-gray-100 text-gray-500"  },
];

const ALL_TENURES = [3, 6, 12, 18, 24, 36, 48, 60, 84];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-light)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
      </div>
      <div>
        <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, prefix }: { label: string; value: number; onChange: (v: number) => void; prefix?: string }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {prefix && <span className="px-2.5 text-sm text-muted-foreground bg-gray-50 border-r" style={{ borderColor: "var(--border)", lineHeight: "2.2rem" }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function AdminConfigPage() {
  const [config, setConfig]       = useState<Config | null>(null);
  const [original, setOriginal]   = useState<Config | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => { fetchConfig(); }, []);

  async function fetchConfig() {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data.config);
      setOriginal(JSON.parse(JSON.stringify(data.config)));
    } catch {
      setError("Failed to load configuration.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true); setError(""); setSaved(false);
    try {
      const res  = await fetch("/api/admin/config", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      setConfig(data.config);
      setOriginal(JSON.parse(JSON.stringify(data.config)));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (original) setConfig(JSON.parse(JSON.stringify(original)));
  }

  function setFeature(key: keyof Config["features"], patch: Partial<FeatureCfg>) {
    setConfig(c => !c ? c : { ...c, features: { ...c.features, [key]: { ...c.features[key], ...patch } } });
  }

  function setLoan(key: keyof Config["loans"], patch: Partial<LoanCfg>) {
    setConfig(c => !c ? c : { ...c, loans: { ...c.loans, [key]: { ...c.loans[key], ...patch } } });
  }

  function toggleTenure(months: number) {
    setConfig(c => {
      if (!c) return c;
      const has = c.fd.tenures.includes(months);
      return { ...c, fd: { ...c.fd, tenures: has ? c.fd.tenures.filter(t => t !== months) : [...c.fd.tenures, months].sort((a, b) => a - b) } };
    });
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
    </div>
  );

  if (!config) return (
    <div className="p-8 text-center text-red-600">{error || "Failed to load config"}</div>
  );

  const FEATURES: { key: keyof Config["features"]; Icon: React.ElementType }[] = [
    { key: "fixedDeposits",     Icon: LayoutGrid  },
    { key: "loans",             Icon: Landmark    },
    { key: "kycVerification",   Icon: ShieldCheck },
    { key: "investorRelations", Icon: TrendingUp  },
    { key: "newsMedia",         Icon: Newspaper   },
  ];

  const LOAN_TYPES: { key: keyof Config["loans"]; label: string }[] = [
    { key: "personal", label: "Personal Loans"         },
    { key: "msme",     label: "MSME / Business Loans"  },
    { key: "ev",       label: "EV Loans"               },
    { key: "lap",      label: "Loan Against Property"  },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>App Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage feature flags, limits, and app-wide settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="neutral" size="sm" className="gap-1.5" onClick={handleReset} disabled={saving}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button
            variant="primary" size="sm" className="gap-1.5 min-w-[100px]"
            onClick={handleSave} disabled={saving}
          >
            {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 font-medium">
          ✓ Configuration saved successfully.
        </div>
      )}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">

        {/* ── Maintenance Banner ── */}
        {config.app.maintenanceMode && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium text-amber-800">Maintenance mode is ON — users will see the maintenance message.</p>
          </div>
        )}

        {/* ── Feature Flags ── */}
        <Card>
          <CardHeader className="border-b pb-4">
            <SectionHeader icon={Settings} title="Feature Visibility" subtitle="Control which features are visible and their current status for users" />
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {FEATURES.map(({ key, Icon }) => {
              const f = config.features[key];
              const statusOpt = STATUS_OPTS.find(s => s.value === f.status)!;
              return (
                <div key={key} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-light)" }}>
                    <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{f.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  </div>

                  {/* Status selector */}
                  <div className="flex gap-1.5 flex-wrap">
                    {STATUS_OPTS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFeature(key, { status: opt.value })}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all border ${
                          f.status === opt.value ? opt.color + " border-transparent" : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Enable toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{f.enabled ? "Visible" : "Hidden"}</span>
                    <Toggle checked={f.enabled} onChange={v => setFeature(key, { enabled: v })} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ── FD Settings ── */}
        <Card>
          <CardHeader className="border-b pb-4">
            <SectionHeader icon={LayoutGrid} title="Fixed Deposit Settings" subtitle="Investment limits, available tenures, and senior citizen benefits" />
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberInput
                label="Minimum Investment (₹)"
                value={config.fd.minAmount}
                onChange={v => setConfig(c => !c ? c : { ...c, fd: { ...c.fd, minAmount: v } })}
                prefix="₹"
              />
              <NumberInput
                label="Maximum Investment (₹)"
                value={config.fd.maxAmount}
                onChange={v => setConfig(c => !c ? c : { ...c, fd: { ...c.fd, maxAmount: v } })}
                prefix="₹"
              />
              <NumberInput
                label="Senior Citizen Bonus (%)"
                value={config.fd.seniorCitizenBonus}
                onChange={v => setConfig(c => !c ? c : { ...c, fd: { ...c.fd, seniorCitizenBonus: v } })}
                prefix="%"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>Available Tenures (months)</label>
              <div className="flex flex-wrap gap-2">
                {ALL_TENURES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTenure(t)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      config.fd.tenures.includes(t)
                        ? "text-white border-transparent"
                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-300"
                    }`}
                    style={config.fd.tenures.includes(t) ? { background: "var(--primary)", borderColor: "var(--primary)" } : {}}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Loan Settings ── */}
        <Card>
          <CardHeader className="border-b pb-4">
            <SectionHeader icon={Landmark} title="Loan Product Settings" subtitle="Enable/disable individual loan types and set amount & tenure limits" />
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {LOAN_TYPES.map(({ key, label }) => {
              const l = config.loans[key];
              return (
                <div key={key} className={`p-4 rounded-xl border transition-colors ${l.enabled ? "" : "opacity-60"}`} style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{l.enabled ? "Enabled" : "Disabled"}</span>
                      <Toggle checked={l.enabled} onChange={v => setLoan(key, { enabled: v })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <NumberInput label="Min Amount (₹)" value={l.minAmount} onChange={v => setLoan(key, { minAmount: v })} prefix="₹" />
                    <NumberInput label="Max Amount (₹)" value={l.maxAmount} onChange={v => setLoan(key, { maxAmount: v })} prefix="₹" />
                    <NumberInput label="Min Tenure (mo)" value={l.minTenureMonths} onChange={v => setLoan(key, { minTenureMonths: v })} />
                    <NumberInput label="Max Tenure (mo)" value={l.maxTenureMonths} onChange={v => setLoan(key, { maxTenureMonths: v })} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ── App Settings ── */}
        <Card>
          <CardHeader className="border-b pb-4">
            <SectionHeader icon={Wrench} title="App Settings" subtitle="Maintenance mode, registration, and support contact details" />
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Maintenance mode */}
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Show maintenance page to all users</p>
                </div>
                <Toggle
                  checked={config.app.maintenanceMode}
                  onChange={v => setConfig(c => !c ? c : { ...c, app: { ...c.app, maintenanceMode: v } })}
                />
              </div>
              {/* Registration */}
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>User Registration</p>
                  <p className="text-xs text-muted-foreground">Allow new users to register</p>
                </div>
                <Toggle
                  checked={config.app.registrationOpen}
                  onChange={v => setConfig(c => !c ? c : { ...c, app: { ...c.app, registrationOpen: v } })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Maintenance Message</label>
              <textarea
                value={config.app.maintenanceMessage}
                onChange={e => setConfig(c => !c ? c : { ...c, app: { ...c.app, maintenanceMessage: e.target.value } })}
                rows={2}
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextInput
                label="Support Email"
                value={config.app.supportEmail}
                onChange={v => setConfig(c => !c ? c : { ...c, app: { ...c.app, supportEmail: v } })}
                type="email"
              />
              <TextInput
                label="Support Phone"
                value={config.app.supportPhone}
                onChange={v => setConfig(c => !c ? c : { ...c, app: { ...c.app, supportPhone: v } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Notification Settings ── */}
        <Card>
          <CardHeader className="border-b pb-4">
            <SectionHeader icon={Bell} title="Notification Settings" subtitle="Control which automated emails are sent to users" />
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {([
              { key: "welcomeEmail",       label: "Welcome Email",        desc: "Send welcome email when a user registers" },
              { key: "otpEmail",           label: "OTP / Verification",   desc: "Send OTP emails for KYC and security actions" },
              { key: "applicationUpdates", label: "Application Updates",  desc: "Notify users on loan/FD application status changes" },
            ] as { key: keyof Config["notifications"]; label: string; desc: string }[]).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Toggle
                  checked={config.notifications[key]}
                  onChange={v => setConfig(c => !c ? c : { ...c, notifications: { ...c.notifications, [key]: v } })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save footer */}
        <div className="flex justify-end gap-3 pb-4">
          <Button variant="neutral" size="md" onClick={handleReset} disabled={saving}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Changes
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving} className="min-w-[130px]">
            {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving…</> : <><Save className="h-3.5 w-3.5 mr-1.5" /> Save All Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
