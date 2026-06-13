"use client";

import { useState, useMemo } from "react";
import FDCard from "@/components/fd/FDCard";
import { Search, Landmark, TrendingUp, ShieldCheck, Users } from "lucide-react";
import FDFilters from "@/components/fd/FDFilters";
import FDCalculator from "@/components/fd/FDCalculator";
import { fdSchemes, getMaxRate } from "@/constants/fdSchemes";

const RATING_ORDER: Record<string, number> = { AAA: 0, "AA+": 1, "AA-": 2, "A+": 3, A: 4 };

export default function FDListPage() {
  const [tenure, setTenure] = useState(0);
  const [bankType, setBankType] = useState("all");
  const [isSenior, setIsSenior] = useState(false);
  const [sortBy, setSortBy] = useState("rate-desc");

  const filtered = useMemo(() => {
    let list = fdSchemes.filter(s => s.isActive);
    if (bankType !== "all") list = list.filter(s => s.bankType === bankType);
    if (tenure > 0) list = list.filter(s => s.tenureRates.some(r => r.tenureMonths === tenure));
    list = [...list].sort((a, b) => {
      if (sortBy === "rate-desc") return getMaxRate(b, isSenior) - getMaxRate(a, isSenior);
      if (sortBy === "rate-asc") return getMaxRate(a, isSenior) - getMaxRate(b, isSenior);
      if (sortBy === "rating") return (RATING_ORDER[a.rating] ?? 9) - (RATING_ORDER[b.rating] ?? 9);
      if (sortBy === "amount-asc") return a.minAmount - b.minAmount;
      return 0;
    });
    return list;
  }, [tenure, bankType, isSenior, sortBy]);

  const institutionCount = new Set(fdSchemes.map(s => s.bankId)).size;

  return (
    <div style={{ background: "var(--bg-light)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="gradient-hero text-white py-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
            <Landmark className="w-4 h-4" /> Compare & Invest
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-3">
            Fixed Deposit Rates<br />
            <span style={{ color: "var(--secondary-light)" }}>All in One Place</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Compare {fdSchemes.length} FD schemes from {institutionCount} trusted institutions — find the best rate for your tenure.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { value: `${fdSchemes.length}+`, label: "FD Schemes",     icon: <Landmark className="w-4 h-4" />,    color: "#eff6ff" },
              { value: `${institutionCount}+`, label: "Institutions",   icon: <Users className="w-4 h-4" />,       color: "#ede9fe" },
              { value: "9.10% p.a.",          label: "Best Rate",       icon: <TrendingUp className="w-4 h-4" />,  color: "#d1fae5" },
              { value: "DICGC",               label: "Insured",         icon: <ShieldCheck className="w-4 h-4" />, color: "#fef3c7" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.color + "33" }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">{s.value}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Filters ── */}
        <div className="mb-6">
          <FDFilters
            selectedTenure={tenure}
            setSelectedTenure={setTenure}
            selectedType={bankType}
            setSelectedType={setBankType}
            isSenior={isSenior}
            setIsSenior={setIsSenior}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <div className="flex gap-8 items-start">
          {/* ── FD Cards Grid ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#eff6ff", color: "var(--primary)" }}>
                  {filtered.length} Schemes{isSenior ? " · Senior Citizen" : ""}
                </span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center" style={{ border: "1.5px solid var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#f1f5f9" }}>
                  <Search className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
                </div>
                <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>No schemes found</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Try changing the tenure or bank type filters.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(scheme => (
                  <FDCard
                    key={scheme.id}
                    scheme={scheme}
                    selectedMonths={tenure || undefined}
                    isSenior={isSenior}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Calculator Sidebar ── */}
          <div className="hidden xl:block w-80 shrink-0 sticky top-20">
            <FDCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
