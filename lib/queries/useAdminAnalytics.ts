"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AdminUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  city?: string;
  role: string;
  status: string;
  kycStatus: string;
  isSeniorCitizen?: boolean;
  createdAt?: string | Date;
}

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

async function fetchAnalytics() {
  const res = await fetch("/api/admin/analytics");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch analytics");
  return data as AnalyticsData;
}

async function fetchAdminUsers(params: { page?: number; limit?: number; search?: string } = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
    )
  ).toString();
  const res = await fetch(`/api/users${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch users");
  return { users: data.users as AdminUser[], total: data.total as number };
}

async function updateUser({ id, body }: { id: string; body: Partial<AdminUser> }) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update user");
  return data.user as AdminUser;
}

async function deleteUser(id: string) {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete user");
  return id;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAnalytics,
  });
}

export function useAdminUsers(params: { page?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchAdminUsers(params),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
