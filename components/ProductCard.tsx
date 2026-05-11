"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });

      if (result === "login") {
        router.push(`/login?redirect=/products`);
        return;
      }

      // Feedback visual
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farfalla-card group">
      {/* Image */}
      <div className="farfalla-card-image">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f5ede8]">
            <span className="text-4xl opacity-30">🦋</span>
          </div>
        )}
        <div className="farfalla-card-overlay" />
      </div>

      {/* Content */}
      <div className="farfalla-card-content">
        <h3 className="farfalla-product-name">{product.name}</h3>
        {product.description && (
          <p className="farfalla-product-desc">{product.description}</p>
        )}
        <div className="farfalla-card-footer">
          <span className="farfalla-price">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`farfalla-btn-cart ${added ? "added" : ""}`}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : added ? (
              "✓ Ditambahkan"
            ) : (
              "Tambah"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
