"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Application {
  _id: string;
  userId: string;
  userName?: string;
  type?: string;
  bankName?: string;
  schemeName?: string;
  fdNumber?: string;
  loanNumber?: string;
  principalAmount: number;
  interestRate: number | string;
  tenureMonths: number;
  maturityAmount?: number;
  status: string;
  remarks?: string;
  createdAt?: string | Date;
  approvedAt?: string | Date;
}

async function fetchApplications(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/applications${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch applications");
  return data.applications as Application[];
}

async function updateApplicationStatus(id: string, status: string) {
  const res = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update application");
  return data.application as Application;
}

export function useApplications(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => fetchApplications(params),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateApplicationStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
