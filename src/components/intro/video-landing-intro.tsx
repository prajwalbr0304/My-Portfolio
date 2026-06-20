"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { NameScrambleIntro } from "@/components/intro/name-scramble-intro";
import { profile } from "@/features/portfolio/data";
import {
  INTRO_DISMISSED_SESSION_KEY,
  isDocumentReload,
  releasePortfolioIntroScrollLock,
} from "@/lib/intro-scroll-bootstrap";
import { useDocumentTheme } from "@/components/theme/use-document-theme";
import { cn } from "@/lib/utils";

/** Bundled landing clip — replace `public/videos/landing-output.mp4` to change the intro. */
const DEFAULT_VIDEO_SRC = "/videos/landing-output.mp4";

/** Hero-style name line (edit if you want it to differ from `profile.name`). */
const INTRO_DISPLAY_NAME = "PRAJWAL BR";

function landingVideoSrc() {
  const fromEnv = process.env.NEXT_PUBLIC_LANDING_VIDEO_URL;
  return fromEnv?.trim() || DEFAULT_VIDEO_SRC;
}

const PLAYBACK_RATE = 1.5;

const EXIT_FADE_MS = 0.65;

type Phase = "title" | "video";

function readInitialReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Phones / touch devices skip the cinematic intro and open the portfolio directly. */
function readInitialMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

/** Align with bootstrap: reload clears flag; otherwise reuse session so in-tab return to `/` skips intro. */
function readInitialDismissed(): boolean {
  if (typeof window === "undefined") return false;
  if (isDocumentReload()) {
    try {
      sessionStorage.removeItem(INTRO_DISMISSED_SESSION_KEY);
    } catch {
      /* ignore */
    }
    return false;
  }
  try {
    return sessionStorage.getItem(INTRO_DISMISSED_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function persistIntroDismissed() {
  try {
    sessionStorage.setItem(INTRO_DISMISSED_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Name scramble → fullscreen video → `exitHref` (usually `/portfolio`).
 * Intended for **`/`** only: first paint reads `sessionStorage` so returning to `/` in the same tab without a reload
 * skips the splash; a full **reload** on `/` clears the flag (bootstrap + `readInitialDismissed`) so the intro replays.
 */
export function VideoLandingIntro({ exitHref }: { exitHref: string }) {
  const router = useRouter();
  const docTheme = useDocumentTheme();
  const isLightIntro = docTheme === "light";
  const redirectedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion] = useState(readInitialReduceMotion);
  const [isMobile] = useState(readInitialMobile);
  const [dismissed, setDismissed] = useState(readInitialDismissed);
  const [introActive, setIntroActive] = useState(true);
  const [phase, setPhase] = useState<Phase>("title");

  /** Skip the intro (go straight to the portfolio) for reduced-motion users and on phones/touch. */
  const skipIntro = reduceMotion || isMobile;

  const goExit = useCallback(() => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    router.replace(exitHref);
  }, [router, exitHref]);

  const src = landingVideoSrc();
  const subtitle = profile.tagline.toUpperCase();

  const requestDismiss = useCallback(() => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      void document.exitFullscreen?.().catch(() => {});
    }
    videoRef.current?.pause();
    persistIntroDismissed();
    setIntroActive(false);
  }, []);

  const onTitleComplete = useCallback(() => {
    setPhase("video");
  }, []);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (!skipIntro && !dismissed) return;
    releasePortfolioIntroScrollLock();
    persistIntroDismissed();
    goExit();
  }, [skipIntro, dismissed, goExit]);

  const showSequence = !skipIntro && !dismissed;
  const lockDocumentScroll = !dismissed && !skipIntro;

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (!lockDocumentScroll) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      releasePortfolioIntroScrollLock();
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, [lockDocumentScroll]);

  useEffect(() => {
    if (!showSequence) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [showSequence, src]);

  /** Lock page zoom during intro (pinch / ctrl+wheel / shortcuts). Restored when intro ends. */
  useEffect(() => {
    if (!showSequence) return;

    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    const prevViewport = meta.getAttribute("content") ?? "";
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
    );

    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const blockGesture = (e: Event) => {
      e.preventDefault();
    };
    const blockKeyZoom = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      if (
        e.code === "Equal" ||
        e.code === "Minus" ||
        e.code === "NumpadAdd" ||
        e.code === "NumpadSubtract" ||
        e.code === "Digit0"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", blockWheel, { passive: false });
    document.addEventListener("gesturestart", blockGesture);
    document.addEventListener("gesturechange", blockGesture);
    window.addEventListener("keydown", blockKeyZoom);

    return () => {
      if (prevViewport) meta?.setAttribute("content", prevViewport);
      else
        meta?.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
        );
      document.removeEventListener("wheel", blockWheel);
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      window.removeEventListener("keydown", blockKeyZoom);
    };
  }, [showSequence]);

  useEffect(() => {
    if (!showSequence) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSequence, requestDismiss]);

  useEffect(() => {
    const el = videoRef.current;
    if (!showSequence || phase !== "video" || !el) return;

    const applyRate = () => {
      el.playbackRate = PLAYBACK_RATE;
    };

    el.addEventListener("loadedmetadata", applyRate);
    applyRate();
    el.muted = true;
    el.defaultPlaybackRate = PLAYBACK_RATE;
    void el.play().catch(() => {});

    return () => {
      el.removeEventListener("loadedmetadata", applyRate);
    };
  }, [showSequence, phase]);

  if (skipIntro || dismissed) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        persistIntroDismissed();
        flushSync(() => {
          setDismissed(true);
        });
        releasePortfolioIntroScrollLock();
      }}
    >
      {introActive ? (
        <motion.div
          key="landing-intro-shell"
          role="presentation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_FADE_MS, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex min-h-[100svh] h-[100dvh] max-h-[100dvh] w-full max-w-none touch-none flex-col overflow-hidden overscroll-none bg-black print:hidden isolate"
        >
          <video
            ref={videoRef}
            className={cn(
              "pointer-events-none absolute inset-0 box-border h-full min-h-0 w-full min-w-0 object-cover object-center will-change-transform [transform:translateZ(0)] transition-opacity duration-500 ease-out",
              phase === "title" ? "opacity-0" : "opacity-100",
            )}
            src={src}
            playsInline
            muted
            preload="auto"
            disablePictureInPicture
            onEnded={requestDismiss}
            onError={() => {
              console.warn("[VideoLandingIntro] Video failed to load; opening portfolio.");
              requestDismiss();
            }}
          />

          <AnimatePresence>
            {phase === "title" ? (
              <motion.div
                key="title-sheet"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                className={cn(
                  "absolute inset-0 z-10 flex flex-col",
                  isLightIntro ? "bg-white text-neutral-900" : "mesh-bg bg-background text-foreground",
                )}
              >
                <NameScrambleIntro
                  text={INTRO_DISPLAY_NAME}
                  subtitle={subtitle}
                  variant={isLightIntro ? "light" : "dark"}
                  onComplete={onTitleComplete}
                />
                <div className="pointer-events-none absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] flex justify-end pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:pl-4 sm:pr-4">
                  <button
                    type="button"
                    className={cn(
                      "pointer-events-auto focus-ring min-h-11 min-w-[2.75rem] rounded-full px-4 py-2 text-xs font-medium shadow-sm transition sm:text-sm",
                      isLightIntro
                        ? "border border-neutral-200 bg-white/90 text-neutral-600 hover:text-neutral-900 focus-visible:text-neutral-900"
                        : "border border-border bg-muted/40 text-muted-foreground hover:bg-muted/55 hover:text-foreground focus-visible:text-foreground",
                    )}
                    onClick={requestDismiss}
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {phase === "video" ? (
            <div className="pointer-events-none absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex justify-end pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:pl-4 sm:pr-4">
              <button
                type="button"
                className="pointer-events-auto focus-ring min-h-11 min-w-[2.75rem] rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:text-white focus-visible:text-white focus-visible:ring-white/40 sm:text-sm"
                onClick={requestDismiss}
              >
                Skip
              </button>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
