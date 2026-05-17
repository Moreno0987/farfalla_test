"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../lib/products";
import { uploadProductImage, deleteProductImage } from "../../lib/storage";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  artisans?: { name: string };
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Load products from database
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    try {
      if (imageUrl) await deleteProductImage(imageUrl);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Gagal hapus produk!");
      console.error(err);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Gagal logout!");
    }
  };

  // Check authorization on mount
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login?redirect=/admin");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || profile?.role !== "admin") {
          router.push("/");
          return;
        }

        setIsAuthorized(true);
        await loadProducts();
      } catch (err) {
        console.error("Authorization check failed:", err);
        router.push("/");
      }
    };

    checkAuthorization();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        <p>Verifying access...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Admin — Produk</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/products/new">
            <button
              style={{
                background: "#1a1a1a",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              + Tambah Produk
            </button>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: "#e53e3e",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ color: "#888" }}>Belum ada produk.</p>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "10px 8px" }}>Gambar</th>
              <th style={{ padding: "10px 8px" }}>Nama</th>
              <th style={{ padding: "10px 8px" }}>Harga</th>
              <th style={{ padding: "10px 8px" }}>Artisan</th>
              <th style={{ padding: "10px 8px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px 8px" }}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      width={50}
                      height={50}
                      style={{
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: "#f0f0f0",
                        borderRadius: 4,
                      }}
                    />
                  )}
                </td>
                <td style={{ padding: "10px 8px", fontWeight: 500 }}>
                  {p.name}
                </td>
                <td style={{ padding: "10px 8px" }}>
                  Rp {p.price.toLocaleString("id-ID")}
                </td>
                <td style={{ padding: "10px 8px" }}>
                  {p.artisans?.name ?? "-"}
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <button
                        style={{
                          padding: "6px 12px",
                          border: "1px solid #1a1a1a",
                          borderRadius: 4,
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.image_url)}
                      style={{
                        padding: "6px 12px",
                        border: "1px solid #e53e3e",
                        borderRadius: 4,
                        background: "#fff",
                        color: "#e53e3e",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
