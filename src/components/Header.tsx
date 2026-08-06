import Link from "next/link";
import { categories, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-major text-lg font-black text-white">M</span>
          <span>
            <span className="block text-2xl font-black tracking-tight text-ink">{siteConfig.name}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Money • AI • Future • Pulse</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`} className="rounded-full border border-slate-200 px-4 py-2 hover:border-major hover:text-major">
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
