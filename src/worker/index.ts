type D1Database = { prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; all?<T = Record<string, unknown>>(): Promise<{ results: T[] }> } } };
type R2Bucket = unknown;

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  APP_NAME: string;
}

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json; charset=utf-8" }, ...init });
}

async function upsertTrend(env: Env, keyword: string, source: string, category: string, region: string, score: number, status: string, sourceUrl: string) {
  await env.DB.prepare("insert into trend_topics (keyword, source, category, region, score, source_url, status, discovered_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'))").bind(keyword, source, category, region, score, sourceUrl, status).run();
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, app: env.APP_NAME });
    }

    if (url.pathname === "/worker/trends/discover") {
      const token = url.searchParams.get("token");
      if (!token || request.headers.get("authorization") !== `Bearer ${token}`) return json({ ok: false, message: "Unauthorized" }, { status: 401 });
      await upsertTrend(env, "ai tools", "hackernews", "tech-ai", "global", 72, "new", "https://news.ycombinator.com");
      await upsertTrend(env, "mortgage rates", "rss", "finance-markets", "us", 66, "new", "https://example.com/rss");
      return json({ ok: true, message: "Trend discovery recorded." });
    }

    if (url.pathname === "/worker/content/opportunities") {
      return json({ ok: true, message: "Editorial opportunities queued for editor review only." });
    }

    if (url.pathname === "/worker/newsletter/candidates") {
      return json({ ok: true, message: "Newsletter candidates selected for manual review only." });
    }

    return json({ ok: false, message: "Not found" }, { status: 404 });
  }
};
