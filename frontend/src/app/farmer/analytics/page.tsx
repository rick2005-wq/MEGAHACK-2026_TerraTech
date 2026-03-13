"use client";
import { useState } from "react";

const MONTHLY = [
  { month:"Aug", earn:8200,  qty:380  },
  { month:"Sep", earn:11500, qty:520  },
  { month:"Oct", earn:9800,  qty:440  },
  { month:"Nov", earn:18400, qty:780  },
  { month:"Dec", earn:15200, qty:640  },
  { month:"Jan", earn:21600, qty:900  },
];

const BUYERS = [
  { name:"FreshSnacks Pvt Ltd",  amount:"₹48,000", pct:58 },
  { name:"AgroFoods Industries", amount:"₹32,000", pct:39 },
  { name:"NatureFresh Exports",  amount:"₹18,600", pct:22 },
  { name:"LocalMart Chain",      amount:"₹9,200",  pct:11 },
];

const PRODUCE_PERF = [
  { emoji:"🥔", name:"Potatoes",   sold:"1.2 ton", avg:"₹23.4/kg", revenue:"₹28,080", trend:"+12%" },
  { emoji:"🌶️", name:"Red Chilli", sold:"400 kg",  avg:"₹87/kg",   revenue:"₹34,800", trend:"+18%" },
  { emoji:"🧅", name:"Onions",     sold:"800 kg",  avg:"₹14.2/kg", revenue:"₹11,360", trend:"-3%"  },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState<"earnings"|"quantity">("earnings");
  const maxEarn = Math.max(...MONTHLY.map(m => m.earn));
  const maxQty  = Math.max(...MONTHLY.map(m => m.qty));

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", position:"sticky", top:0, zIndex:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>Analytics 📊</h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>Your earnings, sales and performance insights</p>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        {/* KPI cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
          {[
            { icon:"💰", label:"Total Revenue",   value:"₹1,24,600", sub:"This financial year",  up:true  },
            { icon:"📦", label:"Total Sold",       value:"3.2 ton",   sub:"Across 8 transactions",up:true  },
            { icon:"📈", label:"Avg. Price",       value:"₹24.6/kg",  sub:"+12% above market",    up:true  },
            { icon:"⭐", label:"Buyer Rating",     value:"4.9 / 5",   sub:"Top 5% sellers",        up:true  },
          ].map(({ icon, label, value, sub }) => (
            <div key={label} style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#1a2e1a" }}>{value}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:3, fontWeight:500 }}>{label}</div>
              <div style={{ fontSize:11, color:"#2d6b30", marginTop:3, fontWeight:600 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a" }}>Monthly Performance</span>
            <div style={{ display:"flex", gap:8 }}>
              {(["earnings","quantity"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding:"6px 14px", borderRadius:10, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", background:tab===t?"#1e4620":"#f0f4ec", color:tab===t?"#fff":"#374151" }}>
                  {t === "earnings" ? "₹ Earnings" : "🌾 Quantity"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:120 }}>
            {MONTHLY.map(({ month, earn, qty }) => {
              const val = tab === "earnings" ? earn : qty;
              const max = tab === "earnings" ? maxEarn : maxQty;
              const h = Math.round((val / max) * 100);
              return (
                <div key={month} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#2d6b30" }}>
                    {tab==="earnings" ? `₹${(earn/1000).toFixed(1)}k` : `${qty}kg`}
                  </div>
                  <div style={{ width:"100%", height:`${h}%`, borderRadius:"8px 8px 0 0", background:"linear-gradient(180deg,#a3c45c,#1e4620)", minHeight:4, transition:"height 0.4s ease", cursor:"pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = "none"} />
                  <div style={{ fontSize:10, color:"#9ca3af" }}>{month}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Top buyers */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>Top Buyers</div>
            {BUYERS.map(({ name, amount, pct }) => (
              <div key={name} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                  <span style={{ fontWeight:600, color:"#1a2e1a" }}>{name}</span>
                  <span style={{ fontWeight:700, color:"#2d6b30" }}>{amount}</span>
                </div>
                <div style={{ height:6, background:"#f0f4ec", borderRadius:100, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#a3c45c,#1e4620)", borderRadius:100 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Produce performance */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>Produce Performance</div>
            {PRODUCE_PERF.map(({ emoji, name, sold, avg, revenue, trend }) => (
              <div key={name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", borderRadius:14, marginBottom:8, background:"#f6f9f0" }}>
                <span style={{ fontSize:28 }}>{emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a2e1a" }}>{name}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{sold} sold · Avg {avg}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#2d6b30" }}>{revenue}</div>
                  <div style={{ fontSize:11, fontWeight:600, color: trend.startsWith("+") ? "#16a34a" : "#e53e3e" }}>{trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
