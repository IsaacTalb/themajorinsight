import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ArticleEngagement } from "@/components/ArticleEngagement";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticleBySlug, getLatestInsights } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { authorSchema, breadcrumbSchema, safeJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ categorySlug: string; articleSlug: string }> };
const prettyDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params; const article = await getArticleBySlug(articleSlug);
  if (!article || article.categorySlug !== categorySlug) return {};
  const canonical = article.canonicalUrl || absoluteUrl(`/${categorySlug}/${articleSlug}`);
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const images = article.image ? [{ url: article.image.src, alt: article.imageAlt }] : [{ url: absoluteUrl("/opengraph-image"), alt: siteConfig.name }];
  return { title, description, authors: [{ name: article.author.name, url: `/author/${article.author.slug}` }], alternates: { canonical }, openGraph: { title, description, url: canonical, siteName: siteConfig.name, locale: siteConfig.locale, type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [absoluteUrl(`/author/${article.author.slug}`)], section: article.categoryName, tags: article.tags, images }, twitter: { card: "summary_large_image", title, description, images } };
}

export default async function ArticlePage({ params }: Props) {
  const { categorySlug, articleSlug } = await params; const article = await getArticleBySlug(articleSlug);
  if (!article || article.categorySlug !== categorySlug) notFound();
  const articleUrl = article.canonicalUrl || absoluteUrl(`/${categorySlug}/${articleSlug}`);
  const related = (await getLatestInsights(4)).filter((item) => item.slug !== article.slug).slice(0, 3);
  const schemaType = article.type === "News" ? "NewsArticle" : "Article";
  const jsonLd = { "@context": "https://schema.org", "@type": schemaType, headline: article.title, description: article.seoDescription || article.excerpt, datePublished: article.publishedAt, dateModified: article.updatedAt, articleSection: article.categoryName, inLanguage: siteConfig.language, author: authorSchema(article.author), publisher: { "@id": `${siteConfig.url}/#organization` }, mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl }, ...(article.image ? { image: { "@type": "ImageObject", url: article.image.src, caption: article.image.caption || undefined } } : {}), keywords: article.tags.join(", ") };
  const breadcrumbs = breadcrumbSchema([{ name: "Home", path: "/" }, { name: article.categoryName, path: `/${categorySlug}` }, { name: article.title, path: `/${categorySlug}/${articleSlug}` }]);
  return <main>
    <article className="site-container py-10 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs text-muted"><Link href="/">Home</Link><span>/</span><Link href={`/${categorySlug}`}>{article.categoryName}</Link><span>/</span><span aria-current="page">{article.title}</span></nav>
      <header className="mt-10 max-w-5xl">
        <p className="eyebrow">{article.categoryName} · {article.type}</p>
        <h1 className="mt-4 font-editorial text-5xl font-semibold leading-[1.01] tracking-[-0.04em] md:text-7xl">{article.title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-charcoal md:text-2xl">{article.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-rule py-5 text-sm text-muted">
          <Link className="font-semibold text-ink hover:text-accent" href={`/author/${article.author.slug}`}>By {article.author.name}</Link><span aria-hidden>•</span>
          <time dateTime={article.publishedAt}>Published {prettyDate(article.publishedAt)}</time><span aria-hidden>•</span>
          <time dateTime={article.updatedAt}>Updated {prettyDate(article.updatedAt)}</time><span aria-hidden>•</span><span>{article.readingTime}</span>
        </div>
      </header>
      {article.image && <figure className="mt-10"><img className="aspect-[16/8] w-full object-cover" src={article.image.src} alt={article.imageAlt}/><figcaption className="mt-2 text-xs text-muted">{article.image.caption} <span className="font-semibold">{article.image.credit}</span></figcaption></figure>}
      <div className="mt-10 grid gap-10 lg:grid-cols-[8rem_minmax(0,46rem)_1fr] lg:gap-10">
        <aside><p className="eyebrow mb-3">Share</p><ArticleEngagement slug={article.slug} title={article.title} url={articleUrl}/></aside>
        <div>
          {article.keyTakeaways && <section className="mb-10 border-y border-ink py-6"><h2 className="font-editorial text-2xl font-semibold">Key takeaways</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal">{article.keyTakeaways.map(x => <li key={x}>{x}</li>)}</ul></section>}
          {article.body.length > 5 && <nav className="mb-10 border-l-2 border-accent pl-5" aria-label="Table of contents"><p className="eyebrow">In this insight</p><a href="#analysis" className="mt-2 block font-semibold">Analysis and context</a></nav>}
          {article.bodyHtml ? <div id="analysis" className="prose-editorial font-editorial text-xl leading-[1.78] text-charcoal" dangerouslySetInnerHTML={{__html:article.bodyHtml}}/> : <div id="analysis" className="prose-editorial font-editorial text-xl leading-[1.78] text-charcoal">{article.body.map(p => <p key={p}>{p}</p>)}</div>}
          <section className="mt-12 border-t border-ink pt-7"><h2 className="font-editorial text-2xl font-semibold">Sources and references</h2><ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">{article.sources.map(s => <li key={s.url}><a className="text-link font-semibold" href={s.url} rel="noreferrer" target="_blank">{s.label}</a></li>)}</ol></section>
          <div className="mt-8 flex flex-wrap gap-2">{article.tags.map(tag => <Link key={tag} href={`/tag/${tag.toLowerCase().replaceAll(" ", "-")}`} className="tag">{tag}</Link>)}</div>
          <section className="mt-12 border-y border-rule py-7"><p className="eyebrow">About the author</p><h2 className="mt-2 font-editorial text-2xl font-semibold"><Link href={`/author/${article.author.slug}`}>{article.author.name}</Link></h2><p className="mt-2 text-muted">{article.author.role}. {article.author.bio}</p></section>
          {article.categorySlug === "finance-markets" && <aside className="mt-8 border-l-2 border-accent pl-5 text-sm leading-6 text-muted"><strong className="text-ink">Financial information disclaimer.</strong> This content is educational and general in nature. It is not individualized financial, investment, tax, or legal advice. Consider your circumstances and consult an appropriately qualified professional before acting.</aside>}
        </div>
        <aside className="hidden text-sm text-muted lg:block"><p className="eyebrow">Our standard</p><p className="mt-3">Clear sourcing, useful context, and independent editorial judgment.</p><Link href="/editorial-policy" className="text-link mt-3 inline-block font-semibold">How we work</Link></aside>
      </div>
    </article>
    <section className="site-container border-t border-ink py-12"><p className="eyebrow">Continue reading</p><h2 className="mt-2 font-editorial text-4xl font-semibold">Related insights</h2><div className="mt-8 grid gap-8 md:grid-cols-3">{related.map(a => <ArticleCard article={a} key={a.slug}/>)}</div></section>
    <div className="site-container"><NewsletterSignup /></div>
  </main>;
}
