/**
 * Downloads your GitHub profile picture to public/images/profile.jpg (same path as `avatarLocalSrc` in data.ts).
 *
 * Login order:
 * 1) PROFILE_AVATAR_URL (direct image URL)
 * 2) GITHUB_PROFILE_LOGIN in .env
 * 3) profile.githubProfileUsername in src/features/portfolio/data.ts
 * 4) GITHUB_USERNAME in .env (last resort)
 *
 * Usage: npm run sync:github-avatar
 */
import fs from "node:fs";
import path from "node:path";

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function readLoginFromDataTs() {
  const dataPath = path.join(process.cwd(), "src", "features", "portfolio", "data.ts");
  const text = fs.readFileSync(dataPath, "utf8");
  const m = text.match(/githubProfileUsername:\s*"([^"]+)"/);
  return m?.[1]?.trim() || null;
}

loadDotEnv();

const directUrl = process.env.PROFILE_AVATAR_URL?.trim();
/** Avatar login: optional env override, else profile.githubProfileUsername in data.ts (not GITHUB_USERNAME — that may be org/repo owner). */
const login =
  process.env.GITHUB_PROFILE_LOGIN?.trim() || readLoginFromDataTs() || process.env.GITHUB_USERNAME?.trim();

const outDir = path.join(process.cwd(), "public", "images");
const outFile = path.join(outDir, "profile.jpg");
fs.mkdirSync(outDir, { recursive: true });

async function downloadFromUrl(url) {
  const imgRes = await fetch(url, { redirect: "follow" });
  if (!imgRes.ok) throw new Error(`GET ${url} → ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  if (buf.length < 100) throw new Error("Image too small — probably not a valid avatar.");
  return buf;
}

try {
  let buffer;
  if (directUrl) {
    buffer = await downloadFromUrl(directUrl);
    console.log("Downloaded from PROFILE_AVATAR_URL");
  } else {
    if (!login) {
      console.error("Set PROFILE_AVATAR_URL, GITHUB_PROFILE_LOGIN, or githubProfileUsername in data.ts");
      process.exit(1);
    }
    const pngUrl = `https://github.com/${encodeURIComponent(login)}.png`;
    const res = await fetch(pngUrl, { redirect: "follow" });
    if (!res.ok) {
      const api = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "ai-native-portfolio-avatar-sync",
        },
      });
      if (!api.ok) {
        console.error(`GitHub user "${login}" not found (${res.status} / ${api.status}).`);
        process.exit(1);
      }
      const { avatar_url: avatarUrl } = await api.json();
      if (!avatarUrl) throw new Error("No avatar_url from API");
      buffer = await downloadFromUrl(avatarUrl);
      console.log("Downloaded from GitHub API avatar_url");
    } else {
      buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 100) {
        const api = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "ai-native-portfolio-avatar-sync",
          },
        });
        if (!api.ok) throw new Error(`github.com/${login}.png too small and API ${api.status}`);
        const { avatar_url: avatarUrl } = await api.json();
        buffer = await downloadFromUrl(avatarUrl);
        console.log("Downloaded from GitHub API (png redirect was empty)");
      } else {
        console.log(`Downloaded from ${res.url}`);
      }
    }
  }

  fs.writeFileSync(outFile, buffer);
  console.log(`Saved ${outFile} (${buffer.length} bytes)`);
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
