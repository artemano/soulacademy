//import { authMiddleware } from "@clerk/nextjs";

import { NextRequest } from "next/server";
import { getQueryParamsFromURL, toQueryString } from "./app/lib/url-utils";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
// export default authMiddleware({
//   publicRoutes: ["/api/webhook", "/api/uploadthing",],
// });
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ["/dashboard", "/teacher",],

  //  matcher: ["/((api|_next/static|_next/image|images|favicon.ico|login|register|recover|reset-password|search).*)",],
};
