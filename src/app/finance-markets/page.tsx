import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type Props = { searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> { const page = Math.max(1, Number((await searchParams).page) || 1); return pageMetadata(page > 1 ? `Finance & Markets — Page ${page}` : "Finance & Markets", categories[0].deck, page > 1 ? `/finance-markets?page=${page}` : "/finance-markets"); }

export default async function FinanceMarketsPage({ searchParams }: Props) {
  const category = categories.find((item) => item.slug === "finance-markets")!;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return <CategoryLanding category={category} page={page} />;
}
