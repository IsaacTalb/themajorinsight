import { NextRequest, NextResponse } from "next/server";
const ACCESS_COOKIE = "tmi-admin-access";

// Next.js 16 uses proxy.ts for an early authentication gate. The protected
// server layout performs the authoritative user and role check on every route.
export function proxy(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  if (!isLogin && !request.cookies.has(ACCESS_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
