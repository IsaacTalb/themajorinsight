import { notFound } from "next/navigation";
import { PageHeader, Status } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin-auth";
import { repository } from "@/lib/repository";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile } = await requireAdmin(["owner", "admin", "editor", "author"]);
  const post = await repository.posts.find("id", id);
  if (!post) notFound();
  const authors = await repository.posts.all();
  const categories = await repository.posts.all();
  const tags = await repository.posts.all();
  const revisions = await repository.posts.all();
  const audit = await repository.audit.all();
  return <main className="admin-main editor-page"><PageHeader eyebrow="Content / Posts" title={String((post as any).title)} action={<Status value={String((post as any).status)} />} /><PostEditor post={post as any} authors={(authors||[]) as any} categories={(categories||[]) as any} tags={(tags||[]) as any} revisions={(revisions||[]) as any} audit={(audit||[]) as any} canApprove={["owner", "admin", "editor"].includes(profile.role)} /></main>;
}
