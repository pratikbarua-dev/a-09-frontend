// src/lib/session.js
// Reusable server-side session helpers for Server Components and Route Handlers.
// Uses Better Auth's auth.api.getSession() for strict DB-validated session checks.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Get the authenticated session in a Server Component or Route Handler.
 * Returns { user, session } if authenticated, or null if not.
 *
 * Usage in Server Component:
 *   const session = await getSession();
 *   if (!session) redirect("/login");
 *   // session.user.name, session.user.email, etc.
 *
 * Usage in Route Handler:
 *   const session = await getSession();
 *   if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session; // { user, session } or null
}
