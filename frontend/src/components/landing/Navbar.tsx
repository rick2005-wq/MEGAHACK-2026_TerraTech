"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
      style={{
        padding: scrolled ? "14px 48px" : "18px 48px",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 1px 40px rgba(30,70,20,0.08)" : "none",
      }}
    >
      <Link href="/landing" className="flex items-center gap-2 no-underline">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#1e4620" }}>
          🌾
        </div>
        <span className="text-xl font-bold text-green-950" style={{ fontFamily: "'Playfair Display', serif" }}>
          GrainOS
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        {["How it works", "Features", "For Farmers", "For Industries"].map((l) => (
          <a key={l} className="text-sm font-medium text-gray-500 hover:text-green-900 transition-colors cursor-pointer">
            {l}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold text-green-900 border-2 transition-all"
            style={{ borderColor: "rgba(30,70,20,0.2)" }}
          >
            Login
          </button>
        </Link>
        <Link href="/register">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all"
            style={{ background: "#1e4620", boxShadow: "0 4px 14px rgba(30,70,20,0.3)" }}
          >
            Get Started Free →
          </button>
        </Link>
      </div>
    </nav>
  );
}
