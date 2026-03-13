"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEMO_INDUSTRY_ID = "00000000-0000-0000-0000-000000000002";

function AddTenderModal({ onClose, onSave }: { onClose: () => void; onSave: (t: any) => void }) {
  const [form, setForm] = useState({ crop: "🥔 Potatoes", quantity: "", budget: "", deadline: "", desc: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.quantity || !form.budget || !form.deadline) return;
    setSaving(true); setError("");
    const cropName = form.crop.split(" ").slice(1).join(" ");
    const { data, error: err } = await supabase
      .from("tenders")
      .insert({
        industry_id: DEMO_INDUSTRY_ID,
        crop: cropName,
        quantity: parseFloat(form.quantity),
        budget_per_kg: parseFloat(form.budget),
        deadline: form.deadline,
        description: form.desc,
        status: "open",
      })
      .select()
      .single();
    setSaving(false);
    if (err) { 
      setError("Failed to post tender. Try again."); 
      console.log("SUPABASE ERROR:", JSON.stringify(err)); 
      return; 
    }
    onSave(data);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f0f4ec", cursor: "pointer", fontSize: 16 }}>✕</button>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#1a2e1a", marginBottom: 4 }}>Post New Tender</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 22 }}>Farmers matching your requirements will be notified instantly.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Produce Required</label>
            <select value={form.crop} onChange={e => set("crop", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }}>
              {["🥔 Potatoes","🌽 Sweet Corn","🧅 Onions","🌶️ Red Chilli","🌾 Wheat","🍅 Tomatoes","🥕 Carrots","🥦 Broccoli"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Quantity Required (kg)</label>
            <input value={form.quantity} onChange={e => set("quantity", e.target.value)} placeholder="e.g. 50000"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Budget (₹ per kg)</label>
            <input value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="e.g. 24"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Requirements <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
        <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={3} placeholder="Grade, certification, delivery terms…"
          style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa", resize: "none", marginBottom: 20 }} />
        {error && <div style={{ marginBottom: 12, padding: "10px 14px", background: "#fee2e2", borderRadius: 10, fontSize: 12, color: "#991b1b", fontWeight: 600 }}>❌ {error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "12px 20px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={handleSave} disabled={!form.quantity || !form.budget || !form.deadline || saving}
            style={{ flex: 1, padding: 13, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#1e2a4a,#2d3d6b)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", opacity: form.quantity && form.budget && form.deadline && !saving ? 1 : 0.5 }}>
            {saving ? "⏳ Posting…" : "📋 Post Tender"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IndustryTendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchTenders = async () => {
      const { data, error } = await supabase
        .from("tenders")
        .select("*")
        .eq("industry_id", DEMO_INDUSTRY_ID)
        .order("created_at", { ascending: false });
      console.log("FETCH RESULT:", JSON.stringify({ data, error }));
      setTenders(data || []);
      setLoading(false);
    };
    fetchTenders();
  }, []);

  return (
    <>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>My Tenders 📋</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>Post procurement requirements · Farmers will bid instantly</p>
        </div>
        <button onClick={() => setModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#1e2a4a,#2d3d6b)", color: "#fff", padding: "9px 18px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          + Post New Tender
        </button>
      </div>
      <div style={{ padding: "28px 32px" }} className="fade-up">
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(30,70,20,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "#1a2e1a" }}>All Tenders ({tenders.length})</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{tenders.filter(t => t.status === "open").length} open · {tenders.filter(t => t.status === "closed").length} closed</span>
          </div>
          {loading && <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>⏳ Loading tenders…</div>}
          {!loading && tenders.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No tenders posted yet</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Click "Post New Tender" to start receiving bids from farmers</div>
            </div>
          )}
          {tenders.map(t => (
            <div key={t.id} style={{ border: "1px solid rgba(30,70,20,0.08)", borderRadius: 16, padding: 18, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#1a2e1a", marginBottom: 4 }}>{t.crop} — {t.quantity} kg</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>💰 ₹{t.budget_per_kg}/kg · ⏰ {new Date(t.deadline).toLocaleDateString("en-IN")}</div>
            </div>
          ))}
        </div>
      </div>
      {modal && <AddTenderModal onClose={() => setModal(false)} onSave={t => setTenders(p => [t, ...p])} />}
    </>
  );
}