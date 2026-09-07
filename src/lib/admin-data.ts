import "server-only";
import { requireAdmin } from "@/lib/admin-auth";
import { repository } from "@/lib/repository";

export type PostRow = { id: string; title: string; slug: string; status: string; view_count: number; updated_at: string; published_at: string | null };
export async function getPosts(limit = 100) {
  await requireAdmin();
  return (await repository.posts.all()).slice(0, limit) as PostRow[];
}
export async function getRows(_table: "categories" | "tags" | "authors" | "media_assets" | "newsletter_subscribers" | "trend_topics" | "audit_logs", _columns = "*") {
  await requireAdmin();
  return [] as Record<string, unknown>[];
}
