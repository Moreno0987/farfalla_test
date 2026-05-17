"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, ShoppingBag } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  subcategory?: string;
  image_url?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  badge?: string | null;
  is_customizable?: boolean;
  origin?: string;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching product:", error);
        } else {
          setProduct(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#8B6C42]">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8B6C42] mb-4">Produk tidak ditemukan</p>
          <Link href="/products" className="text-[#2C2015] underline">
            Kembali ke daftar produk
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = product.image_url || product.images?.[0] || null;
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-[#F5EDD8]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[#8B6C42] hover:text-[#2C2015] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2 p-6">
              <div className="aspect-square rounded-xl bg-[#F5EDD8] overflow-hidden">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                    ⬡
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#8B6C42] uppercase tracking-[0.15em] mb-2">
                    {product.subcategory ?? "Aksesoris"}
                  </p>
                  <h1 className="serif text-3xl font-semibold text-[#2C2015] leading-tight mb-4">
                    {product.name}
                  </h1>
                  <p className="text-lg font-semibold text-[#2C2015] mb-4">
                    {fmt(product.price)}
                  </p>
                  <p className="text-sm leading-relaxed text-[#50422f]">
                    {product.description ?? "Deskripsi produk belum tersedia."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                  });
                }}
                className="w-full rounded-lg bg-[#2C2015] px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#433520] mt-6"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  Tambah ke Tas
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}