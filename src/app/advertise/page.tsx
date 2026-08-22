import { siteConfig } from "@/lib/site";

export default function AdvertisePage() {
  return (
    <main className="site-container max-w-4xl py-16 md:py-24">
      <p className="eyebrow">Partnerships</p><h1 className="display-title mt-4">Advertise</h1>
      <p className="mt-8 border-t border-ink pt-8 text-lg leading-8 text-charcoal">{siteConfig.name} is building premium audiences across finance, AI, business software, science, and internet culture. Sponsorship and direct advertising packages will be available after launch.</p>
    </main>
  );
}
