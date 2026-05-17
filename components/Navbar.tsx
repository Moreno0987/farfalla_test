"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const { getItemCount, toggleCart } = useCart();
  const count = getItemCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ createBrowserClient menggantikan createClientComponentClient
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let subscription: any;

    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      subscription = listener.subscription;
    };

    fetchUser();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Pengguna";

  return (
    <header
      style={{
        background: "rgba(250, 245, 235, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid #E8DDD0",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span
              className="serif"
              style={{ fontSize: 22, fontStyle: "italic", color: "var(--bali-brown)", fontWeight: 400 }}
            >
              Farfalla
            </span>
            <span
              style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--bali-tan)", marginTop: 1 }}
            >
              Ubud · Singaraja · Celuk
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
          <Link href="/" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bali-brown)", textDecoration: "none" }}>
            Beranda
          </Link>
          <Link href="/products" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bali-brown)", textDecoration: "none" }}>
            Koleksi
          </Link>
          <Link href="/products?category=custom" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bali-tan)", textDecoration: "none", fontWeight: 500 }}>
            Custom ✦
          </Link>
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={toggleCart}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "var(--bali-brown)", padding: "4px", display: "flex", alignItems: "center" }}
            aria-label="Buka keranjang"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span
                style={{
                  position: "absolute", top: -4, right: -4,
                  background: "var(--bali-gold)", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </button>

          {!loading && (
            <>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: 12, color: "#2C2015" }}>Halo, {displayName}</span>
                  <button
                    onClick={handleLogout}
                    style={{ padding: "8px 12px", borderRadius: 9999, border: "1px solid #D4AA5C", background: "#fff", color: "#2C2015", cursor: "pointer", fontSize: 12 }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bali-brown)", textDecoration: "none", border: "1px solid #D4AA5C", padding: "8px 14px", borderRadius: 9999 }}>
                  Masuk
                </Link>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile-btn"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--bali-brown)", padding: "4px" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "0.5px solid var(--bali-border)", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: "var(--bali-brown)", textDecoration: "none" }}>Beranda</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: "var(--bali-brown)", textDecoration: "none" }}>Koleksi</Link>
          <Link href="/products?category=custom" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: "var(--bali-tan)", textDecoration: "none", fontWeight: 500 }}>Custom ✦</Link>
          {user ? (
            <button onClick={handleLogout} style={{ fontSize: 13, color: "#2C2015", border: "none", background: "none", textAlign: "left", padding: 0, cursor: "pointer" }}>
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: "#2C2015", textDecoration: "none" }}>
              Masuk
            </Link>
          )}
        </div>
      )}

      <style jsx>{`
        .show-mobile-btn { display: none; }
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}