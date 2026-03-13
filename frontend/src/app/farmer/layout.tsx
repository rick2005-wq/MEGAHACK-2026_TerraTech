"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { icon: "🏠", label: "Dashboard",   href: "/farmer/dashboard" },
  { icon: "📦", label: "My Listings", href: "/farmer/listings",  badge: "3" },
  { icon: "📋", label: "Tenders",     href: "/farmer/tenders",   badge: "12" },
  { icon: "🤝", label: "Bids",        href: "/farmer/bids",      badge: "3",  red: true },
  { icon: "💬", label: "Messages",    href: "/farmer/messages",  badge: "4",  red: true },
  { icon: "📊", label: "Analytics",   href: "/farmer/analytics" },
  { icon: "💰", label: "Payments",    href: "/farmer/payments" },
];

const TICKER = [
  { name: "Potato", price: "₹22/kg", change: "▲ +4.2%", up: true },
  { name: "Onion",  price: "₹14/kg", change: "▼ -1.8%", up: false },
  { name: "Corn",   price: "₹18/kg", change: "▲ +2.1%", up: true },
  { name: "Chilli", price: "₹85/kg", change: "▲ +6.4%", up: true },
  { name: "Wheat",  price: "₹28/kg", change: "▲ +0.8%", up: true },
  { name: "Tomato", price: "₹32/kg", change: "▲+12.3%",  up: true },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4ec", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "#1e4620", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>GrainOS</span>
        </div>

        {/* Farmer profile */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#3a7d35,#a3c45c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👨‍🌾</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Ramesh Patil</div>
            <div style={{ display: "inline-flex", background: "rgba(163,196,92,0.15)", border: "1px solid rgba(163,196,92,0.3)", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: "#a3c45c", fontWeight: 600, marginTop: 2 }}>✅ Govt. Verified</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: 12, position: "relative", zIndex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "8px 8px 4px" }}>Main Menu</div>
          {NAV.map(({ icon, label, href, badge, red }) => {
            const active = path.startsWith(href);
            return (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 12, marginBottom: 2, fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  {label}
                  {badge && (
                    <span style={{ marginLeft: "auto", background: red ? "#e53e3e" : "#3a7d35", color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                      {badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "14px 8px 4px" }}>Account</div>
          {[
            { icon: "⚙️", label: "Settings", href: "/farmer/settings" },
            { icon: "🚪", label: "Logout",   href: "/login" },
          ].map(({ icon, label, href }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, marginBottom: 2, fontSize: 13, fontWeight: path.startsWith(href) ? 600 : 500, color: path.startsWith(href) ? "#fff" : "rgba(255,255,255,0.55)", background: path.startsWith(href) ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer" }}>
                <span>{icon}</span>{label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Help box */}
        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Need Help?</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 10 }}>Our agri-experts are available 24/7 in your language.</div>
            <button style={{ width: "100%", padding: 8, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>📞 Call Support</button>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Live price ticker */}
        <div style={{ background: "#1e4620", padding: "8px 32px", display: "flex", alignItems: "center", gap: 32, overflow: "hidden" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#a3c45c", letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>Live Prices</span>
          <div style={{ display: "flex", gap: 24, animation: "tickerScroll 22s linear infinite" }}>
            {[...TICKER, ...TICKER].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{item.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{item.price}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.up ? "#a3c45c" : "#fc8181" }}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {children}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.3s ease; }
        a { text-decoration: none; }
      `}</style>
    </div>
  );
}
