"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="farfalla-nav">
      <Link href="/" className="farfalla-logo">
        <span className="logo-butterfly">🦋</span>
        <span className="logo-text">Farfalla</span>
      </Link>

      <div className="nav-links">
        <Link href="/products" className="nav-link">
          Produk
        </Link>

        <Link href="/cart" className="nav-cart">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-link nav-logout">
            Keluar
          </button>
        ) : (
          <Link href="/login" className="nav-link nav-login">
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
