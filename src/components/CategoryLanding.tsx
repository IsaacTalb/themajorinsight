import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getArticlesByCategory } from "@/lib/articles";
import type { categories } from "@/lib/site";

type Category = (typeof categories)[number];

export function CategoryLanding({ category }: { category: Category }) {
  const categoryArticles = getArticlesByCategory(category.slug);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Category</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">{category.name}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{category.deck}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {category.topics.map((topic) => (
            <span key={topic} className="rounded-full bg-paper px-4 py-2 text-sm font-bold text-slate-700">{topic}</span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Latest coverage</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Starter stories and future article slots</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </main>
  );
}
