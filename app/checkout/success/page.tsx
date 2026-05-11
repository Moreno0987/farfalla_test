"use client";

import { Suspense } from "react"; // 1. Suspense diambil dari react
import { useSearchParams } from "next/navigation"; // 2. Ini tetap di next/navigation
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "";

  return (
    <div className="max-w-[500px] mx-auto mt-16 p-6 text-center">
      {/* Icon Checkmark */}
      <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-[#1D9E75]">
        ✓
      </div>

      <h1 className="serif italic text-3xl text-[#2C2015] mb-3">
        Pesanan Diterima!
      </h1>

      <p className="text-sm text-[#7A5C1E] leading-relaxed mb-2">
        Terima kasih telah mempercayai Farfalla. Pesanan Anda sedang kami proses.
      </p>

      {orderId && (
        <p className="text-[11px] text-gray-400 mb-8 font-mono tracking-tighter">
          Order ID: {orderId}
        </p>
      )}

      {/* Info Box */}
      <div className="bg-[#F5EDD8] rounded-xl p-4 mb-8 text-left border border-[#D4AA5C]/20">
        <p className="text-[12px] text-[#7A5C1E] leading-relaxed m-0">
          Tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi pesanan dalam 1×24 jam.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        <Link href="/">
          <button className="btn-bali bg-transparent">
            Beranda
          </button>
        </Link>
        
        <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
          <button className="bg-[#2C2015] text-[#F5EDD8] px-6 py-2.5 text-[11px] tracking-widest uppercase rounded-lg hover:bg-[#3D2D1A] transition-all">
            WhatsApp ↗
          </button>
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    // Membungkus Content dengan Suspense agar useSearchParams tidak error saat Build
    <Suspense fallback={<div className="text-center mt-20 pcard">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}