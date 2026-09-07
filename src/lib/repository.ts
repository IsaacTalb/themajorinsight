import "server-only";

type Row = Record<string, unknown>;

const tables = {
  posts: [] as Row[],
  media_assets: [] as Row[],
  site_settings: [] as Row[],
  newsletter_subscribers: [] as Row[],
  trend_topics: [] as Row[],
  audit_logs: [] as Row[]
};

function rows(table: keyof typeof tables) {
  return tables[table];
}

function all(table: keyof typeof tables) {
  return Promise.resolve(rows(table));
}

function find(table: keyof typeof tables, id: string) {
  return Promise.resolve(rows(table).find((row) => String(row.id) === id) ?? null);
}

function insert(table: keyof typeof tables, value: Row) {
  rows(table).push(value);
  return Promise.resolve(value);
}

function update(table: keyof typeof tables, id: string, value: Row) {
  const list = rows(table);
  const index = list.findIndex((row) => String(row.id) === id);
  if (index >= 0) list[index] = { ...list[index], ...value, id };
  return Promise.resolve(list[index] ?? value);
}

function remove(table: keyof typeof tables, id: string) {
  const list = rows(table);
  const index = list.findIndex((row) => String(row.id) === id);
  if (index >= 0) list.splice(index, 1);
  return Promise.resolve();
}

export const repository = {
  posts: { all: () => all("posts"), insert: (value: Row) => insert("posts", value), update: (_idKey: string, id: string, value: Row) => update("posts", id, value), remove: (_idKey: string, id: string) => remove("posts", id), find: (_idKey: string, id: string) => find("posts", id) },
  media: { all: () => all("media_assets"), insert: (value: Row) => insert("media_assets", value), update: (_idKey: string, id: string, value: Row) => update("media_assets", id, value), remove: (_idKey: string, id: string) => remove("media_assets", id), find: (_idKey: string, id: string) => find("media_assets", id) },
  settings: { all: () => all("site_settings") },
  newsletter: { all: () => all("newsletter_subscribers") },
  trends: { all: () => all("trend_topics") },
  audit: { all: () => all("audit_logs"), insert: (value: Row) => insert("audit_logs", value) }
};
