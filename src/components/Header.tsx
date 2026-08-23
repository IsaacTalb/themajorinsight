import Link from "next/link";
import { categories, siteConfig } from "@/lib/site";

const utilityLinks = [
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletters" }
];

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      {categories.map((category) => (
        <Link key={category.slug} href={`/${category.slug}`} className={mobile ? "border-b border-rule py-3 font-semibold" : "py-4 hover:text-accent"}>
          {category.name}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="site-container flex h-10 items-center justify-between border-b border-rule text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
        <span>Independent analysis for consequential ideas</span>
        <nav aria-label="Utility navigation" className="hidden gap-5 sm:flex">
          {utilityLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-ink">{link.label}</Link>)}
        </nav>
      </div>
      <div className="site-container flex items-center justify-between py-5 md:justify-center md:py-7">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="font-editorial text-[1.55rem] font-semibold uppercase leading-none tracking-[0.075em] sm:text-3xl md:text-[2.6rem]">
          {siteConfig.name}
        </Link>
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none border border-rule px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] marker:content-none">Menu</summary>
          <nav aria-label="Mobile navigation" className="absolute right-0 top-[calc(100%+0.75rem)] z-50 grid w-[min(20rem,calc(100vw-2.5rem))] border border-rule bg-paper p-5 shadow-[0_8px_24px_rgba(17,17,17,0.08)]">
            <NavigationLinks mobile />
            <div className="mt-4 flex gap-5 text-xs uppercase tracking-wider text-muted">
              {utilityLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            </div>
          </nav>
        </details>
      </div>
      <nav aria-label="Primary navigation" className="hidden border-t border-rule md:block">
        <div className="site-container flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.12em] lg:gap-12">
          <NavigationLinks />
        </div>
      </nav>
    </header>
  );
}
