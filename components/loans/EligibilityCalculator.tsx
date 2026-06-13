"use client";

import { useState, useMemo } from "react";
import { rangeTrackStyle } from "@/lib/utils";

interface EligibilityCalculatorProps {
  title?: string;
  loanType?: "personal" | "business";
}

export default function EligibilityCalculator({
  title = "Personal Loan Eligibility Calculator",
  loanType = "personal",
}: EligibilityCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [tenure, setTenure] = useState(36);
  const [rate, setRate] = useState(12);
  const [employmentType, setEmploymentType] = useState<"salaried" | "self-employed">("salaried");

  const { eligibleAmount, disposableIncome, foirPercentage, eligibleEMI } = useMemo(() => {
    const foir = employmentType === "salaried" ? 0.5 : 0.45;
    const maxEMIAllowed = monthlyIncome * foir - existingEMI;
    const eligibleEMI = Math.max(0, maxEMIAllowed);
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    let eligibleAmount = 0;
    if (monthlyRate > 0 && eligibleEMI > 0) {
      eligibleAmount = (eligibleEMI * (Math.pow(1 + monthlyRate, n) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, n));
    }
    const usedFoir = ((existingEMI + eligibleEMI) / monthlyIncome) * 100;
    return {
      eligibleAmount: Math.max(0, eligibleAmount),
      disposableIncome: monthlyIncome - existingEMI,
      foirPercentage: Math.min(100, usedFoir),
      eligibleEMI,
    };
  }, [monthlyIncome, existingEMI, tenure, rate, employmentType]);

  const maxLoan = loanType === "personal" ? 2500000 : 10000000;
  const cappedAmount = Math.min(eligibleAmount, maxLoan);

  const eligibilityStatus =
    cappedAmount < 50000
      ? { label: "Low Eligibility", color: "#dc2626", bg: "#fef2f2" }
      : cappedAmount < 300000
      ? { label: "Moderate Eligibility", color: "#d97706", bg: "#fffbeb" }
      : { label: "Good Eligibility", color: "#059669", bg: "#ecfdf5" };

  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
      <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text-primary)" }}>{title}</h3>

      {/* Employment Type Toggle */}
      <div className="flex rounded-xl overflow-hidden border mb-5" style={{ borderColor: "var(--border)" }}>
        {(["salaried", "self-employed"] as const).map(type => (
          <button
            key={type}
            onClick={() => setEmploymentType(type)}
            className="flex-1 py-2.5 text-sm font-medium transition-colors capitalize"
            style={
              employmentType === type
                ? { background: "var(--primary)", color: "white" }
                : { color: "var(--text-secondary)", background: "white" }
            }
          >
            {type === "salaried" ? "Salaried" : "Self-employed"}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* Monthly Income */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {employmentType === "salaried" ? "Net Monthly Salary" : "Monthly Net Income"}
            </label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              ₹{monthlyIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={monthlyIncome}
            onChange={e => setMonthlyIncome(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(monthlyIncome, 10000, 500000, "var(--primary)")}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>₹10K</span><span>₹5L</span>
          </div>
        </div>

        {/* Existing EMI */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Existing Monthly EMIs</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              ₹{existingEMI.toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={existingEMI}
            onChange={e => setExistingEMI(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(existingEMI, 0, 100000, "var(--primary)")}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>₹0</span><span>₹1L</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Desired Loan Tenure</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              {tenure} Months
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={loanType === "business" ? 84 : 60}
            step={12}
            value={tenure}
            onChange={e => setTenure(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={rangeTrackStyle(tenure, 12, loanType === "business" ? 84 : 60, "var(--primary)")}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>12M</span><span>{loanType === "business" ? "84M" : "60M"}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Expected Interest Rate</label>
            <span className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: "var(--bg-light)", color: "var(--primary)" }}>
              {rate.toFixed(1)}% p.a.
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
            style={rangeTrackStyle(rate, 8, 28, "var(--primary)")}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            <span>8%</span><span>28%</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 rounded-xl p-4" style={{ background: eligibilityStatus.bg, border: `1px solid ${eligibilityStatus.color}22` }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>You may be eligible for</p>
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: eligibilityStatus.color + "22", color: eligibilityStatus.color }}>
            {eligibilityStatus.label}
          </span>
        </div>
        <p className="text-3xl font-bold mb-4" style={{ color: "var(--primary)" }}>
          ₹{Math.round(cappedAmount).toLocaleString("en-IN")}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Max EMI Allowed</p>
            <p className="font-bold" style={{ color: "var(--primary)" }}>₹{Math.round(eligibleEMI).toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>FOIR Used</p>
            <p className="font-bold" style={{ color: eligibilityStatus.color }}>{foirPercentage.toFixed(1)}%</p>
          </div>
        </div>

        <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
          Based on {employmentType === "salaried" ? "50%" : "45%"} FOIR (Fixed Obligation to Income Ratio) norm.
          Actual eligibility is subject to credit assessment.
        </p>
      </div>

      <button
        className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)" }}
      >
        Apply Now →
      </button>
    </div>
  );
}
