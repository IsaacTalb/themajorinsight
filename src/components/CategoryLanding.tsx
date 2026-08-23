import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getArticlesByCategory } from "@/lib/articles";
import type { categories } from "@/lib/site";
import { breadcrumbSchema, safeJsonLd } from "@/lib/seo";

type Category = (typeof categories)[number];

export async function CategoryLanding({ category, page = 1 }: { category: Category; page?: number }) {
  const { articles: categoryArticles, totalPages } = await getArticlesByCategory(category.slug, { page, pageSize: 24 });
  const [lead, ...latest] = categoryArticles;
  return (
    <main className="site-container py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: category.name, path: `/${category.slug}` }])) }} />
      {page > 1 && <link rel="prev" href={page === 2 ? `/${category.slug}` : `/${category.slug}?page=${page - 1}`} />}
      {page < totalPages && <link rel="next" href={`/${category.slug}?page=${page + 1}`} />}
      <header className="grid gap-8 border-b border-ink pb-10 md:grid-cols-[1fr_1fr] md:items-end md:pb-14">
        <div><p className="eyebrow">Section</p><h1 className="display-title mt-4">{category.name}</h1></div>
        <div>
          <p className="max-w-2xl text-lg leading-8 text-charcoal">{category.deck}</p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Topics">{category.topics.map((topic) => <span key={topic} className="tag">{topic}</span>)}</div>
        </div>
      </header>
      {lead && <section className="grid gap-8 border-b border-rule py-10 md:grid-cols-[1.4fr_1fr] md:py-14"><div className="min-h-56 bg-[linear-gradient(135deg,#dedbd2,#f5f3ee)]" aria-hidden="true"/><div className="self-center"><p className="eyebrow">Lead story · {lead.type}</p><h2 className="mt-3 font-editorial text-4xl font-semibold leading-tight"><a href={`/${lead.categorySlug}/${lead.slug}`} className="hover:text-accent">{lead.title}</a></h2><p className="mt-4 text-muted">{lead.excerpt}</p><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted">{lead.readingTime}</p></div></section>}
      <section className="py-12 md:py-16" aria-labelledby="latest-coverage">
        <div className="mb-9 flex items-end justify-between border-b border-rule pb-4">
          <div><p className="eyebrow">Latest coverage</p><h2 id="latest-coverage" className="mt-2 font-editorial text-3xl font-semibold md:text-4xl">Analysis and reporting</h2></div>
        </div>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">{(latest.length ? latest : categoryArticles).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>
      <section className="grid gap-10 border-y border-ink py-10 md:grid-cols-2"><div><p className="eyebrow">Popular</p><h2 className="mt-2 font-editorial text-3xl font-semibold">Most read in {category.name}</h2>{lead && <a className="text-link mt-5 block font-semibold" href={`/${lead.categorySlug}/${lead.slug}`}>{lead.title}</a>}</div><div><p className="eyebrow">Explore subtopics</p><div className="mt-4 flex flex-wrap gap-2">{category.topics.map(topic => <a className="tag" key={topic} href={`/tag/${topic.toLowerCase().replaceAll(" ", "-")}`}>{topic}</a>)}</div></div></section>
      <nav className="flex items-center justify-between py-10" aria-label="Pagination"><span className="text-sm text-muted">Page {page} of {Math.max(1, totalPages)}</span><span className="flex gap-3">{page > 1 && <a className="button-secondary" href={page === 2 ? `/${category.slug}` : `/${category.slug}?page=${page - 1}`}>Previous</a>}{page < totalPages && <a className="button-secondary" href={`/${category.slug}?page=${page + 1}`}>Next</a>}</span></nav>
      <NewsletterSignup />
    </main>
  );
}
