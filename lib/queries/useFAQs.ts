"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  isActive?: boolean;
}

async function fetchFAQs(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/faqs${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch FAQs");
  return data.faqs as FAQ[];
}

async function createFAQ(body: Partial<FAQ>) {
  const res = await fetch("/api/faqs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create FAQ");
  return data.faq as FAQ;
}

async function deleteFAQ(id: string) {
  const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete FAQ");
  return id;
}

export function useFAQs(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["faqs", params],
    queryFn: () => fetchFAQs(params),
  });
}

export function useCreateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFAQ,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFAQ,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}
