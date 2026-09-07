import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && anonKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const;

function requireConfig(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function createPublicSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !anonKey) return null;
  return createClient<Database>(requireConfig("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl), requireConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey), options);
}

export function createAdminSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service role is not configured");
  return createClient<Database>(requireConfig("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl), requireConfig("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey), options);
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
