import type { MetadataRoute } from "next";
import { getLatestInsights } from "@/lib/articles";
import { categories, siteConfig } from "@/lib/site";

const staticRoutes = ["", "about", "contact", "editorial-policy", "corrections-policy", "privacy-policy", "terms", "cookie-policy", "advertise", "newsletter", "search"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getLatestInsights(100);
  const tagRoutes = [...new Set(articles.flatMap((article) => article.tags.map((tag) => `tag/${tag.toLowerCase().replaceAll(" ", "-")}`)))];
  const authorRoutes = [...new Set(articles.map((article) => `author/${article.author.slug}`))];
  return [...staticRoutes, ...categories.map((category) => category.slug), ...articles.map((article) => `${article.categorySlug}/${article.slug}`), ...tagRoutes, ...authorRoutes].map((route) => ({
    url: `${siteConfig.url}${route ? `/${route}` : ""}`,
    lastModified: new Date(),
    changeFrequency: route ? "weekly" : "daily",
    priority: route ? 0.7 : 1
  }));
}
