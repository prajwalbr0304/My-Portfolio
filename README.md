
<h1 align="center">AI Portfolio</h1>

<p align="center">
  <strong>Next.js 15</strong> · <strong>React 19</strong> · <strong>Tailwind CSS v4</strong> · <strong>TypeScript</strong><br />
  Cinematic landing, streaming portfolio copilot, publications, certificates, and a dedicated <strong>CV hub</strong>.
</p>

<p align="center">
  <a href="#highlights"><strong>Highlights</strong></a>
  &nbsp;·&nbsp;
  <a href="#routes"><strong>Routes</strong></a>
  &nbsp;·&nbsp;
  <a href="#tech-stack"><strong>Tech stack</strong></a>
  &nbsp;·&nbsp;
  <a href="#getting-started"><strong>Getting started</strong></a>
  &nbsp;·&nbsp;
  <a href="#scripts"><strong>Scripts</strong></a>
  &nbsp;·&nbsp;
  <a href="#security"><strong>Security</strong></a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-087EA4?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=0f172a" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

---

## Highlights

| Area | What you get |
| --- | --- |
| **Experience** | Video + name intro, mesh background, floating dock, theme-aware stack logos |
| **Portfolio** | Projects with media carousels, experience timeline, education, publications |
| **AI** | Edge `/api/ai` streaming assistant with scope + safety checks; local fallback without API keys |
| **CV** | **`/cv`** — fancy + ATS PDFs side-by-side on large screens, stacked on mobile, with open-in-new-tab links |
| **Credentials** | **`/certificates/[ref]`** — printable HTML layouts (demo artwork, not issuer PDFs) |
| **OrderHub** | **`/orderhub`** — internship narrative page |

Design direction: crisp dark UI, accessible focus rings, safe-area aware layout, and motion that respects reduced motion.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Redirects (308) to **`/portfolio`** |
| `/portfolio` | Main portfolio (hash sections: `#hero`, `#about`, …) |
| `/cv` | Dual PDF résumé hub (paths from `profile` in `data.ts`) |
| `/certificates/...` | Per-credential printable views |
| `/orderhub` | Nokia OHUB internship overview |
| `/api/ai` | Streaming portfolio assistant |
| `/api/github` | GitHub signals (optional token for higher rate limits) |

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19  
- **Styling:** Tailwind CSS v4, semantic tokens in `globals.css`  
- **Motion:** Motion for React  
- **AI:** Vercel AI SDK patterns, OpenAI / Gemini env keys optional  
- **Content:** Feature-based modules under `src/features/portfolio` and `src/features/ai-copilot`

### Source layout

```txt
src/
  app/                 App Router pages, API routes, metadata
  components/          Shared UI, intro, layout, theme
  features/
    portfolio/         Data, sections, CV hub, certificates
    ai-copilot/        Copilot UI, store, local orchestrator
  lib/                 env, utils, AI safety, theme bootstrap
public/
  documents/           PDF résumés + publication PDFs
  images/              Profile, logos, project shots
  logos/               Stack SVGs (light/dark where needed)
  videos/              Landing clip
latex/                 Résumé sources + build script (optional)
scripts/               Avatar sync, AI safety tests
```

More detail: [`docs/architecture.md`](./docs/architecture.md) · [`docs/design-system.md`](./docs/design-system.md)

## Getting started

```bash
git clone https://github.com/PRAJWAL-BR-0304/AI_Portfolio.git
cd AI_Portfolio
npm install
cp .env.example .env.local   # optional; see Security below
npm run dev
```

Open **http://127.0.0.1:3000/portfolio** (root `/` redirects there; use the URL Next prints with `/portfolio`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (Next) |
| `npm run resume:build` | Compile LaTeX résumés → `public/documents/` (Windows PowerShell) |
| `npm run sync:github-avatar` | Download GitHub avatar → `public/images/profile.jpg` |
| `npm run test:ai-safety` | Node tests for copilot guardrails |

## Environment variables

Copy **`.env.example`** → **`.env.local`** for local overrides. Typical keys:

| Variable | Role |
| --- | --- |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` | Live AI streaming (omit for built-in fallback copy) |
| `GITHUB_TOKEN` | Optional: higher GitHub API rate limits for `/api/github` |
| `GITHUB_USERNAME` | Repo owner for GitHub features |
| `GITHUB_PROFILE_LOGIN` | Optional: avatar sync login if different from username |
| `NEXT_PUBLIC_LANDING_VIDEO_URL` | Optional: override intro video URL |

## Security

- **Never commit** `.env`, `.env.local`, or any file that contains real API keys or tokens. They are listed in `.gitignore`.
- Keep **`.env.example`** free of real secrets — placeholders only.
- `scripts/` and `src/app/api/**` read configuration from **environment variables** only; there are no embedded production keys in the repo.
- If a key was ever pasted into chat, a ticket, or a screenshot, **rotate it** in the provider dashboard (GitHub, Google AI, OpenAI, etc.).

## Author

**Prajwal B R** — full-stack & AI developer.  
Portfolio: [prajwalbr.netlify.app/portfolio](https://prajwalbr.netlify.app/portfolio)
