import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, writeToSupabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const interestedTopics = new Set(["finance", "markets", "tech", "ai", "science", "future", "pulse"]);

function safeString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = safeString(formData.get("email")).toLowerCase();
  const source = safeString(formData.get("source")) || "website";
  const interests = safeString(formData.get("interests"))
    .split(",")
    .map((item) => item.trim())
    .filter((item) => interestedTopics.has(item));

  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, message: "A valid email is required." }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ ok: false, message: "Newsletter signup is not configured yet." }, { status: 503 });
  }

  const { error } = await writeToSupabase("newsletter_subscribers", {
    email,
    source,
    interests,
    status: "pending_confirmation",
    confirmation_status: "pending",
    unsubscribe_token: crypto.randomUUID(),
    bounce_state: "clean",
    signup_source: source
  });

  if (error) {
    return NextResponse.json({ ok: false, message: "We could not save your subscription. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: `Check your inbox to confirm your subscription to ${siteConfig.name}.`
  });
}
