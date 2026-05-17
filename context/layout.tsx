import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Farfalla – Handmade dengan Cinta",
  description: "Produk handmade lokal Indonesia dari tangan pengrajin pilihan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
