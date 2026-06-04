import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[background,border-color,box-shadow,transform,color] duration-normal ease-standard disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-strong active:scale-[.99]",
        ghost:
          "border border-border bg-surface text-foreground backdrop-blur-lg hover:border-border hover:bg-surface-raised active:scale-[.99]",
        subtle: "text-muted hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, className }))} {...props} />;
}
