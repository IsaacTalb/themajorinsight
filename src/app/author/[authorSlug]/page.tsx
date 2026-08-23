import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByAuthor } from "@/lib/articles";
import type { Metadata } from "next"; import { breadcrumbSchema, pageMetadata, safeJsonLd, authorSchema } from "@/lib/seo";

type Props={params:Promise<{authorSlug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {authorSlug}=await params;const {articles}=await getArticlesByAuthor(authorSlug,{pageSize:1});if(!articles.length)return {robots:{index:false,follow:false}};const a=articles[0].author;return pageMetadata(a.name,`${a.role}. ${a.bio}`,`/author/${authorSlug}`)}

export default async function AuthorPage({ params }: Props) {
  const { authorSlug } = await params; const { articles: work } = await getArticlesByAuthor(authorSlug, { pageSize: 24 }); if (!work.length) notFound(); const author = work[0].author;
  const person={"@context":"https://schema.org",...authorSchema(author)}; const crumbs=breadcrumbSchema([{name:"Home",path:"/"},{name:author.name,path:`/author/${authorSlug}`}]);
  return <main className="site-container py-12 md:py-20"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(person)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(crumbs)}}/><header className="grid gap-8 border-b border-ink pb-10 md:grid-cols-[1fr_2fr]"><div className="flex size-28 items-center justify-center rounded-full bg-ink font-editorial text-4xl text-white" aria-hidden>{author.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><p className="eyebrow">Author</p><h1 className="display-title mt-3">{author.name}</h1><p className="mt-5 max-w-2xl text-lg text-charcoal">{author.role}. {author.bio}</p></div></header><section className="py-12"><p className="eyebrow">Latest work</p><div className="mt-6 grid gap-8 md:grid-cols-2">{work.map(a => <ArticleCard key={a.slug} article={a}/>)}</div></section></main>;
}
