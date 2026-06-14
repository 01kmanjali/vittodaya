"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type IRType =
  | "financial_result"
  | "annual_report"
  | "board_member"
  | "shareholding"
  | "press_release";

export interface InvestorRecord {
  _id: string;
  type: IRType;
  title: string;
  year?: string;
  quarter?: string;
  period?: string;
  revenue?: string;
  netProfit?: string;
  npa?: string;
  fileSize?: string;
  publishedDate: string;
  resultType?: "quarterly" | "annual";
  name?: string;
  designation?: string;
  experience?: string;
  qualification?: string;
  bio?: string;
  imageInitial?: string;
  isActive?: boolean;
  order?: number;
}

async function fetchInvestorRecords(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/investor-relations${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch investor records");
  return data.records as InvestorRecord[];
}

async function createInvestorRecord(body: Partial<InvestorRecord>) {
  const res = await fetch("/api/investor-relations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create record");
  return data.record as InvestorRecord;
}

async function updateInvestorRecord({ id, body }: { id: string; body: Partial<InvestorRecord> }) {
  const res = await fetch(`/api/investor-relations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update record");
  return data.record as InvestorRecord;
}

async function deleteInvestorRecord(id: string) {
  const res = await fetch(`/api/investor-relations/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete record");
  return id;
}

export function useInvestorRecords(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["investor-relations", params],
    queryFn: () => fetchInvestorRecords(params),
  });
}

export function useCreateInvestorRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvestorRecord,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor-relations"] }),
  });
}

export function useUpdateInvestorRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateInvestorRecord,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor-relations"] }),
  });
}

export function useDeleteInvestorRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteInvestorRecord,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["investor-relations"] }),
  });
}
