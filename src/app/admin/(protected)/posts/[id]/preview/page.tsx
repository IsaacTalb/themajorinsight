import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeArticleHtml } from "@/lib/editorial";
import { repository } from "@/lib/repository";

export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const data = await repository.posts.find("id", id);
  if (!data) notFound();
  const p = data as any;
  return <main className="preview-page"><div className="preview-banner">Private editorial preview A— <Link href={`/admin/posts/${id}`}>Return to editor</Link></div><article><header><p>THE MAJOR INSIGHT A— PREVIEW</p><h1>{p.title}</h1><div className="preview-deck">{p.excerpt}</div></header>{p.featured_image_url && <figure><img src={p.featured_image_url} alt={p.featured_image_alt || ""} /><figcaption>{p.featured_image_caption} {p.featured_image_credit}</figcaption></figure>}<div className="preview-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(p.content?.html || "") }} /></article></main>;
}
