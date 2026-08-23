import Link from "next/link";
import { categories, siteConfig } from "@/lib/site";

const links = ["About", "Contact", "Editorial Policy", "Corrections Policy", "Privacy Policy", "Terms", "Cookie Policy", "Advertise"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-ink text-white">
      <div className="site-container grid gap-12 py-14 md:grid-cols-[1.7fr_1fr_1fr] md:py-20">
        <div>
          <Link href="/" className="font-editorial text-2xl font-semibold uppercase tracking-[0.06em]">{siteConfig.name}</Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/65">Independent reporting and analysis at the intersection of markets, technology, science, and culture.</p>
          <Link href="/newsletter" className="mt-7 inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-[0.14em]">Receive The Major Brief</Link>
        </div>
        <nav aria-label="Sections">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Sections</p>
          <div className="mt-4 grid gap-2.5 text-sm text-white/75">
            {categories.map((category) => <Link key={category.slug} href={`/${category.slug}`} className="hover:text-white">{category.name}</Link>)}
          </div>
        </nav>
        <nav aria-label="Company">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Company</p>
          <div className="mt-4 grid gap-2.5 text-sm text-white/75">
            {links.map((link) => <Link key={link} href={`/${link.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-white">{link}</Link>)}
          </div>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p><p>Clarity over noise.</p>
        </div>
      </div>
    </footer>
  );
}
