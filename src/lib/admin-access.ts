import "server-only";

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export type AdminAccessResult =
  | { ok: true; identity: { email: string; source: "cloudflare-access" | "development" } }
  | { ok: false; status: 401 | 403; message: string };

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function teamOrigin(value: string) {
  const normalized = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  const url = new URL(normalized);
  if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || !url.hostname.endsWith(".cloudflareaccess.com"))) {
    throw new Error("Invalid Cloudflare Access team domain");
  }
  if (url.pathname !== "/" || url.search || url.hash) throw new Error("Cloudflare Access team domain must be an origin");
  return url.origin;
}

function remoteKeys(origin: string) {
  const url = `${origin}/cdn-cgi/access/certs`;
  let keys = keySets.get(url);
  if (!keys) {
    keys = createRemoteJWKSet(new URL(url));
    keySets.set(url, keys);
  }
  return keys;
}

function payloadEmail(payload: JWTPayload) {
  return typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
}

/** Verify Cloudflare Access JWT, issuer, audience, expiry, signature, and allowed email. */
export async function authenticateAdminAccess(headers: Pick<Headers, "get">): Promise<AdminAccessResult> {
  if (process.env.NODE_ENV === "development") {
    return {
      ok: true,
      identity: {
        email: process.env.MAJOR_INSIGHT_ADMIN_ALLOWED_EMAIL?.trim().toLowerCase() || "development@localhost",
        source: "development"
      }
    };
  }

  const assertion = headers.get("cf-access-jwt-assertion");
  if (!assertion) return { ok: false, status: 401, message: "Administrator access is required." };

  const domain = process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN?.trim();
  const audience = (process.env.CLOUDFLARE_ACCESS_AUD ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const allowedEmail = process.env.MAJOR_INSIGHT_ADMIN_ALLOWED_EMAIL?.trim().toLowerCase();
  if (!domain || audience.length === 0 || !allowedEmail) return { ok: false, status: 403, message: "Administrator access is not configured." };

  try {
    const issuer = teamOrigin(domain);
    const { payload } = await jwtVerify(assertion, remoteKeys(issuer), { issuer, audience });
    const email = payloadEmail(payload);
    if (!email || email !== allowedEmail) return { ok: false, status: 403, message: "This account does not have administrator access." };
    return { ok: true, identity: { email, source: "cloudflare-access" } };
  } catch (error) {
    console.error("Cloudflare Access verification failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      code: typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code ?? "") : ""
    });
    return { ok: false, status: 403, message: "Invalid administrator session." };
  }
}
