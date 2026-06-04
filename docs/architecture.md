# 2026 AI-Native Portfolio Modernization Plan

## 1. Full Folder Architecture

```txt
src/
  app/                         Next.js App Router, layouts, metadata, routes
    (marketing)/               Public portfolio surfaces
    (dashboard)/               Authenticated intelligence dashboard
    api/ai/                    Edge streaming endpoints
  components/
    ui/                        shadcn-style primitives
    motion/                    Reusable animation primitives
    layout/                    Shell, dock, command menu, navigation
  features/
    portfolio/                 Hero, case studies, metrics, storytelling
    ai-copilot/                Chat, streaming, memory, prompt actions
    dashboard/                 Analytics, leads, recruiter intent
    case-studies/              Interactive project narratives
    theme/                     Adaptive themes and personalization
  lib/                         Env, utilities, clients, auth, analytics
  server/                      Server actions, RSC data, AI orchestration
  db/                          Drizzle schema, migrations, queries
  styles/                      Token exports and global effects
```

## 2. System Architecture

The platform is RSC-first: static portfolio content is prerendered, dynamic islands stream through Suspense, and personalized AI/dashboard surfaces hydrate only where needed. Public routes use partial prerendering, API routes run at the edge when model/vendor constraints allow, and Supabase stores profile content, leads, recruiter events, copilot transcripts, and case-study telemetry.

## 3. Design System Architecture

Design tokens live in Tailwind v4 theme variables: color, depth, blur, motion timing, typography, radius, and focus states. Components are shadcn-style local primitives with strict accessibility contracts. The visual language uses editorial grid layouts, glass panels, ambient lighting, subtle noise, crisp typography, and restrained futuristic accents instead of decorative clutter.

## 4. State Management Plan

Server state belongs to RSC, Server Actions, and TanStack Query for client-side invalidation. Local ephemeral state uses Zustand for command menu, dock state, theme preference, copilot panel state, and cursor-reactive UI. Form state stays local unless it needs optimistic mutation.

## 5. API Architecture

Use route handlers for external callbacks and streaming AI. Use Server Actions for trusted mutations such as lead capture, project updates, dashboard preferences, and authenticated admin workflows. Public APIs are schema-validated, rate-limited, and typed at boundaries.

## 6. AI Architecture

AI routes stream by default. The copilot uses a tool registry for portfolio search, case-study summarization, recruiter briefing, resume tailoring, and contact intent capture. OpenAI handles high-quality reasoning and structured responses, Gemini supports multimodal/project asset understanding, Genkit can orchestrate flows, and Supabase stores durable memory with consent controls.

## 7. Component Architecture

Components are organized by ownership: generic UI primitives, layout primitives, and feature-specific components. RSC components fetch and compose. Client components handle motion, command interactions, streaming chat, and pointer effects. Each feature owns its data mappers, actions, tests, and UI.

## 8. Animation System

Motion is the default animation layer for component transitions, layout animations, entrance states, and reduced-motion-aware interactions. GSAP is reserved for scroll timelines that need precise orchestration. Three.js is used only for meaningful interactive hero or system-map visuals, not decorative weight.

## 9. SEO Architecture

Every route owns metadata through App Router metadata APIs. Case studies receive structured data, canonical URLs, Open Graph images, and keyword-rich but human copy. The platform generates recruiter-friendly summaries, project-specific metadata, sitemap entries, and fast share previews.

## 10. Performance Architecture

Default to static and streamed server rendering. Keep hero motion lightweight, split client islands, use responsive images, avoid unnecessary Three.js, preconnect only to critical origins, and enforce bundle budgets. TanStack Query caches client data, while PPR keeps the top-level experience instant.

## 11. Security Architecture

Secrets remain server-only. Supabase RLS protects all user, lead, and telemetry tables. Server Actions validate input and auth. AI endpoints enforce rate limits, prompt boundaries, logging redaction, and abuse controls. CSP, secure headers, and dependency scanning are deployment gates.

## 12. Accessibility Strategy

The target is WCAG AAA where practical: semantic landmarks, visible focus rings, high contrast, reduced-motion support, keyboard-first command menu, accessible dialogs, aria-live streaming regions, no text overlap, and interaction targets of at least 44px.

## 13. Deployment Strategy

Deploy on Vercel with preview environments, edge route monitoring, Supabase branches, environment-scoped secrets, Playwright smoke tests, type checks, and Lighthouse CI. AI vendor keys are scoped by environment.

## 14. Monorepo-Ready Structure

The app can move into `apps/web` with shared packages:

```txt
apps/web
packages/ui
packages/config
packages/db
packages/ai
packages/analytics
```

Shared packages should expose stable typed contracts while the app owns route composition and feature UX.

## 15. Future Scaling Strategy

Scale into a portfolio operating system: authenticated content studio, recruiter CRM, AI interview prep, analytics dashboard, project knowledge base, A/B-tested story variants, resume generation, and MCP-powered integrations with GitHub, LinkedIn, Notion, and calendars.

## Complete Implementation Plan

1. Scaffold Next.js 15, React 19, Tailwind v4, TypeScript, Motion, and local shadcn-style primitives.
2. Build the public portfolio shell with editorial grid, dock navigation, adaptive hero, glass surfaces, noise, ambient lighting, and reduced-motion handling.
3. Add feature modules for portfolio data, case studies, metrics, AI copilot, and dashboard foundations.
4. Implement streaming AI route handlers with edge runtime and provider abstraction.
5. Add Supabase client, Drizzle schema, RLS policies, and typed query layer.
6. Build dashboard routes for recruiter signals, lead capture, content analytics, and AI conversation history.
7. Add command menu, keyboard navigation, theme switcher, and accessible dialog primitives.
8. Create interactive case-study pages with scroll storytelling, diagrams, impact metrics, and AI summaries.
9. Add SEO metadata, sitemap, robots, OG image generation, JSON-LD, and canonical route strategy.
10. Add performance gates: bundle analysis, Lighthouse, image optimization, PPR validation, and edge route checks.
11. Add security gates: input validation, rate limiting, CSP, secret checks, and Supabase RLS tests.
12. Add Playwright visual and accessibility smoke tests across desktop and mobile.
13. Prepare monorepo extraction by isolating UI, DB, AI, config, and analytics contracts.
14. Deploy preview to Vercel, wire Supabase environments, and verify streaming AI with production secrets.
15. Iterate content polish: recruiter-specific stories, project evidence, metrics, testimonials, and clear calls to action.
