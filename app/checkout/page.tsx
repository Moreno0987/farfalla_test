"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function CheckoutPage() {
const { cart, getTotal, clearCart } = useCart();
const router = useRouter();
const total = getTotal();
const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
const [form, setForm] = useState({ customer_name: "", customer_email: "", customer_phone: "", customer_address: "" });
const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "whatsapp">("bank_transfer");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const update = (field: keyof typeof form, val: string) => setForm(f => ({ ...f, [field]: val }));
const handleSubmit = async () => {
if (!form.customer_name || !form.customer_phone || !form.customer_address) {
setError("Mohon lengkapi nama, nomor HP, dan alamat."); return;
}
if (cart.length === 0) { setError("Keranjang kosong."); return; }
setLoading(true); setError("");
try {
  const { data, error: err } = await supabase
    .from("orders")
    .insert([{ ...form, items: cart, subtotal: total, shipping_cost: 0, total, payment_method: paymentMethod, payment_status: "pending", order_status: "pending" }])
    .select().single();

  if (err) throw err;
  clearCart();

  if (paymentMethod === "whatsapp") {
    const msg = encodeURIComponent(
      "Halo! Saya ingin memesan:\n" +
      cart.map(i => `- ${i.name} x${i.quantity} = ${fmt(i.price * i.quantity)}`).join("\n") +
      `\nTotal: ${fmt(total)}\nNama: ${form.customer_name}\nAlamat: ${form.customer_address}\nOrder ID: ${data.id}`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  }
  router.push(`/checkout/success?order=${data.id}`);
} catch {
  setError("Terjadi kesalahan. Silakan coba lagi.");
} finally {
  setLoading(false);
}
};
if (cart.length === 0) {
return (
<div style={{ maxWidth: 600, margin: "4rem auto", padding: "1.5rem", textAlign: "center" }}>
<div className="serif" style={{ fontSize: 48, opacity: 0.3, marginBottom: "1rem" }}>○</div>
<p className="serif" style={{ fontSize: 22, fontStyle: "italic" }}>Keranjang masih kosong</p>
<Link href="/products"><button className="btn-primary" style={{ marginTop: "1.5rem" }}>Mulai Belanja</button></Link>
</div>
);
}
return (
<div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
<p className="section-label" style={{ marginBottom: 4 }}>Checkout</p>
<h1 className="serif" style={{ fontSize: 28, fontStyle: "italic", fontWeight: 400, marginBottom: "2rem" }}>Selesaikan Pesanan</h1>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
    {/* Form */}
    <div>
      <h2 style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bali-tan)", marginBottom: "1rem" }}>Informasi Pengiriman</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { label: "Nama Lengkap *", field: "customer_name", type: "text", placeholder: "Nama Anda" },
          { label: "Nomor HP / WhatsApp *", field: "customer_phone", type: "tel", placeholder: "08xxxxxxxxxx" },
          { label: "Email", field: "customer_email", type: "email", placeholder: "email@anda.com" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label style={{ fontSize: 11, color: "var(--bali-tan)", display: "block", marginBottom: 4 }}>{label}</label>
            <input type={type} value={form[field as keyof typeof form]} onChange={e => update(field as keyof typeof form, e.target.value)} placeholder={placeholder} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 11, color: "var(--bali-tan)", display: "block", marginBottom: 4 }}>Alamat Lengkap *</label>
          <textarea value={form.customer_address} onChange={e => update("customer_address", e.target.value)} placeholder="Jalan, Kelurahan, Kota, Provinsi, Kode Pos" rows={3} style={{ resize: "vertical" }} />
        </div>
      </div>

      <h2 style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bali-tan)", marginBottom: "1rem" }}>Metode Pembayaran</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
        {[
          { value: "bank_transfer", label: "Transfer Bank", sub: "BCA · Mandiri · BNI · BRI · GoPay · QRIS", icon: "🏦" },
          { value: "whatsapp", label: "Via WhatsApp", sub: "Konfirmasi & bayar bersama admin", icon: "📱" },
        ].map(m => (
          <label key={m.value} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: paymentMethod === m.value ? "1px solid var(--bali-tan)" : "0.5px solid var(--bali-border)", borderRadius: 6, cursor: "pointer", background: paymentMethod === m.value ? "#FAF5EB" : "#fff" }}>
            <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value as "bank_transfer" | "whatsapp")} style={{ accentColor: "var(--bali-tan)" }} />
            <span style={{ fontSize: 20 }}>{m.icon}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: 11, color: "var(--bali-tan)", margin: 0 }}>{m.sub}</p>
            </div>
          </label>
        ))}
      </div>

      {error && <p style={{ fontSize: 12, color: "#c0392b", background: "#fdecea", padding: "8px 12px", borderRadius: 4, marginBottom: "1rem" }}>{error}</p>}
      <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px 22px", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Memproses..." : paymentMethod === "whatsapp" ? "Pesan via WhatsApp ↗" : "Buat Pesanan →"}
      </button>
    </div>

    {/* Ringkasan */}
    <div>
      <h2 style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--bali-tan)", marginBottom: "1rem" }}>Ringkasan Pesanan</h2>
      <div className="pcard" style={{ padding: "1rem", marginBottom: "1rem" }}>
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "0.5px solid var(--bali-border)", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <p className="serif" style={{ fontSize: 14, fontStyle: "italic", margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: 11, color: "var(--bali-muted)", margin: "2px 0 0" }}>x{item.quantity}</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#7A5C1E", whiteSpace: "nowrap" }}>{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: "var(--bali-tan)" }}>Subtotal</span><span>{fmt(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
            <span style={{ color: "var(--bali-tan)" }}>Ongkos Kirim</span>
            <span style={{ color: "var(--bali-sage)", fontWeight: 500 }}>Gratis</span>
          </div>
          <div style={{ borderTop: "0.5px solid var(--bali-border)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#7A5C1E" }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--bali-muted)", textAlign: "center", lineHeight: 1.6 }}>
        ✦ Setiap produk dibuat dengan tangan oleh pengrajin Bali
      </p>
    </div>
  </div>
</div>
);
}