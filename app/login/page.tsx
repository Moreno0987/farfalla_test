"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    if (typeof window === "undefined") return 0;

    const savedTime = localStorage.getItem("otpCooldown");
    if (!savedTime) return 0;

    const remaining = Math.floor((parseInt(savedTime, 10) - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // ⏳ Countdown effect
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

  const handleLogin = async () => {
    if (loading || cooldown > 0) return;

    // 🔍 Validasi email sederhana
    if (!email || !email.includes("@")) {
      alert("Masukkan email yang valid");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      alert("BASE URL belum diset di .env.local");
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
        console.error("Login error:", error);
        alert(error.message);
        return;
      }

      // ⏳ Set cooldown 60 detik
      const expireTime = Date.now() + 60 * 1000;
      localStorage.setItem("otpCooldown", expireTime.toString());
      setCooldown(60);

      alert("Cek email kamu untuk login");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading || cooldown > 0}
        className={`w-full py-2 rounded text-white transition ${
          loading || cooldown > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {loading
          ? "Mengirim..."
          : cooldown > 0
            ? `Tunggu ${cooldown}s`
            : "Login"}
      </button>
    </div>
  );
}
