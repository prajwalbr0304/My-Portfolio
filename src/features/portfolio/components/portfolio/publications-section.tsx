"use client";

import type { ReactNode } from "react";
import { Award, Globe } from "lucide-react";
import { publicationEntries } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";
import { cn } from "@/lib/utils";

const statusStyles: Record<(typeof publicationEntries)[number]["status"], string> = {
  accepted:
    "border-sky-600/45 bg-sky-100 text-sky-950 dark:border-sky-400/35 dark:bg-sky-950/55 dark:text-sky-100",
  published:
    "border-emerald-600/45 bg-emerald-100 text-emerald-950 dark:border-emerald-400/35 dark:bg-emerald-950/50 dark:text-emerald-100",
  forthcoming:
    "border-amber-600/50 bg-amber-100 text-amber-950 dark:border-amber-400/40 dark:bg-amber-950/50 dark:text-amber-100",
};

const statusDot: Record<(typeof publicationEntries)[number]["status"], string> = {
  accepted: "bg-sky-500",
  published: "bg-emerald-500",
  forthcoming: "bg-amber-500",
};

const statusLabel: Record<(typeof publicationEntries)[number]["status"], string> = {
  accepted: "Accepted",
  published: "Published",
  forthcoming: "Forthcoming",
};

function PdfPaperIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        className="fill-red-600 dark:fill-red-500"
      />
      <path d="M14 2v6h6" className="fill-red-400/90 dark:fill-red-300/90" />
      <path
        d="M8 14.5h8M8 17.5h5.5"
        className="stroke-white/95"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PublicationIconLink({
  href,
  tooltip,
  ariaLabel,
  children,
}: {
  href: string;
  tooltip: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={tooltip}
      aria-label={ariaLabel}
      className={cn(
        "focus-ring group relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-edge bg-background/80 text-muted-foreground transition",
        "hover:border-secondary/40 hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 max-w-[min(100vw-1rem,18rem)] -translate-x-1/2 translate-y-1 rounded-md border border-border bg-popover px-2 py-1.5 text-center text-caption-size font-semibold text-popover-foreground opacity-0 shadow-md",
          "transition-[opacity,transform] duration-150",
          "text-pretty sm:whitespace-nowrap group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        )}
      >
        {tooltip}
      </span>
    </a>
  );
}

export function PublicationsSection() {
  return (
    <PanelSection
      id="publications"
      title="Academic Publications"
      description="Research papers and academic contributions."
    >
      <div className="space-y-4">
        {publicationEntries.map((pub) => (
          <article
            key={pub.id}
            className="rounded-xl border border-edge bg-card/80 p-4 shadow-sm transition hover:border-secondary/25 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
                <a
                  href={pub.publisherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 transition hover:text-secondary hover:underline"
                >
                  {pub.title}
                </a>
              </h3>
              <span className="shrink-0 self-start rounded-full border border-edge bg-muted/50 px-3 py-1 font-mono text-caption-size font-semibold uppercase tracking-wide text-muted-foreground">
                {pub.venuePill}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
              <span>{pub.venueLine}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-caption-size font-medium",
                  statusStyles[pub.status],
                )}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", statusDot[pub.status])} aria-hidden />
                {statusLabel[pub.status]}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pub.summary}</p>

            <div className="mt-4 flex flex-col gap-3 border-t border-edge/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {pub.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-edge bg-muted/30 px-2.5 py-0.5 font-mono text-caption-size text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:justify-end">
                <PublicationIconLink
                  href={pub.publisherUrl}
                  tooltip="Publisher page"
                  ariaLabel={`Publisher page: ${pub.shortName}`}
                >
                  <Globe className="size-4" />
                </PublicationIconLink>
                <PublicationIconLink
                  href={pub.paperPdfUrl}
                  tooltip="Research paper (PDF)"
                  ariaLabel={`Research paper PDF: ${pub.shortName}`}
                >
                  <PdfPaperIcon className="size-[1.125rem]" />
                </PublicationIconLink>
                <PublicationIconLink
                  href={pub.certificateUrl}
                  tooltip="Certificate"
                  ariaLabel={`Certificate: ${pub.shortName}`}
                >
                  <Award className="size-4" />
                </PublicationIconLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PanelSection>
  );
}
