"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Bank {
  _id: string;
  name: string;
  type: string;
  description?: string;
  rating?: string;
  ratingAgency?: string;
  established?: number;
  hq?: string;
  isActive: boolean;
}

async function fetchBanks(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/banks${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch banks");
  return data.banks as Bank[];
}

async function createBank(body: Partial<Bank>) {
  const res = await fetch("/api/banks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create bank");
  return data.bank as Bank;
}

async function updateBank({ id, body }: { id: string; body: Partial<Bank> }) {
  const res = await fetch(`/api/banks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update bank");
  return data.bank as Bank;
}

async function deleteBank(id: string) {
  const res = await fetch(`/api/banks/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete bank");
  return id;
}

export function useBanks(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["banks", params],
    queryFn: () => fetchBanks(params),
  });
}

export function useCreateBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBank,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banks"] }),
  });
}

export function useUpdateBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateBank,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banks"] }),
  });
}

export function useDeleteBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBank,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banks"] }),
  });
}
