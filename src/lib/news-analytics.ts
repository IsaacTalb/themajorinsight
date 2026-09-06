import "server-only";
import { createAdminSupabaseClient, createPublicSupabaseClient } from "@/lib/supabase";

export async function recordArticleView(slug: string) {
  const client = createAdminSupabaseClient();
  const { error } = await client.rpc("increment_post_view", { post_slug: slug });
  if (error) throw error;
}

export async function listRecentViews(limit = 10) {
  const client = createAdminSupabaseClient();
  const { data } = await client.from("post_view_events").select("post_slug,created_at,referrer_path,visitor_fingerprint").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as Array<{ post_slug: string; created_at: string; referrer_path?: string | null; visitor_fingerprint?: string | null }>;
}

export async function listNewsletterGrowth(limit = 10) {
  const client = createAdminSupabaseClient();
  const { data } = await client.from("newsletter_subscribers").select("email,status,source,created_at").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as Array<{ email: string; status?: string | null; source?: string | null; created_at?: string | null }>;
}

export async function listTrendCandidates(limit = 10) {
  const client = createPublicSupabaseClient();
  if (!client) return [];
  const { data } = await client.from("trend_topics").select("keyword,source,category,region,score,status,source_url,discovered_at").order("score", { ascending: false }).limit(limit);
  return (data ?? []) as Array<{ keyword: string; source?: string | null; category?: string | null; region?: string | null; score?: number | null; status?: string | null; source_url?: string | null; discovered_at?: string | null }>;
}
