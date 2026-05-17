import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

  if (!redirectTo.startsWith("/")) {
    redirectTo = "/products";
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(
            cookiesToSet: Array<{
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }>,
          ) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Record<string, unknown>),
            );
          },
        },
      },
    );

    const { data: sessionData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
    }

    const userId = sessionData.session?.user?.id;

    if (userId) {
      const productId = searchParams.get("product_id");
      const productName = searchParams.get("product_name");
      const productPrice = searchParams.get("product_price");

      if (productId && productName && productPrice) {
        try {
          const { data: existingCart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

          let cartId = existingCart?.id;

          if (!cartId) {
            const { data: newCart } = await supabase
              .from("carts")
              .insert([{ user_id: userId }])
              .select("id")
              .single();
            cartId = newCart?.id;
          }

          if (cartId) {
            const { data: existingItem } = await supabase
              .from("cart_items")
              .select("id, quantity")
              .eq("cart_id", cartId)
              .eq("product_id", productId)
              .maybeSingle();

            if (existingItem) {
              await supabase
                .from("cart_items")
                .update({ quantity: existingItem.quantity + 1 })
                .eq("id", existingItem.id);
            } else {
              await supabase
                .from("cart_items")
                .insert([
                  { cart_id: cartId, product_id: productId, quantity: 1 },
                ]);
            }
          }

          redirectTo = "/cart";
        } catch (err) {
          console.error("Auto add to cart error:", err);
        }
      }
    }
  }

  return NextResponse.redirect(`${baseUrl}${redirectTo}`);
}
