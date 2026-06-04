# `public/logos`

SVG marks for the **certifications list**, **stack grid**, and **certificate print layouts**.

- Most technology icons are sourced from **[Devicon](https://github.com/devicons/devicon)** (MIT) and stored locally for offline use and consistent rendering.
- **AWS** tile uses the project’s branded-style mark (`aws.svg`).
- **Next.js** uses a line mark: `nextjs.svg` (dark glyph, light UI) and `nextjs-dark.svg` (light glyph, dark UI) via `urlDark` in `data.ts` — avoids CSS `invert` breaking gradient/circle artwork.
- **Solidity** uses paired prisms: `solidity.svg` / `solidity-dark.svg` with explicit slate fills (Devicon’s default used opacity-only paths that disappeared on dark cards).
- **Flask** (black ink artwork) uses `invertInDark` so the mark reads on dark `bg-card`.
- **Google “G”** (`stitch.svg`) uses Google’s product icon geometry from `fonts.gstatic.com` (multicolor, works on light and dark cards).
- **Udemy** list thumbnails use `udemy.svg` (tile + “U” mark); printable certificate headers use `udemy-wordmark.svg`.
- **OpenAI** uses a single full-color mark in `openai.svg` (user-provided artwork; no `urlDark` — same asset in light and dark stack tiles).

Stack grid logos use `ThemeAwareLogo`, which reads **`useTheme().resolvedTheme`** (same as `html[data-theme]`) to choose `url` vs `urlDark` and to apply `invertInDark` — not stacked `dark:hidden` images, so light and dark modes stay in sync after hydration.
