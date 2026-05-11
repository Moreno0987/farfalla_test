"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ShoppingBag } from "lucide-react";

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

const ICONS: Record<string, string> = {
  Gelang: "○", Kalung: "◇", Anting: "❋", "Gift Set": "✦", default: "⬡",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID");
  const icon = ICONS[product.subcategory ?? ""] ?? ICONS.default;
  const rating = product.rating ?? 0;
  const fullStars = Math.round(rating);
  
  return (
    <div className="pcard group">
      <Link href={`/products/${product.id}`} className="no-underline color-inherit">
        
        {/* Kontainer Gambar / Placeholder */}
        <div className="h-48 relative overflow-hidden flex items-center justify-center bg-[#F5EDD8]">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            /* Tampilan jika belum ada gambar: Pakai inisial nama produk agar tetap mewah */
            <div className="flex flex-col items-center gap-2 opacity-40">
              <span className="text-3xl font-light tracking-tighter">{icon}</span>
              <span className="serif italic text-[10px] tracking-[0.2em] uppercase">Farfalla</span>
            </div>
          )}

          {product.badge && (
            <span className={`absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider border shadow-sm
              ${product.badge === "new" 
                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                : "bg-white text-[#7A5C1E] border-[#D4AA5C]"}`}>
              {product.badge === "new" ? "New" : product.badge === "limited" ? "Limited" : "Terlaris"}
            </span>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <p className="text-[9px] text-[#8B6C42] uppercase tracking-[0.15em]">
              {product.subcategory ?? "Aksesoris"}
            </p>
            {product.origin && (
              <span className="text-[8px] text-[#A89070] italic">Bali, ID</span>
            )}
          </div>
          
          <h3 className="serif italic text-lg text-[#2C2015] leading-tight mb-3 group-hover:text-[#8B6C42] transition-colors min-h-[44px]">
            {product.name}
          </h3>

          <div className="flex justify-between items-center border-t border-[#F5EDD8] pt-3">
            <span className="text-sm font-medium text-[#2C2015]">
              {fmt(product.price)}
            </span>
            
            <div className="flex items-center gap-1">
              <span className="star text-[10px]">
                {"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Tombol Add to Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            // SOLUSI ERROR: Saya hapus baris image sementara 
            // agar sesuai dengan tipe data CartItem kamu yang lama.
            addToCart({ 
              id: product.id, 
              name: product.name, 
              price: product.price
            });
          }}
          className="btn-primary w-full flex justify-center items-center gap-2 py-2.5 text-[10px] shadow-sm active:scale-95 transition-transform"
        >
          <ShoppingBag size={13} />
          Tambah ke Tas
        </button>
      </div>
    </div>
  );
}