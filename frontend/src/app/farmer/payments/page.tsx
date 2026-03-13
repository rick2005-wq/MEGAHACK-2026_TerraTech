"use client";
import { useState } from "react";

const TXN = [
  { id:1, icon:"💰", name:"FreshSnacks Pvt Ltd",  meta:"Potato payment · 500 kg",    amount:"+₹12,000", credit:true,  date:"28 Feb 2026", status:"Completed" },
  { id:2, icon:"💰", name:"AgroFoods Industries", meta:"Corn payment · 1 ton",        amount:"+₹20,000", credit:true,  date:"24 Feb 2026", status:"Completed" },
  { id:3, icon:"📋", name:"Platform Fee",          meta:"February subscription",       amount:"-₹499",    credit:false, date:"01 Feb 2026", status:"Completed" },
  { id:4, icon:"💰", name:"NatureFresh Exports",  meta:"Chilli advance · 200 kg",    amount:"+₹17,600", credit:true,  date:"18 Feb 2026", status:"Completed" },
  { id:5, icon:"🔄", name:"FreshSnacks Pvt Ltd",  meta:"Potato order deposit",        amount:"+₹6,000",  credit:true,  date:"10 Feb 2026", status:"Pending" },
  { id:6, icon:"📋", name:"Platform Fee",          meta:"January subscription",        amount:"-₹499",    credit:false, date:"01 Jan 2026", status:"Completed" },
];

export default function PaymentsPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [withdrawn, setWithdrawn] = useState(false);

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", position:"sticky", top:0, zIndex:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>Payments 💰</h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>Transaction history and bank account</p>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Transactions */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>Transaction History</div>
            {TXN.map(({ id, icon, name, meta, amount, credit, date, status }) => (
              <div key={id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, marginBottom:8, background:"#f6f9f0" }}>
                <div style={{ width:40, height:40, borderRadius:12, display:"flex", alignItems:"center", justifyContent:  "center", fontSize:18, flexShrink:0, background: credit ? "#f0f7f0" : "#fff0f0" }}>{icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a2e1a" }}>{name}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{meta} · {date}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color: credit ? "#2d6b30" : "#e53e3e" }}>{amount}</div>
                  <div style={{ fontSize:9, fontWeight:600, color: status === "Completed" ? "#16a34a" : "#f59e0b", marginTop:2 }}>{status}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {/* Bank card */}
            <div style={{ background:"linear-gradient(135deg,#1e4620,#3a7d35)", borderRadius:20, padding:24, marginBottom:16, color:"#fff", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-30, right:-30, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
              <div style={{ fontSize:11, opacity:0.6, marginBottom:4, letterSpacing:1, textTransform:"uppercase" }}>Linked Account</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:2 }}>SBI Savings Account</div>
              <div style={{ fontSize:14, opacity:0.7, marginBottom:20 }}>xxxx xxxx 4821 · NASHIK BRANCH</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                <div>
                  <div style={{ fontSize:11, opacity:0.6, marginBottom:4 }}>Available Balance</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700 }}>₹48,340</div>
                </div>
                <span style={{ fontSize:40 }}>🏦</span>
              </div>
            </div>

            {/* Withdraw */}
            {!showWithdraw && !withdrawn && (
              <button onClick={() => setShowWithdraw(true)} style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 16px rgba(30,70,20,0.3)" }}>
                Withdraw Earnings →
              </button>
            )}

            {showWithdraw && !withdrawn && (
              <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid rgba(30,70,20,0.1)" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#1a2e1a", marginBottom:12 }}>Withdraw to SBI xxxx4821</div>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount e.g. 10000"
                  style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12 }} />
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setShowWithdraw(false)} style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={() => { setShowWithdraw(false); setWithdrawn(true); }} style={{ flex:2, padding:11, borderRadius:12, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Confirm Withdrawal</button>
                </div>
              </div>
            )}

            {withdrawn && (
              <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:14, padding:18, textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#166534", marginBottom:4 }}>Withdrawal Initiated!</div>
                <div style={{ fontSize:12, color:"#16a34a" }}>₹{amount || "10,000"} will credit to SBI xxxx4821 in 2-3 business days.</div>
              </div>
            )}

            {/* Summary */}
            <div style={{ background:"#fff", borderRadius:16, padding:18, border:"1px solid rgba(30,70,20,0.07)", marginTop:16 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"#1a2e1a", marginBottom:14 }}>February Summary</div>
              {[
                { label:"Total Received",  val:"₹55,600", color:"#2d6b30" },
                { label:"Platform Fees",   val:"-₹499",   color:"#e53e3e" },
                { label:"Net Earnings",    val:"₹55,101", color:"#1a2e1a" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <span style={{ fontSize:13, color:"#6b7280" }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
