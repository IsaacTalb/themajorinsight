import { PageHeader } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { repository } from "@/lib/repository";

export default async function NewPostPage() {
  const { profile } = await requireAdmin(["owner", "admin", "editor", "author"]);
  const [authors, categories, tags] = await Promise.all([repository.posts.all(), repository.posts.all(), repository.posts.all()]);
  return <main className="admin-main editor-page"><PageHeader eyebrow="Content / Posts" title="Create article" description="Draft, source, optimize, and submit a complete editorial story." /><PostEditor authors={(authors || []) as any} categories={(categories || []) as any} tags={(tags || []) as any} canApprove={["owner", "admin", "editor"].includes(profile.role)} /></main>;
}
