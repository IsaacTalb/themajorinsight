import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const recentViews = new Map<string, number>();
const REFRESH_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fingerprint = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip") || "anonymous";
  const dedupeKey = `${slug}:${fingerprint}`;
  const now = Date.now();
  const lastSeen = recentViews.get(dedupeKey) ?? 0;

  if (now - lastSeen < REFRESH_WINDOW_MS) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  recentViews.set(dedupeKey, now);

  const client = createAdminSupabaseClient();
  const { error } = await client.rpc("increment_post_view", { post_slug: slug });
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  await client.from("post_view_events").insert({ post_slug: slug, visitor_fingerprint: fingerprint, referrer_path: request.headers.get("referer") ?? null, created_at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
