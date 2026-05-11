"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("otpCooldown");
    if (!saved) return 0;
    const remaining = Math.floor((parseInt(saved, 10) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const redirectTo = searchParams.get("redirect") || "/products";

  // Countdown cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("otpCooldown");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Cek jika user sudah login → redirect
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push(redirectTo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Eksekusi postLoginAction jika ada
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) return;

      const raw = localStorage.getItem("postLoginAction");
      if (raw) {
        try {
          const action = JSON.parse(raw);
          if (action.type === "add_to_cart" && action.product) {
            await addToCart(action.product);
          }
        } catch {
          /* ignore */
        }
        localStorage.removeItem("postLoginAction");
      }

      router.push(redirectTo);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (loading || cooldown > 0) return;

    if (!email || !email.includes("@")) {
      alert("Masukkan email yang valid");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      alert("Konfigurasi server belum lengkap");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${baseUrl}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const expireTime = Date.now() + 60 * 1000;
      localStorage.setItem("otpCooldown", expireTime.toString());
      setCooldown(60);
      setSent(true);
    } catch {
      alert("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="farfalla-login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-butterfly">🦋</span>
          <h1 className="login-brand">Farfalla</h1>
        </div>

        <p className="login-tagline">
          {sent ? "Cek inbox email kamu ✉️" : "Masuk untuk mulai berbelanja"}
        </p>

        {!sent ? (
          <>
            <div className="login-field">
              <label className="login-label">Alamat Email</label>
              <input
                type="email"
                placeholder="contoh@email.com"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || cooldown > 0}
              className="farfalla-btn-primary w-full"
            >
              {loading
                ? "Mengirim..."
                : cooldown > 0
                  ? `Tunggu ${cooldown} detik`
                  : "Kirim Magic Link"}
            </button>

            <p className="login-info">
              Kami akan mengirimkan link login ke email kamu. Tidak perlu
              password!
            </p>
          </>
        ) : (
          <div className="login-sent">
            <p>
              Link login sudah dikirim ke <strong>{email}</strong>
            </p>
            <p className="login-sent-sub">
              Klik link di email untuk masuk otomatis.
              {cooldown > 0 && ` Kirim ulang dalam ${cooldown}s`}
            </p>
            {cooldown <= 0 && (
              <button onClick={() => setSent(false)} className="login-resend">
                Kirim ulang
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
