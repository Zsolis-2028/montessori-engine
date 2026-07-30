import type { MetadataRoute } from "next";

const BASE = "https://montessoriengine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/resources", priority: 0.9, changeFrequency: "weekly" as const },
    {
      path: "/resources/montessori-observation-examples",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-practical-life-activities",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-daily-schedule",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-sensorial-activities",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-math-activities",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-language-activities",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-cultural-activities",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-activities-2-year-olds",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-activities-3-year-olds",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/resources/montessori-activities-4-year-olds",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    { path: "/signup", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
