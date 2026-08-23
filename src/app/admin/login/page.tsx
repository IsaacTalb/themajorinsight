import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";
export const metadata = { title: "Editorial sign in" };
export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return <main className="admin-login"><section><p className="admin-brand">THE MAJOR INSIGHT</p><h1>Editorial administration</h1><p className="admin-muted">Sign in with your approved staff account.</p><LoginForm /></section></main>;
}
