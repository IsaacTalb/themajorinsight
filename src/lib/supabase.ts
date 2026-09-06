import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && anonKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/** RLS-constrained client for server-rendered public content. */
export function createPublicSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !anonKey) return null;
  return createClient<Database>(supabaseUrl, anonKey, options);
}

/** Service-role client. Import only from trusted server routes/actions. */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service role is not configured");
  return createClient<Database>(supabaseUrl, serviceRoleKey, options);
}

export async function writeToSupabase(table: "newsletter_subscribers", body: Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]) {
  const client = createAdminSupabaseClient();
  return client.from(table).upsert(body, { onConflict: "email", ignoreDuplicates: false });
}

export async function callSupabaseRpc<T>(functionName: "increment_post_view", body: { post_slug: string }) {
  const client = createAdminSupabaseClient();
  const { data, error } = await client.rpc(functionName, body);
  if (error) throw error;
  return data as T;
}
