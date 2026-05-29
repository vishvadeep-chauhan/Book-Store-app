// Edge-safe auth config — NO bcrypt, NO PrismaAdapter, NO Node.js APIs.
// Used by middleware.ts which runs on the Edge runtime.
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : "bookify-local-dev-secret"),
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["id"] = user.id as string;
        token["role"] = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token["id"] as string;
        (session.user as { role?: string }).role = token["role"] as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
