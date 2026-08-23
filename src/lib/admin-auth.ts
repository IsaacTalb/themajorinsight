import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export const ACCESS_COOKIE = "tmi-admin-access";
export const REFRESH_COOKIE = "tmi-admin-refresh";
export type AdminRole = "owner" | "admin" | "editor" | "author";

function client(accessToken?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

export async function getAdmin() {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  const supabase = client(accessToken);
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return null;
  const { data } = await supabase.from("admin_profiles").select("id, display_name, role, active").eq("id", user.id).eq("active", true).maybeSingle();
  if (!data) return null;
  return { user, profile: data as unknown as { id: string; display_name: string; role: AdminRole; active: boolean }, supabase };
}

export async function requireAdmin(roles?: AdminRole[]) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.profile.role)) redirect("/admin?denied=1");
  return admin;
}

export function createAuthClient() { return client(); }
