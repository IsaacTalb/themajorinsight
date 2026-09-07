import { PageHeader } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/admin-auth";
import { repository } from "@/lib/repository";

export default async function Page() {
  const { profile } = await requireAdmin();
  const data = await repository.media.all();
  const posts = await repository.posts.all();
  return (
    <main className="admin-main media-page">
      <PageHeader eyebrow="Editorial" title="Media library" description="Upload licensed editorial images to R2 and manage searchable metadata." />
      <MediaLibrary initialAssets={(data || []) as any[]} posts={(posts || []) as any[]} canDelete={["owner", "admin"].includes(profile.role)} />
    </main>
  );
}
