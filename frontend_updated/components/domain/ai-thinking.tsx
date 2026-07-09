"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AIThinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3">
      <div className="relative flex size-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring [animation-delay:0.4s]" />
        <div className="relative flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>{label}</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
