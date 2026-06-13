"use client";
import { create } from "zustand";

export interface AnalyticsData {
  users: { total: number; active: number; pendingKYC: number };
  applications: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    byType: Array<{ _id: string; count: number }>;
    byStatus: Array<{ _id: string; count: number }>;
  };
  products: { fdSchemes: number; loanProducts: number };
  recentApplications: Array<Record<string, unknown>>;
}

interface AdminState {
  analytics: AnalyticsData | null;
  users: Array<Record<string, unknown>>;
  usersTotal: number;
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
  fetchUsers: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  updateUser: (id: string, data: Record<string, unknown>) => Promise<{ error?: string }>;
  deleteUser: (id: string) => Promise<{ error?: string }>;
}

export const useAdminStore = create<AdminState>((set) => ({
  analytics: null,
  users: [],
  usersTotal: 0,
  isLoading: false,

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (res.ok) set({ analytics: data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async (params = {}) => {
    set({ isLoading: true });
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))
      ).toString();
      const res = await fetch(`/api/users${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (res.ok) set({ users: data.users, usersTotal: data.total });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, body) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Update failed" };
    set((s) => ({ users: s.users.map((u) => (u._id === id ? { ...u, ...data.user } : u)) }));
    return {};
  },

  deleteUser: async (id) => {
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Delete failed" };
    set((s) => ({ users: s.users.filter((u) => u._id !== id), usersTotal: s.usersTotal - 1 }));
    return {};
  },
}));
