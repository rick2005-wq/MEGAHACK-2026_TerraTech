"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name:"Ramesh Patil", phone:"+91 98765 43210", village:"Nashik, Maharashtra", email:"ramesh.patil@gmail.com" });
  const [toggles, setToggles] = useState({ geo:true, bids:true, hindi:false, twofa:true, whatsapp:true, sms:false });
  const set = (k:string, v:string) => setForm(p => ({...p,[k]:v}));
  const tog = (k:string) => setToggles(p => ({...p,[k]:!p[k as keyof typeof p]}));

  function Toggle({ k }: { k:string }) {
    const on = toggles[k as keyof typeof toggles];
    return (
      <div onClick={() => tog(k)} style={{ width:44, height:24, borderRadius:100, background:on?"#2d6b30":"#e5e7eb", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?23:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    );
  }

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>Settings ⚙️</h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>Manage your profile and preferences</p>
        </div>
        {saved && <span style={{ fontSize:12, fontWeight:600, color:"#16a34a", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"6px 14px" }}>✅ Changes saved!</span>}
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Profile */}
          <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:18 }}>Profile Information</div>

            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, padding:16, background:"#f6f9f0", borderRadius:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#3a7d35,#a3c45c)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👨‍🌾</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1a2e1a" }}>Ramesh Patil</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Farmer · Nashik, Maharashtra</div>
                <div style={{ display:"inline-flex", background:"rgba(163,196,92,0.15)", border:"1px solid rgba(163,196,92,0.3)", borderRadius:100, padding:"2px 8px", fontSize:10, color:"#2d6b30", fontWeight:700, marginTop:4 }}>✅ Govt. Verified via Aadhaar</div>
              </div>
            </div>

            {[
              { label:"Full Name",     key:"name",    placeholder:"Your full name" },
              { label:"Phone",         key:"phone",   placeholder:"+91 XXXXX XXXXX" },
              { label:"Email",         key:"email",   placeholder:"email@example.com" },
              { label:"Village / District", key:"village", placeholder:"Village, District, State" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>{label}</label>
                <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#fafafa" }} />
              </div>
            ))}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>Aadhaar Number (Verified ✅)</label>
              <input disabled value="XXXX XXXX 4821" style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f5f5f5", color:"#9ca3af" }} />
            </div>
          </div>

          <div>
            {/* Preferences */}
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)", marginBottom:16 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:18 }}>Preferences</div>
              {[
                { key:"geo",       label:"GeoTag All Photos",      sub:"Auto-stamp GPS on every farm photo (recommended)" },
                { key:"bids",      label:"Bid Notifications",       sub:"Get instant alerts for new bids on your listings" },
                { key:"whatsapp",  label:"WhatsApp Alerts",         sub:"Receive bids and messages on WhatsApp" },
                { key:"sms",       label:"SMS Fallback",            sub:"Get SMS alerts when internet is unavailable" },
                { key:"hindi",     label:"Hindi Interface",         sub:"Switch the entire app to Hindi language" },
                { key:"twofa",     label:"Two-Factor Auth (2FA)",   sub:"Extra security: OTP login required each session" },
              ].map(({ key, label, sub }) => (
                <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:12, background:"#f6f9f0", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1a2e1a" }}>{label}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{sub}</div>
                  </div>
                  <Toggle k={key} />
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid #fee2e2" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#991b1b", marginBottom:14 }}>Danger Zone</div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ flex:1, padding:"10px", borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                  🔒 Deactivate Account
                </button>
                <button style={{ flex:1, padding:"10px", borderRadius:12, border:"none", background:"#fee2e2", color:"#991b1b", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            style={{ padding:"13px 32px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 16px rgba(30,70,20,0.3)" }}>
            Save All Changes ✓
          </button>
        </div>
      </div>
    </>
  );
}
