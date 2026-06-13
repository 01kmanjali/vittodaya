"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FDScheme {
  _id?: string;
  id?: string;
  bankId?: string;
  bankName: string;
  schemeName: string;
  bankType: string;
  minAmount: number;
  maxAmount?: number | null;
  tenureRates: Array<{ tenureMonths: number; tenureLabel: string; regularRate: number; seniorRate: number }>;
  compoundingFrequency?: string;
  prematureWithdrawal?: boolean;
  loanAgainstFD?: boolean;
  autoRenewal?: boolean;
  taxSaverFD: boolean;
  rating: string;
  ratingAgency: string;
  slug?: string;
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

export type FDSchemeParams = { bankType?: string; taxSaver?: string; active?: string; [key: string]: string | undefined };

async function fetchFDSchemes(params: FDSchemeParams = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter((e): e is [string, string] => e[1] != null))
  ).toString();
  const res = await fetch(`/api/fd-schemes${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch FD schemes");
  return data.schemes as FDScheme[];
}

async function createFDScheme(body: Partial<FDScheme>) {
  const res = await fetch("/api/fd-schemes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create scheme");
  return data.scheme as FDScheme;
}

async function updateFDScheme({ id, body }: { id: string; body: Partial<FDScheme> }) {
  const res = await fetch(`/api/fd-schemes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update scheme");
  return data.scheme as FDScheme;
}

async function deleteFDScheme(id: string) {
  const res = await fetch(`/api/fd-schemes/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete scheme");
  return id;
}

export function useFDSchemes(params: FDSchemeParams = {}) {
  return useQuery({
    queryKey: ["fd-schemes", params],
    queryFn: () => fetchFDSchemes(params),
  });
}

export function useCreateFDScheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFDScheme,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fd-schemes"] }),
  });
}

export function useUpdateFDScheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateFDScheme,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fd-schemes"] }),
  });
}

export function useDeleteFDScheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFDScheme,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fd-schemes"] }),
  });
}
