import { siteConfig } from "@/lib/site";

export default function EditorialPolicyPage() {
  return (
    <main className="site-container max-w-4xl py-16 md:py-24">
      <p className="eyebrow">Trust center</p><h1 className="display-title mt-4">Editorial Policy</h1>
      <div className="mt-8 border-t border-ink pt-8 text-lg leading-8 text-charcoal"><p>{siteConfig.name} uses human editorial review for every published story. Automated tools may assist with research organization, trend monitoring, formatting, and quality checks, but editors are responsible for accuracy, clarity, sourcing, and final publication decisions.</p>
      <p className="mt-5">Finance, health technology, investing, and business coverage is educational and informational only. We do not provide financial, investment, tax, legal, or medical advice.</p></div>
    </main>
  );
}
