import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/checkout",
  "/orders",
  "/orders/[id]",
  "/checkout/success",
]);

const canonicalHost = "www.rideright.ke";
const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent
) {
  // Redirect non-www to www (e.g. rideright.ke -> www.rideright.ke)
  const hostname = request.headers.get("host") ?? "";
  if (hostname === "rideright.ke" || hostname === "rideright.ke:3000") {
    const newUrl = new URL(request.url);
    newUrl.host = canonicalHost;
    newUrl.protocol = "https:";
    return NextResponse.redirect(newUrl, 301);
  }

  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
