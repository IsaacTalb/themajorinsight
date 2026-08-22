import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getArticlesByCategory } from "@/lib/articles";
import type { categories } from "@/lib/site";

type Category = (typeof categories)[number];

export function CategoryLanding({ category }: { category: Category }) {
  const categoryArticles = getArticlesByCategory(category.slug);
  return (
    <main className="site-container py-12 md:py-20">
      <header className="grid gap-8 border-b border-ink pb-10 md:grid-cols-[1fr_1fr] md:items-end md:pb-14">
        <div><p className="eyebrow">Section</p><h1 className="display-title mt-4">{category.name}</h1></div>
        <div>
          <p className="max-w-2xl text-lg leading-8 text-charcoal">{category.deck}</p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Topics">{category.topics.map((topic) => <span key={topic} className="tag">{topic}</span>)}</div>
        </div>
      </header>
      <section className="py-12 md:py-16" aria-labelledby="latest-coverage">
        <div className="mb-9 flex items-end justify-between border-b border-rule pb-4">
          <div><p className="eyebrow">Latest coverage</p><h2 id="latest-coverage" className="mt-2 font-editorial text-3xl font-semibold md:text-4xl">Analysis and reporting</h2></div>
        </div>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">{categoryArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>
      <NewsletterSignup />
    </main>
  );
}
