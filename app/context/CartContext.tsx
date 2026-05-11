"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase/client";

export type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  }) => Promise<"ok" | "login">;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCart([]);
      return;
    }

    const { data: cartData } = await supabase
      .from("carts")
      .select(
        `id, cart_items(id, quantity, products(id, name, price, image_url))`,
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (!cartData) {
      setCart([]);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: CartItem[] = (cartData.cart_items as any[]).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        image_url: item.products.image_url,
      },
    }));

    setCart(items);
  }, []);

  // ✅ Load cart saat pertama kali mount
  useEffect(() => {
    const loadCart = async () => {
      await refreshCart();
    };
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Refresh cart saat auth berubah (login/logout)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        refreshCart();
      } else {
        setCart([]);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrCreateCart = async (userId: string): Promise<string> => {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.id) return existing.id;

    const { data: newCart, error } = await supabase
      .from("carts")
      .insert([{ user_id: userId }])
      .select("id")
      .single();

    if (error) throw error;
    return newCart.id;
  };

  const addToCart = async (product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  }): Promise<"ok" | "login"> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      localStorage.setItem(
        "postLoginAction",
        JSON.stringify({ type: "add_to_cart", product }),
      );
      return "login";
    }

    try {
      setLoading(true);
      const cartId = await getOrCreateCart(user.id);

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
      } else {
        await supabase
          .from("cart_items")
          .insert([{ cart_id: cartId, product_id: product.id, quantity: 1 }]);
      }

      await refreshCart();
      return "ok";
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    await supabase
      .from("cart_items")
      .update({ quantity: qty })
      .eq("id", cartItemId);
    await refreshCart();
  };

  const clearCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cartData } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartData?.id) {
      await supabase.from("cart_items").delete().eq("cart_id", cartData.id);
    }
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
