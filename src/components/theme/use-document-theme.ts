"use client";

import { useSyncExternalStore } from "react";

/** Resolved `data-theme` on `<html>` (`light` | `dark`), including after `themeInitScript` / ThemeProvider. */
export function useDocumentTheme(): "light" | "dark" {
  return useSyncExternalStore(
    (onStoreChange) => {
      const el = document.documentElement;
      const mo = new MutationObserver(() => onStoreChange());
      mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
      return () => mo.disconnect();
    },
    () => (document.documentElement.dataset.theme === "light" ? "light" : "dark"),
    () => "dark",
  );
}
