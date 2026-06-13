"use client";
import { create } from "zustand";

export interface LoanProduct {
  _id: string;
  slug: string;
  type: "personal" | "msme" | "ev" | "lap";
  name: string;
  tagline: string;
  heroDesc: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  rateFrom: number;
  rateTo: number;
  processingFee: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  eligibility: Array<{ label: string; value: string }>;
  documents: Array<{ category: string; items: string[] }>;
  tags: string[];
  isActive: boolean;
}

interface LoansState {
  loans: LoanProduct[];
  isLoading: boolean;
  error: string | null;
  fetchLoans: (params?: { type?: string }) => Promise<void>;
  updateLoan: (id: string, data: Partial<LoanProduct>) => Promise<{ error?: string }>;
}

export const useLoansStore = create<LoansState>((set) => ({
  loans: [],
  isLoading: false,
  error: null,

  fetchLoans: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
      ).toString();
      const res = await fetch(`/api/loans${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) { set({ error: data.error }); return; }
      set({ loans: data.loans });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLoan: async (id, body) => {
    const res = await fetch(`/api/loans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Update failed" };
    set((s) => ({ loans: s.loans.map((l) => (l._id === id ? { ...l, ...data.loan } : l)) }));
    return {};
  },
}));
