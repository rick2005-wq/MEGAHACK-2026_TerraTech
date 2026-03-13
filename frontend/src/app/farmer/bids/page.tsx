"use client";
import { useState } from "react";

const gd = "#1e4620", gm = "#2d6b30", ac = "#a3c45c", navy = "#1e2a4a";
const PF = (s: any) => ({ fontFamily: "'Playfair Display',serif", ...s });
const card = (x: any = {}) => ({ background: "#fff", borderRadius: 20, border: "1px solid rgba(30,70,20,.07)", ...x });
const gBtn = (x: any = {}) => ({ background: `linear-gradient(135deg,${gd},${gm})`, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13, transition: "all .18s", ...x });
const ghBtn = (x: any = {}) => ({ background: "#f0f4ec", color: "#374151", border: "1px solid rgba(30,70,20,.1)", borderRadius: 12, padding: "10px 16px", fontWeight: 600, cursor: "pointer", fontSize: 13, ...x });

function Badge({ color = "green", children }: { color?: string; children: React.ReactNode }) {
  const C: any = { green: { bg: "#f0f7f0", fg: "#2d6b30" }, amber: { bg: "#fef3c7", fg: "#92400e" }, blue: { bg: "#eff6ff", fg: "#1d4ed8" }, red: { bg: "#fee2e2", fg: "#991b1b" }, gray: { bg: "#f3f4f6", fg: "#6b7280" } };
  const s = C[color] || C.gray;
  return <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: s.bg, color: s.fg, display: "inline-flex", alignItems: "center" }}>{children}</span>;
}

const MOCK_BIDS = [
  { id: 1, listingId: 1, listingName: "Grade A Potatoes", listingPrice: 22, buyer: "Britannia Industries", emoji: "🏭", offer: 24, qty: "500 kg", time: "2h ago", status: "new", note: "Need for chip production. Can pickup from farm." },
  { id: 2, listingId: 1, listingName: "Grade A Potatoes", listingPrice: 22, buyer: "PepsiCo India", emoji: "🏭", offer: 23, qty: "800 kg", time: "5h ago", status: "new", note: "Bulk order. FSSAI cert needed." },
  { id: 3, listingId: 2, listingName: "Nashik Onion", listingPrice: 14, buyer: "BigBasket", emoji: "🛒", offer: 15, qty: "2 ton", time: "3h ago", status: "shortlisted", note: "Regular weekly supply needed." },
  { id: 4, listingId: 3, listingName: "Hybrid Tomato", listingPrice: 32, buyer: "Haldiram's", emoji: "🏭", offer: 34, qty: "400 kg", time: "30m ago", status: "new", note: "Sauce production. Need brix 5.2+" },
  { id: 5, listingId: 3, listingName: "Hybrid Tomato", listingPrice: 32, buyer: "ITC Foods", emoji: "🏭", offer: 33, qty: "600 kg", time: "4h ago", status: "awarded", note: "Looking for consistent weekly supply." },
  { id: 6, listingId: 4, listingName: "Red Chilli Teja", listingPrice: 85, buyer: "MDH Spices", emoji: "🌶️", offer: 75, qty: "300 kg", time: "1d ago", status: "rejected", note: "Export grade required." },
];

const TABS = ["new", "shortlisted", "awarded", "rejected", "all"] as const;
type Tab = typeof TABS[number];
type BidStatus = "new" | "shortlisted" | "awarded" | "rejected";

export default function FarmerBidsPage() {
  const [tab, setTab] = useState<Tab>("new");
  const [bids, setBids] = useState(MOCK_BIDS);
  const [search, setSearch] = useState("");

  const filtered = (tab === "all" ? bids : bids.filter(b => b.status === tab))
    .filter(b => b.buyer.toLowerCase().includes(search.toLowerCase()) || b.listingName.toLowerCase().includes(search.toLowerCase()));

  const act = (id: number, status: BidStatus) => setBids(prev => prev.map(b => b.id === id ? { ...b, status } : b));

  const statusColor: Record<string, string> = { new: "amber", shortlisted: "blue", awarded: "green", rejected: "gray" };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2e8" }}>
      {/* Topbar */}
      <div style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,42,74,.07)", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <h1 style={PF({ fontSize: 19, fontWeight: 600, color: "#1a1f36" })}>Bids Received 🤝</h1>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>All buyer applications to your produce listings</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f8", borderRadius: 12, padding: "8px 14px", border: "1px solid rgba(30,42,74,.07)" }}>
          <span style={{ opacity: .4, fontSize: 13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buyer, listing…" style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, width: 190 }} />
          {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", fontSize: 11 }}>✕</button>}
        </div>
      </div>

      <div style={{ padding: "22px 28px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" as const }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 16px", borderRadius: 10, border: "1px solid", fontSize: 11, fontWeight: 600, cursor: "pointer", background: tab === t ? navy : "#fff", color: tab === t ? "#fff" : "#374151", borderColor: tab === t ? "transparent" : "#e5e7eb", textTransform: "capitalize" as const, transition: "all .12s" }}>
              {t}{t === "new" && ` (${bids.filter(b => b.status === "new").length})`}{t === "all" && ` (${bids.length})`}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ ...card({ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: 13 }) }}>
            No {tab} bids. Keep listing quality produce! 🌾
          </div>
        )}

        {/* Bid list */}
        <div style={card({ padding: 0, overflow: "hidden" })}>
          {filtered.map((b, i) => (
            <div key={b.id} style={{ padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f5" : "none", transition: "background .15s" }} onMouseEnter={e => (e.currentTarget.style.background = "#f9fdf9")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{b.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a" }}>{b.buyer}</span>
                    <Badge color={statusColor[b.status] || "gray"}>{b.status.toUpperCase()}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>📋 {b.listingName} · 📦 {b.qty} · 🕐 {b.time}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={PF({ fontSize: 19, fontWeight: 700, color: gd })}>₹{b.offer}/kg</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>Market: ₹{b.listingPrice}/kg</div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#374151", background: "#f9fdf9", padding: "8px 12px", borderRadius: 9, marginBottom: 10, lineHeight: 1.5 }}>
                &quot;{b.note}&quot;
              </div>

              {(b.status === "new" || b.status === "shortlisted") && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => act(b.id, "rejected")} style={{ ...ghBtn({ flex: 1, padding: "8px 0", fontSize: 11 }), color: "#991b1b", background: "#fee2e2", border: "none" }}>✕ Reject</button>
                  {b.status === "new" && <button onClick={() => act(b.id, "shortlisted")} style={ghBtn({ flex: 1, padding: "8px 0", fontSize: 11 })}>⭐ Shortlist</button>}
                  <button onClick={() => act(b.id, "awarded")} style={gBtn({ flex: 2, padding: "8px 0", fontSize: 11 })}>🏆 Award Deal</button>
                </div>
              )}
              {b.status === "awarded" && <div style={{ padding: "8px 12px", borderRadius: 9, background: "#f0f7f0", textAlign: "center", fontSize: 12, fontWeight: 700, color: gm }}>🏆 Deal Awarded · Delivery confirmation pending</div>}
              {b.status === "rejected" && <div style={{ padding: "8px 12px", borderRadius: 9, background: "#f9f9f9", textAlign: "center", fontSize: 12, color: "#9ca3af" }}>✕ Bid rejected</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}