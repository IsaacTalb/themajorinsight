import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";

export default function ScienceFuturePage() {
  const category = categories.find((item) => item.slug === "science-future")!;
  return <CategoryLanding category={category} />;
}
