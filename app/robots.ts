import type { MetadataRoute } from "next";

const BASE = "https://montessoriengine.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the logged-in app out of search results.
      disallow: ["/dashboard", "/dashboard/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
