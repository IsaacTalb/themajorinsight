import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { articles, getArticleBySlug } from "@/lib/articles";
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

  const articleUrl = `${siteConfig.url}/${article.categorySlug}/${article.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name
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
    <main className="site-container grid gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <p className="eyebrow">{article.categoryName}</p>
        <h1 className="mt-5 max-w-4xl font-editorial text-5xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-7xl">{article.title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-charcoal">{article.excerpt}</p>
        <div className="mt-7 flex flex-wrap gap-3 border-b border-ink pb-6 text-xs font-semibold uppercase tracking-wider text-muted">
          <span>{siteConfig.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt}>Published {article.publishedAt}</time>
          <span>•</span>
          <span>{article.readingTime}</span>
        </div>
        <div className="mt-8">
          <ArticleEngagement slug={article.slug} title={article.title} url={articleUrl} />
        </div>
        <div className="mt-10 border-y border-rule bg-white p-6 text-sm text-muted">
          <p className="font-bold uppercase tracking-wider text-ink">Image brief</p>
          <p className="mt-2">{article.imageAlt}</p>
        </div>
        <div className="prose-editorial mt-10 max-w-[46rem] font-editorial text-xl leading-[1.75] text-charcoal">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <section className="mt-12 border-t border-ink pt-7">
          <h2 className="font-editorial text-2xl font-semibold">Sources and references</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted">
            {article.sources.map((source) => (
              <li key={source.url}><a className="text-link font-semibold" href={source.url} rel="noreferrer" target="_blank">{source.label}</a></li>
            ))}
          </ul>
        </section>
      </article>
      <aside className="space-y-10 lg:border-l lg:border-rule lg:pl-8">
        <div>
          <p className="eyebrow">Topics</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <a key={tag} href={`/tag/${tag.toLowerCase().replaceAll(" ", "-")}`} className="tag">{tag}</a>
            ))}
          </div>
        </div>
        <NewsletterSignup />
      </aside>
    </main>
  );
}
