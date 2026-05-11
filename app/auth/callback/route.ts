import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  let redirectTo = searchParams.get("redirect") || "/products";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL belum diset");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // 🔒 Cegah open redirect
  if (!redirectTo.startsWith("/")) {
    redirectTo = "/products";
  }

  if (code) {
    // ✅ Gunakan ANON KEY, bukan service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
    }
  }

  return NextResponse.redirect(`${baseUrl}${redirectTo}`);
}
