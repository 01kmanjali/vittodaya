"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface NewsArticle {
  _id: string;
  title: string;
  excerpt?: string;
  category: string;
  source?: string;
  publishedDate?: string | Date;
  isFeatured?: boolean;
  imageColor?: string;
  imageInitial?: string;
  isActive?: boolean;
}

async function fetchNews(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/news-media${qs ? `?${qs}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch news");
  return data.articles as NewsArticle[];
}

async function createNews(body: Partial<NewsArticle>) {
  const res = await fetch("/api/news-media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create article");
  return data.article as NewsArticle;
}

async function deleteNews(id: string) {
  const res = await fetch(`/api/news-media/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete article");
  return id;
}

export function useNews(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => fetchNews(params),
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}
