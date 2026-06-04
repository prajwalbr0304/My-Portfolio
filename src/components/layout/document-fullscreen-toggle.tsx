"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  isDocumentFullscreen,
  isFullscreenApiAvailable,
  toggleDocumentFullscreen,
} from "@/lib/document-fullscreen";
import { cn } from "@/lib/utils";

function subscribeFullscreen(cb: () => void) {
  document.addEventListener("fullscreenchange", cb);
  document.addEventListener("webkitfullscreenchange", cb as EventListener);
  return () => {
    document.removeEventListener("fullscreenchange", cb);
    document.removeEventListener("webkitfullscreenchange", cb as EventListener);
  };
}

function getFullscreenSnapshot() {
  return isDocumentFullscreen();
}

function getFullscreenServerSnapshot() {
  return false;
}

/**
 * Toggle browser fullscreen for the current document (like F11). Only works after a user click/tap —
 * browsers block fullscreen on automatic page load.
 */
export function DocumentFullscreenToggle({ className }: { className?: string }) {
  const [supported, setSupported] = useState(false);
  const fs = useSyncExternalStore(subscribeFullscreen, getFullscreenSnapshot, getFullscreenServerSnapshot);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSupported(isFullscreenApiAvailable());
  }, []);

  const onToggle = useCallback(async () => {
    if (!supported || busy) return;
    setBusy(true);
    try {
      await toggleDocumentFullscreen();
    } catch {
      /* user denied or API blocked */
    } finally {
      setBusy(false);
    }
  }, [supported, busy]);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={cn(
        "focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-edge p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground disabled:opacity-50",
        className,
      )}
      aria-pressed={fs}
      aria-label={fs ? "Exit fullscreen" : "Enter fullscreen"}
      title={fs ? "Exit fullscreen (Esc)" : "Enter fullscreen (F11-style). Browsers require a click — cannot run automatically on open."}
      disabled={busy}
      onClick={onToggle}
    >
      {fs ? <Minimize2 className="size-4 shrink-0" aria-hidden /> : <Maximize2 className="size-4 shrink-0" aria-hidden />}
    </button>
  );
}
