"use server";

import { redirect } from "next/navigation";

export type LoginState = { error?: string };

/** Password login was replaced by Cloudflare Zero Trust. */
export async function login(): Promise<LoginState> {
  return { error: "Sign in through Cloudflare Access on the production admin URL." };
}

export async function logout() {
  redirect("/cdn-cgi/access/logout");
}
