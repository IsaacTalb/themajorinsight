import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase";

type Row = Record<string, unknown>;

function d1() {
  const database = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
  if (!database) return null;
  return { database };
}

async function queryAll(table: string) {
  const client = createAdminSupabaseClient();
  const { data } = await client.from(table as never).select("*").limit(500);
  return (data ?? []) as Row[];
}

async function findById(table: string, id: string) {
  const rows = await queryAll(table);
  return rows.find((row) => String(row.id) === id) ?? null;
}

async function upsertRow(table: string, value: Row) {
  const client = createAdminSupabaseClient();
  await client.from(table as never).upsert(value as never, { onConflict: "id", ignoreDuplicates: false });
  return value;
}

async function removeRow(table: string, id: string) {
  const client = createAdminSupabaseClient();
  await client.from(table as never).delete().eq("id", id);
}

export const repository = {
  posts: { all: () => queryAll("posts"), insert: (value: Row) => upsertRow("posts", value), update: (_idKey: string, id: string, value: Row) => upsertRow("posts", { ...value, id }), remove: (idKey: string, id: string) => removeRow("posts", id), find: (idKey: string, id: string) => findById("posts", id) },
  media: { all: () => queryAll("media_assets"), insert: (value: Row) => upsertRow("media_assets", value), update: (_idKey: string, id: string, value: Row) => upsertRow("media_assets", { ...value, id }), remove: (idKey: string, id: string) => removeRow("media_assets", id), find: (idKey: string, id: string) => findById("media_assets", id) },
  settings: { all: () => queryAll("site_settings") },
  newsletter: { all: () => queryAll("newsletter_subscribers") },
  trends: { all: () => queryAll("trend_topics") },
  audit: { all: () => queryAll("audit_logs"), insert: (value: Row) => upsertRow("audit_logs", value) }
};
