import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-5xl font-black tracking-tight">Terms</h1>
      <p className="mt-6 leading-8 text-slate-700">{siteConfig.name} provides informational content. Use of the website is subject to future detailed terms covering acceptable use, content rights, advertising, and disclaimers.</p>
    </main>
  );
}
