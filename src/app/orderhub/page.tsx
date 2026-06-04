import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Boxes, GitBranch, Layers, Server, Shield, TestTube2 } from "lucide-react";
import { profile } from "@/features/portfolio/data";
import { portfolioHash } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: "OrderHub — overview",
  description:
    "High-level, non-confidential overview of the OrderHub initiative and portfolio-safe contribution summary.",
};

export default function OrderHubOverviewPage() {
  return (
    <main className="mesh-bg min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <div className="portfolio-shell mx-auto max-w-3xl">
        <Link
          href={portfolioHash("experience")}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-edge bg-card/60 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-secondary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Work Experience
        </Link>

        <header className="mt-8 rounded-2xl border border-edge bg-card/50 p-6 sm:p-8">
          <p className="text-caption-size font-semibold uppercase tracking-[0.2em] text-secondary">Portfolio overview</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">OrderHub (OHUB)</h1>
          <p className="text-body mt-4 max-w-2xl text-pretty leading-relaxed">
            OrderHub is an order-handling and orchestration platform delivered as a suite of services and tooling. This
            page explains the idea at a glance for recruiters and collaborators — without internal URLs, credentials,
            customer data, or Nokia-confidential implementation detail.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-edge bg-card/40 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Layers className="size-5 text-secondary" aria-hidden />
            At a glance
          </h2>
          <p className="text-body mt-3 leading-relaxed">
            The system separates a <strong className="text-foreground">workspace UI</strong> from{" "}
            <strong className="text-foreground">core backend services</strong>, with supporting components for
            packaging, operations, and local developer workflows. Data is typically backed by a document-oriented store
            for operational state and events.
          </p>

          <div
            className="mt-8 flex flex-col items-stretch gap-4 rounded-xl border border-dashed border-edge bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-6"
            aria-label="Simplified architecture diagram"
          >
            <div className="flex flex-1 flex-col items-center rounded-lg border border-edge bg-background/80 px-4 py-4 text-center text-sm">
              <span className="font-medium text-foreground">Workspace UI</span>
              <span className="mt-1 text-caption-size text-muted-foreground">Operator flows &amp; visibility</span>
            </div>
            <span className="hidden text-muted-foreground sm:block" aria-hidden>
              →
            </span>
            <span className="text-center text-caption-size text-muted-foreground sm:hidden">↓</span>
            <div className="flex flex-1 flex-col items-center rounded-lg border border-edge bg-background/80 px-4 py-4 text-center text-sm">
              <span className="font-medium text-foreground">OrderHub services</span>
              <span className="mt-1 text-caption-size text-muted-foreground">APIs, modules, integrations</span>
            </div>
            <span className="hidden text-muted-foreground sm:block" aria-hidden>
              →
            </span>
            <span className="text-center text-caption-size text-muted-foreground sm:hidden">↓</span>
            <div className="flex flex-1 flex-col items-center rounded-lg border border-edge bg-background/80 px-4 py-4 text-center text-sm">
              <span className="font-medium text-foreground">Data &amp; delivery</span>
              <span className="mt-1 text-caption-size text-muted-foreground">Persistence, builds, releases</span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-edge bg-card/40 p-5">
            <Server className="size-5 text-secondary" aria-hidden />
            <h3 className="mt-3 font-semibold">Backend &amp; platform</h3>
            <p className="text-body mt-2 text-sm leading-relaxed">
              Service-oriented modules, shared libraries, and REST-style boundaries typical of a long-lived enterprise
              product — focused on correctness, observability, and safe evolution.
            </p>
          </div>
          <div className="rounded-2xl border border-edge bg-card/40 p-5">
            <TestTube2 className="size-5 text-secondary" aria-hidden />
            <h3 className="mt-3 font-semibold">Automation &amp; testing</h3>
            <p className="text-body mt-2 text-sm leading-relaxed">
              Repeatable checks that protect regressions: unit and integration coverage, fixtures, and feedback loops
              that keep merges shippable.
            </p>
          </div>
          <div className="rounded-2xl border border-edge bg-card/40 p-5">
            <GitBranch className="size-5 text-secondary" aria-hidden />
            <h3 className="mt-3 font-semibold">CI / CD touchpoints</h3>
            <p className="text-body mt-2 text-sm leading-relaxed">
              Pipeline-friendly packaging and quality gates so artifacts progress from dev to integration environments
              with fewer surprises.
            </p>
          </div>
          <div className="rounded-2xl border border-edge bg-card/40 p-5">
            <Boxes className="size-5 text-secondary" aria-hidden />
            <h3 className="mt-3 font-semibold">How I contribute</h3>
            <p className="text-body mt-2 text-sm leading-relaxed">
              As <strong className="text-foreground">{profile.name}</strong>, R&amp;D intern: backend changes,
              automation and tests, and light CI/CD support — always within team guidelines for confidentiality.
            </p>
          </div>
        </section>

        <section className="mt-8 flex items-start gap-3 rounded-2xl border border-secondary/25 bg-secondary/5 p-5 sm:p-6">
          <Shield className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
          <div>
            <h2 className="font-semibold">Confidentiality</h2>
            <p className="text-body mt-2 text-sm leading-relaxed">
              Names of internal hosts, realms, keys, customer identifiers, and unreleased roadmap items are
              intentionally omitted. For verification of employment or scope, use official Nokia channels with your
              recruiter.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
