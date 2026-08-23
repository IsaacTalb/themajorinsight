import { notFound } from "next/navigation";
import { PageHeader, Status } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
export default async function PostDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=await params; const {profile,supabase}=await requireAdmin(["owner","admin","editor","author"]);
  const [post,authors,categories,tags,revisions,audit]=await Promise.all([
    supabase.from("posts").select("*,post_tags(tag_id),post_sources(label,url,publisher,sort_order)").eq("id",id).maybeSingle(),
    supabase.from("authors").select("id,name").order("name"),supabase.from("categories").select("id,name").order("name"),supabase.from("tags").select("id,name").order("name"),
    supabase.from("post_revisions").select("id,revision_number,change_note,created_at").eq("post_id",id).order("revision_number",{ascending:false}).limit(12),
    supabase.from("audit_logs").select("id,action,created_at").eq("entity_type","post").eq("entity_id",id).order("created_at",{ascending:false}).limit(12)
  ]);
  if(!post.data)notFound();
  return <main className="admin-main editor-page"><PageHeader eyebrow="Content / Posts" title={String((post.data as any).title)} action={<Status value={String((post.data as any).status)}/>}/><PostEditor post={post.data as any} authors={(authors.data||[]) as any} categories={(categories.data||[]) as any} tags={(tags.data||[]) as any} revisions={(revisions.data||[]) as any} audit={(audit.data||[]) as any} canApprove={["owner","admin","editor"].includes(profile.role)}/></main>;
}
