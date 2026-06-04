import { cn } from "@/lib/utils";

type PanelSectionProps = {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function PanelSection({ id, title, eyebrow, description, children, className }: PanelSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "screen-line-before screen-line-after border-x border-edge scroll-mt-16 first:scroll-mt-0",
        className
      )}
    >
      <div className="px-[clamp(0.75rem,2vw,1.5rem)] pt-7 xs:pt-8 md:px-6 md:pt-10">
        {eyebrow ? (
          <p className="text-base font-medium uppercase tracking-wide text-secondary">{eyebrow}</p>
        ) : null}
        <h2 className="text-section-heading mt-1 text-balance tracking-tight">{title}</h2>
        {description ? (
          <p className="text-body mt-3 max-w-2xl text-pretty leading-relaxed">{description}</p>
        ) : null}
        <div className="mt-6 pb-10 md:mt-8 md:pb-14">{children}</div>
      </div>
    </section>
  );
}