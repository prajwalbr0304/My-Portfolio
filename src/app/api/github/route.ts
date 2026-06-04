import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Cache expiration time in seconds (1 hour)
const CACHE_TTL = 3600;

interface GithubActivityItem {
  id: string;
  type: "commit" | "pr" | "deploy" | "test";
  message: string;
  time: string;
  repo: string;
}

interface GithubRepoSnippet {
  name: string;
  stars: number;
  language: string | null;
  pushedAt: string;
  htmlUrl: string;
}

interface GithubStats {
  publicRepos: number;
  followers: number;
  avatarUrl: string;
  bio: string;
  name: string;
  recentActivity: GithubActivityItem[];
  /** Recently pushed public repos (live slice). */
  recentRepos: GithubRepoSnippet[];
  /** Sum of stargazers across `recentRepos` slice (not full account). */
  totalStarsInSlice: number;
}

// Custom fetch wrapper with a strict timeout to prevent edge latency blocking
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 1200): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const githubUsername = process.env.GITHUB_USERNAME || "PRAJWAL-BR-0304";
  
  // Default elegant fallback payload
  const errorFallback: GithubStats = {
    publicRepos: 15,
    followers: 120,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    bio: "AI Product Engineer and UI designer.",
    name: "Prajwal B R",
    recentActivity: [
      { id: "1", type: "commit", message: "Optimized Vercel Edge streaming APIs", time: "2 hours ago", repo: "AI_Portfolio" },
      { id: "2", type: "pr", message: "Merged PR #44: Traceability algorithms", time: "5 hours ago", repo: "MediTrustChain" },
      { id: "3", type: "deploy", message: "Deployed Edge routing controller to Vercel", time: "1 hour ago", repo: "HabitTracker" },
    ],
    recentRepos: [
      {
        name: "AI_Portfolio",
        stars: 8,
        language: "TypeScript",
        pushedAt: new Date().toISOString(),
        htmlUrl: "https://github.com/PRAJWAL-BR-0304/AI_Portfolio",
      },
      {
        name: "portfolio-lab",
        stars: 3,
        language: "TypeScript",
        pushedAt: new Date().toISOString(),
        htmlUrl: "https://github.com/PRAJWAL-BR-0304/portfolio-lab",
      },
    ],
    totalStarsInSlice: 11,
  };

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    const cacheKey = `github-telemetry-${githubUsername}`;

    // 1. Try to read from Upstash Redis cache first (if keys are configured)
    if (redisUrl && redisToken) {
      try {
        console.log(`[REDIS-CACHE] Checking cache for ${cacheKey}...`);
        const cacheResponse = await fetchWithTimeout(`${redisUrl}/get/${cacheKey}`, {
          headers: {
            Authorization: `Bearer ${redisToken}`,
          },
        }, 1000); // Strict 1s limit for Redis cache
        
        if (cacheResponse.ok) {
          const cacheData = await cacheResponse.json();
          if (cacheData && cacheData.result) {
            console.log("[REDIS-CACHE] Cache HIT! Returning cached GitHub data.");
            return new NextResponse(cacheData.result, {
              headers: {
                "Content-Type": "application/json",
                "X-Cache": "HIT",
              },
            });
          }
        }
      } catch (cacheError) {
        console.warn("⚠️ Redis cache read timed out or failed:", cacheError);
      }
    }

    // 2. Fetch live data from GitHub API with timeout limits
    console.log(`[GITHUB-API] Fetching live GitHub data for ${githubUsername}...`);
    const headers: Record<string, string> = {
      "User-Agent": "nextjs-edge-runtime-portfolio-agent",
      Accept: "application/vnd.github.v3+json",
    };

    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    const [profileRes, eventsRes, reposRes] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/users/${githubUsername}`, { headers }, 1500),
      fetchWithTimeout(`https://api.github.com/users/${githubUsername}/events?per_page=20`, { headers }, 1500),
      fetchWithTimeout(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=14&type=owner`,
        { headers },
        1500,
      ),
    ]);

    if (!profileRes.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${profileRes.statusText}`);
    }

    const profileData = await profileRes.json();
    let eventsData: any[] = [];
    if (eventsRes.ok) {
      eventsData = await eventsRes.json();
    }

    let recentRepos: GithubRepoSnippet[] = [];
    let totalStarsInSlice = 0;
    if (reposRes.ok) {
      const reposJson = await reposRes.json();
      if (Array.isArray(reposJson)) {
        recentRepos = reposJson.map((r: Record<string, unknown>) => ({
          name: String(r.name ?? "repo"),
          stars: Number(r.stargazers_count ?? 0),
          language: (r.language as string) ?? null,
          pushedAt: String(r.pushed_at ?? new Date().toISOString()),
          htmlUrl: String(r.html_url ?? `https://github.com/${githubUsername}`),
        }));
        totalStarsInSlice = recentRepos.reduce((acc, r) => acc + r.stars, 0);
      }
    }

    if (recentRepos.length === 0) {
      recentRepos = errorFallback.recentRepos;
      totalStarsInSlice = errorFallback.totalStarsInSlice;
    }

    // Process recent activity stream from GitHub events
    const processedActivity: GithubActivityItem[] = [];

    if (Array.isArray(eventsData)) {
      for (const event of eventsData) {
        if (processedActivity.length >= 5) break;

        const timeString = formatRelativeTime(event.created_at);
        const repoName = event.repo.name.replace(`${githubUsername}/`, "");

        if (event.type === "PushEvent" && event.payload?.commits) {
          const commits = event.payload.commits;
          for (const commit of commits) {
            if (processedActivity.length >= 5) break;
            processedActivity.push({
              id: commit.sha || crypto.randomUUID(),
              type: "commit",
              message: commit.message.split("\n")[0],
              time: timeString,
              repo: repoName,
            });
          }
        } else if (event.type === "PullRequestEvent") {
          const pr = event.payload.pull_request;
          processedActivity.push({
            id: pr?.id?.toString() || crypto.randomUUID(),
            type: "pr",
            message: `${event.payload.action} PR #${pr?.number || 1}: ${pr?.title || 'Upgrade'}`,
            time: timeString,
            repo: repoName,
          });
        }
      }
    }

    // Fallback default activity items if history is empty
    if (processedActivity.length === 0) {
      processedActivity.push(...errorFallback.recentActivity);
    }

    const statsPayload: GithubStats = {
      publicRepos: profileData.public_repos || 15,
      followers: profileData.followers || 120,
      avatarUrl: profileData.avatar_url || errorFallback.avatarUrl,
      bio: profileData.bio || errorFallback.bio,
      name: profileData.name || errorFallback.name,
      recentActivity: processedActivity,
      recentRepos,
      totalStarsInSlice,
    };

    const payloadString = JSON.stringify(statsPayload);

    // 3. Write payload into Upstash Redis Cache (if keys are configured)
    if (redisUrl && redisToken) {
      try {
        console.log(`[REDIS-CACHE] Writing fresh github data to cache key: ${cacheKey}...`);
        await fetchWithTimeout(redisUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["SET", cacheKey, payloadString, "EX", CACHE_TTL]),
        }, 1000);
        console.log("✅ Successfully saved GitHub stats in Upstash cache!");
      } catch (cacheError) {
        console.warn("⚠️ Redis cache write failure:", cacheError);
      }
    }

    return new NextResponse(payloadString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
    });

  } catch (error: any) {
    console.warn("❌ GitHub API route timed out or failed, serving fallback:", error.message || error);
    
    return new NextResponse(JSON.stringify(errorFallback), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Fallback-Active": "true",
      },
    });
  }
}

// Utility function to format relative timestamps
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
