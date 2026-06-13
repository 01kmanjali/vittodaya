"use client";

import { useState, useMemo } from "react";
import { rangeTrackStyle } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function calculateMaturity(principal: number, rate: number, months: number, freq: string): number {
  const n = freq === "Monthly" ? 12 : freq === "Quarterly" ? 4 : freq === "Half-Yearly" ? 2 : 1;
  const t = months / 12;
  const r = rate / 100;
  return Math.round(principal * Math.pow(1 + r / n, n * t));
}

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [months, setMonths] = useState(12);
  const [freq, setFreq] = useState("Quarterly");
  const [isSenior, setIsSenior] = useState(false);
  const seniorBonus = 0.5;

  const effectiveRate = isSenior ? rate + seniorBonus : rate;
  const maturity = useMemo(() => calculateMaturity(principal, effectiveRate, months, freq), [principal, effectiveRate, months, freq]);
  const interest = maturity - principal;

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: "var(--border)" }}>
      <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>FD Calculator</h3>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Principal Amount</label>
            <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>₹{fmt(principal)}</span>
          </div>
          <input
            type="range" min={5000} max={5000000} step={5000}
            value={principal} onChange={e => setPrincipal(+e.target.value)}
            className="w-full h-2 rounded-full cursor-pointer"
            style={rangeTrackStyle(principal, 5000, 5000000, "var(--secondary)")}
          />
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>₹5K</span><span>₹50L</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Interest Rate (p.a.)</label>
            <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{effectiveRate.toFixed(2)}%</span>
          </div>
          <input
            type="range" min={3} max={12} step={0.05}
            value={rate} onChange={e => setRate(+e.target.value)}
            className="w-full h-2 rounded-full cursor-pointer"
            style={rangeTrackStyle(rate, 3, 12, "var(--secondary)")}
          />
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>3%</span><span>12%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Tenure</label>
            <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
              {months >= 12 ? `${Math.floor(months / 12)} yr${months >= 24 ? "s" : ""} ${months % 12 ? `${months % 12} mo` : ""}` : `${months} months`}
            </span>
          </div>
          <input
            type="range" min={3} max={60} step={1}
            value={months} onChange={e => setMonths(+e.target.value)}
            className="w-full h-2 rounded-full cursor-pointer"
            style={rangeTrackStyle(months, 3, 60, "var(--secondary)")}
          />
          <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>3M</span><span>5 Yrs</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Compounding</label>
          <Select value={freq} onValueChange={setFreq}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {["Monthly", "Quarterly", "Half-Yearly", "Annually"].map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Senior Citizen (+0.50%)</label>
          <Switch checked={isSenior} onCheckedChange={setIsSenior} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {isSenior ? "Enabled" : "Off"}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl p-4" style={{ background: "var(--bg-light)" }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Invested Amount</p>
            <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>₹{fmt(principal)}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Interest Earned</p>
            <p className="text-base font-bold" style={{ color: "var(--success)" }}>+₹{fmt(interest)}</p>
          </div>
        </div>
        <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Maturity Amount</p>
          <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>₹{fmt(maturity)}</p>
        </div>
      </div>
    </div>
  );
}
