import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateAdminAccess } from "@/lib/admin-access";

export type AdminRole = "owner" | "admin" | "editor" | "author";

export async function getAdmin() {
  const authentication = await authenticateAdminAccess(await headers());
  if (!authentication.ok) return null;
  const email = authentication.identity.email;
  return {
    user: { email },
    profile: { id: email, display_name: email, role: "admin" as AdminRole, active: true }
  };
}

export async function requireAdmin(roles?: AdminRole[]) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.profile.role)) redirect("/admin?denied=1");
  return { ...admin, supabase: null };
}
