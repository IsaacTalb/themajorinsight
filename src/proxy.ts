import { NextResponse, type NextRequest } from "next/server";

/**
 * Cloudflare Zero Trust is the outer authentication boundary for /admin/*.
 * The protected server layout performs authoritative JWT verification.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
