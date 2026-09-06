import { EmptyState, PageHeader } from "@/components/admin/AdminShell";
import { getPosts } from "@/lib/admin-data";

function summarize(posts: Awaited<ReturnType<typeof getPosts>>) {
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count ?? 0), 0);
  const recent = [...posts].sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? "")).slice(0, 5);
  const mostRead = [...posts].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0)).slice(0, 5);
  return { totalViews, recent, mostRead };
}

export default async function AnalyticsPage() {
  const posts = await getPosts(100);
  const { totalViews, recent, mostRead } = summarize(posts);
  const viewed = posts.filter((post) => (post.view_count ?? 0) > 0);

  return (
    <main className="admin-main">
      <PageHeader eyebrow="Performance" title="Analytics" description="First-party view totals recorded for published insights." />
      {posts.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <section className="admin-card"><p className="text-sm text-muted">Total article views</p><p className="mt-2 text-3xl font-semibold">{totalViews.toLocaleString()}</p></section>
            <section className="admin-card"><p className="text-sm text-muted">Recent views</p><p className="mt-2 text-3xl font-semibold">{recent.length}</p></section>
            <section className="admin-card"><p className="text-sm text-muted">Most-read posts</p><p className="mt-2 text-3xl font-semibold">{mostRead.length}</p></section>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Recent posts</th><th>Views</th></tr></thead><tbody>{recent.map((post) => <tr key={post.id}><td>{post.title}</td><td>{post.view_count.toLocaleString()}</td></tr>)}</tbody></table></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Most read</th><th>Views</th></tr></thead><tbody>{mostRead.map((post) => <tr key={post.id}><td>{post.title}</td><td>{post.view_count.toLocaleString()}</td></tr>)}</tbody></table></div>
          </div>
          <div className="mt-6 admin-table-wrap"><table className="admin-table"><thead><tr><th>Viewed posts</th><th>Views</th></tr></thead><tbody>{viewed.sort((a, b) => b.view_count - a.view_count).map((post) => <tr key={post.id}><td>{post.title}</td><td>{post.view_count.toLocaleString()}</td></tr>)}</tbody></table></div>
        </>
      ) : (
        <EmptyState title="No analytics available" detail="Nothing is estimated or fabricated. Recorded views will appear here." />
      )}
    </main>
  );
}
