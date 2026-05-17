import { supabase } from "@/lib/supabase/client";

// Ambil semua produk
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      artisans (id, name, whatsapp_number)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Ambil satu produk by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`*, artisans (id, name, whatsapp_number)`)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Tambah produk (admin only)
export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  artisan_id: string;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Edit produk (admin only)
export async function updateProduct(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    price: number;
    artisan_id: string;
    image_url: string;
  }>,
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Hapus produk (admin only)
export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
}
