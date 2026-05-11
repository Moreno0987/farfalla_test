"use client";
export default function WhatsAppFloat() {
return (
<a
href="https://wa.me/6285737611493?text=Halo! Saya tertarik dengan produk Farfalla, bisa bantu saya?"
target="_blank"
rel="noopener noreferrer"
style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}
aria-label="Chat WhatsApp"
>
<div style={{ position: "relative" }}>
<span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1D9E75", animation: "waPulse 2s ease-out infinite" }} />
<div style={{ position: "relative", width: 52, height: 52, background: "#1D9E75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(29,158,117,0.4)", fontSize: 24 }}>
📱
</div>
<div style={{ position: "absolute", top: 2, right: 2, width: 12, height: 12, background: "#C8963E", borderRadius: "50%", border: "2px solid #fff" }} />
</div>
<span style={{ fontSize: 9, color: "var(--bali-tan)", letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(250,245,235,0.9)", padding: "2px 6px", borderRadius: 3 }}>
Chat
</span>
</a>
);
}