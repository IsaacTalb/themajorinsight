import Link from "next/link";
import { EmptyState, PageHeader, Status } from "@/components/admin/AdminShell";
import { getPosts, getRows } from "@/lib/admin-data";
export default async function Dashboard() {
  const [posts, subscribers, activity] = await Promise.all([getPosts(), getRows("newsletter_subscribers", "id,status"), getRows("audit_logs")]);
  const count = (s: string) => posts.filter(p => p.status === s).length;
  const views = posts.reduce((sum, p) => sum + Number(p.view_count || 0), 0);
  const metrics = [["Published insights", count("published")], ["Drafts", count("draft")], ["Awaiting review", count("review")], ["Scheduled", count("scheduled")], ["Total views", views], ["Subscribers", subscribers.filter(s => s.status === "active").length]];
  return <main className="admin-main"><PageHeader eyebrow="Overview" title="Dashboard" description="A live view of your editorial operation." action={<Link className="admin-primary" href="/admin/posts/new">New post</Link>} />
    <section className="admin-metrics">{metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{Number(value).toLocaleString()}</strong></div>)}</section>
    <div className="admin-grid"><section className="admin-panel"><h2>Recent posts</h2>{posts.length ? <div className="admin-list">{posts.slice(0, 6).map(p => <Link href={`/admin/posts/${p.id}`} key={p.id}><span><strong>{p.title}</strong><small>Updated {new Date(p.updated_at).toLocaleDateString()}</small></span><Status value={p.status}/></Link>)}</div> : <EmptyState title="No posts yet" detail="Create the first insight to begin your editorial workflow." />}</section>
    <section className="admin-panel"><h2>Popular posts</h2>{posts.some(p => p.view_count > 0) ? <div className="admin-list">{posts.filter(p => p.view_count > 0).sort((a,b) => b.view_count-a.view_count).slice(0,5).map(p => <Link href={`/admin/posts/${p.id}`} key={p.id}><strong>{p.title}</strong><span>{p.view_count.toLocaleString()} views</span></Link>)}</div> : <EmptyState title="No view data yet" detail="Popular insights will appear when recorded views are available." />}</section></div>
    <section className="admin-panel"><h2>Recent activity</h2>{activity.length ? <div className="admin-list">{activity.slice(0,8).map((a,i) => <div key={String(a.id ?? i)}><strong>{String(a.action ?? "Activity")}</strong><span>{String(a.entity_type ?? "")}</span></div>)}</div> : <EmptyState title="No activity recorded" detail="Editorial changes will be listed here when audit events exist." />}</section>
  </main>;
}
