type D1Database = { prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } } };
type R2Bucket = unknown;

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  APP_NAME: string;
}

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json; charset=utf-8" }, ...init });
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, app: env.APP_NAME });
    }

    if (url.pathname === "/worker/trends/discover") {
      return json({ ok: true, message: "Trend discovery endpoint ready for D1 integration." });
    }

    if (url.pathname === "/worker/content/opportunities") {
      return json({ ok: true, message: "Editorial opportunities queued for editor review only." });
    }

    return json({ ok: false, message: "Not found" }, { status: 404 });
  }
};
