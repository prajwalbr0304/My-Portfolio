"use client";

import dynamic from "next/dynamic";
import { FloatingDock } from "@/components/layout/floating-dock";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import { proofLogos } from "@/features/portfolio/data";
import { AboutSection } from "./portfolio/about-section";
import { CertificationsSection } from "./portfolio/certifications-section";
import { EducationSection } from "./portfolio/education-section";
import { ExperienceSection } from "./portfolio/experience-section";
import { HeroSection } from "./portfolio/hero-section";
import { ProjectsSection } from "./portfolio/projects-section";
import { PublicationsSection } from "./portfolio/publications-section";
import { SiteHeader } from "./portfolio/site-header";
import { StackSection } from "./portfolio/stack-section";

const CopilotWorkspace = dynamic(
  () => import("@/features/ai-copilot/components/copilot-workspace").then((mod) => mod.CopilotWorkspace),
  { ssr: false },
);

export function PortfolioExperience() {
  return (
    <main className="mesh-bg safe-dock relative min-h-[100dvh] min-h-[100svh] min-w-0 overflow-x-clip bg-background pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] text-foreground">
      <SiteHeader />
      <div className="portfolio-shell relative z-10 min-w-0 border-x border-edge">
        <HeroSection />
        <div className="screen-line-before screen-line-after border-b border-edge px-[clamp(0.75rem,2vw,1.5rem)] py-4 md:px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(0.75rem,2vw,1.5rem)] gap-y-2 text-center text-caption leading-snug text-muted-foreground sm:gap-x-6">
            {proofLogos.map((proof) => (
              <li key={proof}>{proof}</li>
            ))}
          </ul>
        </div>
        <AboutSection />
        <ExperienceSection />
        <PublicationsSection />
        <EducationSection />
        <ProjectsSection />
        <StackSection />
        <CertificationsSection />
        <section
          id="portfolio-assistant"
          className="screen-line-before screen-line-after scroll-mt-20 border-x border-edge"
          aria-label="Portfolio Q&A assistant"
        >
          <CopilotWorkspace />
        </section>
      </div>
      <FloatingDock />
      <CursorSpotlight />
    </main>
  );
}
