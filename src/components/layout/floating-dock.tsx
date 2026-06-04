"use client";

import { useState } from "react";
import { Award, BookOpen, Briefcase, Code2, GraduationCap, Home, Layers, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PORTFOLIO_PATH, portfolioHash } from "@/lib/site-paths";
import { cn } from "@/lib/utils";

const dockItems = [
  {
    id: "home",
    label: "Home",
    href: portfolioHash("hero"),
    Icon: Home,
    match: (path: string) => path === PORTFOLIO_PATH,
  },
  { id: "about", label: "About", href: portfolioHash("about"), Icon: User, match: () => false },
  { id: "experience", label: "Experience", href: portfolioHash("experience"), Icon: Briefcase, match: () => false },
  { id: "publications", label: "Papers", href: portfolioHash("publications"), Icon: BookOpen, match: () => false },
  { id: "education", label: "Education", href: portfolioHash("education"), Icon: GraduationCap, match: () => false },
  { id: "projects", label: "Projects", href: portfolioHash("projects"), Icon: Code2, match: () => false },
  { id: "stack", label: "Stack", href: portfolioHash("stack"), Icon: Layers, match: () => false },
  { id: "certifications", label: "Certs", href: portfolioHash("certifications"), Icon: Award, match: () => false },
];

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.12;
    if (distance === 1) return 1.06;
    return 1;
  };

  const getTranslateY = (index: number) => {
    if (hoveredIndex === null) return 0;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return -4;
    if (distance === 1) return -2;
    return 0;
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center print:hidden select-none pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
      <motion.nav
        className="pointer-events-auto glass inline-flex w-auto max-w-[min(52rem,calc(100vw-1.25rem-env(safe-area-inset-left)-env(safe-area-inset-right)))] shrink-0 items-center justify-center gap-1 overflow-visible rounded-full border border-border px-2 py-2 shadow-3 xs:gap-1.5 xs:px-2.5 sm:gap-2 sm:px-3 sm:py-2.5"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        aria-label="Section navigation"
      >
        {dockItems.map((item, index) => {
          const isActive = item.match(pathname);
          const Icon = item.Icon;
          return (
            <Link
              href={item.href}
              key={item.id}
              title={item.label}
              className="relative flex shrink-0 flex-col items-center outline-none ring-0 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <motion.div
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: getScale(index),
                  y: getTranslateY(index),
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors sm:size-12",
                  isActive
                    ? "border-secondary bg-secondary text-secondary-foreground shadow-sm"
                    : "border-border bg-surface text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                )}
              >
                <Icon className="size-[1.05rem] shrink-0 sm:size-[1.125rem]" strokeWidth={isActive ? 2.25 : 2} aria-hidden />
              </motion.div>
              <span
                className="pointer-events-none invisible absolute bottom-[calc(100%+0.35rem)] left-1/2 z-50 max-w-[min(100vw-1rem,16rem)] -translate-x-1/2 translate-y-0.5 rounded-md border border-border bg-surface-raised px-2 py-1 text-center text-caption font-medium text-foreground opacity-0 shadow-md transition-[opacity,visibility,transform] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 sm:whitespace-nowrap"
                role="tooltip"
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
