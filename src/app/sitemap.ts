import { MetadataRoute } from "next";
import { certifications } from "@/features/portfolio/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfolio.dev"; // Change to Prajwal's target production domain

  const certificateEntries: MetadataRoute.Sitemap = certifications.map((c) => ({
    url: `${baseUrl}/certificates/${c.ref}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/orderhub`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...certificateEntries,
  ];
}
