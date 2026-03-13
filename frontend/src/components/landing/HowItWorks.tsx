"use client";

const STEPS = [
  {
    num: "01", icon: "🪪",
    title: "Verify with Aadhaar",
    desc: "Sign up and verify your identity with Aadhaar eKYC in under 2 minutes. Get your Government Verified badge instantly.",
    tag: "2 min setup",
  },
  {
    num: "02", icon: "📦",
    title: "List Your Produce",
    desc: "Add your crop details — type, quantity, price, harvest date and photos. Your listing goes live to 2,000+ verified industries.",
    tag: "Instant listing",
  },
  {
    num: "03", icon: "💰",
    title: "Get Direct Offers",
    desc: "Industries find you, send bids, and you negotiate directly in real-time chat. No middleman. You keep 100% of the agreed price.",
    tag: "Zero commission",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "#f6f9f0", border: "1px solid rgba(45,107,48,0.15)", color: "#2d6b30" }}
          >
            ✦ Simple Process
          </div>
          <h2
            className="font-semibold text-green-950 leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 42 }}
          >
            How GrainOS <span style={{ color: "#a3c45c" }}>works</span>
          </h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-[500px]">
            From signup to your first deal in under 24 hours. No paperwork, no agents, no delays.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 relative">
          <div
            className="absolute"
            style={{
              top: 36, left: "calc(16% + 24px)", right: "calc(16% + 24px)",
              height: 2, background: "linear-gradient(90deg, #a3c45c, #2d6b30)",
            }}
          />
          {STEPS.map(({ num, icon, title, desc, tag }) => (
            <div
              key={num}
              className="relative z-10 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-default"
              style={{ background: "#f6f9f0", border: "1px solid transparent" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(30,70,20,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-5"
                style={{ background: "#1e4620", fontFamily: "'Playfair Display', serif" }}
              >
                {num}
              </div>
              <span className="text-3xl block mb-4">{icon}</span>
              <h3
                className="text-lg font-semibold text-green-950 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              <span
                className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(45,107,48,0.08)", color: "#2d6b30" }}
              >
                ✓ {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
