"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/supabase/products";
import { uploadProductImage, deleteProductImage } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

type Artisan = { id: string; name: string; region?: string };

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", price: "", artisan_id: "" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    artisan_id: "",
  });

  const artisanLabels: Record<string, string> = {
    Wayan: "Wayan (Canggu)",
    Putu: "Putu (Jimbaran)",
    Made: "Made (Ubud)",
    Ketut: "Ketut (Seminyak)",
    Nyoman: "Nyoman (Sanur)",
  };

  const getArtisanLabel = (artisan: Artisan) => {
    if (artisan.region) return `${artisan.name} (${artisan.region})`;
    return artisanLabels[artisan.name] ?? artisan.name;
  };

  useEffect(() => {
    getProductById(id).then((data) => {
      if (!data) return;
      setForm({
        name: data.name,
        description: data.description ?? "",
        price: String(data.price),
        artisan_id: data.artisan_id ?? "",
      });
      setImagePreview(data.image_url ?? null);
      setOldImageUrl(data.image_url ?? null);
    });

    async function loadArtisans() {
      const { data, error } = await supabase.from("artisans").select("id, name");
      if (error) {
        console.error("Gagal memuat artisan:", error);
        return;
      }
      setArtisans(data ?? []);
    }

    loadArtisans();
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validateForm() {
    const name = form.name.trim();
    const price = form.price.trim();
    const priceValue = Number(price);
    const nextErrors = { name: "", price: "", artisan_id: "" };

    if (!name) nextErrors.name = "Nama produk harus diisi.";
    if (!price) nextErrors.price = "Harga produk harus diisi.";
    else if (isNaN(priceValue) || priceValue <= 0)
      nextErrors.price = "Harga harus angka positif.";
    if (!form.artisan_id) nextErrors.artisan_id = "Pilih artisan produk.";

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.price && !nextErrors.artisan_id;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let image_url = oldImageUrl ?? "";
      if (imageFile) {
        if (oldImageUrl) await deleteProductImage(oldImageUrl);
        image_url = await uploadProductImage(imageFile);
      }

      await updateProduct(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price.trim()),
        artisan_id: form.artisan_id,
        image_url,
      });

      router.push("/admin");
    } catch (err) {
      alert("Gagal update produk!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: "2rem" }}>
        Edit Produk
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Nama Produk *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
              boxSizing: "border-box",
            }}
          />
          {errors.name && (
            <p style={{ color: "#e53e3e", marginTop: 6, fontSize: 12 }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Harga (Rp) *</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, price: numericValue });
            }}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
              boxSizing: "border-box",
            }}
          />
          {errors.price && (
            <p style={{ color: "#e53e3e", marginTop: 6, fontSize: 12 }}>
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Artisan *</label>
          <select
            value={form.artisan_id}
            onChange={(e) => setForm({ ...form, artisan_id: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
              boxSizing: "border-box",
            }}
          >
            <option value="">Pilih artisan...</option>
            {artisans.map((a) => (
              <option key={a.id} value={a.id}>
                {getArtisanLabel(a)}
              </option>
            ))}
          </select>
          {errors.artisan_id && (
            <p style={{ color: "#e53e3e", marginTop: 6, fontSize: 12 }}>
              {errors.artisan_id}
            </p>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "100%", marginTop: 4, fontSize: 13 }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 6,
                marginTop: 8,
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              background: "#1a1a1a",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {loading ? "Menyimpan..." : "Update Produk"}
          </button>
          <button
            onClick={() => router.push("/admin")}
            style={{
              flex: 1,
              background: "#fff",
              color: "#1a1a1a",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
