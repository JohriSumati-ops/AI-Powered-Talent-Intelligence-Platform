import type { Recommendation } from "@/lib/types";

export function scoreTone(score: number): "emerald" | "primary" | "amber" | "rose" {
  if (score >= 85) return "emerald";
  if (score >= 70) return "primary";
  if (score >= 50) return "amber";
  return "rose";
}

export const recommendationTone: Record<
  Recommendation,
  "emerald" | "primary" | "amber" | "rose"
> = {
  "Strong Hire": "emerald",
  Hire: "primary",
  "Interview Further": "amber",
  Pass: "rose",
};

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
