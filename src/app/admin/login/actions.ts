"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE, createAuthClient } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const supabase = createAuthClient();
  if (!supabase) return { error: "Authentication is not configured." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return { error: "Invalid email or password." };
  // The profile query must use the user's JWT, not the anonymous client.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const { createClient } = await import("@supabase/supabase-js");
  const userClient = createClient(url, key, { global: { headers: { Authorization: `Bearer ${data.session.access_token}` } } });
  const approved = await userClient.from("admin_profiles").select("id").eq("id", data.user.id).eq("active", true).maybeSingle();
  if (!approved.data) { await supabase.auth.signOut(); return { error: "This account is not approved for editorial access." }; }
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(ACCESS_COOKIE, data.session.access_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: data.session.expires_in });
  store.set(REFRESH_COOKIE, data.session.refresh_token, { httpOnly: true, secure, sameSite: "lax", path: "/admin", maxAge: 60 * 60 * 24 * 30 });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE); store.delete(REFRESH_COOKIE);
  redirect("/admin/login");
}
