"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Career {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  isActive: boolean;
  postedAt?: string | Date;
}

async function fetchCareers(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/careers${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch careers");
  return data.careers as Career[];
}

async function createCareer(body: Partial<Career>) {
  const res = await fetch("/api/careers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create job");
  return data.career as Career;
}

async function deleteCareer(id: string) {
  const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete job");
  return id;
}

export function useCareers(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["careers", params],
    queryFn: () => fetchCareers(params),
  });
}

export function useCreateCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCareer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["careers"] }),
  });
}

export function useDeleteCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["careers"] }),
  });
}
