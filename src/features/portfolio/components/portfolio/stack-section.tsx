"use client";

import { useState } from "react";
import { stackTechnologies } from "@/features/portfolio/data";
import { ThemeAwareLogo } from "@/components/ui/theme-aware-logo";
import { PanelSection } from "./panel-section";
import { cn } from "@/lib/utils";

export function StackSection() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <PanelSection
      id="stack"
      title="Stack"
      description="Technologies I use to design, build, and ship products."
    >
      <ul className="grid grid-cols-2 gap-2 xs:grid-cols-3 xs:gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {stackTechnologies.map((tech) => (
          <li key={tech.slug}>
            <div
              title={tech.name}
              className="flex flex-col items-center gap-2 rounded-xl border border-edge bg-card/30 p-3 transition hover:border-secondary/40 hover:bg-card/50"
            >
              {failed[tech.slug] ? (
                <span className="flex size-10 min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                  {tech.name.slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <ThemeAwareLogo
                  src={tech.url}
                  srcDark={tech.urlDark}
                  invertInDark={tech.invertInDark}
                  alt={tech.name}
                  width={40}
                  height={40}
                  unoptimized
                  onError={() => setFailed((prev) => ({ ...prev, [tech.slug]: true }))}
                  imgClassName={cn(
                    "size-10 object-contain",
                    tech.slug === "openai" && "rounded-md dark:ring-1 dark:ring-white/25",
                    tech.slug === "mcp" && "rounded-md dark:ring-1 dark:ring-cyan-400/35",
                  )}
                />
              )}
              <span className="text-center text-caption leading-tight text-muted-foreground">{tech.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </PanelSection>
  );
}
