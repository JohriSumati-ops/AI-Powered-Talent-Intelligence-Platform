import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground border-transparent",
        primary: "bg-primary-muted text-primary border-primary/20",
        emerald: "bg-emerald-muted text-emerald border-emerald/20",
        amber: "bg-amber-muted text-amber border-amber/20",
        rose: "bg-rose-muted text-rose border-rose/20",
        outline: "bg-transparent text-foreground border-border",
      },
    },
    defaultVariants: { tone: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
