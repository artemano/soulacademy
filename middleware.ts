import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const pathname = nextUrl.pathname;

  if (isApiAuthRoute || publicRoutes) {
    console.log("API_ROUTE: ", pathname);
    return;
  }
  if (isAuthRoute) {
    console.log("AUTH_ROUTE: ", pathname);
    if (isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return;
  }
  if (!isLoggedIn && !isPublicRoute) {
    console.log("NOT_AUTH: ", pathname);
    return Response.redirect(new URL("/login", nextUrl));
  }
  return;
});

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};
