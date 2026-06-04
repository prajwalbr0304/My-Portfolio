"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";
import { experienceEntries } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";
import { cn } from "@/lib/utils";

function TimelineAvatar({
  logoSrc,
  type,
}: {
  logoSrc?: string;
  type: (typeof experienceEntries)[number]["type"];
}) {
  if (logoSrc) {
    return (
      <div
        className={cn(
          /* Rounded square: better for wide marks like Nokia; tight inset so the logo fills the frame */
          "relative size-[3rem] overflow-hidden rounded-lg border-[3px] border-background shadow-md sm:size-[3.35rem]",
          "bg-card ring-2 ring-zinc-900/[0.08] dark:bg-zinc-100 dark:ring-white/[0.14]",
        )}
      >
        <Image
          src={logoSrc}
          alt=""
          fill
          className="object-contain object-center p-[2px] sm:p-0.5"
          sizes="56px"
          unoptimized={logoSrc.startsWith("http")}
        />
      </div>
    );
  }
  if (type === "Education") {
    return (
      <div className="flex size-[3rem] items-center justify-center rounded-full border-[3px] border-background bg-secondary/15 shadow-md ring-2 ring-border/80 sm:size-[3.35rem]">
        <GraduationCap className="size-5 text-secondary sm:size-6" aria-hidden />
      </div>
    );
  }
  return (
    <div className="flex size-[3rem] items-center justify-center rounded-full border-[3px] border-background bg-muted text-sm font-semibold text-muted-foreground shadow-md ring-2 ring-border/80 sm:size-[3.35rem] sm:text-base">
      {type === "Professional" ? "N" : "P"}
    </div>
  );
}

function DetailLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const internal = href.startsWith("/");
  const className =
    "focus-ring inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full border border-violet-600/50 bg-violet-600 text-white shadow-sm transition hover:bg-violet-500 hover:shadow-md dark:border-violet-400/50 dark:bg-violet-500 dark:hover:bg-violet-400";
  if (internal) {
    return (
      <Link href={href} className={className} aria-label={label} title={label}>
        <ExternalLink className="size-4" aria-hidden />
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label} title={label}>
      <ExternalLink className="size-4" aria-hidden />
    </a>
  );
}

export function ExperienceSection() {
  return (
    <PanelSection
      id="experience"
      title="Work Experience"
      description="Roles, projects, and how I ship — current Nokia R&D internship highlighted."
    >
      <div className="relative">
        <div
          className="absolute bottom-3 left-[calc(1.5rem-0.5px)] top-3 w-px bg-border sm:left-[calc(1.675rem-0.5px)]"
          aria-hidden
        />
        <ul className="relative space-y-10 sm:space-y-12">
          {experienceEntries.map((entry, index) => {
            const isFeatured = entry.featured === true;
            const darkWorkMode = entry.workMode === "On Site" || entry.workMode === "Remote";
            return (
              <li key={`${entry.company}-${index}`} className="relative flex items-stretch gap-3 sm:gap-5">
                <div className="relative z-10 flex w-[3rem] shrink-0 justify-center sm:w-[3.35rem]">
                  <div className="sticky top-24 self-start pt-1 sm:pt-0">
                    <div className={cn(isFeatured && "relative -translate-x-0.5 sm:-translate-x-1")}>
                      <TimelineAvatar logoSrc={entry.logoSrc} type={entry.type} />
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "relative min-w-0 flex-1 rounded-2xl border px-4 pb-4 pt-4 shadow-sm sm:px-6 sm:pb-5 sm:pt-5",
                    isFeatured
                      ? "border-violet-400/40 bg-violet-500/[0.07] ring-1 ring-violet-500/20 dark:border-violet-500/35 dark:bg-violet-500/[0.09]"
                      : "border-edge bg-card/90",
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground sm:text-lg">{entry.company}</h3>
                        {entry.contextBadge ? (
                          <span className="rounded-full border border-sky-600/45 bg-sky-100 px-2.5 py-0.5 text-caption-size font-semibold text-sky-950 dark:border-sky-400/35 dark:bg-sky-950/50 dark:text-sky-100">
                            {entry.contextBadge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-base font-semibold text-blue-600 dark:text-blue-400 sm:text-lg">
                        {entry.role}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <p className="text-caption-size tabular-nums text-muted-foreground sm:text-base">{entry.period}</p>
                        {entry.externalUrl ? (
                          <DetailLink
                            href={entry.externalUrl}
                            label={
                              entry.externalUrl.startsWith("/orderhub")
                                ? "OrderHub overview (this site)"
                                : `${entry.company} external link`
                            }
                          />
                        ) : null}
                      </div>
                      {entry.isCurrent ? (
                        <span className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-full border border-emerald-600/45 bg-emerald-100 px-2.5 py-1 text-caption-size font-bold uppercase tracking-wide text-emerald-950 shadow-sm dark:border-emerald-400/40 dark:bg-emerald-950/45 dark:text-emerald-100">
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                          </span>
                          Live · Now at Nokia
                        </span>
                      ) : null}
                      {entry.workMode ? (
                        <span
                          className={cn(
                            "w-fit rounded-md border px-2.5 py-1 text-caption-size font-semibold",
                            darkWorkMode
                              ? "border-neutral-700 bg-neutral-800 text-white dark:border-neutral-600 dark:bg-neutral-900"
                              : "border-edge bg-muted/90 text-foreground",
                          )}
                        >
                          {entry.workMode}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                    {entry.description}
                  </p>

                  {entry.highlights.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {entry.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-edge bg-muted/60 px-2.5 py-0.5 font-mono text-caption-size text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </PanelSection>
  );
}
