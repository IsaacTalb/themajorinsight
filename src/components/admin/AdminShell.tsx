import Link from "next/link";
import { logout } from "@/app/admin/login/actions";
import type { AdminRole } from "@/lib/admin-auth";

const nav = [
  ["Overview", "/admin"], ["Posts", "/admin/posts"], ["Categories", "/admin/categories"],
  ["Tags", "/admin/tags"], ["Authors", "/admin/authors"], ["Media", "/admin/media"],
  ["Newsletter", "/admin/newsletter"], ["Trends", "/admin/trends"], ["Analytics", "/admin/analytics"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminShell({ children, name, role }: { children: React.ReactNode; name: string; role: AdminRole }) {
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-wordmark">THE MAJOR<br/>INSIGHT</Link>
      <nav aria-label="Editorial administration">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="admin-account"><strong>{name}</strong><span>{role}</span><form action={logout}><button>Sign out</button></form></div>
    </aside>
    <div className="admin-workspace"><header><span>Editorial desk</span><Link href="/" target="_blank">View site ↗</Link></header>{children}</div>
  </div>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="admin-page-header"><div>{eyebrow && <p>{eyebrow}</p>}<h1>{title}</h1>{description && <span>{description}</span>}</div>{action}</div>;
}

export function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="admin-empty"><strong>{title}</strong><p>{detail}</p></div>; }

export function Status({ value }: { value: string }) { return <span className={`admin-status status-${value}`}>{value === "review" ? "Awaiting review" : value}</span>; }
