"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard"; // Import komponen baru
import { createClient } from "@supabase/supabase-js";
import Hero from "@/components/Hero";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

type Product = {
  id: string; 
  name: string; 
  price: number; 
  description?: string;
  category?: string; 
  subcategory?: string; 
  images?: string[];
  stock?: number; 
  rating?: number; 
  review_count?: number;
  badge?: string | null; 
  is_customizable?: boolean; 
  origin?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .gt("stock", 0)
      .order("review_count", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>
      
      {/* 01 — HERO SECTION */}
      <p className="section-label" style={{ marginBottom: "0.75rem" }}>01 — Featured</p>
      <Hero />

      {/* 02 — JELAJAHI KATEGORI */}
      <p className="section-label" style={{ marginBottom: "0.75rem", marginTop: "3rem" }}>02 — Kategori</p>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 16, 
        marginBottom: "3rem" 
      }}>
        <CategoryCard 
          icon="⬡" 
          tag="Heritage" 
          title="The Heritage" 
          desc="Koleksi perak khas Celuk dengan ukiran tradisional Bali yang mendalam." 
          price="Mulai Rp 185.000" 
          href="/products?category=heritage" 
        />
        <CategoryCard 
          icon="◈" 
          tag="Contemporary" 
          title="The Contemporary" 
          desc="Sentuhan minimalis urban menggunakan bahan premium untuk gaya harian." 
          price="Mulai Rp 145.000" 
          href="/products?category=contemporary" 
          terlaris={true}
        />
        <CategoryCard 
          icon="✦" 
          tag="Custom" 
          title="The Creator" 
          desc="Ekspresikan dirimu lewat ukiran nama dan pilihan warna batu alam." 
          price="Request Custom →" 
          href="/products?category=custom" 
        />
      </div>

      {/* 03 — PRODUK UNGGULAN */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <p className="section-label">03 — Produk Unggulan</p>
        <Link href="/products" style={{ fontSize: 11, color: "var(--bali-tan)", textDecoration: "none" }}>Lihat semua →</Link>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 280, background: "#EDE4D6", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--bali-tan)", background: "#F5EDD8", borderRadius: 8 }}>
          <p className="serif" style={{ fontSize: 18, fontStyle: "italic" }}>Belum ada produk</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>Belum ada produk yang di uploud oleh admin</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* 04 — CARA PEMBAYARAN */}
      <p className="section-label" style={{ marginBottom: "0.75rem" }}>04 — Cara Pembayaran</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: "2.5rem" }}>
        <div className="pcard" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: 24, marginBottom: "0.75rem" }}>🏦</div>
          <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>Transfer Bank</h3>
          <p style={{ fontSize: 11, color: "var(--bali-tan)", lineHeight: 1.6, margin: "0 0 1rem" }}>Verifikasi pembayaran otomatis dalam 1 menit.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["BCA","Mandiri","BNI","BRI","GoPay","QRIS"].map(b => (
              <span key={b} style={{ fontSize: 10, background: "#F5EDD8", padding: "3px 8px", borderRadius: 3, color: "var(--bali-tan)" }}>{b}</span>
            ))}
          </div>
        </div>
        
        <div className="pcard" style={{ padding: "1.25rem", borderColor: "var(--bali-sage)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
            <div style={{ width: 32, height: 32, background: "var(--bali-sage)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>📱</div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Chat via WhatsApp</h3>
              <p style={{ fontSize: 10, color: "var(--bali-sage)", margin: 0, fontWeight: 500 }}>● Admin online sekarang</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "var(--bali-tan)", lineHeight: 1.6, margin: "0 0 1rem" }}>Konsultasi langsung dengan admin kami.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
            <button style={{ width: "100%", background: "var(--bali-sage)", color: "#fff", border: "none", padding: "10px", borderRadius: 3, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
              Chat WhatsApp Sekarang ↗
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}