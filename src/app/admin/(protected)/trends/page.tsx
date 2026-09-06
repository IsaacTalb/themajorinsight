import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/admin/AdminShell";
import { getRows } from "@/lib/admin-data";

export default async function Page() {
  const rows = await getRows("trend_topics", "id,keyword,source,category,region,score,source_url,discovered_at,status");

  return (
    <main className="admin-main">
      <PageHeader eyebrow="Editorial" title="Trends" description="Review topics collected by configured trend sources." />
      <p className="mb-4 text-sm text-muted">Trends can be inspected, dismissed, saved, categorized, or converted into draft briefs from this workflow.</p>
      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Source</th>
                <th>Category</th>
                <th>Region</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.id ?? i)}>
                  <td>{String(row.keyword ?? row.topic ?? "Record")}</td>
                  <td>{String(row.source ?? "-")}</td>
                  <td>{String(row.category ?? "-")}</td>
                  <td>{String(row.region ?? "-")}</td>
                  <td>{String(row.score ?? "-")}</td>
                  <td>{String(row.status ?? "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No records yet" detail="Records will appear here when they are available in Supabase." />
      )}
      <p className="mt-4 text-sm text-muted"><Link className="text-link font-semibold" href="/worker">Review the worker automation overview</Link>.</p>
    </main>
  );
}
