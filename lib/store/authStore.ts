"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  kycStatus?: "not_started" | "pending" | "verified" | "rejected";
  isSeniorCitizen?: boolean;
  status?: string;
  panNumber?: string;
  aadharNumber?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (v: boolean) => void;
  login: (email: string, password: string) => Promise<{ error?: string; role?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (v) => set({ isLoading: v }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error ?? "Login failed" };
          set({ user: data.user });
          return { role: data.user?.role };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error ?? "Registration failed" };
          set({ user: data.user });
          return {};
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        set({ user: null });
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) { set({ user: null }); return; }
          const data = await res.json();
          set({ user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "vf-auth", partialize: (s) => ({ user: s.user }) }
  )
);
