import "server-only";

type Row = Record<string, unknown>;

const memoryStore = new Map<string, Row[]>();

function seed(table: string) {
  if (!memoryStore.has(table)) memoryStore.set(table, []);
  return memoryStore.get(table)!;
}

function query(table: string) {
  const rows = seed(table);
  return {
    async all() { return rows; },
    async insert(value: Row) { rows.push(value); return value; },
    async update(idKey: string, id: string, value: Row) {
      const index = rows.findIndex((row) => String(row[idKey]) === id);
      if (index >= 0) rows[index] = { ...rows[index], ...value };
      return rows[index] ?? null;
    },
    async remove(idKey: string, id: string) { const index = rows.findIndex((row) => String(row[idKey]) === id); if (index >= 0) rows.splice(index, 1); },
    async find(idKey: string, id: string) { return rows.find((row) => String(row[idKey]) === id) ?? null; }
  };
}

export const repository = {
  posts: query("posts"),
  media: query("media_assets"),
  settings: query("site_settings"),
  newsletter: query("newsletter_subscribers"),
  trends: query("trend_topics"),
  audit: query("audit_logs")
};
