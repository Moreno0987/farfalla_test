"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "Gelang",
    description: "",
    image_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengirim data ke tabel 'products' di Supabase milik temanmu
      const { data, error } = await supabase
        .from('products')
        .insert([
          { 
            name: product.name, 
            price: parseInt(product.price), 
            category: product.category, 
            description: product.description,
            image_url: product.image_url 
          }
        ]);

      if (error) throw error;

      alert("✨ Produk Farfalla Berhasil Disimpan ke Database!");
      
      // Reset Form biar bisa input produk lain
      setProduct({ name: "", price: "", category: "Gelang", description: "", image_url: "" });
      
    } catch (error: any) {
      console.error("Error:", error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "60px 20px", 
      backgroundColor: "#1C1208", 
      minHeight: "100vh", 
      color: "#F5EDD8",
      fontFamily: "'Playfair Display', serif"
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", color: "#C8963E", marginBottom: "10px" }}>
            FARFALLA ADMIN
          </h1>
          <div style={{ height: "1px", width: "100px", backgroundColor: "#C8963E", margin: "0 auto" }}></div>
          <p style={{ color: "#A89070", marginTop: "20px", fontSize: "14px", letterSpacing: "1px" }}>
            PENGELOLAAN KOLEKSI PERHIASAN
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: "#2E1E0A", 
          padding: "40px", 
          borderRadius: "4px", 
          border: "1px solid #3D2810",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "25px"
        }}>
          
          {/* NAMA PRODUK */}
          <div>
            <label style={labelStyle}>Nama Perhiasan</label>
            <input 
              type="text" 
              required
              value={product.name}
              placeholder="Contoh: Gelang Perak Celuk"
              style={inputStyle}
              onChange={(e) => setProduct({...product, name: e.target.value})}
            />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* HARGA */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Harga (Rp)</label>
              <input 
                type="number" 
                required
                value={product.price}
                placeholder="0"
                style={inputStyle}
                onChange={(e) => setProduct({...product, price: e.target.value})}
              />
            </div>
            {/* KATEGORI */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Kategori</label>
              <select 
                style={inputStyle}
                value={product.category}
                onChange={(e) => setProduct({...product, category: e.target.value})}
              >
                <option value="Gelang">Gelang</option>
                <option value="Kalung">Kalung</option>
                <option value="Cincin">Cincin</option>
                <option value="Anting">Anting</option>
              </select>
            </div>
          </div>

          {/* URL FOTO */}
          <div>
            <label style={labelStyle}>Link URL Foto (Cloudinary/Unsplash)</label>
            <input 
              type="text" 
              value={product.image_url}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
              onChange={(e) => setProduct({...product, image_url: e.target.value})}
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label style={labelStyle}>Deskripsi Produk</label>
            <textarea 
              value={product.description}
              placeholder="Jelaskan detail produk di sini..."
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
              onChange={(e) => setProduct({...product, description: e.target.value})}
            />
          </div>

          {/* TOMBOL SIMPAN */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: loading ? "#5C4020" : "#C8963E", 
              color: "#1C1208", 
              padding: "16px", 
              border: "none", 
              borderRadius: "2px", 
              fontWeight: "bold", 
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              letterSpacing: "2px",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "MENGIRIM KE SUPABASE..." : "SIMPAN PRODUK"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling untuk Label dan Input agar konsisten
const labelStyle = { 
  display: "block", 
  fontSize: "11px", 
  color: "#A89070", 
  marginBottom: "8px", 
  textTransform: "uppercase" as const,
  letterSpacing: "1px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1C1208",
  border: "1px solid #4D3A24",
  borderRadius: "2px",
  color: "#F5EDD8",
  fontSize: "14px",
  outline: "none",
  transition: "border 0.3s"
};