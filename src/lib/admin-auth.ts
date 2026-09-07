import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ACCESS_COOKIE = "tmi-admin-access";
export const REFRESH_COOKIE = "tmi-admin-refresh";
export type AdminRole = "owner" | "admin" | "editor" | "author";

export async function getAdmin() {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  const decoded = Buffer.from(accessToken, "base64").toString("utf8");
  if (!decoded) return null;
  return { user: { email: decoded }, profile: { id: decoded, display_name: decoded, role: "admin" as AdminRole, active: true } };
}

export async function requireAdmin(roles?: AdminRole[]) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.profile.role)) redirect("/admin?denied=1");
  return { ...admin, supabase: null };
}

export function createAuthClient() { return null; }
