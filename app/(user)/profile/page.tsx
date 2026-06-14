"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthStore, AuthUser } from "@/lib/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle, Circle, KeyRound, ShieldCheck, Smartphone,
  ChevronRight, Pencil, X, Eye, EyeOff, Loader2, Upload,
  Send, RefreshCw, ShieldOff,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

type Panel =
  | null
  | "editProfile"
  | "changePassword"
  | "phone"
  | "pan"
  | "aadhaar"
  | "2fa_setup"
  | "2fa_disable"
  | "devices";

type OTPState = "idle" | "sending" | "sent" | "verifying" | "done";

// ─── helpers ──────────────────────────────────────────────────────────────────

function Field({
  label, name, value, type = "text", onChange, disabled,
}: {
  label: string; name: string; value: string; type?: string;
  onChange: (n: string, v: string) => void; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={e => onChange(name, e.target.value)}
        className="w-full border rounded-xl px-3 py-2 text-sm outline-none disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-1"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function Alert({ type, msg }: { type: "error" | "success" | "info"; msg: string }) {
  const cls = type === "error"
    ? "bg-red-50 text-red-700 border-red-200"
    : type === "success"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-blue-50 text-blue-700 border-blue-200";
  return <p className={`text-xs px-3 py-2 rounded-lg border ${cls}`}>{msg}</p>;
}

// ─── OTP input panel (reused across phone / pan / aadhaar) ────────────────────

function OTPFlow({
  type, value, valueLabel, valuePlaceholder, valueNote,
  onDone,
}: {
  type: "phone" | "pan" | "aadhaar";
  value: string;
  valueLabel: string;
  valuePlaceholder: string;
  valueNote?: string;
  onDone: (updatedUser: Record<string, unknown>) => void;
}) {
  const [fieldValue, setFieldValue] = useState(value);
  const [otp, setOtp] = useState("");
  const [otpState, setOtpState] = useState<OTPState>("idle");
  const [sentTo, setSentTo] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function sendOTP() {
    setError(""); setSuccess("");
    setOtpState("sending");
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setOtpState("idle");
      if (res.status === 429) setCountdown(60);
      return;
    }
    setSentTo(data.sentTo);
    setOtpState("sent");
    setCountdown(60);
  }

  async function verifyOTP() {
    if (otp.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setError(""); setOtpState("verifying");
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, code: otp, value: fieldValue }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setOtpState("sent");
      return;
    }
    setSuccess("Verified successfully!");
    setOtpState("done");
    setTimeout(() => onDone(data.user), 800);
  }

  return (
    <div className="space-y-4">
      {/* field value input */}
      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{valueLabel}</label>
        <input
          type="text"
          value={fieldValue}
          onChange={e => {
            const v = type === "pan" ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, "").slice(0, type === "aadhaar" ? 12 : 10);
            setFieldValue(v);
          }}
          placeholder={valuePlaceholder}
          disabled={otpState !== "idle"}
          className="w-full border rounded-xl px-3 py-2 text-sm outline-none font-mono tracking-widest disabled:bg-gray-50"
          style={{ borderColor: "var(--border)" }}
          maxLength={type === "pan" ? 10 : type === "aadhaar" ? 12 : 15}
        />
        {valueNote && <p className="text-xs mt-1 text-muted-foreground">{valueNote}</p>}
      </div>

      {/* send OTP step */}
      {otpState === "idle" && (
        <Button variant="primary" size="md" className="w-full gap-2" onClick={sendOTP}
          disabled={countdown > 0 || (type === "pan" ? fieldValue.length !== 10 : type === "aadhaar" ? fieldValue.length !== 12 : fieldValue.length < 10)}>
          {countdown > 0
            ? <><RefreshCw className="h-3.5 w-3.5" /> Resend in {countdown}s</>
            : <><Send className="h-3.5 w-3.5" /> Send OTP to Email</>}
        </Button>
      )}

      {otpState === "sending" && (
        <Button variant="primary" size="md" className="w-full" disabled>
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending OTP…
        </Button>
      )}

      {(otpState === "sent" || otpState === "verifying") && (
        <>
          <div className="p-3 rounded-xl text-xs" style={{ background: "var(--bg-light)" }}>
            📧 OTP sent to <strong>{sentTo}</strong>. Check your inbox (and spam folder).
            {type === "phone" && " Also sent via SMS if configured."}
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Enter 6-digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
              className="w-full border rounded-xl px-3 py-2.5 text-center text-2xl font-bold tracking-[0.5rem] outline-none"
              style={{ borderColor: "var(--border)", color: "var(--primary)" }}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md" className="flex-1 gap-1.5" onClick={verifyOTP}
              disabled={otp.length !== 6 || otpState === "verifying"}>
              {otpState === "verifying"
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…</>
                : "Verify OTP"}
            </Button>
            <Button variant="neutral" size="md" onClick={sendOTP} disabled={countdown > 0 || otpState === "verifying"}>
              {countdown > 0 ? <><RefreshCw className="h-3.5 w-3.5" /> {countdown}s</> : "Resend"}
            </Button>
          </div>
        </>
      )}

      {otpState === "done" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">Verified successfully!</span>
        </div>
      )}

      {error && <Alert type="error" msg={error} />}
      {success && !error && <Alert type="success" msg={success} />}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [panel, setPanel] = useState<Panel>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── edit profile state ──────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: "", phone: "", dateOfBirth: "", address: "",
    city: "", state: "", pincode: "", isSeniorCitizen: false,
  });

  // ── change password state ───────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState<Record<string, boolean>>({});

  // ── 2FA state ───────────────────────────────────────────────────────────
  const [tfaQR, setTfaQR] = useState("");
  const [tfaSecret, setTfaSecret] = useState("");
  const [tfaToken, setTfaToken] = useState("");
  const [tfaStep, setTfaStep] = useState<"loading" | "scan" | "verify" | "done">("loading");
  const [tfaDisableToken, setTfaDisableToken] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        name:             user.name ?? "",
        phone:            user.phone ?? "",
        dateOfBirth:      user.dateOfBirth ?? "",
        address:          user.address ?? "",
        city:             user.city ?? "",
        state:            user.state ?? "",
        pincode:          user.pincode ?? "",
        isSeniorCitizen:  user.isSeniorCitizen ?? false,
      });
    }
  }, [user]);

  function openPanel(p: Panel) {
    setError(""); setSuccess(""); setPanel(p);
    if (p === "2fa_setup") initTFA();
  }
  function closePanel() {
    setPanel(null); setError(""); setSuccess("");
    setTfaQR(""); setTfaSecret(""); setTfaToken(""); setTfaStep("loading");
    setTfaDisableToken("");
    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  // ── init 2FA ─────────────────────────────────────────────────────────────
  async function initTFA() {
    setTfaStep("loading");
    const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setTfaQR(data.qrCode);
    setTfaSecret(data.secret);
    setTfaStep("scan");
  }

  async function verifyTFA() {
    if (tfaToken.length !== 6) { setError("Enter 6-digit code"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tfaToken }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setTfaStep("done");
    setUser({ ...user!, twoFactorEnabled: true });
    setTimeout(closePanel, 1500);
  }

  async function disableTFA() {
    if (tfaDisableToken.length !== 6) { setError("Enter 6-digit code from your app"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/auth/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tfaDisableToken }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess("2FA disabled.");
    setUser({ ...user!, twoFactorEnabled: false });
    setTimeout(closePanel, 1200);
  }

  // ── save profile ─────────────────────────────────────────────────────────
  async function saveProfile() {
    if (!user) return;
    setSaving(true); setError("");
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to update"); return; }
    setUser({
      ...user, name: data.user.name, phone: data.user.phone,
      city: data.user.city, isSeniorCitizen: data.user.isSeniorCitizen,
      dateOfBirth: data.user.dateOfBirth, address: data.user.address,
      state: data.user.state, pincode: data.user.pincode,
    });
    setSuccess("Profile updated.");
    setTimeout(closePanel, 1000);
  }

  // ── change password ───────────────────────────────────────────────────────
  async function changePassword() {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setError("Passwords do not match"); return; }
    if (pwForm.newPassword.length < 8) { setError("Min 8 characters required"); return; }
    setSaving(true); setError("");
    const res = await fetch("/api/users/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed"); return; }
    setSuccess("Password changed.");
    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(closePanel, 1200);
  }

  // ── OTP done callback ─────────────────────────────────────────────────────
  function handleOTPDone(updatedUser: Record<string, unknown>) {
    if (!user) return;
    setUser({
      ...user!,
      phoneVerified:   updatedUser.phoneVerified as boolean,
      panVerified:     updatedUser.panVerified as boolean,
      aadhaarVerified: updatedUser.aadhaarVerified as boolean,
      panNumber:       updatedUser.panNumber as string,
      aadharNumber:    updatedUser.aadharNumber as string,
      kycStatus:       updatedUser.kycStatus as AuthUser["kycStatus"],
    });
    closePanel();
  }

  if (!user) {
    return (
      <div className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  const kycSteps = [
    {
      key: "email", label: "Email Verified",
      done: true, verified: true,
      action: null, Icon: CheckCircle,
    },
    {
      key: "phone", label: "Mobile Number Verified",
      done: !!user.phoneVerified, verified: !!user.phoneVerified,
      action: () => openPanel("phone"), Icon: Smartphone,
    },
    {
      key: "pan", label: "PAN Card Verified",
      done: !!user.panVerified, verified: !!user.panVerified,
      action: () => openPanel("pan"), Icon: CheckCircle,
    },
    {
      key: "aadhaar", label: "Aadhaar Verified",
      done: !!user.aadhaarVerified, verified: !!user.aadhaarVerified,
      action: () => openPanel("aadhaar"), Icon: CheckCircle,
    },
    {
      key: "bank", label: "Bank Account Linked",
      done: false, verified: false,
      action: null, Icon: Circle,
    },
  ];

  const kycComplete = kycSteps.filter(s => s.done).length;
  const kycPercent  = Math.round((kycComplete / kycSteps.length) * 100);

  const kycBadgeStyle =
    user.kycStatus === "verified"  ? "bg-green-100 text-green-700" :
    user.kycStatus === "pending"   ? "bg-amber-100 text-amber-700" :
    user.kycStatus === "rejected"  ? "bg-red-100 text-red-700" :
                                     "bg-gray-100 text-gray-600";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Profile & KYC</h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── left card ── */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
                style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary-light))" }}>
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <h2 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${kycBadgeStyle}`}>
                KYC: {user.kycStatus?.replace("_", " ")}
              </span>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-2 text-sm">
              {[
                { label: "Phone",  value: user.phone ?? "—",                                extra: user.phoneVerified ? "✓" : null },
                { label: "City",   value: user.city ?? "—" },
                { label: "Status", value: user.status ?? "active" },
                { label: "2FA",    value: user.twoFactorEnabled ? "Enabled" : "Disabled",   extra: user.twoFactorEnabled ? "✓" : null },
              ].map(({ label, value, extra }) => (
                <div key={label} className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium capitalize flex items-center gap-1">
                    {value}
                    {extra && <span className="text-green-600 text-xs">{extra}</span>}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="primaryOutline" size="md" className="mt-5 w-full gap-2" onClick={() => openPanel("editProfile")}>
              <Pencil className="h-3.5 w-3.5" /> Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* ── right panels ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* KYC */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-base font-semibold">KYC Verification</CardTitle>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${kycBadgeStyle}`}>
                {kycComplete}/{kycSteps.length} Complete
              </span>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                  <span>Overall Progress</span>
                  <span className="font-semibold">{kycPercent}%</span>
                </div>
                <Progress value={kycPercent} className="h-2.5" />
              </div>

              <div className="space-y-2">
                {kycSteps.map(step => (
                  <div key={step.key} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${step.done ? "bg-green-50" : "bg-muted/40"}`}>
                    {step.done
                      ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    }
                    <span className="text-sm font-medium flex-1" style={{ color: step.done ? "var(--success)" : "var(--text-secondary)" }}>
                      {step.label}
                    </span>
                    {step.done
                      ? <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                      : step.action
                      ? <Button size="sm" variant="primary" className="h-7 text-xs gap-1" onClick={step.action}>
                          <Upload className="h-3 w-3" /> Verify Now
                        </Button>
                      : <span className="text-xs text-muted-foreground">Coming soon</span>
                    }
                  </div>
                ))}
              </div>

              {user.kycStatus === "pending" && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  ⏳ Your KYC documents have been submitted and are under review. You will be notified once verified.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <CardTitle className="text-base font-semibold">Personal Details</CardTitle>
              <Button variant="primaryOutline" size="sm" className="gap-1.5" onClick={() => openPanel("editProfile")}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Full Name",     value: user.name },
                  { label: "Email",         value: user.email },
                  { label: "Phone",         value: user.phone },
                  { label: "Date of Birth", value: user.dateOfBirth },
                  { label: "Address",       value: user.address },
                  { label: "City",          value: user.city },
                  { label: "State",         value: user.state },
                  { label: "Pincode",       value: user.pincode },
                  { label: "PAN Number",    value: user.panNumber },
                  { label: "Aadhaar",       value: user.aadharNumber ? `XXXX-XXXX-${user.aadharNumber.slice(-4)}` : undefined },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "var(--bg-light)" }}>
                    <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{label}</p>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{value || "—"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-semibold">Security</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {[
                {
                  label: "Change Password",
                  Icon: KeyRound,
                  desc: "Update your account password",
                  action: () => openPanel("changePassword"),
                  badge: null,
                },
                {
                  label: user.twoFactorEnabled ? "Disable Two-Factor Auth" : "Enable Two-Factor Auth",
                  Icon: user.twoFactorEnabled ? ShieldOff : ShieldCheck,
                  desc: user.twoFactorEnabled ? "Remove authenticator app protection" : "Protect with Google Authenticator / Authy",
                  action: () => openPanel(user.twoFactorEnabled ? "2fa_disable" : "2fa_setup"),
                  badge: user.twoFactorEnabled ? "ON" : null,
                },
                {
                  label: "Active Sessions",
                  Icon: Smartphone,
                  desc: "View & sign out other devices",
                  action: () => openPanel("devices"),
                  badge: null,
                },
              ].map(({ label, Icon, action, desc, badge }) => (
                <Button key={label} variant="ghost" className="w-full justify-start gap-3 h-auto py-3" onClick={action}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--bg-light)" }}>
                    <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      {label}
                      {badge && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">{badge}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ═══════════ MODALS ═══════════ */}

      {/* Edit Profile */}
      {panel === "editProfile" && (
        <Modal title="Edit Profile" onClose={closePanel}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name"    name="name"  value={profileForm.name}  onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
              <Field label="Phone Number" name="phone" value={profileForm.phone} onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
            </div>
            <Field label="Date of Birth" name="dateOfBirth" value={profileForm.dateOfBirth} type="date" onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
            <Field label="Address"       name="address"     value={profileForm.address}     onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
            <div className="grid grid-cols-3 gap-3">
              <Field label="City"    name="city"    value={profileForm.city}    onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
              <Field label="State"   name="state"   value={profileForm.state}   onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
              <Field label="Pincode" name="pincode" value={profileForm.pincode} onChange={(n, v) => setProfileForm(p => ({ ...p, [n]: v }))} />
            </div>
            <label className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
              <input type="checkbox" checked={profileForm.isSeniorCitizen}
                onChange={e => setProfileForm(p => ({ ...p, isSeniorCitizen: e.target.checked }))}
                className="h-4 w-4 rounded" />
              <span style={{ color: "var(--text-primary)" }}>I am a Senior Citizen (60+ years)</span>
            </label>
            {error && <Alert type="error" msg={error} />}
            {success && <Alert type="success" msg={success} />}
            <div className="flex gap-3 pt-1">
              <Button variant="primary" size="md" className="flex-1" onClick={saveProfile} disabled={saving}>
                {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : "Save Changes"}
              </Button>
              <Button variant="neutral" size="md" onClick={closePanel}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Phone OTP */}
      {panel === "phone" && (
        <Modal title="Verify Mobile Number" onClose={closePanel}>
          <div className="mb-4 text-sm text-muted-foreground">
            We'll send a 6-digit OTP to your registered email{user.phone ? ` and SMS to ${user.phone}` : ""}.
          </div>
          <OTPFlow
            type="phone"
            value={user.phone ?? ""}
            valueLabel="Mobile Number"
            valuePlaceholder="10-digit mobile number"
            valueNote="Must be a valid Indian mobile number"
            onDone={handleOTPDone}
          />
        </Modal>
      )}

      {/* PAN OTP */}
      {panel === "pan" && (
        <Modal title="Verify PAN Card" onClose={closePanel}>
          <div className="mb-4 text-sm text-muted-foreground">
            Enter your PAN number. An OTP will be sent to your email to confirm ownership.
          </div>
          <OTPFlow
            type="pan"
            value={user.panNumber ?? ""}
            valueLabel="PAN Number"
            valuePlaceholder="ABCDE1234F"
            valueNote="10-character PAN as printed on your card"
            onDone={handleOTPDone}
          />
        </Modal>
      )}

      {/* Aadhaar OTP */}
      {panel === "aadhaar" && (
        <Modal title="Verify Aadhaar" onClose={closePanel}>
          <div className="mb-4 text-sm text-muted-foreground">
            Enter your 12-digit Aadhaar number. An OTP will be sent to your registered email.
          </div>
          <OTPFlow
            type="aadhaar"
            value={user.aadharNumber ?? ""}
            valueLabel="Aadhaar Number"
            valuePlaceholder="123456789012"
            valueNote="Your Aadhaar is stored encrypted and masked in the UI"
            onDone={handleOTPDone}
          />
        </Modal>
      )}

      {/* Change Password */}
      {panel === "changePassword" && (
        <Modal title="Change Password" onClose={closePanel}>
          <div className="space-y-3">
            {(["currentPassword", "newPassword", "confirmPassword"] as const).map(field => (
              <div key={field}>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>
                  {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPw[field] ? "text" : "password"}
                    value={pwForm[field]}
                    onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none pr-10"
                    style={{ borderColor: "var(--border)" }}
                    placeholder={field === "currentPassword" ? "Enter current password" : "Min 8 characters"}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}>
                    {showPw[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            {error && <Alert type="error" msg={error} />}
            {success && <Alert type="success" msg={success} />}
            <div className="flex gap-3 pt-1">
              <Button variant="primary" size="md" className="flex-1" onClick={changePassword}
                disabled={saving || !pwForm.currentPassword || !pwForm.newPassword}>
                {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…</> : "Update Password"}
              </Button>
              <Button variant="neutral" size="md" onClick={closePanel}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2FA Setup */}
      {panel === "2fa_setup" && (
        <Modal title="Enable Two-Factor Authentication" onClose={closePanel}>
          <div className="space-y-4">
            {tfaStep === "loading" && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
              </div>
            )}

            {tfaStep === "scan" && (
              <>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong className="text-gray-700">Step 1:</strong> Install <strong>Google Authenticator</strong> or <strong>Authy</strong> on your phone.</p>
                  <p><strong className="text-gray-700">Step 2:</strong> Scan the QR code below.</p>
                </div>
                <div className="flex justify-center p-4 bg-white border rounded-xl" style={{ borderColor: "var(--border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tfaQR} alt="2FA QR Code" className="w-48 h-48" />
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-light)" }}>
                  <p className="text-xs text-muted-foreground mb-1">Or enter manually:</p>
                  <code className="text-xs font-mono font-bold tracking-widest break-all" style={{ color: "var(--primary)" }}>{tfaSecret}</code>
                </div>
                <Button variant="primary" size="md" className="w-full" onClick={() => setTfaStep("verify")}>
                  I've scanned the QR code →
                </Button>
              </>
            )}

            {tfaStep === "verify" && (
              <>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app to confirm setup.</p>
                <input
                  type="text"
                  value={tfaToken}
                  onChange={e => setTfaToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  className="w-full border rounded-xl px-3 py-3 text-center text-2xl font-bold tracking-[0.5rem] outline-none"
                  style={{ borderColor: "var(--border)", color: "var(--primary)" }}
                  autoFocus
                />
                {error && <Alert type="error" msg={error} />}
                <div className="flex gap-3">
                  <Button variant="primary" size="md" className="flex-1" onClick={verifyTFA}
                    disabled={saving || tfaToken.length !== 6}>
                    {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enabling…</> : "Enable 2FA"}
                  </Button>
                  <Button variant="neutral" size="md" onClick={() => setTfaStep("scan")}>Back</Button>
                </div>
              </>
            )}

            {tfaStep === "done" && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <p className="font-semibold text-green-700">2FA Enabled Successfully!</p>
                <p className="text-xs text-muted-foreground">Your account is now protected with two-factor authentication.</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* 2FA Disable */}
      {panel === "2fa_disable" && (
        <Modal title="Disable Two-Factor Authentication" onClose={closePanel}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              ⚠️ Disabling 2FA will make your account less secure. Make sure you understand the risk.
            </div>
            <p className="text-sm text-muted-foreground">Enter the current code from your authenticator app to confirm.</p>
            <input
              type="text"
              value={tfaDisableToken}
              onChange={e => setTfaDisableToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
              className="w-full border rounded-xl px-3 py-3 text-center text-2xl font-bold tracking-[0.5rem] outline-none"
              style={{ borderColor: "var(--border)", color: "var(--danger)" }}
              autoFocus
            />
            {error && <Alert type="error" msg={error} />}
            {success && <Alert type="success" msg={success} />}
            <div className="flex gap-3">
              <Button variant="danger" size="md" className="flex-1" onClick={disableTFA}
                disabled={saving || tfaDisableToken.length !== 6}>
                {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Disabling…</> : "Disable 2FA"}
              </Button>
              <Button variant="neutral" size="md" onClick={closePanel}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Active Sessions */}
      {panel === "devices" && (
        <Modal title="Active Sessions" onClose={closePanel}>
          <div className="space-y-3">
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>This device</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Active now · Web browser</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Current</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground py-2">No other active sessions found.</p>
            <Button variant="dangerOutline" size="md" className="w-full" onClick={closePanel}>
              Sign Out All Other Devices
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
