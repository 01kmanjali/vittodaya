"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface LoanApplication {
  _id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  type: "personal" | "msme" | "ev" | "lap";
  amount: number;
  tenure?: string;
  interestRate?: number;
  status: string;
  city?: string;
  remarks?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

async function fetchLoanApplications(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/applications${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch loan applications");
  return (data.applications ?? []) as LoanApplication[];
}

async function updateLoanStatus(id: string, status: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update");
  return data.application as LoanApplication;
}

export function useLoanApplications(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["loan-applications", params],
    queryFn: () => fetchLoanApplications(params),
  });
}

export function useUpdateLoanStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateLoanStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loan-applications"] }),
  });
}
