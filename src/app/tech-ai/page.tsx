import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";

export default function TechAiPage() {
  const category = categories.find((item) => item.slug === "tech-ai")!;
  return <CategoryLanding category={category} />;
}
