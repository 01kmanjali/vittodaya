"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signIn, signOut } from "next-auth/react";

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
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phoneVerified?: boolean;
  panVerified?: boolean;
  aadhaarVerified?: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (v: boolean) => void;
  login: (email: string, password: string, twoFactorToken?: string) => Promise<{ error?: string; role?: string; twoFactorRequired?: boolean }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ error?: string; email?: string }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:      null,
      isLoading: false,

      setUser:    (user) => set({ user }),
      setLoading: (v)    => set({ isLoading: v }),

      login: async (email, password, twoFactorToken?) => {
        set({ isLoading: true });
        try {
          // Step 1: verify credentials and check if 2FA is required
          if (!twoFactorToken) {
            const pre = await fetch("/api/auth/preflight", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ email, password }),
            });
            const preData = await pre.json();
            if (!pre.ok) return { error: preData.error ?? "Invalid email or password" };
            if (preData.twoFactorRequired) return { twoFactorRequired: true };
          }

          // Step 2: sign in via NextAuth (with optional 2FA token)
          const result = await signIn("credentials", {
            email, password,
            twoFactorToken: twoFactorToken ?? "",
            redirect: false,
          });
          if (!result?.ok) {
            return { error: twoFactorToken ? "Invalid 2FA code. Please try again." : "Login failed. Please try again." };
          }
          await get().fetchMe();
          return { role: get().user?.role };
        } catch {
          return { error: "Login failed. Please try again." };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const res  = await fetch("/api/register", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ name, email, phone, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error ?? "Registration failed" };
          // Return email so the register page can redirect to verify-email
          return { email: data.email };
        } catch {
          return { error: "Registration failed. Please try again." };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ user: null });
        await signOut({ redirect: false });
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/me");
          if (!res.ok) { set({ user: null }); return; }
          const data = await res.json();
          const u    = data.user;
          set({
            user: {
              id:               u._id ?? u.id,
              name:             u.name,
              email:            u.email,
              role:             u.role,
              phone:            u.phone,
              kycStatus:        u.kycStatus,
              isSeniorCitizen:  u.isSeniorCitizen,
              status:           u.status,
              panNumber:        u.panNumber,
              aadharNumber:     u.aadharNumber,
              dateOfBirth:      u.dateOfBirth,
              address:          u.address,
              city:             u.city,
              state:            u.state,
              pincode:          u.pincode,
              phoneVerified:    u.phoneVerified,
              panVerified:      u.panVerified,
              aadhaarVerified:  u.aadhaarVerified,
              twoFactorEnabled: u.twoFactorEnabled,
            },
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "vf-auth", partialize: (s) => ({ user: s.user }) }
  )
);
