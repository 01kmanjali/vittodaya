"use client";

import { useState, useMemo } from "react";
import { rangeTrackStyle } from "@/lib/utils";

interface EMICalculatorProps {
  title: string;
  defaultAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  defaultRate?: number;
  defaultTenure?: number;
  maxTenure?: number;
  loanType?: "personal" | "business" | "ev" | "lap";
}

export default function EMICalculator({
  title,
  defaultAmount = 500000,
  minAmount = 50000,
  maxAmount = 2500000,
  defaultRate = 12,
  defaultTenure = 36,
  maxTenure = 60,
  loanType = "personal",
}: EMICalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [tenure, setTenure] = useState(defaultTenure);

  const { emi, totalPayable, totalInterest } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    if (monthlyRate === 0) {
      const emi = amount / n;
      return { emi, totalPayable: amount, totalInterest: 0 };
    }
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - amount;
    return { emi, totalPayable, totalInterest };
  }, [amount, rate, tenure]);

  const principalPct = Math.round((amount / (amount + totalInterest)) * 100);
  const interestPct = 100 - principalPct;

  const accentColor = loanType === "ev" ? "#059669" : loanType === "lap" ? "#7c3aed" : "var(--secondary)";

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
      <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text-primary)" }}>{title}</h3>

      <div className="space-y-5">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Loan Amount</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              ₹{amount.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={minAmount}
            max={maxAmount}
            step={10000}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(amount, minAmount, maxAmount, accentColor)}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>₹{(minAmount / 100000).toFixed(1)}L</span>
            <span>₹{(maxAmount / 100000).toFixed(0)}L</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Interest Rate (p.a.)</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              {rate.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={28}
            step={0.5}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(rate, 8, 28, accentColor)}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>8%</span><span>28%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Loan Tenure</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              {tenure} Months
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={maxTenure}
            step={6}
            value={tenure}
            onChange={e => setTenure(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(tenure, 6, maxTenure, accentColor)}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>6 Months</span><span>{maxTenure} Months</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 rounded-xl p-4" style={{ background: "var(--bg-light)" }}>
        <div className="text-center mb-4">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Monthly EMI</p>
          <p className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
            ₹{Math.round(emi).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Visual bar */}
        <div className="flex rounded-full overflow-hidden h-3 mb-3">
          <div style={{ width: `${principalPct}%`, background: "var(--primary)" }} />
          <div style={{ width: `${interestPct}%`, background: accentColor }} />
        </div>
        <div className="flex justify-between text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "var(--primary)" }} />
            Principal {principalPct}%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: accentColor }} />
            Interest {interestPct}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Principal</p>
            <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>₹{amount.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Total Interest</p>
            <p className="font-bold text-sm" style={{ color: accentColor }}>₹{Math.round(totalInterest).toLocaleString("en-IN")}</p>
          </div>
          <div className="col-span-2 bg-white rounded-lg p-3 text-center border" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Total Payable</p>
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>₹{Math.round(totalPayable).toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      <p className="text-xs mt-3 text-center" style={{ color: "var(--text-secondary)" }}>
        * This is an indicative calculation. Actual EMI may vary based on your credit profile.
      </p>
    </div>
  );
}
