import NextAuth from 'next-auth';
import { authConfig } from './app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isOnPublicPage = nextUrl.pathname.startsWith("/login");
  const isOnAdminPage = nextUrl.pathname.startsWith("/admin");
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "draewe3@gmail.com";

  if (!isLoggedIn && !isOnPublicPage) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isOnAdminPage && req.auth?.user?.email !== ADMIN_EMAIL) {
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img|img-log|img-sidebar|font|images).*)'],
};
