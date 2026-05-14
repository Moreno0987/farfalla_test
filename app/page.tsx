"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { supabase } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

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

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(135deg, #F5EDD8 0%, #EDE4D6 100%)",
        animation: "skeletonPulse 1.8s ease-in-out infinite",
      }}
    >
      {/* Image area */}
      <div style={{ height: 200, background: "rgba(0,0,0,0.06)" }} />
      {/* Text area */}
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            height: 10,
            background: "rgba(0,0,0,0.08)",
            borderRadius: 6,
            marginBottom: 8,
            width: "60%",
          }}
        />
        <div
          style={{
            height: 14,
            background: "rgba(0,0,0,0.10)",
            borderRadius: 6,
            marginBottom: 6,
            width: "85%",
          }}
        />
        <div
          style={{
            height: 10,
            background: "rgba(0,0,0,0.06)",
            borderRadius: 6,
            width: "45%",
          }}
        />
      </div>

      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

/* ─── Animated Product Card Wrapper ─────────────────────────── */
function AnimatedCard({ product, index }: { product: Product; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <ProductCard product={product} />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 [HomePage] Fetching products from Supabase...");

    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error, status, statusText }) => {
        console.group("📦 [HomePage] Supabase products result");
        console.log("Status     :", status, statusText);
        console.log("Error      :", error ?? "none");
        console.log("Row count  :", data?.length ?? 0);
        console.log("Raw data   :", data);

        if (error) {
          console.error(
            "❌ Query error detail:",
            error.message,
            error.details,
            error.hint,
          );
        }

        if (data && data.length > 0) {
          console.log("✅ Sample product keys:", Object.keys(data[0]));
          console.log("✅ Sample product[0]  :", data[0]);

          // Cek apakah kolom 'stock' ada dan nilainya
          const stockValues = data.map((p: Product) => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
          }));
          console.table(stockValues);
        } else {
          console.warn("⚠️  Data kosong — kemungkinan penyebab:");
          console.warn("   1. Tabel 'products' masih kosong");
          console.warn("   2. RLS (Row Level Security) memblokir akses");
          console.warn("   3. Nama tabel bukan 'products'");
          console.warn("   4. Kolom 'created_at' tidak ada");
        }

        console.groupEnd();

        const shuffled = (data ?? []).sort(() => Math.random() - 0.5);
        setProducts(shuffled);
        setLoading(false);
      });
  }, []);

  // Apakah section produk perlu ditampilkan?
  const showProductSection = loading || products.length > 0;

  return (
    <>
      {/* ── Global Animations ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .section-reveal {
          animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .product-grid-enter {
          animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .view-all-link {
          position: relative;
          font-size: 11px;
          color: var(--bali-tan);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .view-all-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0%;
          height: 1px;
          background: var(--bali-tan);
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .view-all-link:hover::after { width: 100%; }
        .view-all-link:hover { color: var(--bali-dark, #3a2e1e); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>
        {/* 01 — HERO */}
        <p className="section-label" style={{ marginBottom: "0.75rem" }}>
          01 — Featured
        </p>
        <Hero />

        {/* 02 — KATEGORI */}
        <p
          className="section-label"
          style={{ marginBottom: "0.75rem", marginTop: "3rem" }}
        >
          02 — Kategori
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: "3rem",
          }}
        >
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

        {/* 03 — PRODUK UNGGULAN — hanya tampil kalau ada produk atau sedang loading */}
        {showProductSection && (
          <div className="section-reveal" style={{ marginBottom: "3rem" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <p className="section-label" style={{ margin: 0 }}>
                03 — Produk Unggulan
              </p>
              {!loading && products.length > 0 && (
                <Link href="/products" className="view-all-link">
                  Lihat semua →
                </Link>
              )}
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {loading
                ? /* Skeleton */ [1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                  ))
                : /* Produk nyata dengan staggered fade-in */
                  products.map((p, i) => (
                    <AnimatedCard key={p.id} product={p} index={i} />
                  ))}
            </div>
          </div>
        )}

        {/* 04 — CARA PEMBAYARAN */}
        {/* Nomor section menyesuaikan: kalau produk tampil = 04, kalau tidak = 03 */}
        <p className="section-label" style={{ marginBottom: "0.75rem" }}>
          {showProductSection ? "04" : "03"} — Cara Pembayaran
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
            marginBottom: "2.5rem",
          }}
        >
          <div className="pcard" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: 24, marginBottom: "0.75rem" }}>🏦</div>
            <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>
              Transfer Bank Otomatis
            </h3>
            <p
              style={{
                fontSize: 11,
                color: "var(--bali-tan)",
                lineHeight: 1.6,
                margin: "0 0 1rem",
              }}
            >
              Verifikasi pembayaran otomatis dalam 1 menit.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["BCA", "Mandiri", "BNI", "BRI", "GoPay", "QRIS"].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 10,
                    background: "#F5EDD8",
                    padding: "3px 8px",
                    borderRadius: 3,
                    color: "var(--bali-tan)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div
            className="pcard"
            style={{ padding: "1.25rem", borderColor: "var(--bali-sage)" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--bali-sage)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                📱
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                  Chat via WhatsApp
                </h3>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--bali-sage)",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  ● Admin online sekarang
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: 11,
                color: "var(--bali-tan)",
                lineHeight: 1.6,
                margin: "0 0 1rem",
              }}
            >
              Konsultasi langsung dengan admin kami.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                style={{
                  width: "100%",
                  background: "var(--bali-sage)",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: 3,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Chat WhatsApp Sekarang ↗
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
