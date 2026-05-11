import { createServerClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export default async function ProductsPage() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, description, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="farfalla-empty">
        <p>Gagal memuat produk. Silakan coba lagi.</p>
      </div>
    );
  }

  const products = (data ?? []) as Product[];

  return (
    <main className="farfalla-products-page">
      {/* Header */}
      <div className="products-header">
        <p className="products-eyebrow">Koleksi Kami</p>
        <h1 className="products-title">Karya Tangan Pilihan</h1>
        <p className="products-subtitle">
          Setiap produk dibuat dengan cinta oleh pengrajin lokal Indonesia
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="farfalla-empty">
          <span>🦋</span>
          <p>Belum ada produk tersedia</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
