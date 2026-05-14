"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; // ✅ ganti dari auth-helpers-nextjs

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/products";
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    registered ? "Registrasi berhasil. Silakan login." : "",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (registered) {
      setMessage("Registrasi berhasil. Silakan login.");
    }
  }, [registered]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Login gagal, periksa kredensial.");
      return;
    }

    if (data?.session) {
      router.push(redirectTo);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5EDD8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#ffffff",
          borderRadius: 24,
          boxShadow: "0 24px 80px rgba(44, 32, 21, 0.12)",
          padding: "2rem",
          fontFamily: "Georgia, serif",
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8B6C42",
            marginBottom: "0.75rem",
          }}
        >
          Masuk ke Farfalla
        </p>
        <h1
          style={{ fontSize: 32, margin: 0, fontWeight: 400, color: "#2C2015" }}
        >
          Login
        </h1>
        <p style={{ marginTop: "0.75rem", color: "#7A5C1E", lineHeight: 1.7 }}>
          Masuk menggunakan email dan password kamu untuk melanjutkan belanja.
        </p>

        {message && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              borderRadius: 16,
              background: "#F7F0E5",
              color: "#2C2015",
              fontSize: 13,
            }}
          >
            {message}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: 16,
              background: "#FDECE4",
              color: "#A7280E",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <label
            style={{ display: "grid", gap: 6, fontSize: 12, color: "#8B6C42" }}
          >
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                borderRadius: 16,
                border: "1px solid #E5D9C6",
                outline: "none",
                fontSize: 14,
              }}
            />
          </label>

          <label
            style={{ display: "grid", gap: 6, fontSize: 12, color: "#8B6C42" }}
          >
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                borderRadius: 16,
                border: "1px solid #E5D9C6",
                outline: "none",
                fontSize: 14,
              }}
            />
          </label>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              background: "#2C2015",
              color: "#fff",
              padding: "0.95rem 1rem",
              borderRadius: 16,
              border: "none",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>

        <p style={{ marginTop: "1.25rem", fontSize: 13, color: "#7A5C1E" }}>
          Belum punya akun?{" "}
          <Link
            href="/register"
            style={{ color: "#2C2015", textDecoration: "underline" }}
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
