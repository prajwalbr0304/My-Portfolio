"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { featuredProjects } from "@/features/portfolio/data";
import { PanelSection } from "./panel-section";
import { ProjectMedia } from "./project-media";

const categories = ["All", ...Array.from(new Set(featuredProjects.map((p) => p.category)))];

type ProjectList = typeof featuredProjects;

type CarouselState = { projectIndex: number; imageIndex: number };

type CarouselAction =
  | { type: "tick"; list: ProjectList }
  | { type: "sync"; projectIndex: number; imageIndex: number };

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  if (action.type === "sync") {
    return { projectIndex: action.projectIndex, imageIndex: action.imageIndex };
  }

  const list = action.list;
  if (list.length === 0) return state;

  const { projectIndex: p, imageIndex: i } = state;
  const safeP = Math.min(p, list.length - 1);
  const project = list[safeP];
  const imgLen = project?.images?.length ?? 0;

  if (imgLen === 0) {
    return { projectIndex: (safeP + 1) % list.length, imageIndex: 0 };
  }

  if (i < imgLen - 1) {
    return { projectIndex: safeP, imageIndex: i + 1 };
  }

  return { projectIndex: (safeP + 1) % list.length, imageIndex: 0 };
}

const SLIDE_MS = 3000;

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [carousel, dispatch] = useReducer(carouselReducer, { projectIndex: 0, imageIndex: 0 });

  const filtered = useMemo(() => {
    if (activeCategory === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const { projectIndex, imageIndex } = carousel;
  const activeProject = filtered[projectIndex] ?? filtered[0];
  const gridProjects = showAll ? filtered : filtered.slice(0, 4);
  const stripRef = useRef<HTMLDivElement>(null);
  const [scrollEdges, setScrollEdges] = useState({ canLeft: false, canRight: false, overflow: false });

  const updateScrollEdges = useMemo(
    () => () => {
      const el = stripRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const max = Math.max(0, scrollWidth - clientWidth);
      const overflow = scrollWidth > clientWidth + 2;
      setScrollEdges({
        overflow,
        canLeft: overflow && scrollLeft > 6,
        canRight: overflow && scrollLeft < max - 6,
      });
    },
    [],
  );

  useEffect(() => {
    updateScrollEdges();
    const el = stripRef.current;
    if (!el) return;
    const onScroll = () => updateScrollEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => updateScrollEdges());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [filtered, updateScrollEdges]);

  function scrollChips(direction: -1 | 1) {
    const el = stripRef.current;
    if (!el) return;
    const delta = direction * Math.min(320, Math.max(180, el.clientWidth * 0.55));
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  useEffect(() => {
    dispatch({ type: "sync", projectIndex: 0, imageIndex: 0 });
  }, [activeCategory]);

  useEffect(() => {
    if (filtered.length === 0) return;
    const id = window.setInterval(() => {
      dispatch({ type: "tick", list: filtered });
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [filtered]);

  return (
    <PanelSection
      id="projects"
      title="Projects"
      description="Selected work across blockchain, AI, and full-stack applications."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCategory(cat);
              setShowAll(false);
            }}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === cat
                ? "border-secondary bg-secondary/15 text-foreground"
                : "border-edge text-muted-foreground hover:border-secondary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeProject ? (
        <article className="overflow-hidden rounded-2xl border border-edge bg-card/50 shadow-2">
          <ProjectMedia
            images={activeProject.images}
            title={activeProject.title}
            imageIndex={imageIndex}
            onImageIndexChange={(next) =>
              dispatch({ type: "sync", projectIndex, imageIndex: next })
            }
            className="max-h-[clamp(220px,42vh,440px)]"
          />
          <div className="space-y-4 p-4 sm:p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-caption-size font-medium uppercase tracking-wide text-secondary">
                  {activeProject.category}
                </p>
                <h3 className="mt-1 text-xl font-semibold md:text-2xl">{activeProject.title}</h3>
              </div>
              <span className="shrink-0 rounded-full border border-edge px-2.5 py-1 text-caption-size text-muted-foreground">
                {activeProject.metric}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {activeProject.summary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-edge bg-muted/50 px-2 py-0.5 text-caption-size text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={activeProject.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                View repository
                <ArrowUpRight className="size-3.5" />
              </a>
              {activeProject.demoUrl ? (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/10 px-4 py-2 text-sm font-medium text-foreground transition hover:border-secondary hover:bg-secondary/20"
                >
                  <PlayCircle className="size-4 text-secondary" />
                  View demo video
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ) : null}

      {filtered.length > 1 ? (
        <div className="mt-4 rounded-2xl border border-edge bg-muted/20 p-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Scroll project list left"
              disabled={!scrollEdges.overflow || !scrollEdges.canLeft}
              onClick={() => scrollChips(-1)}
              className="focus-ring flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-edge bg-background/90 text-muted-foreground shadow-sm transition hover:border-secondary/40 hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-11"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div
              ref={stripRef}
              role="tablist"
              aria-label="Select a project"
              className="flex min-h-11 min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filtered.map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  role="tab"
                  aria-selected={i === projectIndex}
                  data-project-index={i}
                  onClick={(e) => {
                    dispatch({ type: "sync", projectIndex: i, imageIndex: 0 });
                    e.currentTarget.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
                  }}
                  className={`snap-start shrink-0 rounded-xl border px-3 py-2.5 text-left text-sm transition sm:min-h-[3.25rem] sm:px-3.5 ${
                    i === projectIndex
                      ? "border-secondary bg-secondary/15 text-foreground shadow-sm ring-1 ring-secondary/25"
                      : "border-edge bg-background/60 text-muted-foreground hover:border-secondary/30 hover:bg-card hover:text-foreground"
                  }`}
                >
                  <span className="block max-w-[11rem] truncate font-medium sm:max-w-[13rem]">{project.title}</span>
                  <span className="mt-0.5 block text-caption-size text-muted-foreground">{project.category}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Scroll project list right"
              disabled={!scrollEdges.overflow || !scrollEdges.canRight}
              onClick={() => scrollChips(1)}
              className="focus-ring flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-edge bg-background/90 text-muted-foreground shadow-sm transition hover:border-secondary/40 hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-11"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 min-[480px]:gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {gridProjects.map((project) => {
          const idx = filtered.indexOf(project);
          const isActive = idx === projectIndex;
          return (
            <div
              key={project.title}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => dispatch({ type: "sync", projectIndex: idx, imageIndex: 0 })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  dispatch({ type: "sync", projectIndex: idx, imageIndex: 0 });
                }
              }}
              className={`focus-ring group cursor-pointer overflow-hidden rounded-xl border text-left transition outline-none ${
                isActive
                  ? "border-secondary/60 bg-secondary/5 ring-1 ring-secondary/30"
                  : "border-edge bg-card/30 hover:border-secondary/30 hover:bg-card/50"
              }`}
            >
              <ProjectMedia
                images={project.images}
                title={project.title}
                imageIndex={0}
                onImageIndexChange={() => {}}
                autoPlayMs={SLIDE_MS + (idx % 5) * 350}
                className="aspect-[16/10] rounded-none border-0"
              />
              <div className="space-y-1 p-4">
                <p className="text-caption-size uppercase tracking-wide text-secondary">{project.category}</p>
                <h4 className="font-semibold leading-snug group-hover:text-secondary">{project.title}</h4>
                <p className="line-clamp-2 text-caption-size leading-relaxed text-muted-foreground">{project.summary}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 4 ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="rounded-full border border-edge px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-secondary/40 hover:text-foreground"
          >
            {showAll ? "Show fewer" : `View all ${filtered.length} projects`}
          </button>
        </div>
      ) : null}
    </PanelSection>
  );
}
