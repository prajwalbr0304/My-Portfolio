"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!spotlightRef.current) return;
      const x = e.clientX;
      const y = e.clientY;

      // Update CSS variables for responsive card backlights
      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);

      // Update global cursor spotlight position
      spotlightRef.current.style.transform = `translate3d(${x - 120}px, ${y - 120}px, 0)`;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 size-60 rounded-full bg-[radial-gradient(circle_at_center,rgba(155,220,255,0.06),transparent_70%)] blur-xl transition-opacity duration-normal print:hidden"
      style={{
        transform: "translate3d(-1000px, -1000px, 0)",
        willChange: "transform",
      }}
    />
  );
}
