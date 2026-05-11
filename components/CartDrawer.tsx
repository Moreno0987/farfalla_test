"use client";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
export default function CartDrawer() {
const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotal } = useCart();
const total = getTotal();
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
if (!isOpen) return null;
return (
<>
<div className="cart-overlay" onClick={closeCart} />
<div className="cart-drawer">
{/* Header */}
<div style={{ background: "var(--bali-brown)", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
<span style={{ color: "var(--bali-cream)", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em" }}>
Keranjang ({cart.length})
</span>
<button onClick={closeCart} style={{ background: "none", border: "none", color: "var(--bali-muted)", cursor: "pointer" }}>
<X size={18} />
</button>
</div>
{/* Items */}
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--bali-tan)" }}>
          <div className="serif" style={{ fontSize: 42, marginBottom: "0.5rem", opacity: 0.3 }}>○</div>
          <p style={{ fontSize: 13 }}>Keranjang masih kosong</p>
          <button onClick={closeCart} className="btn-outline" style={{ marginTop: "1rem", fontSize: 11 }}>
            Jelajahi Koleksi
          </button>
        </div>
      ) : (
        cart.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: "0.75rem", padding: "0.875rem 0", borderBottom: "0.5px solid var(--bali-border)" }}>
            <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #D4B896 0%, #8B6C42 60%, #5C3D20 100%)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,237,216,0.8)", fontSize: 22, flexShrink: 0 }}>
              ○
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="serif" style={{ fontSize: 14, fontStyle: "italic", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.name}
              </p>
              {item.customization?.engrave_name && (
                <p style={{ fontSize: 10, color: "var(--bali-tan)", marginBottom: 2 }}>Ukiran: {item.customization.engrave_name}</p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#7A5C1E" }}>{fmt(item.price * item.quantity)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 24, height: 24, border: "0.5px solid var(--bali-border-mid)", borderRadius: 3, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Minus size={10} />
                  </button>
                  <span style={{ fontSize: 12, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 24, height: 24, border: "0.5px solid var(--bali-border-mid)", borderRadius: 3, background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={10} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", color: "#C0A080" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Footer */}
    {cart.length > 0 && (
      <div style={{ borderTop: "0.5px solid var(--bali-border)", padding: "1rem 1.25rem", flexShrink: 0, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: "var(--bali-tan)" }}>Subtotal</span>
          <span style={{ fontWeight: 500 }}>{fmt(total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 16 }}>
          <span style={{ color: "var(--bali-tan)" }}>Ongkos Kirim</span>
          <span style={{ color: "var(--bali-sage)", fontWeight: 500 }}>Gratis</span>
        </div>
        <Link href="/checkout" onClick={closeCart}>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>
            Lanjut ke Checkout <ArrowRight size={14} />
          </button>
        </Link>
        <a href={`https://wa.me/6281234567890?text=Halo! Saya ingin checkout pesanan senilai ${fmt(total)}`} target="_blank" rel="noopener noreferrer">
          <button className="btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
            Chat Admin WhatsApp ↗
          </button>
        </a>
      </div>
    )}
  </div>
</>
);
}