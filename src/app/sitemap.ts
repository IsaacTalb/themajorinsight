import type { MetadataRoute } from "next";
import { categories, siteConfig } from "@/lib/site";

const staticRoutes = ["", "about", "contact", "editorial-policy", "privacy-policy", "terms", "advertise", "newsletter"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...categories.map((category) => category.slug)].map((route) => ({
    url: `${siteConfig.url}${route ? `/${route}` : ""}`,
    lastModified: new Date(),
    changeFrequency: route ? "weekly" : "daily",
    priority: route ? 0.7 : 1
  }));
}
