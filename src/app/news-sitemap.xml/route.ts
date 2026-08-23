import { getLatestInsights } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export async function GET() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const stories = (await getLatestInsights(100)).filter((article) => article.type === "News" && new Date(article.publishedAt).getTime() >= cutoff);
  const urls = stories.map((article) => `<url><loc>${xml(`${siteConfig.url}/${article.categorySlug}/${article.slug}`)}</loc><news:news><news:publication><news:name>${xml(siteConfig.name)}</news:name><news:language>en</news:language></news:publication><news:publication_date>${xml(new Date(article.publishedAt).toISOString())}</news:publication_date><news:title>${xml(article.title)}</news:title></news:news></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
