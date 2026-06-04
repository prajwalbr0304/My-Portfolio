import type { Metadata } from "next";
import { LandingClient } from "@/components/intro/landing-client";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Portfolio intro — Prajwal B R.",
};

/** Cinematic intro only on `/`. Scroll-lock bootstrap lives in root `layout.tsx` (runs before paint). */
export default function Home() {
  return <LandingClient />;
}
