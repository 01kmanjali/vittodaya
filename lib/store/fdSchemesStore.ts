"use client";
import { create } from "zustand";

export interface FDScheme {
  _id: string;
  slug: string;
  bankId: string;
  bankName: string;
  bankType: string;
  schemeName: string;
  minAmount: number;
  maxAmount?: number;
  tenureRates: Array<{ tenureMonths: number; tenureLabel: string; regularRate: number; seniorRate: number }>;
  compoundingFrequency: string;
  prematureWithdrawal: boolean;
  loanAgainstFD: boolean;
  autoRenewal: boolean;
  taxSaverFD: boolean;
  rating: string;
  ratingAgency: string;
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

interface FDSchemesState {
  schemes: FDScheme[];
  isLoading: boolean;
  error: string | null;
  fetchSchemes: (params?: { bankType?: string; taxSaver?: boolean }) => Promise<void>;
  createScheme: (data: Partial<FDScheme>) => Promise<{ error?: string }>;
  updateScheme: (id: string, data: Partial<FDScheme>) => Promise<{ error?: string }>;
  deleteScheme: (id: string) => Promise<{ error?: string }>;
}

export const useFDSchemesStore = create<FDSchemesState>((set) => ({
  schemes: [],
  isLoading: false,
  error: null,

  fetchSchemes: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
      ).toString();
      const res = await fetch(`/api/fd-schemes${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) { set({ error: data.error }); return; }
      set({ schemes: data.schemes });
    } finally {
      set({ isLoading: false });
    }
  },

  createScheme: async (body) => {
    const res = await fetch("/api/fd-schemes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Failed to create scheme" };
    set((s) => ({ schemes: [...s.schemes, data.scheme] }));
    return {};
  },

  updateScheme: async (id, body) => {
    const res = await fetch(`/api/fd-schemes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Update failed" };
    set((s) => ({ schemes: s.schemes.map((sc) => (sc._id === id ? { ...sc, ...data.scheme } : sc)) }));
    return {};
  },

  deleteScheme: async (id) => {
    const res = await fetch(`/api/fd-schemes/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Delete failed" };
    set((s) => ({ schemes: s.schemes.filter((sc) => sc._id !== id) }));
    return {};
  },
}));
