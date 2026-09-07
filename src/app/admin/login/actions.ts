"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  if (process.env.CLOUDFLARE_ADMIN_TOKEN && password !== process.env.CLOUDFLARE_ADMIN_TOKEN) return { error: "Invalid email or password." };
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(ACCESS_COOKIE, Buffer.from(email).toString("base64"), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  store.set(REFRESH_COOKIE, "cloudflare-admin", { httpOnly: true, secure, sameSite: "lax", path: "/admin", maxAge: 60 * 60 * 24 * 30 });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE); store.delete(REFRESH_COOKIE);
  redirect("/admin/login");
}
