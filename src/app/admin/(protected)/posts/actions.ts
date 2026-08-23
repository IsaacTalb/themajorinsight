"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { editorialWarnings, makeSlug, plainText, sanitizeArticleHtml, type PostStatus } from "@/lib/editorial";

type ActionResult = { ok?: boolean; error?: string; savedAt?: string; id?: string };
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function savePost(_: ActionResult, form: FormData): Promise<ActionResult> {
  const { profile, supabase } = await requireAdmin(["owner", "admin", "editor", "author"]);
  const id = text(form, "id");
  const intent = text(form, "intent") || "draft";
  const requested = text(form, "status") as PostStatus;
  let status: PostStatus = intent === "review" ? "review" : intent === "schedule" ? "scheduled" : intent === "publish" ? "published" : intent === "archive" ? "archived" : intent === "unpublish" ? "draft" : requested || "draft";
  const canApprove = ["owner", "admin", "editor"].includes(profile.role);
  if (["scheduled", "published", "archived"].includes(status) && !canApprove) return { error: "Only an editor can approve, schedule, publish, or archive an article." };
  const title = text(form, "title"), slug = text(form, "slug") || makeSlug(title), authorId = text(form, "author_id"), categoryId = text(form, "category_id");
  const bodyHtml = sanitizeArticleHtml(text(form, "body_html"));
  const scheduledAt = text(form, "scheduled_at");
  const sources = parseSources(text(form, "sources_json"));
  const { data: duplicate } = await supabase.from("posts").select("id").eq("slug", slug).neq("id", id || "00000000-0000-0000-0000-000000000000").maybeSingle();
  const warnings = editorialWarnings({ title, slug, authorId, bodyHtml, featuredImageUrl:text(form,"featured_image_url"), featuredImageAlt:text(form,"featured_image_alt"), seoDescription:text(form,"seo_description"), sources, scheduledAt, duplicateSlug:!!duplicate });
  if (!title) return { error: "A title is required." };
  if (warnings.includes("Invalid slug") || warnings.includes("Duplicate slug")) return { error: warnings.find(x => x.includes("slug")) };
  if (["review","scheduled","published"].includes(status) && warnings.some(x => ["Missing author","Missing sources","Missing featured-image alt text","Unfinished content"].includes(x))) return { error: `Resolve publication checks first: ${warnings.join(", ")}.` };
  if (status === "scheduled" && (!scheduledAt || new Date(scheduledAt) <= new Date())) return { error: "Choose a future schedule date." };
  // Publication is always an explicit editor action; saving/autosaving can never infer it.
  if (status === "published" && intent !== "publish") status = requested === "published" ? "published" : "draft";
  const now = new Date().toISOString();
  const payload = {
    title, slug, excerpt:text(form,"excerpt"), content:{ html:bodyHtml }, content_type:text(form,"content_type") || "Analysis",
    category_id:categoryId || null, author_id:authorId || null, status, featured_image_url:text(form,"featured_image_url") || null,
    featured_image_alt:text(form,"featured_image_alt") || null, featured_image_caption:text(form,"featured_image_caption") || null,
    featured_image_credit:text(form,"featured_image_credit") || null, seo_title:text(form,"seo_title") || null,
    seo_description:text(form,"seo_description") || null, canonical_url:text(form,"canonical_url") || null, focus_keyword:text(form,"focus_keyword") || null,
    scheduled_at:status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
    published_at:status === "published" ? now : null, is_editor_pick:form.get("is_editor_pick") === "on", is_featured:form.get("is_featured") === "on",
    include_in_newsletter:form.get("include_in_newsletter") === "on", reading_time_minutes:Math.max(1, Math.ceil(plainText(bodyHtml).split(/\s+/).length / 220)), updated_by:profile.id,
  };
  let postId = id;
  let oldValues: Record<string, unknown> | null = null;
  if (id) {
    const existing = await supabase.from("posts").select("*").eq("id",id).maybeSingle(); oldValues = existing.data as Record<string,unknown> | null;
    const { error } = await supabase.from("posts").update(payload).eq("id",id); if (error) return { error:error.message };
  } else {
    const { data, error } = await supabase.from("posts").insert({ ...payload, created_by:profile.id }).select("id").single();
    if (error) return { error:error.message }; postId = String((data as Record<string,unknown>).id);
  }
  await Promise.all([
    replaceRelations(supabase, postId, text(form,"tag_ids"), sources),
    createRevision(supabase, postId, profile.id, title, text(form,"excerpt"), bodyHtml, text(form,"change_note") || intent),
    supabase.from("audit_logs").insert({ actor_id:profile.id, action:`post.${intent}`, entity_type:"post", entity_id:postId, old_values:oldValues, new_values:{ status, title, slug } }),
  ]);
  revalidatePath("/admin/posts"); revalidatePath(`/admin/posts/${postId}`);
  if (!id) redirect(`/admin/posts/${postId}?created=1`);
  return { ok:true, savedAt:now, id:postId };
}

async function replaceRelations(supabase:any, postId:string, rawTags:string, sources:{label:string;url:string;publisher?:string}[]) {
  await supabase.from("post_tags").delete().eq("post_id",postId);
  const tags = rawTags.split(",").filter(Boolean); if (tags.length) await supabase.from("post_tags").insert(tags.map(tag_id => ({post_id:postId,tag_id})));
  await supabase.from("post_sources").delete().eq("post_id",postId);
  if (sources.length) await supabase.from("post_sources").insert(sources.map((s,i) => ({post_id:postId,label:s.label,url:s.url,publisher:s.publisher || null,sort_order:i})));
}
async function createRevision(supabase:any, postId:string, userId:string, title:string, excerpt:string, html:string, note:string) {
  const { data } = await supabase.from("post_revisions").select("revision_number").eq("post_id",postId).order("revision_number",{ascending:false}).limit(1).maybeSingle();
  await supabase.from("post_revisions").insert({ post_id:postId, revision_number:Number(data?.revision_number || 0)+1, title, excerpt, content:{html}, change_note:note, created_by:userId });
}
function parseSources(raw:string) { try { const value=JSON.parse(raw); return Array.isArray(value) ? value.filter(x => x && typeof x.label === "string" && /^https?:\/\//.test(x.url)).map(x => ({label:x.label.trim(),url:x.url.trim(),publisher:String(x.publisher || "").trim()})) : []; } catch { return []; } }
