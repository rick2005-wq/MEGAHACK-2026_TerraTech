"use client";
import Link from "next/link";

const PRODUCE = [
  { emoji: "🥔", name: "Potatoes",   meta: "Ramesh K. · Nashik",  qty: "500 kg",  price: "₹22/kg" },
  { emoji: "🌽", name: "Sweet Corn", meta: "Sunita D. · Pune",    qty: "1.2 ton", price: "₹18/kg" },
  { emoji: "🧅", name: "Onions",     meta: "Vijay P. · Nasik",    qty: "2 ton",   price: "₹14/kg" },
];

const AVATAR_COLORS = ["#2d6b30", "#3a7d35", "#4a8f40", "#1e4620", "#5a9f50"];
const AVATAR_LETTERS = ["R", "S", "A", "M", "P"];

export default function HeroSection() {
  return (
    <section
      className="min-h-screen relative overflow-hidden flex items-center"
      style={{ background: "linear-gradient(135deg, #e8f0e3 0%, #f5f9f0 50%, #edf3e8 100%)" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{ width: 700, height: 700, borderRadius: "50%", top: -200, right: -100,
          background: "radial-gradient(circle, rgba(45,107,48,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ width: 400, height: 400, borderRadius: "50%", bottom: -100, left: 100,
          background: "radial-gradient(circle, rgba(163,196,92,0.15) 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#2d5a27 1px, transparent 1px), linear-gradient(90deg, #2d5a27 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative z-10 w-full max-w-[1200px] mx-auto px-12 grid gap-16 items-center"
        style={{ paddingTop: 120, paddingBottom: 80, gridTemplateColumns: "1fr 1fr" }}
      >
        <div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(45,107,48,0.1)", border: "1px solid rgba(45,107,48,0.2)", color: "#2d6b30" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#a3c45c" }} />
            India's #1 Direct Agri Marketplace
          </div>

          <h1
            className="font-bold text-green-950 leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 58 }}
          >
            Farm to factory.<br />
            <span className="text-green-700" style={{ fontStyle: "italic" }}>No middlemen.</span><br />
            <span style={{ color: "#a3c45c" }}>Full profit.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-[480px]">
            GrainOS connects farmers directly with food industries — chips factories, oil mills,
            exporters and FMCG companies. Transparent pricing, verified buyers, zero commission.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href="/register">
              <button
                className="px-8 py-3.5 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #1e4620, #2d6b30)", boxShadow: "0 8px 24px rgba(30,70,20,0.25)" }}
              >
                Start Selling Free →
              </button>
            </Link>
            <button
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-green-900 border-2 transition-all hover:bg-green-50"
              style={{ borderColor: "rgba(30,70,20,0.2)" }}
            >
              Browse Tenders
            </button>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex">
              {AVATAR_LETTERS.map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: AVATAR_COLORS[i], marginLeft: i === 0 ? 0 : -8 }}
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Trusted by <strong className="text-green-900">50,000+</strong> farmers across India
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 z-10"
            style={{ boxShadow: "0 8px 32px rgba(30,70,20,0.12)", animation: "floatUp 3s ease-in-out infinite" }}
          >
            <span className="text-2xl">📈</span>
            <div>
              <div className="text-xs text-gray-400">Avg. Price Increase</div>
              <div className="text-base font-bold text-gray-800">+34% <span className="text-green-600 text-xs">↑</span></div>
            </div>
          </div>

          <div
            className="rounded-3xl p-7"
            style={{
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 24px 60px rgba(30,70,20,0.12)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-green-950" style={{ fontFamily: "'Playfair Display', serif" }}>
                Live Produce Market
              </span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "#f0f7f0", border: "1px solid #a3c45c", color: "#2d6b30" }}
              >
                🟢 Live
              </span>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {PRODUCE.map(({ emoji, name, meta, qty, price }) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3"
                  style={{ background: "#f6f9f0" }}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{meta} · {qty}</div>
                  </div>
                  <span className="text-sm font-bold text-green-700">{price}</span>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #1e4620, #2d6b30)" }}
            >
              Browse All Produce →
            </button>
          </div>

          <div
            className="absolute -bottom-4 -left-5 rounded-2xl px-4 py-3 flex items-center gap-3 z-10"
            style={{ background: "#1e4620", boxShadow: "0 8px 32px rgba(30,70,20,0.2)", animation: "floatDown 3.5s ease-in-out infinite" }}
          >
            <span className="text-2xl">🏭</span>
            <div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>New Tender Posted</div>
              <div className="text-sm font-bold text-white">50 ton Wheat</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp   { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-8px) } }
        @keyframes floatDown { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(8px)  } }
      `}</style>
    </section>
  );
}
