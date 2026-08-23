import type { ReactNode } from "react";

export function EditorialPage({ eyebrow, title, intro, children, aside }: { eyebrow: string; title: string; intro: string; children: ReactNode; aside?: ReactNode }) {
  return <main className="site-container py-12 md:py-20">
    <header className="max-w-4xl border-b border-ink pb-10 md:pb-14">
      <p className="eyebrow">{eyebrow}</p><h1 className="display-title mt-4">{title}</h1>
      <p className="mt-7 max-w-3xl text-xl leading-8 text-charcoal">{intro}</p>
    </header>
    <div className={`mt-10 grid gap-12 ${aside ? "lg:grid-cols-[minmax(0,46rem)_18rem] lg:gap-20" : "max-w-[46rem]"}`}>
      <div className="policy-copy">{children}</div>{aside && <aside className="border-t border-rule pt-5 lg:border-l lg:border-t-0 lg:pl-7">{aside}</aside>}
    </div>
  </main>;
}
