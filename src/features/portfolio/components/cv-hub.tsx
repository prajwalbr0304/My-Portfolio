"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { FloatingDock } from "@/components/layout/floating-dock";
import { SiteHeader } from "@/features/portfolio/components/portfolio/site-header";
import { profile } from "@/features/portfolio/data";
import { PORTFOLIO_PATH } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

/** Hints embedded PDF viewers to reduce chrome where supported (Chrome / Firefox / Edge vary). */
function pdfEmbedSrc(path: string) {
  if (path.includes("#")) return path;
  return `${path}#navpanes=0&toolbar=0`;
}

/**
 * True on Android, where browsers (Chrome, WebView, Vivo/MIUI, etc.) can't render
 * a PDF inline in an `<iframe>` and instead show a "content is blocked" error.
 *
 * Starts `false` so the server render and the first client render BOTH produce the
 * iframe (no hydration mismatch); it flips to `true` after mount only on Android.
 */
function useAndroidPdfFallback(): boolean {
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    if (/Android/i.test(navigator.userAgent || "")) setFallback(true);
  }, []);
  return fallback;
}

function PdfPreview({
  src,
  title,
  className,
  loading,
}: {
  src: string;
  title: string;
  className: string;
  loading: "eager" | "lazy";
}) {
  const showFallback = useAndroidPdfFallback();

  return (
    <div className={className}>
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-edge bg-background/70 shadow-sm">
            <FileText className="size-7 text-secondary" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Inline preview isn&apos;t supported on this device</p>
            <p className="mx-auto max-w-xs text-caption-size text-muted-foreground">
              Your browser can&apos;t display PDFs inline. Open or download the résumé to view it.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Open PDF
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <a
              href={src}
              download
              className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full border border-edge bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-secondary/50 hover:bg-muted/50"
            >
              <Download className="size-3.5" aria-hidden />
              Download
            </a>
          </div>
        </div>
      ) : (
        <iframe
          title={title}
          src={pdfEmbedSrc(src)}
          className="absolute inset-0 h-full w-full border-0 bg-background"
          loading={loading}
        />
      )}
    </div>
  );
}

export function CvHub() {
  const fancySrc = profile.resumeFancyPdfSrc;
  const atsSrc = profile.resumeAtsPdfSrc;

  const panelHeader = cn(
    "flex min-h-[3.25rem] flex-wrap items-center justify-between gap-2 border-b border-edge px-3 py-2 sm:px-4",
    "bg-card text-foreground shadow-sm",
  );

  const contextStrip = cn(
    "flex min-h-[3.25rem] flex-wrap items-center gap-2 border-b border-edge/80 px-3 py-2 sm:px-4",
    "bg-muted/20 text-sm",
  );

  const previewShell = cn(
    "relative min-h-[min(68dvh,760px)] w-full flex-1 overflow-hidden rounded-b-lg bg-neutral-950/40",
    "ring-1 ring-border/60 dark:bg-neutral-950/50",
  );

  return (
    <main className="mesh-bg safe-dock relative min-h-[100dvh] min-h-[100svh] min-w-0 overflow-x-clip bg-background pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] text-foreground">
      <SiteHeader />
      <div className="portfolio-shell relative z-10 mx-auto max-w-[min(100vw-1.5rem,90rem)] border-x border-edge px-3 py-6 xs:px-4 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href={PORTFOLIO_PATH}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-edge bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm transition hover:border-secondary/50 hover:bg-surface-raised hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
            Portfolio
          </Link>
        </div>

        <header className="mb-8 border-b border-edge pb-8">
          <h1 className="text-title text-foreground">Curriculum vitae</h1>
        </header>

        <div
          className={cn(
            "grid min-h-0 w-full grid-cols-1 gap-6 lg:min-h-[calc(100dvh-14rem)] lg:grid-cols-2 lg:gap-0",
            "lg:divide-x lg:divide-edge",
            "overflow-hidden rounded-xl border border-edge bg-card shadow-xl",
          )}
          role="group"
          aria-label="CV PDFs"
        >
          <section
            className="flex min-h-0 min-w-0 flex-col lg:rounded-l-xl lg:rounded-r-none"
            aria-labelledby="cv-fancy-heading"
          >
            <div className={cn(panelHeader, "rounded-t-xl lg:rounded-tr-none")}>
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-secondary" aria-hidden />
                <h2
                  id="cv-fancy-heading"
                  className="truncate text-sm font-semibold tracking-wide text-foreground sm:text-base"
                >
                  Fancy CV
                </h2>
              </div>
              <a
                href={fancySrc}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-edge bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-secondary/50 hover:bg-muted/50 sm:px-3.5"
              >
                Open
                <ExternalLink className="size-3.5 opacity-80" aria-hidden />
              </a>
            </div>
            <div className={contextStrip}>
              <a
                href={profile.portfolioDeployHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-2.5 rounded-md border border-secondary/45 bg-background px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm outline-offset-2 transition hover:border-secondary/70 hover:bg-muted/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- small static mark; avoids SVG Image config */}
                <img
                  src={profile.portfolioDeployMarkSrc}
                  alt=""
                  width={28}
                  height={28}
                  className="shrink-0 rounded-md ring-1 ring-border/60"
                />
                <span className="text-secondary">{profile.portfolioDeployLabel}</span>
              </a>
            </div>
            <PdfPreview
              title="Fancy CV PDF preview"
              src={fancySrc}
              className={cn(previewShell, "lg:rounded-bl-xl")}
              loading="eager"
            />
          </section>

          <section
            className="flex min-h-0 min-w-0 flex-col lg:rounded-none lg:rounded-r-xl"
            aria-labelledby="cv-ats-heading"
          >
            <div className={cn(panelHeader, "lg:rounded-none")}>
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-secondary" aria-hidden />
                <h2
                  id="cv-ats-heading"
                  className="truncate text-sm font-semibold tracking-wide text-foreground sm:text-base"
                >
                  ATS-friendly CV
                </h2>
              </div>
              <a
                href={atsSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-edge bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-secondary/50 hover:bg-muted/50 sm:px-3.5"
              >
                Open
                <ExternalLink className="size-3.5 opacity-80" aria-hidden />
              </a>
            </div>
            <div className={contextStrip}>
              <a
                href={profile.portfolioDeployHref}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex min-h-10 items-center rounded-md border border-edge bg-background/80 px-3 py-2 text-sm font-medium text-secondary underline-offset-2 outline-offset-2 transition hover:border-secondary/50 hover:bg-muted/30 hover:underline"
              >
                {profile.portfolioDeployLabel}
              </a>
            </div>
            <PdfPreview
              title="ATS-friendly CV PDF preview"
              src={atsSrc}
              className={cn(previewShell, "lg:rounded-br-xl")}
              loading="lazy"
            />
          </section>
        </div>
      </div>
      <FloatingDock />
    </main>
  );
}
