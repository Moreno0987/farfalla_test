"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; // ✅ ganti dari auth-helpers-nextjs
import Link from "next/link";

export default function RegisterPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    setStatus("success");
    router.push(
      `/login?registered=true&redirect=${encodeURIComponent(redirect)}`,
    );
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 60px)",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 480,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.08)",
          border: "1px solid rgba(212, 170, 92, 0.16)",
          padding: "2.5rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#B0955F",
            }}
          >
            Daftar Akun
          </p>
          <h1
            style={{
              marginTop: "0.75rem",
              fontSize: "2rem",
              lineHeight: 1.1,
              color: "#1C1B19",
            }}
          >
            Selamat datang di Farfalla
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#6E5F4D", fontSize: 15 }}>
            Buat akun untuk menyelesaikan pesanan dan melihat keranjang Anda.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          style={{ display: "grid", gap: "1rem" }}
        >
          <label
            style={{
              display: "grid",
              gap: "0.5rem",
              fontSize: 14,
              color: "#5D4D3B",
            }}
          >
            Nama Lengkap
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Nama lengkap Anda"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 12,
                border: "1px solid #E2D7C7",
                background: "#fff",
                color: "#1C1B19",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "0.5rem",
              fontSize: 14,
              color: "#5D4D3B",
            }}
          >
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="Alamat email"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 12,
                border: "1px solid #E2D7C7",
                background: "#fff",
                color: "#1C1B19",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "0.5rem",
              fontSize: 14,
              color: "#5D4D3B",
            }}
          >
            Kata Sandi
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Minimal 6 karakter"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 12,
                border: "1px solid #E2D7C7",
                background: "#fff",
                color: "#1C1B19",
              }}
            />
          </label>

          {errorMessage && (
            <div
              style={{
                color: "#9B2C2C",
                fontSize: 14,
                background: "#F8E3E3",
                borderRadius: 12,
                padding: "0.9rem 1rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: 14,
              border: "none",
              background: "#B0955F",
              color: "#fff",
              fontWeight: 600,
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "Memproses..." : "Buat Akun"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: 14,
            color: "#6E5F4D",
          }}
        >
          <span>Sudah punya akun? </span>
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            style={{
              color: "#805C29",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Masuk di sini
          </Link>
        </div>
      </section>
    </main>
  );
}
