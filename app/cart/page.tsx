"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react"; // Tambahkan ikon untuk estetika

// 🔹 Type RAW dari Supabase
type SupabaseCartItem = {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    subcategory?: string; // Tambahkan subcategory untuk detail
  };
};

type SupabaseCart = {
  id: string;
  cart_items: SupabaseCartItem[];
};

// 🔹 Type untuk UI
type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    subcategory: string;
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user ?? null;

      if (!user) {
        setCartItems([]);
        return;
      }

      const { data, error } = await supabase
        .from("carts")
        .select(`
          id,
          cart_items (
            id,
            quantity,
            products (
              id,
              name,
              price,
              images,
              subcategory
            )
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;

      const cart = data as SupabaseCart | null;

      const items: CartItem[] = cart?.cart_items?.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.images?.[0] || "", // Kosongkan jika belum ada gambar
          subcategory: item.products.subcategory || "Aksesoris",
        },
      })) || [];

      setCartItems(items);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };

    void loadCart();
  }, []);

  // Fungsi hapus item (Opsional, tapi sangat disarankan)
  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (!error) fetchCart();
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 border-2 border-[#D4AA5C] border-t-transparent rounded-full animate-spin"></div>
      <p className="serif italic text-[#7A5C1E] text-lg">Menyiapkan perhiasan Anda...</p>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-12 text-center pcard bg-white">
        <div className="flex justify-center mb-6">
          <ShoppingBag size={48} className="text-[#D4C4AC] stroke-[1px]" />
        </div>
        <h1 className="serif text-3xl mb-4 italic text-[#2C2015]">Tas Belanja Kosong</h1>
        <p className="text-[#8B6C42] mb-10 text-sm tracking-wide">
          Sepertinya Anda belum memilih koleksi perhiasan kami.
        </p>
        <Link href="/products">
          <button className="btn-primary py-3 px-8 text-[10px] tracking-[0.2em]">
            Lihat Koleksi
          </button>
        </Link>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <span className="section-label mb-2 block">Shopping Bag</span>
        <h1 className="serif text-5xl italic text-[#2C2015]">Keranjang</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List Items */}
        <div className="lg:col-span-2 space-y-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-[#E8DDD0] last:border-0 relative group">
              {/* Gambar / Placeholder */}
              <div className="w-24 h-32 bg-[#F5EDD8] flex-shrink-0 overflow-hidden rounded-sm relative">
                {item.product.image ? (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center italic text-[#8B6C42] text-[10px] opacity-40">
                    Farfalla
                  </div>
                )}
              </div>
              
              {/* Detail */}
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <p className="text-[9px] tracking-widest text-[#8B6C42] uppercase mb-1">
                    {item.product.subcategory}
                  </p>
                  <h3 className="serif text-xl text-[#2C2015] mb-2">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[#A89070]">
                    Jumlah: {item.quantity}
                  </p>
                </div>
                
                <p className="text-sm font-medium text-[#2C2015] tracking-tight">
                  Rp {item.product.price.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-[#A89070] hover:text-red-800"
                title="Hapus"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {/* Ringkasan Belanja */}
        <div className="lg:col-span-1">
          <div className="pcard p-8 sticky top-24">
            <h2 className="serif text-2xl italic text-[#2C2015] mb-6">Ringkasan</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-[#8B6C42]">Subtotal</span>
                <span className="text-[#2C2015]">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8B6C42]">Pengiriman</span>
                <span className="text-[#8B6C42] italic">Dihitung saat checkout</span>
              </div>
              <div className="divider !my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-[#2C2015]">Total</span>
                <span className="text-xl font-bold text-[#2C2015]">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="btn-primary w-full py-4 text-[11px] justify-center tracking-[0.2em]">
                PROSES PEMBAYARAN
              </button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] text-[#A89070] uppercase tracking-wider">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}