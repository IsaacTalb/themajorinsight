import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-5xl font-black tracking-tight">The Major Brief</h1>
      <p className="mt-6 leading-8 text-slate-700">A planned newsletter for finance, AI, markets, science, and trend briefings.</p>
      <div className="mt-8"><NewsletterSignup /></div>
    </main>
  );
}
