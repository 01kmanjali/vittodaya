"use client";

import { useQuery } from "@tanstack/react-query";
import type { FeatureStatus } from "@/lib/models/AppConfig";

export interface FeatureFlag {
  enabled: boolean;
  status: FeatureStatus;
  label: string;
}

export interface AppFeatures {
  fixedDeposits:     FeatureFlag;
  loans:             FeatureFlag;
  kycVerification:   FeatureFlag;
  investorRelations: FeatureFlag;
  newsMedia:         FeatureFlag;
}

async function fetchFeatureFlags(): Promise<AppFeatures> {
  const res = await fetch("/api/config/public");
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch config");
  return data.features as AppFeatures;
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: fetchFeatureFlags,
    staleTime: 60_000,
  });
}

export function isFDAvailable(features: AppFeatures | undefined): boolean {
  if (!features) return true; // default to visible while loading
  return features.fixedDeposits.enabled && features.fixedDeposits.status !== "disabled";
}
