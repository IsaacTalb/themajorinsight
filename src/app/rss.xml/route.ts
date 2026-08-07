import { articles } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

export function GET() {
  const items = articles
    .map((article) => {
      const url = `${siteConfig.url}/${article.categorySlug}/${article.slug}`;
      return `<item><title><![CDATA[${article.title}]]></title><link>${url}</link><guid>${url}</guid><description><![CDATA[${article.excerpt}]]></description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${siteConfig.description}</description>${items}</channel></rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
