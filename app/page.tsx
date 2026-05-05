import { createServerClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default async function Home() {
  const supabase = createServerClient();

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>Belum ada produk</div>;
  }

  return (
    <div>
      <h1>Farfalla Project</h1>

      <div style={{ display: "grid", gap: "10px" }}>
        {data.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
