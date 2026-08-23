import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByTag } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

type TagPageProps = { params: Promise<{ tagSlug: string }> };
const slugifyTag = (tag: string) => tag.toLowerCase().replaceAll(" ", "-");

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tagSlug } = await params;
  const { articles: matchingArticles } = await getArticlesByTag(tagSlug, { pageSize: 24 });
  if (!matchingArticles.length) return {};
  const tag = matchingArticles[0].tags.find((item) => slugifyTag(item) === tagSlug) ?? tagSlug;
  return {
    title: `${tag} News and Analysis`,
    description: `The latest ${tag} reporting, explainers, and analysis from ${siteConfig.name}.`,
    alternates: { canonical: `/tag/${tagSlug}` }
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagSlug } = await params;
  const { articles: matchingArticles } = await getArticlesByTag(tagSlug, { pageSize: 24 });
  if (!matchingArticles.length) notFound();
  const tag = matchingArticles[0].tags.find((item) => slugifyTag(item) === tagSlug) ?? tagSlug;

  return (
    <main className="site-container py-12 md:py-20">
      <header className="border-b border-ink pb-10"><p className="eyebrow">Topic</p><h1 className="display-title mt-4">{tag}</h1>
      <p className="mt-6 max-w-2xl text-lg text-charcoal">News, practical explainers, and independent analysis covering {tag}.</p></header>
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {matchingArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </main>
  );
}
