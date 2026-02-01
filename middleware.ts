import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const canonicalHost = "www.rideright.ke";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") ?? "";

  // Redirect non-www to www (e.g. rideright.ke -> www.rideright.ke)
  if (hostname === "rideright.ke" || hostname === "rideright.ke:3000") {
    const newUrl = new URL(request.url);
    newUrl.host = canonicalHost;
    newUrl.protocol = "https:";
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static files and api
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, loggo.png, etc.
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|loggo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/).*)",
  ],
};
