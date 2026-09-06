import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { ArticleEngagement } from "@/components/ArticleEngagement";

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; articleSlug: string }> }): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article || article.categorySlug !== categorySlug) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: article.canonicalUrl || absoluteUrl(`/${categorySlug}/${articleSlug}`) },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: absoluteUrl(`/${categorySlug}/${articleSlug}`),
      siteName: siteConfig.name
    }
  };
}

export default async function Page({ params }: { params: Promise<{ categorySlug: string; articleSlug: string }> }) {
  const { categorySlug, articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article || article.categorySlug !== categorySlug) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <article>
        <p className="eyebrow">{article.categoryName}</p>
        <h1 className="mt-3 font-editorial text-4xl font-semibold tracking-tight">{article.title}</h1>
        <p className="mt-4 text-muted">{article.excerpt}</p>
        <ArticleEngagement slug={article.slug} title={article.title} url={absoluteUrl(`/${categorySlug}/${articleSlug}`)} />
        {article.bodyHtml ? <div className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} /> : null}
      </article>
    </main>
  );
}
