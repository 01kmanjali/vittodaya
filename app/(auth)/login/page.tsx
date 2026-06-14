"use client";

import Link from "next/link";
import { useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [tfaDigits, setTfaDigits] = useState(["", "", "", "", "", ""]);
  const tfaRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTfaChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...tfaDigits];
    next[i] = val;
    setTfaDigits(next);
    if (val && i < 5) tfaRefs.current[i + 1]?.focus();
  };

  const handleTfaKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !tfaDigits[i] && i > 0) tfaRefs.current[i - 1]?.focus();
  };

  const handleTfaPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setTfaDigits(pasted.split(""));
      tfaRefs.current[5]?.focus();
    }
  };

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    setError("");
    const token = show2FA ? tfaDigits.join("") : undefined;
    const result = await login(email, password, token);
    if (result.twoFactorRequired) {
      setShow2FA(true);
      setTimeout(() => tfaRefs.current[0]?.focus(), 50);
      return;
    }
    if (result.error) {
      setError(result.error);
      if (show2FA) setTfaDigits(["", "", "", "", "", ""]);
      return;
    }
    if (redirectTo) router.push(redirectTo);
    else if (result.role === "admin") router.push("/admin");
    else router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--primary)" }}>
            {show2FA ? <ShieldCheck className="w-6 h-6" /> : "V"}
          </div>
          <CardTitle className="text-2xl">{show2FA ? "Two-Factor Auth" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {show2FA
              ? "Enter the 6-digit code from your authenticator app"
              : "Sign in to your Vittodaya account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!show2FA ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl text-sm text-center bg-blue-50 text-blue-700">
                  Signing in as <strong>{email}</strong>
                </div>
                <div className="flex justify-center gap-2" onPaste={handleTfaPaste}>
                  {tfaDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { tfaRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleTfaChange(i, e.target.value)}
                      onKeyDown={e => handleTfaKeyDown(i, e)}
                      className="w-11 text-center text-xl font-bold border-2 rounded-lg outline-none transition-colors focus:border-blue-500"
                      style={{ height: "52px", borderColor: d ? "var(--primary)" : undefined }}
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Open Google Authenticator / Authy and enter the current code
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || (show2FA && tfaDigits.join("").length < 6)}
              className="w-full text-white"
              style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Verifying..." : show2FA ? "Verify & Sign In" : "Sign In"}
            </Button>

            {show2FA && (
              <button
                type="button"
                onClick={() => { setShow2FA(false); setTfaDigits(["", "", "", "", "", ""]); setError(""); }}
                className="w-full text-sm text-center hover:underline"
                style={{ color: "var(--text-secondary)" }}
              >
                ← Back to login
              </button>
            )}
          </form>

          {!show2FA && (
            <>
              <Separator className="my-5" />
              <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
                  Create Account
                </Link>
              </p>
              <div className="mt-5 rounded-xl p-4 text-xs space-y-1.5 bg-blue-50">
                <p className="font-semibold mb-2 text-blue-800">Demo Credentials</p>
                <div className="flex justify-between">
                  <span className="text-gray-700">Admin:</span>
                  <span className="font-mono text-blue-700">admin@vfspl.in / Admin@123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">User:</span>
                  <span className="font-mono text-blue-700">01kmanjali@gmail.com / User@1234</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl border animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
