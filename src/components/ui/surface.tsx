import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("relative overflow-hidden border", {
  variants: {
    variant: {
      flat: "surface",
      raised: "surface-raised",
      glass: "glass",
      strong: "glass-strong",
    },
    radius: {
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
    },
    interactive: {
      true: "interactive",
      false: "",
    },
  },
  defaultVariants: {
    variant: "glass",
    radius: "3xl",
    interactive: false,
  },
});

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {
  as?: React.ElementType;
}

export function Surface({
  as: Component = "div",
  className,
  variant,
  radius,
  interactive,
  ...props
}: SurfaceProps) {
  return (
    <Component
      className={cn(surfaceVariants({ variant, radius, interactive, className }))}
      {...props}
    />
  );
}
