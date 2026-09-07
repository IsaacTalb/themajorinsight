import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  await requireAdmin(["owner", "admin", "editor"]);
  return NextResponse.json({ ok: true, message: "Worker endpoints are deployed separately through Cloudflare Wrangler." });
}
