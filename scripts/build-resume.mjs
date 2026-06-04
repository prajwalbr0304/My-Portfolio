/**
 * Builds `latex/Prajwal_BR_Resume.tex` (and `Prajwal_BR_Resume_ATS.tex` when present)
 * via `latex/build-resume.ps1`, then copies:
 * - `public/documents/prajwal-b-r-resume.pdf` (visual; `profile.resumeFancyPdfSrc`)
 * - `public/documents/prajwal-b-r-resume-ats.pdf` (ATS-oriented plain layout)
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ps1 = path.join(root, "latex", "build-resume.ps1");
const systemRoot = process.env.SystemRoot || "C:\\Windows";
const powershell = path.join(
  systemRoot,
  "System32",
  "WindowsPowerShell",
  "v1.0",
  "powershell.exe",
);

const r = spawnSync(
  powershell,
  ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1],
  { stdio: "inherit", cwd: root },
);

if (r.error) {
  console.error(r.error);
  process.exit(1);
}
process.exit(r.status ?? 1);
