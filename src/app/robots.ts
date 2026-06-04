import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://portfolio.dev";

  return {
    rules: [
      {
        // 1. Target general search crawlers
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // 2. Specific directives for AI Bot Crawlers to index systems and public achievements
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot"],
        allow: ["/", "/portfolio", "/portfolio#projects", "/#ai"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
