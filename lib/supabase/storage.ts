import { supabase } from "@/lib/supabase/client";

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string) {
  const fileName = imageUrl.split("/").pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from("product-images")
    .remove([fileName]);

  if (error) throw error;
}
