"use client";
import Link from "next/link";

const S = {
  page: { padding: "28px 32px" } as React.CSSProperties,
  topbar: { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 } as React.CSSProperties,
  card: { background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(30,70,20,0.07)", marginBottom: 16 } as React.CSSProperties,
  cardTitle: { fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "#1a2e1a" } as React.CSSProperties,
};

const STATS = [
  { icon: "💰", label: "Total Earnings",  value: "₹1.24L", change: "↑ +18% this month", up: true },
  { icon: "📦", label: "Active Listings", value: "4",       change: "↑ +2 this week",    up: true },
  { icon: "🤝", label: "Incoming Bids",   value: "9",       change: "3 need response",   up: true },
  { icon: "⭐", label: "Seller Rating",   value: "4.9",     change: "Top 5% sellers",    up: true },
];

const LISTINGS = [
  { emoji: "🥔", name: "Potatoes",   qty: "800 kg",  price: "₹22/kg", loc: "Nashik, MH",   bids: 4, active: true },
  { emoji: "🌶️", name: "Red Chilli", qty: "500 kg",  price: "₹85/kg", loc: "Kolhapur, MH", bids: 7, active: true },
  { emoji: "🧅", name: "Onions",     qty: "2 ton",   price: "₹14/kg", loc: "Nasik, MH",    bids: 0, active: false },
];

const BIDS = [
  { company: "FreshSnacks Pvt Ltd",  produce: "Potatoes · 500 kg",   amount: "₹24/kg", time: "2 min ago", isNew: true,  isHigh: true },
  { company: "AgroFoods Industries", produce: "Sweet Corn · 1 ton",  amount: "₹20/kg", time: "1 hr ago",  isNew: false, isHigh: true },
  { company: "NatureFresh Exports",  produce: "Red Chilli · 400 kg", amount: "₹88/kg", time: "3 hr ago",  isNew: false, isHigh: false },
];

const CHATS = [
  { emoji: "🏭", name: "FreshSnacks Pvt Ltd",  msg: "We can offer ₹24/kg for 500kg...", time: "2m", unread: 3 },
  { emoji: "🌿", name: "AgroFoods Industries", msg: "Please share quality certificate",  time: "1h", unread: 1 },
  { emoji: "🚢", name: "NatureFresh Exports",  msg: "Interested in bulk order next season", time: "3h", unread: 0 },
];

export default function DashboardPage() {
  return (
    <>
      {/* Topbar */}
      <div style={S.topbar}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>Good morning, Ramesh 🌾</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>Saturday, 28 Feb 2026 · Nashik, Maharashtra</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f4ec", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(30,70,20,0.08)" }}>
            <span style={{ opacity: 0.4 }}>🔍</span>
            <input placeholder="Search..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 180, fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          <button style={{ width: 38, height: 38, borderRadius: 11, border: "1px solid rgba(30,70,20,0.08)", background: "#f0f4ec", fontSize: 16, cursor: "pointer", position: "relative" }}>
            🔔<span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#e53e3e", borderRadius: "50%", border: "2px solid #fff" }} />
          </button>
          <Link href="/farmer/listings">
            <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", padding: "9px 18px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              + Add Produce
            </button>
          </Link>
        </div>
      </div>

      <div style={S.page} className="fade-up">
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
          {STATS.map(({ icon, label, value, change, up }) => (
            <div key={label} style={{ ...S.card, marginBottom: 0, transition: "all 0.2s", cursor: "default" }}>
              <div style={{ fontSize: 20, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#1a2e1a" }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: up ? "#2d6b30" : "#e53e3e" }}>{change}</div>
            </div>
          ))}
        </div>

        {/* Listings + Bids */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={S.cardTitle}>My Active Listings</span>
              <Link href="/farmer/listings" style={{ fontSize: 12, color: "#2d6b30", fontWeight: 600 }}>View all →</Link>
            </div>
            {LISTINGS.map(({ emoji, name, qty, price, loc, bids, active }) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, marginBottom: 8, border: "1px solid transparent", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f6f9f0"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f6f9f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, position: "relative", flexShrink: 0 }}>
                  {emoji}<span style={{ position: "absolute", bottom: 2, right: 2, background: "#1e4620", borderRadius: 100, padding: "1px 4px", fontSize: 8, color: "#fff", fontWeight: 700 }}>📍</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1a" }}>{name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>📍 {loc} · {bids} bids</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2d6b30" }}>{price}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{qty}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#22c55e" : "#f59e0b", flexShrink: 0 }} />
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={S.cardTitle}>Incoming Bids</span>
              <Link href="/farmer/bids" style={{ fontSize: 12, color: "#2d6b30", fontWeight: 600 }}>All bids →</Link>
            </div>
            {BIDS.map(({ company, produce, amount, time, isNew, isHigh }) => (
              <div key={company} style={{ padding: 12, borderRadius: 14, marginBottom: 8, background: "#f6f9f0", border: "1px solid rgba(30,70,20,0.06)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1a2e1a" }}>
                    🏭 {company}
                    {isNew && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "#fef3c7", color: "#92400e", marginLeft: 5 }}>NEW</span>}
                    {isHigh && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "#f0f7f0", color: "#2d6b30", marginLeft: 4 }}>ABOVE MKT</span>}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2d6b30" }}>{amount}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>📦 {produce}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>🕐 {time}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "4px 10px", borderRadius: 8, border: "none", fontSize: 10, fontWeight: 700, background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✕ Decline</button>
                    <button style={{ padding: "4px 10px", borderRadius: 8, border: "none", fontSize: 10, fontWeight: 700, background: "#1e4620", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✓ Accept</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chats */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={S.cardTitle}>Recent Messages</span>
            <Link href="/farmer/messages" style={{ fontSize: 12, color: "#2d6b30", fontWeight: 600 }}>Open inbox →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {CHATS.map(({ emoji, name, msg, time, unread }) => (
              <Link key={name} href="/farmer/messages">
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, cursor: "pointer", border: "1px solid #f0f0f0" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f6f9f0"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#f0f7f0,#d4edda)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a2e1a" }}>{name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{time}</span>
                    {unread > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#1e4620", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>{unread}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
