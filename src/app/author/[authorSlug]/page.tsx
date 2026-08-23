import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByAuthor } from "@/lib/articles";

export default async function AuthorPage({ params }: { params: Promise<{ authorSlug: string }> }) {
  const { authorSlug } = await params; const { articles: work } = await getArticlesByAuthor(authorSlug, { pageSize: 24 }); if (!work.length) notFound(); const author = work[0].author;
  return <main className="site-container py-12 md:py-20"><header className="grid gap-8 border-b border-ink pb-10 md:grid-cols-[1fr_2fr]"><div className="flex size-28 items-center justify-center rounded-full bg-ink font-editorial text-4xl text-white" aria-hidden>{author.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><p className="eyebrow">Author</p><h1 className="display-title mt-3">{author.name}</h1><p className="mt-5 max-w-2xl text-lg text-charcoal">{author.role}. {author.bio}</p></div></header><section className="py-12"><p className="eyebrow">Latest work</p><div className="mt-6 grid gap-8 md:grid-cols-2">{work.map(a => <ArticleCard key={a.slug} article={a}/>)}</div></section></main>;
}
