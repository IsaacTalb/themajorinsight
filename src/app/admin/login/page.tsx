import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";

export const metadata = { title: "Editorial sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="admin-login">
      <section>
        <p className="admin-brand">THE MAJOR INSIGHT</p>
        <h1>Editorial administration</h1>
        <p className="admin-muted">Administrator access is protected by Cloudflare Zero Trust. Open the production admin URL and sign in through Cloudflare Access.</p>
      </section>
    </main>
  );
}
