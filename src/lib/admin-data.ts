import "server-only";
import { requireAdmin } from "@/lib/admin-auth";

export type PostRow = { id: string; title: string; slug: string; status: string; view_count: number; updated_at: string; published_at: string | null };
export async function getPosts(limit = 100) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("posts").select("id,title,slug,status,view_count,updated_at,published_at").order("updated_at", { ascending: false }).limit(limit);
  if (error) return [];
  return (data ?? []) as unknown as PostRow[];
}
export async function getRows(table: "categories" | "tags" | "authors" | "media_assets" | "newsletter_subscribers" | "trend_topics" | "audit_logs", columns = "*") {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from(table).select(columns).limit(100);
  return (data ?? []) as unknown as Record<string, unknown>[];
}
