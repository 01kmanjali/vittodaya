"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const PROFILE_OPTIONS = [
  { value: "dsa",         label: "Direct Selling Agent (DSA)" },
  { value: "advisor",     label: "Financial Advisor / Loan Consultant" },
  { value: "realestate",  label: "Real Estate Professional" },
  { value: "channel",     label: "Channel Partner / Broker" },
  { value: "other",       label: "Other" },
];

export default function PartnerForm() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", city: "", profile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.profile) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-10 flex flex-col items-center text-center gap-4"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#C9A84C22", border: "2px solid #C9A84C" }}>
          <CheckCircle2 className="h-8 w-8" style={{ color: "#C9A84C" }} />
        </div>
        <h3 className="text-xl font-bold text-white">Request Submitted!</h3>
        <p className="text-blue-200 text-sm max-w-xs">
          Thank you, <span className="font-semibold text-white">{form.name}</span>. Our team will contact you at <span className="font-semibold text-white">{form.mobile}</span> within 24 business hours.
        </p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-blue-300/60 outline-none focus:ring-2 focus:ring-amber-400/60";
  const inputStyle = { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 space-y-4"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-blue-200 mb-1.5">Full Name *</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-200 mb-1.5">Mobile Number *</label>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={form.mobile}
            onChange={e => set("mobile", e.target.value)}
            className={inputClass}
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-blue-200 mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-200 mb-1.5">City</label>
          <input
            type="text"
            placeholder="Your city"
            value={form.city}
            onChange={e => set("city", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-blue-200 mb-1.5">Professional Profile *</label>
        <Select value={form.profile} onValueChange={v => set("profile", v)} required>
          <SelectTrigger
            className="w-full text-sm focus:ring-amber-400/60"
            style={{ background: "rgba(10,52,96,0.8)", border: "1px solid rgba(255,255,255,0.2)", color: form.profile ? "white" : "rgba(147,197,253,0.6)" }}
          >
            <SelectValue placeholder="Select your profile" />
          </SelectTrigger>
          <SelectContent>
            {PROFILE_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs font-medium text-blue-200 mb-1.5">Message (Optional)</label>
        <textarea
          rows={3}
          placeholder="Tell us about your experience or any questions..."
          value={form.message}
          onChange={e => set("message", e.target.value)}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full font-semibold text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #C9A84C 0%, #e2b96a 100%)" }}
      >
        {loading ? "Submitting..." : "Submit Partnership Request"}
        {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
      </Button>

      <p className="text-center text-xs text-blue-300">
        Our team will contact you within 24 business hours.
      </p>
    </form>
  );
}
