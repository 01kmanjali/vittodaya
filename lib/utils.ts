import { type CSSProperties } from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rangeTrackStyle(
  value: number,
  min: number,
  max: number,
  fill: string,
  track: string = "var(--secondary-bg)"
): CSSProperties {
  const safeMin = Math.min(min, max)
  const safeMax = Math.max(min, max)
  const clampedValue = Math.min(Math.max(value, safeMin), safeMax)
  const percent = ((clampedValue - safeMin) / (safeMax - safeMin || 1)) * 100

  return {
    background: `linear-gradient(to right, ${fill} 0%, ${fill} ${percent}%, ${track} ${percent}%, ${track} 100%)`,
  }
}
