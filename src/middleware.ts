import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get access token from cookie
  const token = request.cookies.get("accessToken")?.value;
  const isAuthPage =
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup";

  // If accessing a protected route without a token, redirect to login
  if (
    !token &&
    !isAuthPage &&
    (request.nextUrl.pathname.startsWith("/room") ||
      request.nextUrl.pathname.startsWith("/playground"))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If accessing auth pages with a token, redirect to rooms
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/room", request.url));
  }

  return NextResponse.next();
}

// Match these paths where middleware should run
export const config = {
  matcher: ["/room/:path*", "/playground/:path*", "/signin", "/signup"],
};
