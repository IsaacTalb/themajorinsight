import { categories } from "@/lib/site";

export default function FinanceMarketsPage() {
  const category = categories.find((item) => item.slug === "finance-markets")!;
  return <CategoryLanding category={category} />;
}

function CategoryLanding({ category }: { category: (typeof categories)[number] }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-major">Category</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">{category.name}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{category.deck}</p>
      <div className="mt-8 flex flex-wrap gap-3">{category.topics.map((topic) => <span key={topic} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">{topic}</span>)}</div>
    </main>
  );
}
