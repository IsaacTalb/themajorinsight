import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <main className="site-container max-w-4xl py-16 md:py-24">
      <p className="eyebrow">Inquiries</p><h1 className="display-title mt-4">Contact</h1><div className="mt-8 border-t border-ink pt-8">
      {siteConfig.contactEmail ? (
        <p className="text-lg leading-8 text-charcoal">For tips, corrections, partnerships, and advertising inquiries, contact <a className="text-link font-semibold" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p>
      ) : (
        <p className="text-lg leading-8 text-charcoal">Contact details will be published here when the editorial inbox is configured.</p>
      )}</div>
    </main>
  );
}
