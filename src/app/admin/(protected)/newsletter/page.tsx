import { EmptyState, PageHeader } from "@/components/admin/AdminShell";
import { getRows } from "@/lib/admin-data";

export default async function Page() {
  const rows = await getRows("newsletter_subscribers", "id,email,status,source,interests,subscription_date,confirmation_status,bounce_state");

  return (
    <main className="admin-main">
      <PageHeader eyebrow="Editorial" title="Newsletter" description="Monitor subscriber status, sources, interests, and subscription timing." />
      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Source</th>
                <th>Interests</th>
                <th>Subscription date</th>
                <th>Confirmation</th>
                <th>Bounce state</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={String(row.id ?? i)}>
                  <td>{String(row.email ?? "Record")}</td>
                  <td>{String(row.status ?? "-")}</td>
                  <td>{String(row.source ?? "-")}</td>
                  <td>{Array.isArray(row.interests) ? row.interests.join(", ") : String(row.interests ?? "-")}</td>
                  <td>{String(row.subscription_date ?? "-")}</td>
                  <td>{String(row.confirmation_status ?? "-")}</td>
                  <td>{String(row.bounce_state ?? "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No records yet" detail="Records will appear here when they are available in Supabase." />
      )}
    </main>
  );
}
