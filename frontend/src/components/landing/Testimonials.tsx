"use client";

const TESTIMONIALS = [
  {
    emoji: "👨‍🌾", name: "Ramesh Patil", meta: "Wheat Farmer · Nashik, Maharashtra",
    text: "Before GrainOS I was selling at ₹18/kg through agents. Now I get ₹26/kg directly from a chips factory. My income went up 40% in just 3 months.",
    stars: 5, badge: "✅ Govt. Verified",
  },
  {
    emoji: "👩‍🌾", name: "Sunita Devi", meta: "Potato Farmer · Agra, UP",
    text: "The Aadhaar verification gave me trust. Buyers know I am real. I got my first export order to a Dubai importer through GrainOS last season.",
    stars: 5, badge: "🌍 Export Seller",
  },
  {
    emoji: "👨‍💼", name: "Arjun Mehta", meta: "Procurement Head · FreshSnacks Pvt Ltd",
    text: "We floated a tender for 50 tons of potatoes and got 12 verified bids within 24 hours. Quality was consistent and the price was 18% below market.",
    stars: 5, badge: "🏭 Industry Buyer",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-12 overflow-hidden" style={{ background: "#1e4620" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14">
          <div
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
          >
            ✦ Farmer Stories
          </div>
          <h2
            className="font-semibold text-white leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 42 }}
          >
            Real farmers. <span style={{ color: "#a3c45c" }}>Real profits.</span>
          </h2>
          <p className="text-base leading-relaxed max-w-[500px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Hear from the farmers and buyers who have already left the middlemen behind.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ emoji, name, meta, text, stars, badge }) => (
            <div
              key={name}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
            >
              <div className="text-sm mb-3" style={{ color: "#f0c040" }}>{"★".repeat(stars)}</div>
              <div
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "rgba(163,196,92,0.15)", border: "1px solid rgba(163,196,92,0.3)", color: "#a3c45c" }}
              >
                {badge}
              </div>
              <div
                className="text-4xl leading-none mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#a3c45c" }}
              >
                &ldquo;
              </div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "rgba(255,255,255,0.8)" }}>
                {text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  {emoji}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
