"use client";

import { useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [hoverUtama, setHoverUtama] = useState(false);
  const [hoverVideo, setHoverVideo] = useState(false);

  const gayaDasarBtn = {
    padding: "12px 24px",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: "'Inter', sans-serif",
    border: "1px solid transparent",
    fontWeight: 500,
  };

  // WARNA BARU: Menggunakan warna yang selaras dengan tema Farfalla
  const gayaBtnUtama = {
    ...gayaDasarBtn,
    // Background menggunakan warna krem emas (F5EDD8) saat hover, 
    // dan cokelat keemasan (C8963E) saat normal
    background: hoverUtama ? "#F5EDD8" : "#C8963E", 
    color: hoverUtama ? "#3D2810" : "#1C1208",
    borderColor: hoverUtama ? "#C8963E" : "transparent",
  };

  const gayaBtnOutline = {
    ...gayaDasarBtn,
    background: hoverVideo ? "rgba(245, 237, 216, 0.1)" : "transparent",
    color: "#F5EDD8",
    borderColor: "rgba(245, 237, 216, 0.3)",
  };

  return (
    <div style={{ 
      position: "relative", 
      background: "linear-gradient(160deg, #1C1208 0%, #2E1E0A 50%, #3D2810 100%)", 
      borderRadius: 12, 
      padding: "4rem 2.5rem", 
      marginBottom: "1.5rem", 
      overflow: "hidden" 
    }}>
      {/* Pattern Overlay */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        opacity: 0.05, 
        backgroundImage: "repeating-linear-gradient(45deg, #C8963E 0px, #C8963E 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #C8963E 0px, #C8963E 1px, transparent 1px, transparent 12px)",
        pointerEvents: "none"
      }} />
      
      <div style={{ position: "relative", zIndex: 1, maxWidth: 500 }}>
        <span style={{ 
          color: "#C8963E", 
          fontSize: "10px", 
          letterSpacing: "0.2em", 
          textTransform: "uppercase",
          marginBottom: "1rem",
          display: "block"
        }}>
          Ubud · Singaraja · Celuk
        </span>
        
        <h1 className="serif" style={{ 
          fontSize: "clamp(36px, 5vw, 52px)", 
          fontWeight: 400, 
          color: "#F5EDD8", 
          lineHeight: 1.1, 
          margin: "0.5rem 0 1rem", 
          fontStyle: "italic" 
        }}>
          Warisan yang<br />Hidup di Tangan
        </h1>
        
        <p style={{ 
          fontSize: "14px", 
          color: "#A89070", 
          margin: "0 0 2.5rem", 
          lineHeight: 1.6, 
          maxWidth: 380 
        }}>
          Aksesori gelang dan kalung tradisional dan modern, dibuat langsung oleh pengrajin lokal Bali.
        </p>
        
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <button 
              style={gayaBtnUtama}
              onMouseEnter={() => setHoverUtama(true)}
              onMouseLeave={() => setHoverUtama(false)}
            >
              Jelajahi Koleksi ↗
            </button>
          </Link>

          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button 
              style={gayaBtnOutline}
              onMouseEnter={() => setHoverVideo(true)}
              onMouseLeave={() => setHoverVideo(false)}
            >
              Lihat Video Pengrajin
            </button>
          </a>
        </div>
      </div>

      {/* Decorative Icon */}
      <div style={{ 
        position: "absolute", 
        right: "3rem", 
        top: "50%", 
        transform: "translateY(-50%)", 
        opacity: 0.1, 
        fontSize: "180px", 
        color: "#C8963E", 
        pointerEvents: "none",
        fontFamily: "serif"
      }}>
        ✦
      </div>
    </div>
  );
}