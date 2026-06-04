export function themeInitScript() {
  return `
    (() => {
      try {
        const stored = localStorage.getItem("portfolio-theme");
        const theme =
          stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
        const resolved =
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: light)").matches
              ? "light"
              : "dark"
            : theme;
        document.documentElement.dataset.theme = resolved;
        document.documentElement.style.colorScheme = resolved;
      } catch {
        document.documentElement.dataset.theme = "dark";
        document.documentElement.style.colorScheme = "dark";
      }
    })();
  `;
}
