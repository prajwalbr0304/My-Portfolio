"use client";

import Link from "next/link";
import { GitBranch, Menu, X } from "lucide-react";
import { useState } from "react";
import { OpenPortfolioAiButton } from "@/features/ai-copilot/components/open-portfolio-ai-button";
import { DocumentFullscreenToggle } from "@/components/layout/document-fullscreen-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { profile } from "@/features/portfolio/data";
import { PORTFOLIO_PATH, portfolioHash } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: portfolioHash("about"), label: "About" },
  { href: portfolioHash("experience"), label: "Experience" },
  { href: portfolioHash("publications"), label: "Publications" },
  { href: portfolioHash("education"), label: "Education" },
  { href: portfolioHash("projects"), label: "Projects" },
  { href: portfolioHash("stack"), label: "Stack" },
  { href: portfolioHash("certifications"), label: "Certifications" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-background/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="portfolio-shell flex min-h-[min(3.5rem,clamp(2.75rem,8vw,3.5rem))] min-w-0 items-center justify-between gap-2 px-[clamp(0.75rem,2vw,1.5rem)] xs:gap-3 md:px-6">
        <Link
          href={PORTFOLIO_PATH}
          className="focus-ring inline-flex min-h-10 min-w-0 flex-1 truncate py-2 font-mono text-base font-semibold tracking-tight md:flex-none"
          onClick={() => setOpen(false)}
        >
          {profile.name}
        </Link>

        <nav className="hidden flex-wrap items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-lg px-3 py-2.5 text-base text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <OpenPortfolioAiButton iconOnly className="sm:hidden" />
          <OpenPortfolioAiButton iconOnly className="hidden sm:inline-flex" />
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-edge bg-card/50 p-2 text-muted-foreground transition hover:border-secondary/40 hover:text-foreground"
            aria-label="GitHub"
          >
            <GitBranch className="size-4 shrink-0" />
          </a>
          <DocumentFullscreenToggle />
          <ThemeToggle />
          <button
            type="button"
            className="focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-edge p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-edge bg-background/95 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="portfolio-shell flex min-w-0 flex-col gap-1 px-[clamp(0.75rem,2vw,1.5rem)] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-lg px-3 py-3 text-base text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <OpenPortfolioAiButton className="w-full" />
          </div>
        </nav>
      </div>
    </header>
  );
}
