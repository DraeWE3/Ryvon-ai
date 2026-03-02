import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.email === (process.env.ADMIN_EMAIL || "draewe3@gmail.com");
      const isOnPublicPage = nextUrl.pathname.startsWith("/login");
      const isOnAdminPage = nextUrl.pathname.startsWith("/admin");

      // Redirect logged-in users away from /login to /welcome (or chat)
      if (isOnPublicPage && isLoggedIn) {
        return Response.redirect(new URL("/welcome", nextUrl));
      }

      // Restrict admin pages
      if (isOnAdminPage) {
        if (!isLoggedIn) return false; // Force sign in
        if (!isAdmin) return Response.redirect(new URL("/", nextUrl)); // Redirect non-admins to home
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
