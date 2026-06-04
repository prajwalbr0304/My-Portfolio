"use client";

import { useLayoutEffect, useState } from "react";
import { VideoLandingIntro } from "@/components/intro/video-landing-intro";
import { PORTFOLIO_PATH } from "@/lib/site-paths";

/**
 * Intro on `/` only. Pre-hydration background is handled by `html[data-portfolio-intro-lock]` + `data-theme`
 * in `globals.css` (no extra div — avoids a dark flash in light mode after reload).
 */
export function LandingClient() {
  const [clientReady, setClientReady] = useState(false);

  useLayoutEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady) {
    return null;
  }

  return <VideoLandingIntro exitHref={PORTFOLIO_PATH} />;
}
