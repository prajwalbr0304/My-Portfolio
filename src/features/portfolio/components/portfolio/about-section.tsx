import { Mail } from "lucide-react";
import { contactChannels, profile } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";

export function AboutSection() {
  return (
    <PanelSection id="about" title="About" description="What I focus on and how I like to collaborate.">
      <div id="contact" className="scroll-mt-20 space-y-8">
        <div className="space-y-4 text-muted-foreground">
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="text-body leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="rounded-2xl border border-edge bg-gradient-to-br from-secondary/10 via-card/40 to-accent/5 p-6">
          <p className="text-sm font-medium text-foreground">Let&apos;s work together</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Open to full-time roles, internships, and freelance projects.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="focus-ring mt-4 inline-flex max-w-full break-all items-center gap-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:break-normal sm:text-left"
          >
            <Mail className="size-4" aria-hidden />
            {profile.email}
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {contactChannels.map(({ label, value, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={label === "GitHub" || label === "LinkedIn" ? "_blank" : undefined}
              rel={label === "GitHub" || label === "LinkedIn" ? "noopener noreferrer" : undefined}
              className="focus-ring flex items-center gap-3 rounded-xl border border-edge bg-card/40 p-4 transition hover:border-secondary/40 hover:bg-card/60"
            >
              <span className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
                <Icon className="size-4 text-secondary" />
              </span>
              <div className="min-w-0">
                <p className="text-caption-size text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PanelSection>
  );
}
