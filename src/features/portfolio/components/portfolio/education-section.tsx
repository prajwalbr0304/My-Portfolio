"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, GraduationCap } from "lucide-react";
import { educationEntries } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";

export function EducationSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <PanelSection
      id="education"
      title="Education"
      description="Formal training and academic focus areas."
      action={
        <a
          href="https://prajwalbreducation.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 px-3.5 py-1.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
        >
          <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          Explore Education
        </a>
      }
    >
      <div className="space-y-3">
        {educationEntries.map((entry, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={`${entry.school}-${index}`}
              className="overflow-hidden rounded-xl border border-edge bg-card/40 transition hover:border-secondary/20"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="focus-ring flex w-full items-start gap-4 p-4 text-left sm:p-5"
              >
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card ring-1 ring-border/80 dark:bg-zinc-950 dark:ring-white/12">
                  {entry.logoSrc ? (
                    <Image
                      src={entry.logoSrc}
                      alt={`${entry.school} logo`}
                      fill
                      className="object-contain p-1"
                      sizes="44px"
                    />
                  ) : (
                    <GraduationCap className="size-5" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-2 sm:gap-y-1">
                    <h3 className="min-w-0 break-words font-semibold sm:pr-2">{entry.school}</h3>
                    <span className="shrink-0 text-caption-size tabular-nums text-muted-foreground sm:text-right sm:text-base">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-secondary">{entry.degree}</p>
                  <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${isOpen ? "" : "line-clamp-2"}`}>
                    {entry.description}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                ) : (
                  <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
              </button>
              {isOpen ? (
                <div className="border-t border-edge bg-muted/15 px-4 pb-5 pt-4 sm:px-5">
                  <ul className="mb-4 list-disc space-y-1.5 pl-5 font-mono text-sm leading-relaxed text-muted-foreground">
                    {entry.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-edge bg-background/80 px-2 py-0.5 font-mono text-caption-size text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </PanelSection>
  );
}
