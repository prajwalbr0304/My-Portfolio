# Portfolio Design System 2026

## Identity

The system blends Vercel precision, Linear density, Raycast command surfaces, and Apple-like material depth. The aesthetic is AI-native, dark-first, restrained, luminous, and interface-led rather than decorative.

## Tailwind v4 Theme Architecture

Tailwind tokens are declared in `src/app/globals.css` with `@theme`. Runtime theme values are CSS variables on `:root` and `[data-theme="light"]`, allowing Tailwind utilities and custom classes to share the same semantic source.

Core token groups:
- Color: `background`, `foreground`, `surface`, `surface-raised`, `muted`, `subtle`, `border`, `primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `ring`
- Radius: `xs` through `3xl`, plus `full`
- Shadow: `hairline`, `1`, `2`, `3`, `4`, `glow`, `glow-strong`
- Blur: `xs` through `2xl`
- Motion: `instant`, `fast`, `normal`, `slow`, `cinematic`
- Easing: `standard`, `enter`, `exit`, `spring`
- Breakpoints: `xs`, Tailwind defaults, `3xl`

## CSS Variables

Runtime variables power adaptive theming:
- `--color-bg`, `--color-fg`, `--color-surface`, `--color-surface-raised`
- `--gradient-aurora`, `--gradient-mesh`, `--gradient-panel`, `--gradient-hairline`
- `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-saturation`
- `--space-page`, `--space-section`, `--container-xl`
- `--duration-*`, `--ease-*`

## Typography

Reusable classes:
- `.text-display`: hero-scale portfolio statement
- `.text-headline`: section headlines
- `.text-title`: card and panel titles
- `.text-body`: readable narrative copy
- `.text-caption`: metadata and labels

All typography uses zero letter spacing and responsive `clamp()` sizing without viewport-width-only scaling.

## Layout

Reusable classes:
- `.container-page`: centered max-width content with responsive gutters
- `.section-space`: large vertical rhythm
- `designSystem.layout.editorialGrid`: asymmetric storytelling grid
- `designSystem.layout.bentoGrid`: responsive metric/project grid
- `designSystem.layout.dashboardGrid`: 12-column dashboard foundation

## Materials

Reusable classes:
- `.surface`: solid semantic surface
- `.surface-raised`: higher hierarchy surface
- `.glass`: default glass material
- `.glass-strong`: cinematic elevated glass
- `.noise`: local noise overlay
- `.mesh-bg`: ambient background mesh

## Motion

Typed presets live in `src/lib/motion.ts`:
- `motionDurations`
- `motionEasing`
- `motionTransitions`
- `animationPresets`
- `scrollAnimationPresets`
- `pointerSpring`

CSS scroll presets:
- `.scroll-fade-up`
- `@keyframes fade-up`
- `@keyframes ambient-shift`

Reduced-motion preferences are respected globally.

## Components

Reusable primitives:
- `Button`: primary, ghost, subtle
- `Surface`: flat, raised, glass, strong
- `Badge`: neutral, primary, secondary, accent
- `ThemeProvider`: dark, light, system support
- `ThemeToggle`: accessible adaptive theme control

## Accessibility

The system uses semantic foreground/background variables, high-contrast dark and light palettes, visible focus rings, 44px interactive targets, reduced-motion support, document-level color scheme updates, and text sizing designed to prevent overflow in compact UI.
