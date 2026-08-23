import { PageHeader } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/admin-auth";

export default async function Page(){const {supabase,profile}=await requireAdmin();const {data}=await supabase.from("media_assets").select("*").order("created_at",{ascending:false}).limit(200);const {data:posts}=await supabase.from("posts").select("id,title").order("updated_at",{ascending:false}).limit(100);return <main className="admin-main media-page"><PageHeader eyebrow="Editorial" title="Media library" description="Upload licensed editorial images to R2 and manage searchable metadata."/><MediaLibrary initialAssets={(data||[]) as any[]} posts={(posts||[]) as any[]} canDelete={["owner","admin"].includes(profile.role)}/></main>}
