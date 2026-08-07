import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";

export default function FinanceMarketsPage() {
  const category = categories.find((item) => item.slug === "finance-markets")!;
  return <CategoryLanding category={category} />;
}
