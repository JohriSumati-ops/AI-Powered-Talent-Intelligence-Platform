"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils/cn";

const toneClass: Record<string, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald",
  amber: "bg-amber",
  rose: "bg-rose",
};

export function Progress({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "emerald" | "amber" | "rose";
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full flex-1 rounded-full transition-transform duration-500 ease-out",
          toneClass[tone]
        )}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
