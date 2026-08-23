import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, writeToSupabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, message: "A valid email is required." }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ ok: false, message: "Newsletter signup is not configured yet." }, { status: 503 });
  }

  const { error } = await writeToSupabase("newsletter_subscribers", { email, source: "website" });
  if (error) {
    return NextResponse.json({ ok: false, message: "We could not save your subscription. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: `You are subscribed. Welcome to ${siteConfig.name}.` });
}
