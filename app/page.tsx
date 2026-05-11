import { createServerClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export default async function Home() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .order("created_at", { ascending: false })
    .limit(4);

  const products = (data ?? []) as Product[];

  return (
    <main className="farfalla-home">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Handmade · Lokal · Penuh Cinta</p>
          <h1 className="hero-title">
            Keindahan dari
            <br />
            <span className="hero-accent">Tangan Pengrajin</span>
          </h1>
          <p className="hero-desc">
            Setiap produk Farfalla dibuat dengan tangan oleh pengrajin lokal
            Indonesia. Unik, bermakna, dan berkelanjutan.
          </p>
          <div className="hero-cta">
            <Link href="/products" className="farfalla-btn-primary">
              Jelajahi Produk
            </Link>
            <Link href="/products" className="farfalla-btn-ghost">
              Tentang Kami
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-butterfly-bg">🦋</div>
          <div className="hero-float hero-float-1">✦</div>
          <div className="hero-float hero-float-2">✦</div>
          <div className="hero-float hero-float-3">✦</div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="featured-section">
          <div className="featured-header">
            <p className="products-eyebrow">Pilihan Terbaru</p>
            <h2 className="featured-title">Produk Unggulan</h2>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="featured-footer">
            <Link href="/products" className="farfalla-btn-ghost">
              Lihat Semua Produk →
            </Link>
          </div>
        </section>
      )}

      {/* Value Props */}
      <section className="values-section">
        {[
          {
            icon: "🤲",
            title: "100% Handmade",
            desc: "Dibuat langsung oleh tangan pengrajin berpengalaman",
          },
          {
            icon: "🌿",
            title: "Bahan Alami",
            desc: "Menggunakan bahan-bahan pilihan yang ramah lingkungan",
          },
          {
            icon: "💬",
            title: "Order via WA",
            desc: "Konfirmasi pesanan langsung dengan pengrajin kami",
          },
        ].map((v) => (
          <div key={v.title} className="value-card">
            <span className="value-icon">{v.icon}</span>
            <h3 className="value-title">{v.title}</h3>
            <p className="value-desc">{v.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
