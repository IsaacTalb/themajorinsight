import { NextResponse } from "next/server";
import { callSupabaseRpc, isSupabaseConfigured } from "@/lib/supabase";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_: Request, { params }: RouteContext) {
  if (!isSupabaseConfigured) return NextResponse.json({ views: null });
  const { slug } = await params;

  try {
    const views = await callSupabaseRpc<number>("increment_post_view", { post_slug: slug });
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: null });
  }
}
