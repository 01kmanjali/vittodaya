"use client";
import { create } from "zustand";

export interface Application {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: "fd" | "personal" | "msme" | "ev" | "lap";
  schemeId: string;
  schemeName: string;
  bankName?: string;
  principalAmount: number;
  tenureMonths?: number;
  interestRate?: number;
  maturityAmount?: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface ApplicationsState {
  applications: Application[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchApplications: (params?: { page?: number; limit?: number; status?: string; type?: string }) => Promise<void>;
  createApplication: (data: Partial<Application>) => Promise<{ error?: string; application?: Application }>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<{ error?: string }>;
}

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  applications: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchApplications: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
      ).toString();
      const res = await fetch(`/api/applications${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) { set({ error: data.error }); return; }
      set({ applications: data.applications, total: data.total });
    } finally {
      set({ isLoading: false });
    }
  },

  createApplication: async (body) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Failed to submit application" };
    set((s) => ({ applications: [data.application, ...s.applications], total: s.total + 1 }));
    return { application: data.application };
  },

  updateApplication: async (id, body) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Update failed" };
    set((s) => ({
      applications: s.applications.map((a) => (a._id === id ? { ...a, ...data.application } : a)),
    }));
    return {};
  },
}));
