import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function NewsletterPage() {
  return (
    <main className="site-container max-w-5xl py-16 md:py-24">
      <p className="eyebrow">Newsletter</p><h1 className="display-title mt-4">The Major Brief</h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-charcoal">A planned newsletter for finance, AI, markets, science, and trend briefings.</p>
      <div className="mt-12"><NewsletterSignup /></div>
    </main>
  );
}
