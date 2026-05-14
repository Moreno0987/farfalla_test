"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/supabase/products";
import { uploadProductImage } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Artisan = {
  id: string;
  name: string;
  description: string;
  whatsapp_number: string;
};

type FormValues = {
  name: string;
  description: string;
  price: string;
  artisan_id: string;
  category: string;
  subcategory: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Artisan fallback — dipakai jika tabel Supabase kosong atau belum diisi.
 * Label dropdown: "Nama (Wilayah)"
 */
const ARTISAN_FALLBACK: Artisan[] = [
  {
    id: "artisan-1",
    name: "Wayan Sudarta",
    description: "Pengrajin perak tradisional Bali",
    whatsapp_number: "628123456701",
  },
  {
    id: "artisan-2",
    name: "Made Artana",
    description: "Spesialis ukiran kayu dan lukisan",
    whatsapp_number: "628123456702",
  },
  {
    id: "artisan-3",
    name: "Nyoman Kariasa",
    description: "Pengrajin perhiasan perak Celuk",
    whatsapp_number: "628123456703",
  },
  {
    id: "artisan-4",
    name: "Ketut Suardana",
    description: "Pembuat batik dan tenun tradisional",
    whatsapp_number: "628123456704",
  },
  {
    id: "artisan-5",
    name: "Putu Aryasa",
    description: "Pengrajin keramik dan gerabah",
    whatsapp_number: "628123456705",
  },
];

const CATEGORIES = [
  { value: "heritage", label: "Heritage" },
  { value: "contemporary", label: "Contemporary" },
  { value: "custom", label: "Custom" },
];

const SUBCATEGORIES = [
  { value: "Gelang", label: "Gelang" },
  { value: "Kalung", label: "Kalung" },
  { value: "Anting", label: "Anting" },
  { value: "Gift Set", label: "Gift Set" },
];

const INITIAL_FORM: FormValues = {
  name: "",
  description: "",
  price: "",
  artisan_id: "",
  category: "",
  subcategory: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Nama produk wajib diisi.";

  if (!form.description.trim()) errors.description = "Deskripsi wajib diisi.";

  const priceNum = Number(form.price);
  if (!form.price.trim() || isNaN(priceNum) || priceNum <= 0)
    errors.price = "Harga wajib diisi dan harus lebih dari 0.";

  if (!form.artisan_id) errors.artisan_id = "Artisan wajib dipilih.";

  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch artisans dari Supabase; fallback ke data lokal jika kosong
  useEffect(() => {
    async function fetchArtisans() {
      try {
        const { data } = await supabase
          .from("artisans")
          .select("id, name, description, whatsapp_number");
        setArtisans(data && data.length > 0 ? data : ARTISAN_FALLBACK);
      } catch {
        setArtisans(ARTISAN_FALLBACK);
      }
    }
    fetchArtisans();
  }, []);

  // Update satu field dan hapus error-nya sekaligus
  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit() {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Tampilkan error per-field, tidak pakai alert()
    }

    setLoading(true);
    try {
      let image_url = "";
      if (imageFile) {
        image_url = await uploadProductImage(imageFile);
      }

      await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        artisan_id: form.artisan_id,
        category: form.category,
        subcategory: form.subcategory,
        image_url,
      });

      router.push("/admin");
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      alert("Terjadi kesalahan saat menyimpan produk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => router.push("/admin")} style={styles.backBtn}>
          ← Kembali
        </button>
        <h1 style={styles.title}>Tambah Produk</h1>
      </div>

      <div style={styles.form}>
        {/* Nama Produk */}
        <FormField label="Nama Produk" required error={errors.name}>
          <input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Contoh: Gelang Perak Celuk"
            style={inputStyle(!!errors.name)}
          />
        </FormField>

        {/* Deskripsi */}
        <FormField label="Deskripsi" required error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Ceritakan keunikan produk ini..."
            style={{ ...inputStyle(!!errors.description), resize: "vertical" }}
          />
        </FormField>

        {/* Harga */}
        <FormField label="Harga" required error={errors.price}>
          <div style={{ position: "relative" }}>
            <span style={styles.pricePrefix}>Rp</span>
            <input
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="185000"
              style={{ ...inputStyle(!!errors.price), paddingLeft: 36 }}
            />
          </div>
        </FormField>

        {/* Artisan */}
        <FormField label="Artisan" required error={errors.artisan_id}>
          <select
            value={form.artisan_id}
            onChange={(e) => setField("artisan_id", e.target.value)}
            style={inputStyle(!!errors.artisan_id)}
          >
            <option value="">Pilih artisan...</option>
            {artisans.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </FormField>

        {/* Kategori */}
        <FormField label="Kategori" required error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            style={inputStyle(!!errors.category)}
          >
            <option value="">Pilih kategori...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Subkategori */}
        <FormField label="Subkategori" required error={errors.subcategory}>
          <select
            value={form.subcategory}
            onChange={(e) => setField("subcategory", e.target.value)}
            style={inputStyle(!!errors.subcategory)}
          >
            <option value="">Pilih subkategori...</option>
            {SUBCATEGORIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Gambar Produk */}
        <FormField label="Gambar Produk">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ fontSize: 13 }}
          />
          {imagePreview && (
            <div style={{ position: "relative", marginTop: 10 }}>
              <img
                src={imagePreview}
                alt="Preview gambar"
                style={styles.imagePreview}
              />
              <button onClick={removeImage} style={styles.removeImageBtn}>
                Hapus
              </button>
            </div>
          )}
        </FormField>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...styles.btnPrimary,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
          <button
            onClick={() => router.push("/admin")}
            disabled={loading}
            style={styles.btnSecondary}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: FormField ─────────────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={styles.label}>
        {label}
        {required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={styles.errorMsg}>{error}</span>}
    </div>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    fontSize: 13,
    border: `1.5px solid ${hasError ? "#dc2626" : "#e2e8f0"}`,
    borderRadius: 8,
    background: "#fff",
    color: "#111",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s",
  };
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  header: {
    marginBottom: "1.75rem",
  },
  backBtn: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: 13,
    color: "#64748b",
    cursor: "pointer",
    marginBottom: 12,
    display: "block",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
  },
  errorMsg: {
    fontSize: 12,
    color: "#dc2626",
  },
  pricePrefix: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 13,
    color: "#94a3b8",
    pointerEvents: "none",
  },
  imagePreview: {
    width: "100%",
    maxHeight: 220,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    display: "block",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    padding: "3px 9px",
    fontSize: 12,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },
  btnPrimary: {
    flex: 1,
    background: "#0f172a",
    color: "#fff",
    padding: "12px 16px",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  btnSecondary: {
    flex: 1,
    background: "#fff",
    color: "#374151",
    padding: "12px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },
};
