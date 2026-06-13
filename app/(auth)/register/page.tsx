import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Start investing in fixed deposits today</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" placeholder="Anjali" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" placeholder="Sharma" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min. 8 characters" />
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="senior" className="mt-0.5" />
              <Label htmlFor="senior" className="text-sm font-normal leading-relaxed cursor-pointer text-muted-foreground">
                I am a Senior Citizen (60+ years) — eligible for extra 0.50% interest
              </Label>
            </div>
            <div className="flex items-start gap-2.5">
              <Checkbox id="terms" className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer text-muted-foreground">
                I agree to the{" "}
                <Link href="#" className="underline" style={{ color: "var(--primary)" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="underline" style={{ color: "var(--primary)" }}>Privacy Policy</Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full text-white"
              style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
            >
              Create Account
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
