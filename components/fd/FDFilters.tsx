"use client";

import { BankType } from "@/constants/banks";

const tenureOptions = [
  { label: "All", value: 0 },
  { label: "3M", value: 3 },
  { label: "6M", value: 6 },
  { label: "1 Yr", value: 12 },
  { label: "18M", value: 18 },
  { label: "2 Yrs", value: 24 },
  { label: "3 Yrs", value: 36 },
  { label: "5 Yrs", value: 60 },
];

const bankTypes: { label: string; value: BankType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Small Finance Bank", value: "Small Finance Bank" },
  { label: "NBFC", value: "NBFC" },
  { label: "Private Bank", value: "Private Bank" },
  { label: "Public Sector Bank", value: "Public Sector Bank" },
];

interface Props {
  selectedTenure: number;
  setSelectedTenure: (v: number) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  isSenior: boolean;
  setIsSenior: (v: boolean) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}

export default function FDFilters({
  selectedTenure, setSelectedTenure,
  selectedType, setSelectedType,
  isSenior, setIsSenior,
  sortBy, setSortBy,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Tenure</p>
          <div className="flex flex-wrap gap-2">
            {tenureOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedTenure(opt.value)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={
                  selectedTenure === opt.value
                    ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                    : { background: "white", color: "var(--text-primary)", borderColor: "var(--border)" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Bank Type</p>
          <div className="flex flex-wrap gap-2">
            {bankTypes.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={
                  selectedType === opt.value
                    ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                    : { background: "white", color: "var(--text-primary)", borderColor: "var(--border)" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Sort By</p>
            <select
              className="text-sm border rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              style={{ borderColor: "var(--border)" }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="rate-desc">Highest Rate</option>
              <option value="rate-asc">Lowest Rate</option>
              <option value="rating">Safety Rating</option>
              <option value="amount-asc">Min Amount ↑</option>
            </select>
          </div>

          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Category</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSenior(false)}
                className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                style={
                  !isSenior
                    ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
                    : { background: "white", color: "var(--text-primary)", borderColor: "var(--border)" }
                }
              >
                Regular
              </button>
              <button
                onClick={() => setIsSenior(true)}
                className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                style={
                  isSenior
                    ? { background: "var(--accent-dark)", color: "white", borderColor: "var(--accent-dark)" }
                    : { background: "white", color: "var(--text-primary)", borderColor: "var(--border)" }
                }
              >
                Senior Citizen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
