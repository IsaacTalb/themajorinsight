import { getLatestInsights } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const cdata = (value: string) => value.replaceAll("]]>", "]]]]><![CDATA[>");

export async function GET() {
  const articles = await getLatestInsights(50);
  const items = articles
    .map((article) => {
      const url = `${siteConfig.url}/${article.categorySlug}/${article.slug}`;
      return `<item><title><![CDATA[${cdata(article.title)}]]></title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description><![CDATA[${cdata(article.excerpt)}]]></description><author>${xml(article.author.name)}</author><category>${xml(article.categoryName)}</category><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(siteConfig.name)}</title><link>${xml(siteConfig.url)}</link><atom:link href="${xml(`${siteConfig.url}/rss.xml`)}" rel="self" type="application/rss+xml"/><description>${xml(siteConfig.description)}</description><language>${siteConfig.language}</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
      ,"Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600"
    }
  });
}
