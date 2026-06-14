"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (!terms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    const result = await register(name, email, phone, password);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Account created! Please verify your email.");
    router.push(`/verify-email?email=${encodeURIComponent(result.email ?? email)}`);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Start investing in fixed deposits today</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Anjali" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Sharma" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="terms" className="mt-0.5" checked={terms} onCheckedChange={v => setTerms(!!v)} />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer text-muted-foreground">
                I agree to the{" "}
                <Link href="#" className="underline" style={{ color: "var(--primary)" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="underline" style={{ color: "var(--primary)" }}>Privacy Policy</Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white"
              style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <Separator className="my-5" />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
