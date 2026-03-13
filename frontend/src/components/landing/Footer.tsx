"use client";

const FOOTER_COLS = [
  {
    title: "Platform",
    links: ["For Farmers", "For Industries", "Tender System", "Produce Listings", "Chat & Negotiate"],
  },
  {
    title: "Company",
    links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Data Terms", "Cookie Policy", "UIDAI Compliance"],
  },
];

export default function Footer() {
  return (
    <footer className="px-12 pt-16 pb-8" style={{ background: "#0f2110" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "#2d6b30" }}>
                🌾
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                GrainOS
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-[260px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              India's largest direct agri-supply network. Connecting farmers to industries without exploitation.
            </p>
            <div className="flex gap-2">
              {["𝕏", "in", "f", "▶"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm cursor-pointer transition-all hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {title}
              </div>
              <div className="flex flex-col gap-3">
                {links.map((l) => (
                  <a
                    key={l}
                    className="text-sm cursor-pointer transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2025 GrainOS. All rights reserved. Made with 🌾 for Indian farmers.
          </span>
          <div className="flex gap-2">
            {["🔐 SSL Secured", "🏛️ UIDAI Certified", "🇮🇳 Made in India"].map((b) => (
              <span key={b} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
