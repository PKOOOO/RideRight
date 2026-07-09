import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const canonicalHost = "www.rideright.ke";

export default async function proxy(
  request: NextRequest,
  _event: NextFetchEvent
) {
  // Redirect non-www to www (e.g. rideright.ke -> www.rideright.ke)
  const hostname = request.headers.get("host") ?? "";
  if (hostname === "rideright.ke" || hostname === "rideright.ke:3000") {
    const newUrl = new URL(request.url);
    newUrl.host = canonicalHost;
    newUrl.protocol = "https:";
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
