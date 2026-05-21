// lib/auth-client.js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // use the public prefix
});

// Optional: export named methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
