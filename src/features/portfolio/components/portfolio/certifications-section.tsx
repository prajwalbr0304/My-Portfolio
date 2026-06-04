"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { certifications } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";
import { cn } from "@/lib/utils";

export function CertificationsSection() {
  const count = certifications.length;

  return (
    <PanelSection
      id="certifications"
      title={`Certifications (${count})`}
      description="Udemy, Google & Firebase, AWS Bedrock / Strands, IBM SkillsBuild, and Infosys Springboard — each opens an HTML certificate view with your reference ID."
    >
      <ul className="overflow-hidden rounded-xl border border-edge bg-card/25">
        {certifications.map((cert, index) => (
          <li
            key={cert.ref}
            className={cn(index > 0 && "border-t border-dashed border-edge/80")}
          >
            <Link
              href={`/certificates/${cert.ref}`}
              className="focus-ring group flex min-w-0 items-center gap-3 rounded-lg border border-transparent px-3 py-3.5 transition hover:border-edge/90 hover:bg-card/35 sm:gap-4 sm:rounded-xl sm:px-4 sm:py-4 md:gap-5"
            >
              <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-edge bg-card p-1 ring-1 ring-border/60 sm:size-12 sm:p-1.5">
                <Image
                  src={cert.thumbnailSrc}
                  alt={`${cert.title} thumbnail`}
                  fill
                  className={
                    cert.thumbnailSrc.endsWith(".svg") ? "object-contain p-2" : "object-cover"
                  }
                  sizes="48px"
                  unoptimized={cert.thumbnailSrc.startsWith("http")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-foreground transition group-hover:text-secondary sm:text-base">
                  {cert.title}
                </p>
                <p className="mt-1 font-mono text-caption-size text-muted-foreground sm:text-base">
                  @ {cert.issuer} | {cert.issuedDisplay}
                </p>
              </div>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition group-hover:text-secondary sm:size-[1.125rem]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </PanelSection>
  );
}
