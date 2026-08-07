import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/lib/articles";

type TagPageProps = { params: Promise<{ tagSlug: string }> };
const slugifyTag = (tag: string) => tag.toLowerCase().replaceAll(" ", "-");

export function generateStaticParams() {
  return [...new Set(articles.flatMap((article) => article.tags.map(slugifyTag)))].map((tagSlug) => ({ tagSlug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tagSlug } = await params;
  const matchingArticles = articles.filter((article) => article.tags.some((tag) => slugifyTag(tag) === tagSlug));
  if (!matchingArticles.length) return {};
  const tag = matchingArticles[0].tags.find((item) => slugifyTag(item) === tagSlug) ?? tagSlug;
  return {
    title: `${tag} News and Analysis`,
    description: `The latest ${tag} reporting, explainers, and analysis from The Major News.`,
    alternates: { canonical: `/tag/${tagSlug}` }
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagSlug } = await params;
  const matchingArticles = articles.filter((article) => article.tags.some((tag) => slugifyTag(tag) === tagSlug));
  if (!matchingArticles.length) notFound();
  const tag = matchingArticles[0].tags.find((item) => slugifyTag(item) === tagSlug) ?? tagSlug;

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Topic</p>
      <h1 className="mt-2 text-5xl font-black tracking-tight">{tag}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">News, practical explainers, and independent analysis covering {tag}.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matchingArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </main>
  );
}
