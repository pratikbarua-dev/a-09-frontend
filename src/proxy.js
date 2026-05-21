// src/proxy.js
// Optimistic proxy — checks for cookie existence only (no DB call).
// Strict session validation happens inside pages/route handlers via auth.api.getSession().

import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedRoutes = ["/profile", "/appointments"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Optimistically check for session cookie existence
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists — allow through (strict validation done server-side)
  return NextResponse.next();
}

export const config = {
  // Only run proxy on these paths
  matcher: ["/profile/:path*", "/appointments/:path*"],
};
