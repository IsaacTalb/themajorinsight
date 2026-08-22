import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-t border-ink pt-5">
      <p className="eyebrow">{article.categoryName}</p>
      <h3 className="mt-3 font-editorial text-[1.7rem] font-semibold leading-[1.12] tracking-[-0.02em] md:text-3xl">
        <Link className="transition-colors group-hover:text-accent" href={`/${article.categorySlug}/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-4 leading-7 text-muted">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Article tags">
        {article.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </article>
  );
}
