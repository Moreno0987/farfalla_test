import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestedPath = request.nextUrl.pathname;
  const requestedSearch = request.nextUrl.search;
  const redirectTarget = encodeURIComponent(requestedPath + requestedSearch);

  if (requestedPath.startsWith("/checkout") || requestedPath.startsWith("/cart")) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${redirectTarget}`, request.url));
    }
  }

  if (requestedPath.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${redirectTarget}`, request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/checkout/:path*", "/cart/:path*", "/admin/:path*"],
};
