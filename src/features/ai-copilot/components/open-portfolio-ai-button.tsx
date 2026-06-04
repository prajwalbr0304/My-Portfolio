"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { useCopilotStore } from "@/features/ai-copilot/store/copilot-store";
import { cn } from "@/lib/utils";

type OpenPortfolioAiButtonProps = {
  className?: string;
  /** Icon-only (e.g. header); still include aria-label via label */
  iconOnly?: boolean;
  label?: string;
  children?: ReactNode;
};

export function OpenPortfolioAiButton({
  className,
  iconOnly,
  label = "Ask about my portfolio, repos, and experience",
  children,
}: OpenPortfolioAiButtonProps) {
  const setOpen = useCopilotStore((s) => s.setOpen);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        setOpen(true);
      }}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 transition",
        iconOnly
          ? "size-9 rounded-full border border-edge bg-card/50 text-muted-foreground hover:border-secondary/40 hover:text-foreground"
          : "min-h-10 rounded-full border border-edge bg-card/60 px-4 text-sm font-medium text-muted-foreground hover:border-secondary/40 hover:text-foreground sm:px-5",
        className,
      )}
    >
      <Sparkles className="size-4 shrink-0 text-secondary" aria-hidden />
      {!iconOnly ? <span>{children ?? "Ask AI"}</span> : null}
    </button>
  );
}
