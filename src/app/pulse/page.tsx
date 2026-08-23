import { CategoryLanding } from "@/components/CategoryLanding";
import { categories } from "@/lib/site";
import type { Metadata } from "next"; import { pageMetadata } from "@/lib/seo";
type Props={searchParams:Promise<{page?:string}>}; export async function generateMetadata({searchParams}:Props):Promise<Metadata>{const p=Math.max(1,Number((await searchParams).page)||1),c=categories[3];return pageMetadata(p>1?`${c.name} — Page ${p}`:c.name,c.deck,p>1?`/${c.slug}?page=${p}`:`/${c.slug}`)}

export default async function PulsePage({searchParams}:Props) {
  const category = categories.find((item) => item.slug === "pulse")!;
  const page=Math.max(1,Number((await searchParams).page)||1); return <CategoryLanding category={category} page={page} />;
}
