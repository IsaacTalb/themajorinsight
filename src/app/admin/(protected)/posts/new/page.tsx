import { PageHeader } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
export default async function NewPostPage() {
  const {profile,supabase}=await requireAdmin(["owner","admin","editor","author"]);
  const [authors,categories,tags]=await Promise.all([supabase.from("authors").select("id,name").order("name"),supabase.from("categories").select("id,name").order("name"),supabase.from("tags").select("id,name").order("name")]);
  return <main className="admin-main editor-page"><PageHeader eyebrow="Content / Posts" title="Create article" description="Draft, source, optimize, and submit a complete editorial story."/><PostEditor authors={(authors.data||[]) as any} categories={(categories.data||[]) as any} tags={(tags.data||[]) as any} canApprove={["owner","admin","editor"].includes(profile.role)}/></main>;
}
