"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";

// Tag colors per crop
function getTagStyle(tag: string) {
  const map: Record<string, { tc: string; tt: string }> = {
    Wheat:      { tc: "#fef3c7", tt: "#92400e" },
    Potato:     { tc: "#f0f7f0", tt: "#2d6b30" },
    Chilli:     { tc: "#eff6ff", tt: "#1d4ed8" },
    Onion:      { tc: "#fef3c7", tt: "#92400e" },
    Tomato:     { tc: "#fdf4ff", tt: "#7e22ce" },
    Corn:       { tc: "#f0f7f0", tt: "#2d6b30" },
    Urgent:     { tc: "#fee2e2", tt: "#991b1b" },
    Monthly:    { tc: "#f0f7f0", tt: "#2d6b30" },
    Export:     { tc: "#eff6ff", tt: "#1d4ed8" },
    Bulk:       { tc: "#fef3c7", tt: "#92400e" },
    Organic:    { tc: "#fdf4ff", tt: "#7e22ce" },
    Processing: { tc: "#f0f7f0", tt: "#2d6b30" },
  };
  return map[tag] || { tc: "#f0f4ec", tt: "#374151" };
}

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [expandId, setExpandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // ── Load tenders from Supabase ──
  useEffect(() => {
    const fetchData = async () => {
      // Fetch all open tenders
      const { data: tenderData, error: tenderError } = await supabase
        .from("tenders")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (tenderError) { console.error(tenderError); setLoading(false); return; }

      // Fetch bids already placed by this farmer
      const { data: bidData } = await supabase
        .from("bids")
        .select("tender_id")
        .eq("farmer_id", DEMO_FARMER_ID);

      const appliedSet = new Set((bidData || []).map((b: any) => b.tender_id));
      setAppliedIds(appliedSet);
      setTenders(tenderData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // ── Apply to tender → save bid to Supabase ──
  const applyToTender = async (tender: any) => {
    setApplyingId(tender.id);

    const { error } = await supabase
      .from("bids")
      .insert({
        tender_id: tender.id,
        farmer_id: DEMO_FARMER_ID,
        price_per_kg: tender.budget_per_kg,
        message: `I am interested in supplying ${tender.crop} for your tender.`,
        status: "pending",
      });

    if (error) {
      console.error(error);
      setApplyingId(null);
      return;
    }

    setAppliedIds(prev => new Set([...prev, tender.id]));
    setApplyingId(null);
  };

  const filtered = filter === "applied"
    ? tenders.filter(t => appliedIds.has(t.id))
    : filter === "new"
    ? tenders.filter(t => !appliedIds.has(t.id))
    : tenders;

  return (
    <>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>Available Tenders 📋</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>AI-matched based on your active listings</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "new", "applied"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 10, border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", background: filter === f ? "#1e4620" : "#f0f4ec", color: filter === f ? "#fff" : "#374151", transition: "all 0.2s" }}>
              {f === "all" ? "All Tenders" : f === "new" ? "Not Applied" : "Applied"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }} className="fade-up">
        {/* AI Match banner */}
        <div style={{ background: "linear-gradient(135deg,#1e4620,#2d6b30)", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>🤖</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{tenders.length} tenders AI-matched to your listings</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Based on your listings in Maharashtra</div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(30,70,20,0.07)" }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>
              ⏳ Loading tenders…
            </div>
          )}

          {/* Empty */}
          {!loading && tenders.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No tenders yet</div>
              <div style={{ fontSize: 12 }}>Tenders posted by industry buyers will appear here</div>
            </div>
          )}

          {/* Tender list */}
          {filtered.map(t => {
            const isApplied = appliedIds.has(t.id);
            const isApplying = applyingId === t.id;
            const tags = [t.crop, t.status === "open" ? "Open" : "Closed"].filter(Boolean);
            const tagStyle = getTagStyle(t.crop);

            return (
              <div key={t.id} style={{ border: "1px solid rgba(30,70,20,0.08)", borderRadius: 16, padding: 16, marginBottom: 12, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.35)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,70,20,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,70,20,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: "#1a2e1a" }}>{t.crop} Required — {t.quantity} kg</span>
                    {isApplied && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: "#f0f7f0", color: "#2d6b30", marginLeft: 8 }}>✓ APPLIED</span>}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#2d6b30", flexShrink: 0, marginLeft: 12 }}>₹{t.budget_per_kg}/kg</span>
                </div>

                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
                  📦 {t.quantity} kg required
                  {t.deadline && ` · ⏰ Deadline: ${new Date(t.deadline).toLocaleDateString("en-IN")}`}
                </div>

                {expandId === t.id && t.description && (
                  <div style={{ background: "#f6f9f0", borderRadius: 12, padding: "12px 14px", marginBottom: 10, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                    {t.description}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: tagStyle.tc, color: tagStyle.tt }}>{tag}</span>
                  ))}

                  <span style={{ marginLeft: "auto" }} />

                  {t.description && (
                    <button onClick={() => setExpandId(expandId === t.id ? null : t.id)}
                      style={{ padding: "5px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, background: "#f0f4ec", color: "#374151", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                      {expandId === t.id ? "Hide details" : "View details"}
                    </button>
                  )}

                  {!isApplied
                    ? <button
                        onClick={() => applyToTender(t)}
                        disabled={isApplying}
                        style={{ padding: "6px 16px", borderRadius: 10, border: "none", background: isApplying ? "#9ca3af" : "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: isApplying ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        {isApplying ? "⏳ Applying…" : "Apply Now →"}
                      </button>
                    : <button style={{ padding: "6px 16px", borderRadius: 10, border: "none", background: "#f0f4ec", color: "#9ca3af", fontSize: 11, fontWeight: 700, cursor: "not-allowed", fontFamily: "'DM Sans',sans-serif" }}>
                        Applied ✓
                      </button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
