"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// 🔹 Type dari hasil query Supabase (RAW)
type SupabaseCartItem = {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
  };
};

type SupabaseCart = {
  id: string;
  cart_items: SupabaseCartItem[];
};

// 🔹 Type untuk UI (lebih clean)
type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setCartItems([]);
          return;
        }

        const { data, error } = await supabase
          .from("carts")
          .select(
            `
            id,
            cart_items (
              id,
              quantity,
              products (
                id,
                name,
                price
              )
            )
          `,
          )
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle(); // 🔥 lebih aman

        if (error) {
          console.error(error);
          return;
        }

        const cart = data as SupabaseCart | null;

        // 🔹 Transform dengan type aman
        const items: CartItem[] =
          cart?.cart_items?.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
              id: item.products.id,
              name: item.products.name,
              price: item.products.price,
            },
          })) || [];

        setCartItems(items);
      } catch (err) {
        console.error("Fetch cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (cartItems.length === 0) {
    return <p>Keranjang kosong</p>;
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Keranjang</h1>

      {cartItems.map((item) => (
        <div key={item.id} className="mb-2 border-b pb-2">
          {item.product.name} - {item.quantity} x Rp {item.product.price}
        </div>
      ))}

      <p className="mt-4 font-bold">Total: Rp {totalPrice}</p>
    </div>
  );
}
