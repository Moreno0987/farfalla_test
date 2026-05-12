"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sesuai skema database temanmu: name, description, price, image_url
      const { data, error } = await supabase
        .from('products')
        .insert([
          { 
            name: product.name, 
            price: parseFloat(product.price), 
            description: product.description,
            image_url: product.image_url,
            // Catatan: Jika artisan_id wajib diisi, masukkan ID artisan yang ada di tabel 'artisans'
            // artisan_id: "id-artisan-disini" 
          }
        ]);

      if (error) throw error;

      alert("✨ Berhasil! Produk sudah masuk ke database Farfalla.");
      setProduct({ name: "", price: "", description: "", image_url: "" });
      
    } catch (error: any) {
      alert("Gagal simpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px 20px", backgroundColor: "#1C1208", minHeight: "100vh", color: "#F5EDD8" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1 style={{ color: "#C8963E", fontFamily: "serif", marginBottom: "30px" }}>Tambah Koleksi Baru</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#2E1E0A", padding: "30px", borderRadius: "8px" }}>
          <input 
            placeholder="Nama Perhiasan" 
            required
            value={product.name}
            style={inputStyle}
            onChange={(e) => setProduct({...product, name: e.target.value})}
          />
          <input 
            placeholder="Harga (Contoh: 250000)" 
            type="number" 
            required
            value={product.price}
            style={inputStyle}
            onChange={(e) => setProduct({...product, price: e.target.value})}
          />
          <input 
            placeholder="URL Foto Produk" 
            value={product.image_url}
            style={inputStyle}
            onChange={(e) => setProduct({...product, image_url: e.target.value})}
          />
          <textarea 
            placeholder="Deskripsi Singkat" 
            value={product.description}
            style={{ ...inputStyle, minHeight: "100px" }}
            onChange={(e) => setProduct({...product, description: e.target.value})}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: "#C8963E", color: "#1C1208", padding: "12px", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "MENYIMPAN..." : "INPUT KE DATABASE"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", backgroundColor: "#1C1208", border: "1px solid #4D3A24", color: "#F5EDD8" };