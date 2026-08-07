import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-major">{article.categoryName}</p>
      <h3 className="mt-3 text-2xl font-black leading-tight">
        <Link href={`/${article.categorySlug}/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-3 leading-7 text-slate-600">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-slate-600">{tag}</span>
        ))}
      </div>
    </article>
  );
}
