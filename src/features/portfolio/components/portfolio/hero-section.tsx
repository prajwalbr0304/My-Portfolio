"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download, Mail, Sparkles } from "lucide-react";
import { IndiaMapTricolorBadge } from "@/components/icons/india-map-tricolor-badge";
import { OpenPortfolioAiButton } from "@/features/ai-copilot/components/open-portfolio-ai-button";
import { profile, heroMetrics, socialLinks } from "@/features/portfolio/data";

export function HeroSection() {
  const [localAvatarFailed, setLocalAvatarFailed] = useState(false);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showLocalAvatar = profile.avatarLocalSrc && !localAvatarFailed;
  const showIndiaBadge = profile.location?.toLowerCase().includes("india") ?? false;

  return (
    <section id="hero" className="scroll-mt-16 border-b border-edge">
      <div className="mx-auto grid min-w-0 max-w-full gap-8 px-[clamp(0.75rem,2vw,1.5rem)] py-8 xs:py-10 md:grid-cols-[minmax(0,clamp(10rem,18vw,14rem))_1fr] md:items-start md:gap-10 md:px-6 md:py-14">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="relative isolate flex justify-center md:justify-start">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-secondary/25 via-accent/15 to-transparent opacity-90 blur-xl md:size-[13rem]"
            />
            {/* Tiranga-inspired ring: saffron (top) · white (middle) · green (bottom) */}
            <div
              className="relative z-10 rounded-full bg-[linear-gradient(180deg,#FF9933_0%,#FF9933_33.33%,#f1f5f9_33.33%,#f1f5f9_66.66%,#138808_66.66%,#138808_100%)] p-[3px] shadow-sm ring-1 ring-border/70 dark:bg-[linear-gradient(180deg,#FF9933_0%,#FF9933_33.33%,#FFFFFF_33.33%,#FFFFFF_66.66%,#138808_66.66%,#138808_100%)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_28px_rgba(255,153,51,0.22),0_12px_40px_rgba(19,136,8,0.14)] dark:ring-white/20 sm:p-1"
            >
              <div className="relative size-36 overflow-hidden rounded-full bg-card ring-2 ring-background md:size-44">
              {showLocalAvatar ? (
                <Image
                  src={profile.avatarLocalSrc}
                  alt={`${profile.name} — profile photo`}
                  fill
                  className="object-cover object-[center_12%] origin-center scale-[1.18]"
                  sizes="(max-width: 768px) 160px, 192px"
                  priority
                  onError={() => setLocalAvatarFailed(true)}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-3xl font-semibold text-foreground md:text-4xl">
                  {initials}
                </div>
              )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {socialLinks.map((link) => {
              const isMailto = link.href.startsWith("mailto:");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  {...(isMailto
                    ? {}
                    : { target: "_blank" as const, rel: "noopener noreferrer" })}
                  className="inline-flex min-h-11 min-w-0 shrink-0 items-center justify-center rounded-full border border-edge bg-card/60 px-4 py-2 text-base font-medium text-muted-foreground transition hover:border-secondary/50 hover:text-foreground"
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 space-y-6 text-center md:text-left">
          <div className="min-w-0">
            <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-edge bg-card/50 px-3 py-2 text-base font-medium text-muted-foreground">
              <Sparkles className="size-3.5 shrink-0 text-secondary" aria-hidden />
              Open to opportunities
            </p>
            <h1 className="text-headline flex flex-wrap items-center justify-center gap-2.5 text-balance tracking-tight md:justify-start">
              <span className="min-w-0 leading-tight">{profile.name}</span>
              {showIndiaBadge ? (
                <IndiaMapTricolorBadge className="inline-block h-[0.92em] w-[0.92em] shrink-0 translate-y-px" />
              ) : null}
            </h1>
            <p className="mt-2 text-lg leading-snug text-secondary sm:text-xl md:text-2xl">{profile.tagline}</p>
            <p className="text-body mx-auto mt-3 max-w-xl text-pretty md:mx-0">{profile.headline}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
            <Link
              href="/cv"
              className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-full bg-primary px-4 text-base font-medium text-primary-foreground transition hover:opacity-90 sm:px-5"
            >
              <Download className="size-4 shrink-0" aria-hidden />
              CV
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-full border border-edge bg-card/60 px-4 text-base font-medium transition hover:border-secondary/40 sm:px-5"
            >
              <Mail className="size-4" aria-hidden />
              Contact
            </a>
            <OpenPortfolioAiButton>Ask AI</OpenPortfolioAiButton>
          </div>

          <div className="grid grid-cols-1 gap-3 xs:grid-cols-3 sm:gap-4">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-edge bg-card/50 px-4 py-3 text-center md:text-left"
              >
                <p className="text-2xl font-semibold tabular-nums text-foreground">{metric.value}</p>
                <p className="mt-1 text-caption text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
