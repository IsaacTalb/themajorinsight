import { siteConfig } from "@/lib/site";

export default function AboutPage() {
  return (
    <main className="site-container max-w-4xl py-16 md:py-24">
      <p className="eyebrow">Company</p><h1 className="display-title mt-4">About {siteConfig.name}</h1>
      <p className="mt-8 border-t border-ink pt-8 text-lg leading-8 text-charcoal">{siteConfig.name} covers finance, markets, artificial intelligence, technology, science, future innovation, and cultural trends for readers who want practical context without noise.</p>
    </main>
  );
}
