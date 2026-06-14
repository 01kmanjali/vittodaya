"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Please enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Verification failed"); return; }
      toast.success("Email verified! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/email-verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to resend OTP"); return; }
      toast.success("New OTP sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#eff6ff" }}>
            <MailCheck className="w-7 h-7" style={{ color: "var(--primary)" }} />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We sent a 6-digit OTP to<br />
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-11 text-center text-xl font-bold border-2 rounded-lg outline-none transition-colors focus:border-blue-500"
                  style={{ height: "52px", borderColor: digit ? "var(--primary)" : undefined }}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full text-white"
              style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Verifying…" : "Verify Email"}
            </Button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: "var(--text-secondary)" }}>
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold hover:underline disabled:opacity-50"
              style={{ color: "var(--primary)" }}
            >
              {resending ? "Sending…" : "Resend OTP"}
            </button>
          </p>

          <p className="text-center text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
            <Link href="/login" className="hover:underline" style={{ color: "var(--text-secondary)" }}>
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-80 bg-white rounded-2xl border animate-pulse" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
