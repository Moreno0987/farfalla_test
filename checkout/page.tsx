"use client";

import { useCart } from "../app/context/CartContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Profile = {
  name: string | null;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: "" });
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login?redirect=/checkout"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();

      setProfile({ name: data?.name ?? "" });
      setCheckingAuth(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login?redirect=/checkout"); return; }

      // 1. Buat order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          total_price: totalPrice,
          status: "pending",
        }])
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 2. Insert order_items dengan price_snapshot
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_snapshot: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Ambil nomor WA artisan dari produk pertama
      const { data: productData } = await supabase
        .from("products")
        .select("artisan_id, artisans(whatsapp_number, name)")
        .eq("id", cart[0].product.id)
        .maybeSingle();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const artisan = (productData as any)?.artisans;
      const waNumber = artisan?.whatsapp_number?.replace(/\D/g, "") || "6281234567890";

      // 4. Buat pesan WA
      const itemList = cart
        .map((item) => `• ${item.product.name} ×${item.quantity} = Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}`)
        .join("\n");

      const waMessage = encodeURIComponent(
        `Halo Farfalla! 🦋\n\nSaya ingin konfirmasi pesanan:\n\n${itemList}\n\n*Total: Rp ${totalPrice.toLocaleString("id-ID")}*\n${note ? `\nCatatan: ${note}` : ""}\n\nNama: ${profile.name || user.email}\nOrder ID: ${order.id.slice(0, 8).toUpperCase()}`
      );

      // 5. Clear cart & tracking
      await supabase.from("order_tracking").insert([{
        order_id: order.id,
        status: "pending",
        note: "Pesanan baru dibuat",
      }]);

      await clearCart();

      // 6. Redirect ke WA
      window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");
      router.push(`/`);

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Terjadi kesalahan saat checkout. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="farfalla-loading">
        <div className="loading-butterfly">🦋</div>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <main className="farfalla-checkout-page">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Periksa pesanan sebelum konfirmasi</p>
      </div>

      <div className="checkout-layout">
        {/* Order Review */}
        <div className="checkout-items">
          <h2 className="section-label">Pesanan Kamu</h2>

          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="checkout-item-img">
                {item.product.image_url ? (
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover rounded-lg" />
                ) : (
                  <div className="cart-item-placeholder">🦋</div>
                )}
              </div>
              <div className="checkout-item-info">
                <p className="checkout-item-name">{item.product.name}</p>
                <p className="checkout-item-qty">×{item.quantity}</p>
              </div>
              <p className="checkout-item-price">
                Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
              </p>
            </div>
          ))}

          {/* Catatan */}
          <div className="checkout-note">
            <label className="note-label">Catatan (opsional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Warna, ukuran, atau permintaan khusus..."
              className="note-input"
              rows={3}
            />
          </div>
        </div>

        {/* Summary & CTA */}
        <div className="checkout-summary">
          <h2 className="section-label">Ringkasan Pembayaran</h2>

          <div className="summary-rows">
            {cart.map((item) => (
              <div key={item.id} className="summary-row">
                <span>{item.product.name} ×{item.quantity}</span>
                <span>Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>

          <div className="checkout-wa-info">
            <span>💬</span>
            <p>Setelah klik konfirmasi, kamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran dengan pengrajin kami.</p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="farfalla-btn-primary w-full mt-4"
          >
            {loading ? "Memproses..." : "Konfirmasi via WhatsApp 💬"}
          </button>
        </div>
      </div>
    </main>
  );
}