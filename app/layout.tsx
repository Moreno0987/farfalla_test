// app/layout.tsx
import type { Metadata } from "next"; // Gunakan 'import type' untuk metadata agar lebih bersih
import { Inter, Cormorant_Garamond } from "next/font/google";
import { CartProvider } from "@/app/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

// Gunakan path absolut (@/) untuk globals.css agar TypeScript tidak bingung
import "@/app/globals.css"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farfalla — Aksesori Perak & Tenun Bali",
  description: "Aksesori handmade dari pengrajin Bali",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable}`}>
      {/* Tambahkan suppressHydrationWarning jika nanti ada error mismatch hydration gara-gara localStorage */}
      <body className="antialiased overflow-x-hidden font-sans" suppressHydrationWarning>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow page-enter">
              {children}
            </main>
            
            <CartDrawer />
            <WhatsAppFloat />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}