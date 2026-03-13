"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEMO_INDUSTRY_ID = "00000000-0000-0000-0000-000000000002";

export default function IndustryBidsPage() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      // Get all tenders by this industry, then get bids on them
      const { data: tenderData } = await supabase
        .from("tenders")
        .select("id, crop, quantity, budget_per_kg")
        .eq("industry_id", DEMO_INDUSTRY_ID);

      if (!tenderData || tenderData.length === 0) { setLoading(false); return; }

      const tenderIds = tenderData.map((t: any) => t.id);
      const tenderMap = Object.fromEntries(tenderData.map((t: any) => [t.id, t]));

      const { data: bidData } = await supabase
        .from("bids")
        .select("*, users(name, email, state)")
        .in("tender_id", tenderIds)
        .order("created_at", { ascending: false });

      const enriched = (bidData || []).map((b: any) => ({
        ...b,
        tender: tenderMap[b.tender_id],
      }));

      setBids(enriched);
      setLoading(false);
    };

    fetchBids();
  }, []);

  const updateBidStatus = async (bidId: string, status: "accepted" | "rejected") => {
    setUpdatingId(bidId);
    await supabase.from("bids").update({ status }).eq("id", bidId);
    setBids(prev => prev.map(b => b.id === bidId ? { ...b, status } : b));
    setUpdatingId(null);
  };

  const statusColor = (s: string) => {
    if (s === "accepted") return { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" };
    if (s === "rejected") return { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" };
    return { bg: "#fefce8", color: "#d97706", dot: "#f59e0b" };
  };

  return (
    <>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>Incoming Bids 🤝</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>Review and respond to farmer bids on your tenders</p>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "#d97706" }}>⏳ {bids.filter(b => b.status === "pending").length} pending</span>
          <span style={{ fontWeight: 700, color: "#16a34a" }}>✅ {bids.filter(b => b.status === "accepted").length} accepted</span>
        </div>
      </div>

      <div style={{ padding: "28px 32px" }} className="fade-up">
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(30,70,20,0.07)" }}>

          {loading && <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>⏳ Loading bids…</div>}

          {!loading && bids.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No bids yet</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Post a tender and farmers will start bidding</div>
            </div>
          )}

          {bids.map(bid => {
            const s = statusColor(bid.status);
            const isUpdating = updatingId === bid.id;
            return (
              <div key={bid.id} style={{ border: "1px solid rgba(30,70,20,0.08)", borderRadius: 16, padding: 18, marginBottom: 12, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.35)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,70,20,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,70,20,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f0f7f0,#d4edda)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👨‍🌾</div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: "#1a2e1a" }}>
                        {bid.users?.name || "Farmer"}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {bid.users?.state && `📍 ${bid.users.state} · `}Bid on: {bid.tender?.crop}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#2d6b30" }}>₹{bid.price_per_kg}/kg</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>vs budget ₹{bid.tender?.budget_per_kg}/kg</div>
                  </div>
                </div>

                {/* Message */}
                {bid.message && (
                  <div style={{ background: "#f6f9f0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#374151", marginBottom: 12, lineHeight: 1.6 }}>
                    💬 "{bid.message}"
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: s.bg }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: s.color, textTransform: "capitalize" }}>{bid.status}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>
                    {new Date(bid.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    {bid.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateBidStatus(bid.id, "rejected")}
                          disabled={isUpdating}
                          style={{ padding: "6px 14px", borderRadius: 10, border: "none", background: "#fee2e2", color: "#991b1b", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                          ✕ Reject
                        </button>
                        <button
                          onClick={() => updateBidStatus(bid.id, "accepted")}
                          disabled={isUpdating}
                          style={{ padding: "6px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                          {isUpdating ? "⏳" : "✓ Accept"}
                        </button>
                      </>
                    )}
                    {bid.status === "accepted" && (
                      <button style={{ padding: "6px 16px", borderRadius: 10, border: "none", background: "#f0f7f0", color: "#2d6b30", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        💬 Message Farmer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
