import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { articles, getArticleAuthor, getArticleBySlug } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{ categorySlug: string; articleSlug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ categorySlug: article.categorySlug, articleSlug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;
  const article = getArticleBySlug(articleSlug);

  if (!article || article.categorySlug !== categorySlug) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/${article.categorySlug}/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${siteConfig.url}/${article.categorySlug}/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { categorySlug, articleSlug } = await params;
  const article = getArticleBySlug(articleSlug);

  if (!article || article.categorySlug !== categorySlug) {
    notFound();
  }

  const author = getArticleAuthor(article);
  const articleUrl = `${siteConfig.url}/${article.categorySlug}/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: author?.name ?? siteConfig.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    mainEntityOfPage: articleUrl,
    keywords: [article.focusKeyword, ...article.tags].join(", ")
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
      <article className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <p className="text-sm font-black uppercase tracking-[0.25em] text-major">{article.categoryName}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-xl leading-9 text-slate-700">{article.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
          <span>{author?.name ?? siteConfig.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt}>Published {article.publishedAt}</time>
          <span>•</span>
          <span>{article.readingTime}</span>
        </div>
        <div className="mt-8">
          <ArticleEngagement slug={article.slug} title={article.title} url={articleUrl} />
        </div>
        <div className="mt-8 rounded-3xl bg-paper p-6 text-sm text-slate-600">
          <p className="font-black text-ink">Image brief</p>
          <p className="mt-2">{article.imageAlt}</p>
        </div>
        <div className="mt-8 space-y-6 text-lg leading-9 text-slate-700">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black">Sources and references</h2>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600">
            {article.sources.map((source) => (
              <li key={source.url}><a className="font-bold text-major" href={source.url} rel="noreferrer" target="_blank">{source.label}</a></li>
            ))}
          </ul>
        </section>
      </article>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Tags</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <a key={tag} href={`/tag/${tag.toLowerCase().replaceAll(" ", "-")}`} className="rounded-full bg-paper px-3 py-1 text-sm font-bold text-slate-700 hover:text-major">{tag}</a>
            ))}
          </div>
        </div>
        <NewsletterSignup />
      </aside>
    </main>
  );
}
