"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? "X";
}

type Props = {
  text: string;
  subtitle?: string;
  onComplete: () => void;
  /** `light` = dark type on white card; `dark` = semantic tokens on mesh background */
  variant?: "light" | "dark";
};

/**
 * Decodes random glyphs into the final string (spaces stay fixed).
 */
export function NameScrambleIntro({ text, subtitle, onComplete, variant = "dark" }: Props) {
  const targets = useMemo(() => [...text], [text]);
  const [display, setDisplay] = useState(() => targets.map(() => " "));

  useEffect(() => {
    const n = Math.max(targets.length, 1);
    const start = performance.now();
    const totalMs = 2200;
    let raf = 0;
    let holdTimer: number | undefined;

    const tick = (now: number) => {
      const u = Math.min(1, (now - start) / totalMs);
      const next = targets.map((ch, i) => {
        if (ch === " ") return " ";
        if (u >= ((i + 1) / n) * 0.9) return ch;
        return randomChar();
      });
      setDisplay(next);

      const locked = next.every((c, i) => c === targets[i]);
      if (locked) {
        setDisplay([...targets]);
        holdTimer = window.setTimeout(onComplete, 400);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, [onComplete, targets]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 pb-[env(safe-area-inset-bottom,0px)] pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] pt-[max(0.5rem,env(safe-area-inset-top,0px))] text-center">
      <h1
        className={cn(
          "flex max-w-[min(100%,calc(100vw-2rem))] flex-wrap justify-center gap-x-0.5 break-words font-sans text-4xl font-bold tracking-tight xs:gap-x-1 xs:text-5xl sm:text-6xl md:text-7xl",
          variant === "light" ? "text-neutral-900" : "text-foreground",
        )}
      >
        {targets.map((_, i) => (
          <span key={i} className="inline-block min-w-[0.42em] text-center uppercase">
            {(display[i] ?? " ").toUpperCase()}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl px-1 font-mono text-xs font-medium uppercase leading-relaxed tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]",
            variant === "light" ? "text-neutral-600" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
