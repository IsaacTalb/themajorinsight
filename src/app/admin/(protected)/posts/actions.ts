"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { editorialWarnings, makeSlug, plainText, sanitizeArticleHtml, type PostStatus } from "@/lib/editorial";
import { repository } from "@/lib/repository";

type ActionResult = { ok?: boolean; error?: string; savedAt?: string; id?: string };
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function savePost(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { profile } = await requireAdmin(["owner", "admin", "editor", "author"]);
  const id = text(form, "id");
  const intent = text(form, "intent") || "draft";
  const requested = text(form, "status") as PostStatus;
  let status: PostStatus = intent === "review" ? "review" : intent === "schedule" ? "scheduled" : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent === "unpublish" ? "draft" : requested || "draft";
  const canApprove = ["owner", "admin", "editor"].includes(profile.role);
  if (["scheduled", "published", "archived"].includes(status) && !canApprove) return { error: "Only an editor can approve, schedule, publish, or archive an article." };
  const title = text(form, "title"), slug = text(form, "slug") || makeSlug(title), authorId = text(form, "author_id"), categoryId = text(form, "category_id");
  const bodyHtml = sanitizeArticleHtml(text(form, "body_html"));
  const scheduledAt = text(form, "scheduled_at");
  const sources: { label: string; url: string; publisher?: string }[] = [];
  const warnings = editorialWarnings({ title, slug, authorId, bodyHtml, featuredImageUrl:text(form,"featured_image_url"), featuredImageAlt:text(form,"featured_image_alt"), seoDescription:text(form,"seo_description"), sources, scheduledAt, duplicateSlug:false });
  if (!title) return { error: "A title is required." };
  if (warnings.includes("Invalid slug") || warnings.includes("Duplicate slug")) return { error: warnings.find(x => x.includes("slug")) };
  if (["review","scheduled","published"].includes(status) && warnings.some(x => ["Missing author","Missing sources","Missing featured-image alt text","Unfinished content"].includes(x))) return { error: `Resolve publication checks first: ${warnings.join(", ")}.` };
  if (status === "scheduled" && (!scheduledAt || new Date(scheduledAt) <= new Date())) return { error: "Choose a future schedule date." };
  if (status === "published" && intent !== "publish") status = requested === "published" ? "published" : "draft";
  const now = new Date().toISOString();
  const payload = { title, slug, excerpt:text(form,"excerpt"), content:{ html:bodyHtml }, content_type:text(form,"content_type") || "Analysis", category_id:categoryId || null, author_id:authorId || null, status, featured_image_url:text(form,"featured_image_url") || null, featured_image_alt:text(form,"featured_image_alt") || null, featured_image_caption:text(form,"featured_image_caption") || null, featured_image_credit:text(form,"featured_image_credit") || null, seo_title:text(form,"seo_title") || null, seo_description:text(form,"seo_description") || null, canonical_url:text(form,"canonical_url") || null, focus_keyword:text(form,"focus_keyword") || null, scheduled_at:status === "scheduled" ? new Date(scheduledAt).toISOString() : null, published_at:status === "published" ? now : null, is_editor_pick:form.get("is_editor_pick") === "on", is_featured:form.get("is_featured") === "on", include_in_newsletter:form.get("include_in_newsletter") === "on", reading_time_minutes:Math.max(1, Math.ceil(plainText(bodyHtml).split(/\s+/).length / 220)), updated_by:profile.id };
  let postId = id;
  if (id) await repository.posts.update("id", id, payload as any); else { const data = await repository.posts.insert({ ...payload, created_by: profile.id } as any); postId = String((data as any).id ?? crypto.randomUUID()); }
  revalidatePath("/admin/posts"); revalidatePath(`/admin/posts/${postId}`);
  if (!id) redirect(`/admin/posts/${postId}?created=1`);
  return { ok:true, savedAt:now, id:postId };
}
