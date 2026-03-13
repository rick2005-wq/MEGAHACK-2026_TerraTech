"use client";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-20 px-12 bg-white">
      <div
        className="max-w-[1200px] mx-auto rounded-[32px] px-16 py-16 flex items-center justify-between gap-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e4620 0%, #2d6b30 100%)" }}
      >
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute -bottom-20 left-[40%] w-48 h-48 rounded-full" style={{ background: "rgba(163,196,92,0.1)" }} />

        <div className="relative z-10">
          <h2
            className="font-bold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 36 }}
          >
            Ready to sell at the <span style={{ color: "#a3c45c" }}>right price?</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Join 50,000+ farmers already trading directly. Free forever for farmers.
          </p>
        </div>

        <div className="flex gap-4 relative z-10 flex-shrink-0">
          <Link href="/register">
            <button
              className="px-7 py-3.5 rounded-full text-sm font-bold text-green-900 transition-all hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            >
              Start for Free →
            </button>
          </Link>
          <button
            className="px-7 py-3.5 rounded-full text-sm font-semibold text-white border-2 transition-all hover:border-white/70"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Browse Tenders
          </button>
        </div>
      </div>
    </section>
  );
}
