import { siteConfig } from "@/lib/site";

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-5xl font-black tracking-tight">The Major Brief</h1>
      <p className="mt-6 leading-8 text-slate-700">A planned newsletter for finance, AI, markets, science, and trend briefings. For early access, contact <a className="font-bold text-major" href={`mailto:${siteConfig.newsletterEmail}`}>{siteConfig.newsletterEmail}</a>.</p>
    </main>
  );
}
