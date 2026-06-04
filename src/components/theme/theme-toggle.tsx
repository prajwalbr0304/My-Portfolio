"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

const themeIcons = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const Icon = themeIcons[theme];

  return (
    <Button
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className="min-h-11 px-3"
      onClick={toggleTheme}
      title={`Theme: ${theme}`}
      type="button"
      variant="ghost"
    >
      <Icon aria-hidden="true" className="size-4" />
    </Button>
  );
}
