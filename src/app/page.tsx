import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { articles } from "@/lib/articles";
import { categories, siteConfig } from "@/lib/site";

const workflow = [
  "Trend discovery",
  "Keyword brief",
  "Human edit",
  "SEO review",
  "Publish",
  "Social + newsletter",
  "Performance refresh"
];

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-ink via-slate-900 to-major text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-gold">Launch blueprint</p>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Building a search-first media company for money, AI, future tech, and culture.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{siteConfig.name} is structured to combine premium AdSense categories, trustworthy editorial systems, automated research workflows, and humanized reporting.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/newsletter" className="rounded-full bg-gold px-6 py-3 font-black text-ink">Join the newsletter</Link>
              <Link href="/editorial-policy" className="rounded-full border border-white/30 px-6 py-3 font-black text-white">Editorial standards</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">Operating workflow</p>
            <div className="mt-6 grid gap-3">
              {workflow.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-sm font-black text-ink">{index + 1}</span>
                  <span className="font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Categories</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Revenue-aware editorial pillars</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-black">{category.name}</h3>
              <p className="mt-3 leading-7 text-slate-600">{category.deck}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {category.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-paper px-3 py-1 text-sm font-semibold text-slate-700">{topic}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Launch articles</p>
        <h2 className="mt-2 text-4xl font-black tracking-tight">Starter templates for search demand</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <NewsletterSignup />
      </section>
    </main>
  );
}
