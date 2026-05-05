import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("sb-access-token");

  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/checkout")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
