

import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { error: "Unauthorized: No valid session" },
      { status: 401 }
    );
  }

  // Return user data (Better Auth already strips sensitive fields)
  return Response.json({
    user: session.user,
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
    },
  });
}
