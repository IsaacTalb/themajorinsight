import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, message: "A valid email is required." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Newsletter capture placeholder received. Connect Supabase and Resend before production launch.",
    email
  });
}
