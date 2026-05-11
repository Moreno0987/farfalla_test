"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";
type Product = {
id: string; name: string; price: number; description?: string;
category?: string; subcategory?: string; images?: string[];
stock?: number; rating?: number; review_count?: number;
badge?: string | null; is_customizable?: boolean; origin?: string;
};
const CATEGORIES = ["all","heritage","contemporary","custom"];
const SUBCATEGORIES = ["all","Gelang","Kalung","Anting","Gift Set"];
function ProductsContent() {
const searchParams = useSearchParams();
const urlCat = searchParams.get("category") ?? "all";
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [category, setCategory] = useState(urlCat);
const [subcategory, setSubcategory] = useState("all");
useEffect(() => { setCategory(urlCat); }, [urlCat]);
useEffect(() => {
setLoading(true);
let q = supabase.from("products").select("*").gt("stock", 0);
if (category !== "all") q = q.eq("category", category);
if (subcategory !== "all") q = q.eq("subcategory", subcategory);
q.order("created_at", { ascending: false }).then(({ data }) => {
setProducts(data ?? []);
setLoading(false);
});
}, [category, subcategory]);
return (
<div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>
<p className="section-label" style={{ marginBottom: 4 }}>Koleksi Lengkap</p>
<h1 className="serif" style={{ fontSize: 32, fontStyle: "italic", fontWeight: 400, marginBottom: "1.5rem" }}>
Semua Produk
</h1>{/* Tab Kategori */}
  <div style={{ borderBottom: "0.5px solid var(--bali-border)", marginBottom: "0.75rem", display: "flex", overflowX: "auto" }}>
    {CATEGORIES.map(c => (
      <button key={c} className={`tab ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
        {c === "all" ? "Semua" : c.charAt(0).toUpperCase() + c.slice(1)}
      </button>
    ))}
  </div>

  {/* Tab Subkategori */}
  <div style={{ borderBottom: "0.5px solid var(--bali-border)", marginBottom: "1.5rem", display: "flex", overflowX: "auto" }}>
    {SUBCATEGORIES.map(s => (
      <button key={s} className={`tab ${subcategory === s ? "active" : ""}`} onClick={() => setSubcategory(s)} style={{ fontSize: 11 }}>
        {s === "all" ? "Semua" : s}
      </button>
    ))}
  </div>

  {loading ? (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
      {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 300, background: "#EDE4D6", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />)}
    </div>
  ) : products.length === 0 ? (
    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--bali-tan)" }}>
      <div className="serif" style={{ fontSize: 48, opacity: 0.3, marginBottom: "0.75rem" }}>⬡</div>
      <p className="serif" style={{ fontSize: 18, fontStyle: "italic" }}>Belum ada produk di kategori ini</p>
    </div>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )}
</div>
);
}
export default function ProductsPage() {
return <Suspense><ProductsContent /></Suspense>;
}