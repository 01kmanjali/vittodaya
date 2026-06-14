"use client";

import { useState } from "react";
import FDCard from "@/components/fd/FDCard";
import FDFilters from "@/components/fd/FDFilters";
import { useFDSchemes } from "@/lib/queries/useFDSchemes";
import { useFeatureFlags } from "@/lib/queries/useFeatureFlags";
import { AlertTriangle, Clock, Wrench, Ban } from "lucide-react";

const STATUS_INFO = {
  disabled:    { Icon: Ban,           color: "#dc2626", bg: "#fef2f2", title: "Feature Disabled",       message: "Fixed Deposits are not available at this time." },
  maintenance: { Icon: Wrench,        color: "#d97706", bg: "#fffbeb", title: "Under Maintenance",      message: "Fixed Deposits are temporarily under maintenance. Please check back soon." },
  upcoming:    { Icon: Clock,         color: "#7c3aed", bg: "#fdf4ff", title: "Coming Soon",            message: "Fixed Deposits will be available shortly. Stay tuned!" },
  active:      { Icon: AlertTriangle, color: "#dc2626", bg: "#fef2f2", title: "Currently Unavailable",  message: "Fixed Deposits are not available at this time." },
};

export default function FDPage() {
  const { data: features } = useFeatureFlags();
  const [selectedTenure, setSelectedTenure] = useState(0);
  const [selectedType, setSelectedType] = useState("all");
  const [isSenior, setIsSenior] = useState(false);
  const [sortBy, setSortBy] = useState("rate-desc");

  if (features && (!features.fixedDeposits.enabled || features.fixedDeposits.status === "disabled" || features.fixedDeposits.status === "upcoming" || features.fixedDeposits.status === "maintenance")) {
    const status = features.fixedDeposits.status;
    const info = STATUS_INFO[status] ?? STATUS_INFO.disabled;
    const { Icon } = info;
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="rounded-2xl border p-10 max-w-md w-full text-center" style={{ borderColor: "var(--border)", background: info.bg }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: info.color + "22" }}>
            <Icon className="w-8 h-8" style={{ color: info.color }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{info.title}</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{info.message}</p>
          {features.fixedDeposits.label && (
            <p className="mt-3 text-xs font-medium px-3 py-1.5 rounded-full inline-block" style={{ background: info.color + "22", color: info.color }}>
              {features.fixedDeposits.label}
            </p>
          )}
        </div>
      </div>
    );
  }

  const params: Record<string, string> = { active: "true" };
  if (selectedType !== "all") params.bankType = selectedType;

  const { data: rawSchemes = [], isLoading, error } = useFDSchemes(params);

  const schemes = rawSchemes
    .filter(s => {
      if (!selectedTenure) return true;
      return s.tenureRates.some(r => r.tenureMonths === selectedTenure);
    })
    .sort((a, b) => {
      const rateA = Math.max(...a.tenureRates.map(r => isSenior ? r.seniorRate : r.regularRate));
      const rateB = Math.max(...b.tenureRates.map(r => isSenior ? r.seniorRate : r.regularRate));
      if (sortBy === "rate-desc") return rateB - rateA;
      if (sortBy === "rate-asc") return rateA - rateB;
      if (sortBy === "amount-asc") return (a.minAmount ?? 0) - (b.minAmount ?? 0);
      return 0;
    });

  const bestRate = rawSchemes.length
    ? Math.max(...rawSchemes.flatMap(s => s.tenureRates.map(r => r.regularRate)))
    : 0;

  return (
    <>
      <section className="gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/15 mb-4">
              Fixed Deposits
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Best FD Rates Up to{" "}
              <span style={{ color: "var(--secondary-light)" }}>
                {bestRate > 0 ? `${bestRate.toFixed(2)}%` : "—"} p.a.
              </span>
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Compare fixed deposit rates from top banks and NBFCs. Safe, regulated, and high-return investments.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FDFilters
          selectedTenure={selectedTenure}
          setSelectedTenure={setSelectedTenure}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          isSenior={isSenior}
          setIsSenior={setIsSenior}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "var(--bg-light)" }} />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-500">{(error as Error).message}</p>
        )}

        {!isLoading && !error && (
          <>
            <div className="flex items-center justify-between my-6">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <strong>{schemes.length}</strong> schemes available
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map(scheme => (
                <FDCard key={String(scheme._id ?? scheme.id)} scheme={scheme} selectedMonths={selectedTenure || undefined} isSenior={isSenior} />
              ))}
            </div>
            {!schemes.length && (
              <div className="text-center py-20">
                <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
                  No FD schemes match your filters.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
