import { LogOut } from "lucide-react";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("session_kesiswaan");

  if (request.nextUrl.pathname === "/login") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/kesiswaan"
  ) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login/:path*", "/:path*"],
};
