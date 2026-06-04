# Résumé (LaTeX)

- **`Prajwal_BR_Resume.tex`** --- Visual/portfolio version: mirrors `src/features/portfolio/data.ts` where relevant; cyan boxed links; profile photo; Nokia/DSU logos; TikZ GitHub badge beside **Personal projects**; **Netlify portfolio** as one cyan-framed chip (**PB** + “My Portfolio”, single link).
- **`Prajwal_BR_Resume_ATS.tex`** --- **Inter** via CTAN **`inter`** (`[sfdefault,scaled=0.96]` + `T1`); Tectonic bundles Inter OTFs (using **`fontspec` + `\setmainfont{Inter}`** alone requires Inter installed system-wide). **0.6pt rule first**, then section title, then body (`\atsection`). **`metagray`** (`HTML #454545`, readable on gray panels) for dates, tech rows, skill labels, header links, certs. **`gray!10`** project cards (linked title + metagray stack with `$\cdot$`); **`gray!7`** skills panel. **Section order:** Summary → Education → Experience → Technical skills → **Publications → Projects** → Certifications → Languages. Header portfolio: text-only **My Portfolio** → `prajwalbr.netlify.app` (no PB mark). Outputs `prajwal-b-r-resume-ats.pdf`.

## Build to PDF (recommended: Tectonic)

From the **repository root**:

```bash
npm run resume:build
```

This script:

1. Downloads [Tectonic](https://tectonic-typesetting.org/) into `latex/.tectonic/` if missing (no admin rights; first run downloads TeX packages from the network).
2. Compiles `Prajwal_BR_Resume.tex`.
3. Copies the portfolio PDF to `public/documents/prajwal-b-r-resume.pdf` (the path used by the site’s CV button).
4. If `Prajwal_BR_Resume_ATS.tex` is present, compiles it and copies `public/documents/prajwal-b-r-resume-ats.pdf` (plain layout: no photo; header links are text-only framed chips, including **My Portfolio** → Netlify without a PB mark).

You can also run `latex/build-resume.ps1` directly from PowerShell.

### Cyan “boxed” links (how it works)

Links are not only blue text: each URL is wrapped in `\fcolorbox` (see `\linkbox`, `\linkboxsmall`, `\icontact`, `\projtitle` in `Prajwal_BR_Resume.tex`) so the PDF shows a **thin bright-cyan rectangle** around the label, similar to many modern CVs. The box is drawn **inside** `\href{...}{...}`, so the whole frame stays clickable. Hyperref uses `colorlinks=false` and `pdfborder={0 0 0}` so you do not get a second PDF link outline on top of the cyan frame.

### Notes

- You may see `Fontconfig error` on Windows; Tectonic still produces a valid PDF.
- SVG logos under `public/logos/` are **not** embedded in the LaTeX PDF (standard `graphicx` has no SVG bounding box). Brand marks use **Font Awesome 5** (`fontawesome5`) instead.
- For a full MiKTeX/TeX Live install (optional): install from [MiKTeX](https://miktex.org/) or [TeX Live](https://www.tug.org/texlive/), then run `pdflatex Prajwal_BR_Resume.tex` from this folder (paths to `../public/images/` must stay valid).
