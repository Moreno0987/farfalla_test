import ProductCard from "@/components/ProductCard";

const products = [
  { id: "1", name: "Tas Handmade", price: 100000 },
  { id: "2", name: "Gelang", price: 50000 },
];

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>

      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
