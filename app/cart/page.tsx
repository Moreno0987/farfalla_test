"use client";

import { useCart, CartItem } from "../context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, refreshCart } =
    useCart();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login?redirect=/cart");
      else {
        refreshCart();
        setCheckingAuth(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingAuth || loading) {
    return (
      <div className="farfalla-loading">
        <div className="loading-butterfly">🦋</div>
        <p>Memuat keranjang...</p>
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (total: number, item: CartItem) =>
      total + item.product.price * item.quantity,
    0,
  );

  return (
    <main className="farfalla-cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Keranjang Belanja</h1>
        <span className="cart-count">{cart.length} item</span>
      </div>

      {cart.length === 0 ? (
        <div className="farfalla-empty">
          <span className="empty-icon">🛍️</span>
          <p>Keranjang kamu masih kosong</p>
          <Link href="/products" className="farfalla-btn-primary">
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Item List */}
          <div className="cart-items">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="cart-item-placeholder">🦋</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-price">
                    Rp {item.product.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="cart-item-qty">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  Rp{" "}
                  {(item.product.price * item.quantity).toLocaleString("id-ID")}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-item-remove"
                  title="Hapus"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h2 className="summary-title">Ringkasan</h2>

            <div className="summary-rows">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="summary-row">
                  <span>
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span>
                    Rp{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="farfalla-btn-primary w-full mt-6"
            >
              Lanjut ke Checkout →
            </button>

            <Link href="/products" className="summary-continue">
              ← Lanjut belanja
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
