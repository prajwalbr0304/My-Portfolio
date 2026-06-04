export const designSystem = {
  themes: ["dark", "light", "system"] as const,
  typography: {
    display: "text-display text-balance",
    headline: "text-headline text-balance",
    title: "text-title text-balance",
    body: "text-body text-pretty",
    caption: "text-caption",
  },
  radius: {
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  },
  elevation: {
    flat: "shadow-hairline",
    raised: "shadow-2",
    floating: "shadow-3",
    cinematic: "shadow-4",
    glow: "shadow-glow",
    halo: "shadow-glow-strong",
  },
  glass: {
    subtle: "glass",
    strong: "glass-strong",
    interactive: "glass interactive",
  },
  layout: {
    page: "container-page",
    section: "section-space",
    editorialGrid: "grid gap-6 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)]",
    bentoGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
    dashboardGrid: "grid gap-4 lg:grid-cols-12",
  },
  gradients: {
    aurora: "gradient-aurora",
    mesh: "gradient-mesh",
    backgroundMesh: "mesh-bg",
    hairlineTop: "hairline-top",
  },
  interaction: {
    focus: "focus-ring",
    base: "interactive",
    disabled: "disabled:pointer-events-none disabled:opacity-50",
  },
} as const;

export type ThemeMode = (typeof designSystem.themes)[number];
