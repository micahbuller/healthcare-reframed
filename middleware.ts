import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware that protects /admin/analytics.
 * Any request without a valid admin_auth cookie is redirected to /admin/login.
 *
 * The cookie value is SHA-256(ADMIN_ANALYTICS_PASSWORD), computed at login time
 * by /api/admin/login and re-verified here using the Web Crypto API (Edge-compatible).
 */

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/analytics")) {
    const cookie = request.cookies.get("admin_auth");
    const adminPassword = process.env.ADMIN_ANALYTICS_PASSWORD;

    if (!cookie?.value || !adminPassword) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const expected = await sha256Hex(adminPassword);
    if (cookie.value !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/analytics/:path*"],
};
