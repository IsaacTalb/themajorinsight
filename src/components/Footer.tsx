import Link from "next/link";
import { siteConfig } from "@/lib/site";

const links = ["About", "Contact", "Editorial Policy", "Privacy Policy", "Terms", "Advertise"];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-2xl font-black">{siteConfig.name}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Independent business, technology, science, and culture coverage designed for clarity, search visibility, reader trust, and sustainable monetization.</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-300">
          {links.map((link) => (
            <Link key={link} href={`/${link.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-white">{link}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
