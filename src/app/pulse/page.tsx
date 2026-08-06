import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";

export default function PulsePage() {
  const category = categories.find((item) => item.slug === "pulse")!;
  return <CategoryLanding category={category} />;
}
