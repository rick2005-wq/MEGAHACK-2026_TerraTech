"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const S = {
  topbar: { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,70,20,0.07)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 } as React.CSSProperties,
  page: { padding: "28px 32px" } as React.CSSProperties,
  card: { background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(30,70,20,0.07)", marginBottom: 16 } as React.CSSProperties,
};

// Hardcoded farmer ID for hackathon demo — replace with real auth later
const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";

type GeoData = { lat: string; lng: string; district: string; state: string; acc: number };
type PhotoItem = { url?: string; emoji: string; geo: GeoData; verifying?: boolean };

function mockGPS(): Promise<GeoData> {
  return new Promise(res => setTimeout(() => res({
    lat: (20.0 + Math.random() * 0.15).toFixed(5),
    lng: (73.8 + Math.random() * 0.15).toFixed(5),
    district: "Nashik", state: "Maharashtra",
    acc: Math.floor(Math.random() * 6 + 3),
  }), 1800));
}

function GeoUploader({ photos, setPhotos }: { photos: PhotoItem[]; setPhotos: (fn: (p: PhotoItem[]) => PhotoItem[]) => void }) {
  const [gpsState, setGpsState] = useState<"idle"|"acquiring"|"locked">("idle");
  const [gps, setGps] = useState<GeoData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojis = ["🥔","🌽","🧅","🌶️","🌾","🍅","🥕","🥦"];

  const getGPS = async () => {
    setGpsState("acquiring");
    const g = await mockGPS();
    setGps(g); setGpsState("locked"); return g;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const g = gps ?? await getGPS();
    const newPhotos: PhotoItem[] = Array.from(files).map((file, i) => ({
      url: URL.createObjectURL(file),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      geo: { ...g, lat: (parseFloat(g.lat) + i * 0.0001).toFixed(5), lng: (parseFloat(g.lng) + i * 0.0001).toFixed(5) },
      verifying: true,
    }));
    setPhotos(p => [...p, ...newPhotos]);
    setTimeout(() => setPhotos(p => p.map(ph => ({ ...ph, verifying: false }))), 1600);
  };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>
        📸 Farm & Produce Photos <span style={{ color: "#9ca3af", fontWeight: 400 }}>(GPS auto-stamped)</span>
      </label>

      {gpsState === "acquiring" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#92400e", fontWeight: 500 }}>📡 Acquiring GPS location… please wait</span>
        </div>
      )}
      {gpsState === "locked" && gps && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ fontSize: 12, color: "#166534", fontWeight: 600, lineHeight: 1.6 }}>
            <strong>GPS Locked!</strong> Stamping with:<br />
            📍 {gps.lat}°N, {gps.lng}°E · {gps.district}, {gps.state} · ±{gps.acc}m accuracy
          </span>
        </div>
      )}
      {gpsState === "idle" && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>📍</span>
          <span style={{ fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
            <strong>GeoTag Protection</strong> — Your GPS coordinates will be automatically stamped on every photo you upload. This proves your farm is real, prevents fraud, and gives buyers <strong>2.4× more confidence</strong>.
          </span>
        </div>
      )}

      {photos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          {photos.map((ph, i) => (
            <div key={i} style={{ width: 96, height: 96, borderRadius: 14, overflow: "hidden", position: "relative", border: "2px solid #e5e7eb", flexShrink: 0 }}>
              {ph.url
                ? <img src={ph.url} alt="farm" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, background: "#f6f9f0" }}>{ph.emoji}</div>
              }
              {ph.verifying
                ? <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, border: "2px solid #a3c45c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ fontSize: 8, color: "#2d6b30", fontWeight: 700 }}>Stamping GPS…</span>
                  </div>
                : <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(30,70,20,0.88))", padding: "14px 5px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#a3c45c", fontWeight: 800 }}>📍 GEOTAGGED</div>
                    <div style={{ fontSize: 7, color: "#fff", fontWeight: 700 }}>{ph.geo.lat}°N</div>
                  </div>
              }
              <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => { fileRef.current?.click(); if (gpsState === "idle") getGPS(); }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        style={{ border: "2.5px dashed #c5d9b8", borderRadius: 16, padding: 24, textAlign: "center", cursor: "pointer", background: "#f9fdf5", transition: "all 0.2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2d6b30"; (e.currentTarget as HTMLElement).style.background = "#f0f7f0"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c5d9b8"; (e.currentTarget as HTMLElement).style.background = "#f9fdf5"; }}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
        <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2e1a", marginBottom: 4 }}>
          {photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""} added — click to add more` : "Click or drag & drop farm photos"}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>JPG, PNG, HEIC up to 20MB · GPS auto-stamped on every photo</div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: (l: any) => void }) {
  const [form, setForm] = useState({ type: "🥔 Potatoes", qty: "", price: "", date: "", desc: "" });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.qty || !form.price) return;
    setSaving(true);
    setError("");

    const cropName = form.type.split(" ").slice(1).join(" ");
    const emoji = form.type.split(" ")[0];
    const qty = parseFloat(form.qty);
    const price = parseFloat(form.price);

    // ── Save to Supabase ──
    const { data, error: err } = await supabase
      .from("listings")
      .insert({
        farmer_id: DEMO_FARMER_ID,
        crop: cropName,
        quantity: qty,
        price_per_kg: price,
        grade: "A",
        state: "Maharashtra",
        description: form.desc,
        status: "pending",
      })
      .select()
      .single();

    setSaving(false);

    if (err) {
      setError("Failed to save listing. Please try again.");
      console.error(err);
      return;
    }

    // ── Add to UI ──
    onSave({
      id: data.id,
      emoji,
      name: cropName,
      qty: form.qty,
      price: `₹${form.price}/kg`,
      loc: "Nashik, MH",
      bids: 0,
      status: "pending",
      tags: photos.length ? ["⏳ Pending Review", "📍 GeoTagged"] : ["⏳ Pending Review"],
      images: photos,
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: 620, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", position: "relative", animation: "fadeUp 0.25s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f0f4ec", cursor: "pointer", fontSize: 16 }}>✕</button>

        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#1a2e1a", marginBottom: 4 }}>Add New Produce Listing</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 22 }}>Your listing goes live to 2,000+ verified buyers after review.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Produce Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }}>
              {["🥔 Potatoes","🌽 Sweet Corn","🧅 Onions","🌶️ Red Chilli","🌾 Wheat","🍅 Tomatoes","🥕 Carrots","🥦 Broccoli"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Quantity Available</label>
            <input value={form.qty} onChange={e => set("qty", e.target.value)} placeholder="e.g. 500"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Asking Price (per kg) ₹</label>
            <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 22"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Harvest Date</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa" }} />
          </div>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>Description <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
        <textarea value={form.desc} onChange={e => set("desc", e.target.value)} rows={2} placeholder="Grade A, no pesticides, certified organic…"
          style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "#fafafa", resize: "none", marginBottom: 20 }} />

        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        <GeoUploader photos={photos} setPhotos={setPhotos} />

        {error && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#fee2e2", borderRadius: 10, fontSize: 12, color: "#991b1b", fontWeight: 600 }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "12px 20px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={!form.qty || !form.price || saving}
            style={{ flex: 1, padding: 13, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", opacity: form.qty && form.price && !saving ? 1 : 0.5 }}>
            {saving ? "⏳ Saving to database…" : "🌾 List Produce Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load listings from Supabase on mount ──
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("farmer_id", DEMO_FARMER_ID)
        .order("created_at", { ascending: false });

      if (error) { console.error(error); setLoading(false); return; }

      // Map DB rows → UI shape
      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        emoji: "🌾",
        name: row.crop,
        qty: `${row.quantity} kg`,
        price: `₹${row.price_per_kg}/kg`,
        loc: `${row.state}`,
        bids: 0,
        status: row.status,
        tags: row.status === "active" ? ["✅ Verified"] : ["⏳ Pending Review"],
        images: [],
        description: row.description,
      }));

      setListings(mapped);
      setLoading(false);
    };

    fetchListings();
  }, []);

  // ── Delete listing from Supabase ──
  const deleteListing = async (id: any) => {
    await supabase.from("listings").delete().eq("id", id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <>
      {/* Topbar */}
      <div style={S.topbar}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: "#1a2e1a" }}>My Produce Listings 📦</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>Add, manage and geotag your farm produce</p>
        </div>
        <button onClick={() => setModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#1e4620,#2d6b30)", color: "#fff", padding: "9px 18px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          + Add New Listing
        </button>
      </div>

      <div style={S.page} className="fade-up">
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: "#1a2e1a" }}>All Listings ({listings.length})</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{listings.filter(l => l.status === "active").length} active · {listings.filter(l => l.status === "pending").length} pending review</span>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 14 }}>
              ⏳ Loading your listings…
            </div>
          )}

          {/* Empty state */}
          {!loading && listings.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>No listings yet</div>
              <div style={{ fontSize: 12 }}>Click "Add New Listing" to list your first produce</div>
            </div>
          )}

          {/* Listings */}
          {listings.map(listing => (
            <div key={listing.id} style={{ border: "1px solid rgba(30,70,20,0.08)", borderRadius: 18, padding: 16, marginBottom: 12, transition: "all 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(30,70,20,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,70,20,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>

              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f6f9f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{listing.emoji}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#1a2e1a", marginBottom: 3 }}>{listing.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>📍 {listing.loc} · {listing.bids} active bids</div>
                  {listing.description && <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{listing.description}</div>}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {listing.tags.map((t: string) => (
                      <span key={t} style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 100, background: t.includes("GeoTagged") ? "#eff6ff" : t.includes("Verified") ? "#f0f7f0" : "#fef3c7", color: t.includes("GeoTagged") ? "#1d4ed8" : t.includes("Verified") ? "#2d6b30" : "#92400e" }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#2d6b30" }}>{listing.price}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{listing.qty}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: listing.status === "active" ? "#22c55e" : "#f59e0b" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: listing.status === "active" ? "#16a34a" : "#d97706" }}>
                    {listing.status === "active" ? "Active" : "Pending Review"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "5px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, background: "#f0f7f0", color: "#2d6b30", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✏️ Edit</button>
                  <button onClick={() => deleteListing(listing.id)}
                    style={{ padding: "5px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>🗑️ Remove</button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new CTA */}
          {!loading && (
            <div onClick={() => setModal(true)} style={{ border: "2px dashed #c5d9b8", borderRadius: 18, padding: 28, textAlign: "center", cursor: "pointer", background: "#f9fdf5", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2d6b30"; (e.currentTarget as HTMLElement).style.background = "#f0f7f0"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c5d9b8"; (e.currentTarget as HTMLElement).style.background = "#f9fdf5"; }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Add New Produce Listing</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Upload photos with auto GPS stamp · Live to 2,000+ verified buyers</div>
            </div>
          )}
        </div>
      </div>

      {modal && <AddModal onClose={() => setModal(false)} onSave={l => setListings(p => [l, ...p])} />}
    </>
  );
}
