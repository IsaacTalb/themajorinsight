import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-5xl font-black tracking-tight">Contact</h1>
      {siteConfig.contactEmail ? (
        <p className="mt-6 leading-8 text-slate-700">For tips, corrections, partnerships, and advertising inquiries, contact <a className="font-bold text-major" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p>
      ) : (
        <p className="mt-6 leading-8 text-slate-700">Contact details will be published here when the editorial inbox is configured.</p>
      )}
    </main>
  );
}
