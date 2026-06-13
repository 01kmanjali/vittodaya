"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";

const DUMMY_USERS = [
  { email: "admin@vfspl.in", password: "admin123", role: "admin", name: "Admin User" },
  { email: "user@vfspl.in", password: "user123", role: "user", name: "Demo User" },
  { email: "anjali@example.com", password: "user123", role: "user", name: "Anjali Sharma" },
];

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 600));

    const match = DUMMY_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    setCookie("vf_auth", "1");
    setCookie("vf_role", match.role);
    setCookie("vf_user_email", match.email);
    setCookie("vf_user_name", match.name);

    if (redirectTo) {
      router.push(redirectTo);
    } else if (match.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--primary)" }}>
            V
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Vittodaya account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white"
              style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Separator className="my-5" />

          <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
              Create Account
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl p-4 text-xs space-y-1.5 bg-blue-50">
            <p className="font-semibold mb-2 text-blue-800">Demo Credentials</p>
            <div className="flex justify-between">
              <span className="text-gray-700">Admin:</span>
              <span className="font-mono text-blue-700">admin@vfspl.in / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">User:</span>
              <span className="font-mono text-blue-700">user@vfspl.in / user123</span>
            </div>
          </div>
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
