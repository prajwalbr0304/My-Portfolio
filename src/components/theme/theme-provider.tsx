"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ThemeMode } from "@/lib/design-system";

type ResolvedTheme = "dark" | "light";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  if (theme !== "system") return theme;

  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const didReadStorage = useRef(false);

  /**
   * Before paint: sync `document.documentElement` from `localStorage`, then keep it aligned with `theme`.
   * On the first run, if storage differs from the initial `dark` placeholder state, we `setThemeState` and
   * return so the next commit applies — avoids applying `resolveTheme("dark")` over the head script’s light.
   */
  useLayoutEffect(() => {
    let mode: ThemeMode = theme;

    if (!didReadStorage.current) {
      didReadStorage.current = true;
      const stored = window.localStorage.getItem("portfolio-theme") as ThemeMode | null;
      if (stored === "dark" || stored === "light" || stored === "system") {
        mode = stored;
        if (mode !== theme) {
          setThemeState(mode);
          return;
        }
      }
    }

    const resolved = resolveTheme(mode);
    setResolvedTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const listener = () => {
      if (theme !== "system") return;
      const resolved = resolveTheme("system");
      setResolvedTheme(resolved);
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme(nextTheme) {
        setThemeState(nextTheme);
        window.localStorage.setItem("portfolio-theme", nextTheme);
      },
      toggleTheme() {
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        setThemeState(nextTheme);
        window.localStorage.setItem("portfolio-theme", nextTheme);
      },
    }),
    [resolvedTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
