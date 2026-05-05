import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  let redirectTo = searchParams.get("redirect") || "/";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.error("BASE URL belum diset");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // 🔒 Prevent open redirect (best practice)
  if (!redirectTo.startsWith("/")) {
    redirectTo = "/";
  }

  if (code) {
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string,
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
    }
  }

  // 🔥 FIX UTAMA: gunakan BASE URL, bukan request.url
  return NextResponse.redirect(`${baseUrl}${redirectTo}`);
}
