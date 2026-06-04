import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-7 items-center gap-2 rounded-full border px-3 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "border-border bg-surface text-muted",
        primary: "border-primary/20 bg-primary/10 text-foreground",
        secondary: "border-secondary/24 bg-secondary/12 text-secondary",
        accent: "border-accent/24 bg-accent/12 text-accent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
