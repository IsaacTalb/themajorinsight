import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <main className="site-container max-w-4xl py-16 md:py-24">
      <p className="eyebrow">Legal</p><h1 className="display-title mt-4">Terms</h1>
      <p className="mt-8 border-t border-ink pt-8 text-lg leading-8 text-charcoal">{siteConfig.name} provides informational content. Use of the website is subject to future detailed terms covering acceptable use, content rights, advertising, and disclaimers.</p>
    </main>
  );
}
