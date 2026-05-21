// lib/auth-client.js
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [jwtClient()],
});

// Optional: export named methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
