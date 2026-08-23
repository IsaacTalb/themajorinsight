import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return <AdminShell name={profile.display_name} role={profile.role}>{children}</AdminShell>;
}
