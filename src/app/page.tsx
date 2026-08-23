import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getLatestInsights } from "@/lib/articles";
import { categories, siteConfig } from "@/lib/site";

const workflow = ["Trend discovery", "Keyword brief", "Human edit", "SEO review", "Publish", "Social + newsletter", "Performance refresh"];

export default async function Home() {
  const articles = await getLatestInsights(6);
  const leadArticle = articles[0];
  return (
    <main>
      <section className="site-container py-10 md:py-16">
        <div className="grid border-y border-ink lg:grid-cols-[1.55fr_0.75fr]">
          <div className="py-9 lg:border-r lg:border-rule lg:py-14 lg:pr-12">
            <p className="eyebrow">The Major Perspective</p>
            <h1 className="display-title mt-5 max-w-4xl">Intelligence for a world in motion.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-charcoal">{siteConfig.name} brings disciplined reporting and clear analysis to finance, technology, science, and the cultural forces reshaping modern life.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={leadArticle ? `/${leadArticle.categorySlug}/${leadArticle.slug}` : "/newsletter"} className="button-primary">Read the latest</Link>
              <Link href="/newsletter" className="button-secondary">Join the newsletter</Link>
            </div>
          </div>
          <aside className="border-t border-rule py-9 lg:border-t-0 lg:py-14 lg:pl-10" aria-label="Editorial approach">
            <p className="eyebrow">Our method</p>
            <ol className="mt-5 divide-y divide-rule border-t border-rule">
              {workflow.map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] py-2.5 text-sm"><span className="font-editorial text-muted">{String(index + 1).padStart(2, "0")}</span><span className="font-semibold">{step}</span></li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="site-container py-10 md:py-16" aria-labelledby="latest-heading">
        <div className="mb-9 flex items-end justify-between border-b border-rule pb-4">
          <div><p className="eyebrow">Latest</p><h2 id="latest-heading" className="section-title mt-2">Essential reading</h2></div>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-muted sm:block">Analysis · Briefings · Perspective</span>
        </div>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">{articles.slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>

      <section className="site-container py-10 md:py-16" aria-labelledby="sections-heading">
        <div className="border-b border-ink pb-4"><p className="eyebrow">Explore</p><h2 id="sections-heading" className="section-title mt-2">Areas of focus</h2></div>
        <div className="divide-y divide-rule">
          {categories.map((category, index) => (
            <article key={category.slug} className="grid gap-4 py-7 md:grid-cols-[4rem_0.8fr_1.2fr_auto] md:items-start md:gap-8">
              <span className="font-editorial text-lg text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-editorial text-2xl font-semibold"><Link href={`/${category.slug}`} className="hover:text-accent">{category.name}</Link></h3>
              <p className="max-w-xl text-sm leading-6 text-muted">{category.deck}</p>
              <Link href={`/${category.slug}`} className="text-xs font-bold uppercase tracking-[0.12em] underline decoration-rule underline-offset-4">View section</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="site-container py-10 md:py-16"><NewsletterSignup /></section>
    </main>
  );
}
