"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 🔥 FIX UTAMA: simpan intent
      if (!user) {
        localStorage.setItem(
          "postLoginAction",
          JSON.stringify({
            type: "add_to_cart",
            product,
          }),
        );

        router.push(`/login?redirect=/products`);
        return;
      }

      const userId = user.id;

      const { data: existingCart } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      let cartId = existingCart?.id;

      if (!cartId) {
        const { data: newCart, error } = await supabase
          .from("carts")
          .insert([{ user_id: userId, status: "active" }])
          .select()
          .single();

        if (error) throw error;
        cartId = newCart.id;
      }

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartId)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from("cart_items")
          .update({
            quantity: existingItem.quantity + 1,
          })
          .eq("id", existingItem.id);
      } else {
        await supabase.from("cart_items").insert([
          {
            cart_id: cartId,
            product_id: product.id,
            quantity: 1,
          },
        ]);
      }

      alert("Produk berhasil ditambahkan");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-pink-500 font-bold">Rp {product.price}</p>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`mt-3 w-full py-2 rounded-lg text-white ${
          loading ? "bg-gray-400" : "bg-pink-400 hover:bg-pink-500"
        }`}
      >
        {loading ? "Loading..." : "Add to Cart"}
      </button>
    </div>
  );
}
