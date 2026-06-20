"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectMediaProps = {
  images: string[];
  title: string;
  imageIndex: number;
  onImageIndexChange: (index: number) => void;
  className?: string;
  /**
   * When set (ms) and there are 2+ images, cycles slides on a timer (grid cards).
   * Parent `imageIndex` / `onImageIndexChange` are ignored until autoplay is off.
   */
  autoPlayMs?: number;
  /**
   * `auto` (default): pick `cover` vs `contain` from intrinsic size + frame aspect so small
   * assets fill the card and large mismatched screenshots stay uncropped.
   * `cover` / `contain` force that mode.
   */
  imageFit?: "auto" | "cover" | "contain";
};

/** How `object-fit` is applied to the slide image. */
type ObjectFitMode = "cover" | "contain";

/**
 * Prefer cover when the source is smaller than the slot (upscale to fill) or when aspect
 * ratios almost match (little cropping). Otherwise contain avoids chopping tall/wide UIs.
 */
function pickObjectFit(
  boxW: number,
  boxH: number,
  naturalW: number,
  naturalH: number,
): ObjectFitMode {
  if (naturalW <= 0 || naturalH <= 0 || boxW <= 0 || boxH <= 0) return "contain";

  const imageAr = naturalW / naturalH;
  const boxAr = boxW / boxH;
  const arRatio = imageAr / boxAr;
  // Within ~±14% aspect → cover fills with light crop
  if (arRatio > 1 / 1.14 && arRatio < 1.14) return "cover";

  // Bitmap smaller than frame in both directions → upscale with cover (no “postage stamp”)
  if (naturalW < boxW * 0.9 && naturalH < boxH * 0.9) return "cover";

  return "contain";
}

export function ProjectMedia({
  images,
  title,
  imageIndex: controlledIndex,
  onImageIndexChange,
  className,
  autoPlayMs,
  imageFit = "auto",
}: ProjectMediaProps) {
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [internalIndex, setInternalIndex] = useState(0);
  const [resolvedFit, setResolvedFit] = useState<ObjectFitMode>("contain");
  const boxRef = useRef<HTMLDivElement>(null);
  const naturalRef = useRef({ w: 0, h: 0 });

  const autoplay =
    typeof autoPlayMs === "number" && autoPlayMs > 0 && images.filter(Boolean).length > 1;
  const imageIndex = autoplay ? internalIndex : controlledIndex;

  const src = images[imageIndex] ?? images[0];
  const slideCount = images.filter(Boolean).length;
  const hasSlides = slideCount > 1;
  const showPlaceholder = !src || failed[imageIndex];

  const recomputeAutoFit = useCallback(() => {
    if (imageFit !== "auto") return;
    const el = boxRef.current;
    const { w: nw, h: nh } = naturalRef.current;
    if (!el || !nw || !nh) return;
    setResolvedFit(pickObjectFit(el.clientWidth, el.clientHeight, nw, nh));
  }, [imageFit]);

  useEffect(() => {
    setFailed({});
  }, [title, images]);

  useEffect(() => {
    setInternalIndex(0);
  }, [title, images]);

  useLayoutEffect(() => {
    if (imageFit !== "auto") return;
    naturalRef.current = { w: 0, h: 0 };
    setResolvedFit("contain");
  }, [imageFit, src, imageIndex]);

  useLayoutEffect(() => {
    if (imageFit !== "auto") return;
    const el = boxRef.current;
    if (!el) return;
    recomputeAutoFit();
    const ro = new ResizeObserver(() => recomputeAutoFit());
    ro.observe(el);
    return () => ro.disconnect();
  }, [imageFit, recomputeAutoFit, src, imageIndex]);

  useEffect(() => {
    if (!autoplay || !autoPlayMs) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const n = images.length;
    const id = window.setInterval(() => {
      setInternalIndex((i) => (i + 1) % n);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoplay, autoPlayMs, images]);

  function goToSlide(i: number) {
    if (autoplay) setInternalIndex(i);
    else onImageIndexChange(i);
  }

  function onImageLoad(img: HTMLImageElement) {
    naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight };
    recomputeAutoFit();
  }

  const effectiveFit: ObjectFitMode =
    imageFit === "auto" ? resolvedFit : imageFit === "cover" ? "cover" : "contain";

  return (
    <div
      ref={boxRef}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden bg-muted dark:bg-muted/40",
        className,
      )}
    >
      {showPlaceholder ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, color-mix(in oklab, var(--color-fg) 12%, transparent) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <ImageIcon className="size-8 text-muted-foreground/60" aria-hidden />
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-caption-size text-muted-foreground/70">Preview coming soon</p>
          </div>
        </>
      ) : (
        <Image
          key={src}
          src={src}
          alt={`${title} screenshot ${imageIndex + 1}`}
          fill
          className={cn(
            "relative z-10",
            effectiveFit === "contain"
              ? "object-contain object-center"
              : "object-cover object-center",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1536px) min(90vw, 1280px), 1440px"
          onLoad={(e) => onImageLoad(e.currentTarget)}
          onError={() => setFailed((prev) => ({ ...prev, [imageIndex]: true }))}
        />
      )}
      {hasSlides && !showPlaceholder ? (
        slideCount > 8 ? (
          // Many images → compact counter (dots would overflow on small cards)
          <div
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-caption-size font-medium tabular-nums text-foreground shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {imageIndex + 1} / {slideCount}
          </div>
        ) : (
          <div
            className="absolute bottom-3 left-1/2 z-20 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-wrap justify-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2 py-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === imageIndex
                    ? "w-4 bg-secondary"
                    : "w-1.5 bg-foreground/25 hover:bg-foreground/45 dark:bg-white/35 dark:hover:bg-white/55",
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
