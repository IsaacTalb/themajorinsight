import { siteConfig } from "@/lib/site";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-5xl font-black tracking-tight">About {siteConfig.name}</h1>
      <p className="mt-6 leading-8 text-slate-700">{siteConfig.name} covers finance, markets, artificial intelligence, technology, science, future innovation, and cultural trends for readers who want practical context without noise.</p>
    </main>
  );
}
