import { useState, useEffect, useRef } from "react";

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#080e14;}
input,textarea,select,button{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:rgba(255,255,255,.03);}
::-webkit-scrollbar-thumb{background:rgba(163,196,92,.25);border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ping{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.2);opacity:0}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .28s ease both;}
.fi{animation:fadeIn .2s ease both;}
.pi{animation:popIn .2s cubic-bezier(.34,1.4,.64,1) both;}
.pulse{animation:pulse 1.6s ease infinite;}
.si{animation:slideIn .3s cubic-bezier(.22,1,.36,1) both;}
.cu{animation:countUp .5s ease both;}
`;

/* ─── TOKENS ─── */
const bg0="#080e14", bg1="#0d1520", bg2="#111e2d", bg3="#162338";
const gd="#1e4620", gm="#2d6b30", ac="#a3c45c", navy="#1e2a4a";
const amber="#f0c040", red="#ef4444", teal="#22d3ee", purple="#a78bfa";
const textPrimary="#e8f0e8", textSecondary="rgba(232,240,232,.5)", textMuted="rgba(232,240,232,.25)";

const PF = s => ({ fontFamily:"'Playfair Display',serif", ...s });
const MONO = s => ({ fontFamily:"'JetBrains Mono',monospace", ...s });

/* ─── SHARED STYLES ─── */
const card = (extra={}) => ({
  background: bg2,
  borderRadius: 16,
  border: "1px solid rgba(163,196,92,.08)",
  padding: "20px 22px",
  ...extra
});

const badge = (color, extra={}) => ({
  display:"inline-flex", alignItems:"center", gap:5,
  padding:"3px 10px", borderRadius:100,
  fontSize:10, fontWeight:700, letterSpacing:.3,
  background:`${color}18`, color, border:`1px solid ${color}30`,
  ...extra
});

const btn = (color=ac, extra={}) => ({
  padding:"8px 18px", borderRadius:10, border:"none",
  background:`linear-gradient(135deg,${color},${color}cc)`,
  color: color===amber?"#1a1400":"#fff",
  fontWeight:700, fontSize:12, cursor:"pointer",
  transition:"all .15s",
  ...extra
});

const ghostBtn = (extra={}) => ({
  padding:"7px 14px", borderRadius:10,
  border:"1px solid rgba(163,196,92,.2)",
  background:"transparent", color:textSecondary,
  fontWeight:600, fontSize:12, cursor:"pointer",
  transition:"all .15s",
  ...extra
});

/* ─── MOCK DATA ─── */
const PLATFORM_STATS = {
  totalUsers:14892, newToday:47,
  totalFarmers:11340, totalIndustry:3552,
  activeListings:2841, pendingKYC:128,
  totalGMV:84200000, gmvGrowth:"+18.4%",
  activeTenders:341, disputesOpen:23,
  fraudFlags:7, systemHealth:99.2,
};

const ACTIVITY_FEED = [
  {id:1,type:"kyc",icon:"🛡️",text:"Ramesh Patil submitted Aadhaar eKYC for verification",time:"2m ago",color:teal},
  {id:2,type:"trade",icon:"🌾",text:"PepsiCo India placed ₹4.2L order for 500kg potatoes",time:"5m ago",color:ac},
  {id:3,type:"fraud",icon:"🚨",text:"Suspicious listing flagged: 'Grade A Wheat' at ₹8/kg",time:"8m ago",color:red},
  {id:4,type:"kyc",icon:"🏭",text:"Britannia Industries GST verification approved",time:"12m ago",color:ac},
  {id:5,type:"dispute",icon:"⚖️",text:"Dispute #D-0091 opened: BigBasket vs Sunita Devi",time:"18m ago",color:amber},
  {id:6,type:"trade",icon:"💰",text:"₹1.8L payment released for wheat contract #C-0342",time:"24m ago",color:teal},
  {id:7,type:"user",icon:"👤",text:"New farmer registration: Vikram Singh, Punjab",time:"31m ago",color:purple},
  {id:8,type:"fraud",icon:"🚨",text:"Multiple failed login attempts on account #U-8821",time:"45m ago",color:red},
];

const KYC_QUEUE = [
  {id:"KYC-1201",name:"Arjun Sharma",type:"farmer",state:"Maharashtra",crop:"Wheat",doc:"Aadhaar + Land Record",submitted:"2h ago",risk:"low",avatar:"👨‍🌾"},
  {id:"KYC-1202",name:"Meera Foods Pvt Ltd",type:"industry",state:"Gujarat",gst:"27AABCM1234F1ZX",doc:"GST + CIN",submitted:"3h ago",risk:"medium",avatar:"🏭"},
  {id:"KYC-1203",name:"Sunita Bai",type:"farmer",state:"Punjab",crop:"Rice",doc:"Aadhaar + PM Kisan",submitted:"4h ago",risk:"low",avatar:"👩‍🌾"},
  {id:"KYC-1204",name:"AgriTrade Solutions",type:"industry",state:"Delhi",gst:"07AAECA1234H1ZP",doc:"GST + FSSAI",submitted:"5h ago",risk:"high",avatar:"🏢"},
  {id:"KYC-1205",name:"Priya Devi",type:"farmer",state:"UP",crop:"Sugarcane",doc:"Aadhaar only",submitted:"6h ago",risk:"medium",avatar:"👩‍🌾"},
  {id:"KYC-1206",name:"NaturePure Exports",type:"industry",state:"Mumbai",gst:"27AADCN5678B1ZM",doc:"GST + Import License",submitted:"7h ago",risk:"low",avatar:"🌿"},
];

const ALL_USERS = [
  {id:"U-1001",name:"Ramesh Patil",type:"farmer",state:"Maharashtra",crop:"Potato",joined:"Jan 2024",trades:12,gmv:"₹2.4L",status:"active",verified:true,avatar:"👨‍🌾"},
  {id:"U-1002",name:"PepsiCo India",type:"industry",state:"Delhi",category:"FMCG",joined:"Dec 2023",trades:34,gmv:"₹48L",status:"active",verified:true,avatar:"🏭"},
  {id:"U-1003",name:"Sunita Devi",type:"farmer",state:"Punjab",crop:"Wheat",joined:"Feb 2024",trades:5,gmv:"₹90K",status:"active",verified:true,avatar:"👩‍🌾"},
  {id:"U-1004",name:"FakeGrain Corp",type:"industry",state:"Unknown",category:"Unknown",joined:"Mar 2024",trades:0,gmv:"₹0",status:"suspended",verified:false,avatar:"❓"},
  {id:"U-1005",name:"Kavitha Rao",type:"farmer",state:"AP",crop:"Chilli",joined:"Jan 2024",trades:8,gmv:"₹1.2L",status:"active",verified:true,avatar:"👩‍🌾"},
  {id:"U-1006",name:"BigBasket",type:"industry",state:"Bangalore",category:"Retail",joined:"Nov 2023",trades:67,gmv:"₹1.2Cr",status:"active",verified:true,avatar:"🛒"},
  {id:"U-1007",name:"Vikram Singh",type:"farmer",state:"Punjab",crop:"Rice",joined:"Mar 2024",trades:2,gmv:"₹35K",status:"pending",verified:false,avatar:"👨‍🌾"},
  {id:"U-1008",name:"QuickAgri Ltd",type:"industry",state:"Mumbai",category:"Trading",joined:"Mar 2024",trades:1,gmv:"₹2K",status:"flagged",verified:false,avatar:"⚠️"},
];

const FRAUD_FLAGS = [
  {id:"FR-0041",type:"price_anomaly",severity:"high",title:"Wheat listed at ₹2/kg",desc:"Market rate ₹26/kg. 92% below average. Possible scam listing.",user:"QuickAgri Ltd",userId:"U-1008",time:"1h ago",status:"open"},
  {id:"FR-0042",type:"identity",severity:"high",title:"Duplicate Aadhaar detected",desc:"Same Aadhaar number used across 3 accounts: U-2341, U-2798, U-3011",user:"Multiple accounts",userId:null,time:"2h ago",status:"open"},
  {id:"FR-0043",type:"behavior",severity:"medium",title:"Unusual bid pattern",desc:"Account placing bids and immediately cancelling across 14 tenders. Market manipulation suspected.",user:"AgroTrade Solutions",userId:"U-0892",time:"3h ago",status:"investigating"},
  {id:"FR-0044",type:"document",severity:"medium",title:"Forged FSSAI certificate",desc:"Certificate number FSSAI-2024-12984 does not match govt database.",user:"FastFood Processors",userId:"U-1122",time:"5h ago",status:"open"},
  {id:"FR-0045",type:"behavior",severity:"low",title:"Multiple failed login attempts",desc:"47 failed attempts from IP 103.21.xx.xx in 2 hours on account U-8821.",user:"Raju Farms",userId:"U-8821",time:"45m ago",status:"monitoring"},
];

const DISPUTES = [
  {id:"D-0091",status:"open",priority:"high",farmer:"Sunita Devi",industry:"BigBasket",amount:"₹84,000",issue:"Quality mismatch — buyer claims Grade B delivered vs Grade A ordered",opened:"2 days ago",messages:8},
  {id:"D-0090",status:"mediation",priority:"high",farmer:"Arjun Mehta",industry:"Reliance Fresh",amount:"₹1,20,000",issue:"Delivery delayed by 6 days. Buyer demanding penalty.",opened:"4 days ago",messages:14},
  {id:"D-0089",status:"open",priority:"medium",farmer:"Kavitha Rao",industry:"NatureFresh Exports",amount:"₹55,000",issue:"Payment not received 15 days after delivery confirmation.",opened:"5 days ago",messages:5},
  {id:"D-0088",status:"resolved",priority:"low",farmer:"Ramesh Patil",industry:"PepsiCo India",amount:"₹2,400",issue:"Minor weight discrepancy of 12kg. Resolved with partial refund.",opened:"8 days ago",messages:11},
  {id:"D-0087",status:"resolved",priority:"medium",farmer:"Priya Sharma",industry:"Britannia",amount:"₹18,000",issue:"Moisture content dispute on wheat batch. Lab test confirmed farmer's claim.",opened:"12 days ago",messages:19},
];

const MONTHLY_GMV = [
  {month:"Sep",gmv:42,users:180,trades:210},
  {month:"Oct",gmv:58,users:220,trades:280},
  {month:"Nov",gmv:71,users:310,trades:350},
  {month:"Dec",gmv:65,users:290,trades:320},
  {month:"Jan",gmv:89,users:410,trades:490},
  {month:"Feb",gmv:102,users:520,trades:580},
  {month:"Mar",gmv:128,users:640,trades:720},
];

/* ─── NAV ITEMS ─── */
const NAV = [
  {id:"overview",   icon:"⚡", label:"Overview"},
  {id:"kyc",        icon:"🛡️", label:"KYC Queue",    badge:128},
  {id:"users",      icon:"👥", label:"Users"},
  {id:"fraud",      icon:"🚨", label:"Fraud",         badge:7},
  {id:"analytics",  icon:"📊", label:"Analytics"},
  {id:"disputes",   icon:"⚖️", label:"Disputes",      badge:23},
  {id:"settings",   icon:"⚙️", label:"Settings"},
];

/* ─── MINI SPARKLINE ─── */
function Sparkline({ data, color=ac, height=36 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*100;
    const y = height - ((v-min)/(max-min||1))*(height-4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points={`0,${height} ${pts} 100,${height}`} fill={`${color}18`} stroke="none"/>
    </svg>
  );
}

/* ─── DONUT CHART ─── */
function Donut({ pct, color=ac, size=64, label }) {
  const r = 24, circ = 2*Math.PI*r;
  const dash = (pct/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke={`${color}18`} strokeWidth="6"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4} strokeLinecap="round"
          style={{transition:"stroke-dasharray .8s ease"}}/>
        <text x="28" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={color} fontFamily="DM Sans">{pct}%</text>
      </svg>
      {label && <div style={{fontSize:9,color:textMuted,fontWeight:600,textAlign:"center"}}>{label}</div>}
    </div>
  );
}

/* ─── BAR CHART ─── */
function BarChart({ data, color=ac }) {
  const max = Math.max(...data.map(d=>d.gmv));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80,padding:"0 4px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:`linear-gradient(180deg,${color},${color}88)`,height:`${(d.gmv/max)*72}px`,transition:"height .6s ease",minHeight:3}}/>
          <div style={{fontSize:8,color:textMuted,fontWeight:600}}>{d.month}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI CARD ─── */
function KpiCard({ label, value, sub, color=ac, icon, spark }) {
  return (
    <div style={{...card(),display:"flex",flexDirection:"column",gap:8,position:"relative",overflow:"hidden"}} className="fu">
      <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:`radial-gradient(circle at top right,${color}14,transparent 70%)`,borderRadius:"0 16px 0 0"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{fontSize:10,fontWeight:700,color:textMuted,textTransform:"uppercase",letterSpacing:.8}}>{label}</div>
        <div style={{fontSize:18}}>{icon}</div>
      </div>
      <div style={{fontSize:26,fontWeight:800,color:textPrimary,fontFamily:"'DM Sans',sans-serif",letterSpacing:-1}}>{value}</div>
      {sub && <div style={{fontSize:11,color,fontWeight:600}}>{sub}</div>}
      {spark && <div style={{marginTop:4}}><Sparkline data={spark} color={color}/></div>}
    </div>
  );
}

/* ─── STATUS PILL ─── */
function StatusPill({ status }) {
  const map = {
    active:   [ac,    "Active"],
    pending:  [amber, "Pending"],
    suspended:[red,   "Suspended"],
    flagged:  [red,   "Flagged"],
    open:     [red,   "Open"],
    mediation:[amber, "Mediation"],
    resolved: [ac,    "Resolved"],
    investigating:[purple,"Investigating"],
    monitoring:[teal, "Monitoring"],
    low:      [ac,    "Low Risk"],
    medium:   [amber, "Medium"],
    high:     [red,   "High Risk"],
  };
  const [color, label] = map[status] || [textMuted, status];
  return <span style={badge(color)}><span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>{label}</span>;
}

/* ─── OVERVIEW PAGE ─── */
function OverviewPage() {
  const [tick, setTick] = useState(0);
  useEffect(()=>{ const t = setInterval(()=>setTick(p=>p+1),4000); return()=>clearInterval(t); },[]);
  const liveActivity = ACTIVITY_FEED[tick % ACTIVITY_FEED.length];

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:24}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>Platform Overview</h1>
          <div style={{fontSize:12,color:textMuted}}>Wednesday, 12 March 2025 · Live data refreshes every 30s</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:`${ac}15`,border:`1px solid ${ac}30`}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:ac,display:"inline-block",position:"relative"}}>
              <span style={{position:"absolute",inset:-2,borderRadius:"50%",background:ac,animation:"ping 1.4s ease infinite"}}/>
            </span>
            <span style={{fontSize:11,color:ac,fontWeight:700}}>All Systems Operational</span>
          </div>
          <button style={btn(gm,{fontSize:11})}>⬇ Export Report</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <KpiCard label="Total GMV" value="₹8.42Cr" sub={`↑ ${PLATFORM_STATS.gmvGrowth} this month`} icon="💰" color={ac} spark={[42,58,71,65,89,102,128]}/>
        <KpiCard label="Total Users" value="14,892" sub={`+${PLATFORM_STATS.newToday} today`} icon="👥" color={teal} spark={[180,220,310,290,410,520,640]}/>
        <KpiCard label="Active Tenders" value="341" sub="↑ 28 new this week" icon="📋" color={purple} spark={[210,240,280,260,310,330,341]}/>
        <KpiCard label="System Health" value="99.2%" sub="All services running" icon="⚡" color={ac} spark={[98,99,98.5,99.1,99.2,99,99.2]}/>
      </div>

      {/* Secondary KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        {[
          {label:"Pending KYC",value:"128",color:amber,icon:"🛡️"},
          {label:"Open Disputes",value:"23",color:red,icon:"⚖️"},
          {label:"Fraud Alerts",value:"7",color:red,icon:"🚨"},
          {label:"Active Listings",value:"2,841",color:teal,icon:"🌾"},
        ].map(k=>(
          <div key={k.label} style={{...card({padding:"14px 18px"}),display:"flex",alignItems:"center",gap:12}} className="fu">
            <div style={{width:40,height:40,borderRadius:10,background:`${k.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{k.icon}</div>
            <div>
              <div style={{fontSize:20,fontWeight:800,color:k.color,letterSpacing:-0.5}}>{k.value}</div>
              <div style={{fontSize:10,color:textMuted,fontWeight:600,marginTop:1}}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom 3-col layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>

        {/* GMV Chart */}
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:textSecondary,textTransform:"uppercase",letterSpacing:.8}}>Monthly GMV (₹L)</div>
            <span style={{...MONO({fontSize:10}),color:ac}}>+18.4% MoM</span>
          </div>
          <BarChart data={MONTHLY_GMV} color={ac}/>
        </div>

        {/* User Split */}
        <div style={card()}>
          <div style={{fontSize:12,fontWeight:700,color:textSecondary,textTransform:"uppercase",letterSpacing:.8,marginBottom:16}}>User Distribution</div>
          <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
            <Donut pct={76} color={ac} label="Farmers"/>
            <Donut pct={24} color={teal} label="Industry"/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[{l:"Maharashtra",v:32,c:ac},{l:"Punjab",v:24,c:teal},{l:"UP",v:18,c:purple},{l:"Others",v:26,c:textMuted}].map(r=>(
                <div key={r.l} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:7,height:7,borderRadius:2,background:r.c,flexShrink:0}}/>
                  <div style={{fontSize:10,color:textSecondary}}>{r.l}</div>
                  <div style={{...MONO({fontSize:10}),color:r.c,marginLeft:"auto",paddingLeft:8}}>{r.v}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:textSecondary,textTransform:"uppercase",letterSpacing:.8}}>Live Activity</div>
            <span style={{width:8,height:8,borderRadius:"50%",background:ac,display:"inline-block"}} className="pulse"/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ACTIVITY_FEED.slice(0,5).map((a,i)=>(
              <div key={a.id} style={{display:"flex",gap:9,padding:"8px 10px",borderRadius:10,background:i===0?`${a.color}0f`:"transparent",border:i===0?`1px solid ${a.color}20`:"1px solid transparent",transition:"all .5s"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{a.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,color:textSecondary,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{a.text}</div>
                  <div style={{fontSize:9,color:textMuted,marginTop:2}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── KYC QUEUE PAGE ─── */
function KycPage() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [statuses, setStatuses] = useState({});

  const filtered = KYC_QUEUE.filter(k => filter==="all" || k.type===filter);

  const approve = id => setStatuses(p=>({...p,[id]:"approved"}));
  const reject  = id => setStatuses(p=>({...p,[id]:"rejected"}));

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>KYC Verification Queue</h1>
          <div style={{fontSize:12,color:textMuted}}>128 pending verifications · Avg processing time: 2.4h</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {["all","farmer","industry"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"7px 16px",borderRadius:9,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",
              background:filter===f?`linear-gradient(135deg,${gd},${gm})`:"rgba(255,255,255,.04)",
              color:filter===f?"#fff":textSecondary,transition:"all .18s",
              textTransform:"capitalize"
            }}>{f==="all"?"All":f==="farmer"?"👨‍🌾 Farmers":"🏭 Industry"}</button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Total Pending",v:"128",c:amber},
          {l:"Approved Today",v:"34",c:ac},
          {l:"Rejected Today",v:"8",c:red},
          {l:"Avg Review Time",v:"2.4h",c:teal},
        ].map(s=>(
          <div key={s.l} style={{...card({padding:"14px 16px",display:"flex",gap:10,alignItems:"center"})}}>
            <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:textMuted,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={card({padding:0,overflow:"hidden"})}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 1fr 1fr 1fr 1.4fr",padding:"11px 20px",background:bg3,borderBottom:"1px solid rgba(255,255,255,.04)"}}>
          {["Application","Type","State","Documents","Submitted","Risk","Actions"].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:700,color:textMuted,textTransform:"uppercase",letterSpacing:.7}}>{h}</div>
          ))}
        </div>
        {filtered.map((k,i)=>{
          const st = statuses[k.id];
          return(
            <div key={k.id} style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 1fr 1fr 1fr 1.4fr",padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,.03)",background:selected===k.id?`${ac}06`:"transparent",cursor:"pointer",transition:"background .15s"}}
              onClick={()=>setSelected(k.id===selected?null:k.id)}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${navy},#2d3b6b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{k.avatar}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:textPrimary}}>{k.name}</div>
                  <div style={{...MONO({fontSize:9}),color:textMuted}}>{k.id}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center"}}><span style={badge(k.type==="farmer"?ac:teal,{fontSize:9})}>{k.type==="farmer"?"👨‍🌾 Farmer":"🏭 Industry"}</span></div>
              <div style={{display:"flex",alignItems:"center",fontSize:12,color:textSecondary}}>{k.state}</div>
              <div style={{display:"flex",alignItems:"center",fontSize:11,color:textSecondary}}>{k.doc}</div>
              <div style={{display:"flex",alignItems:"center",fontSize:11,color:textMuted}}>{k.submitted}</div>
              <div style={{display:"flex",alignItems:"center"}}><StatusPill status={k.risk}/></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {st ? (
                  <span style={badge(st==="approved"?ac:red,{fontSize:10})}>{st==="approved"?"✅ Approved":"❌ Rejected"}</span>
                ) : (
                  <>
                    <button onClick={e=>{e.stopPropagation();approve(k.id);}} style={btn(gm,{padding:"5px 12px",fontSize:11})}>✓ Approve</button>
                    <button onClick={e=>{e.stopPropagation();reject(k.id);}} style={btn(red,{padding:"5px 12px",fontSize:11})}>✕ Reject</button>
                    <button onClick={e=>{e.stopPropagation();}} style={ghostBtn({padding:"5px 10px",fontSize:11})}>View</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── USER MANAGEMENT PAGE ─── */
function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [statuses, setStatuses] = useState({});

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all" || u.type===filter || u.status===filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>User Management</h1>
          <div style={{fontSize:12,color:textMuted}}>14,892 total users · 11,340 farmers · 3,552 industry buyers</div>
        </div>
        <button style={btn(gm,{fontSize:11})}>⬇ Export CSV</button>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:bg2,border:"1px solid rgba(163,196,92,.1)",borderRadius:10,padding:"8px 14px",flex:1,maxWidth:320}}>
          <span style={{opacity:.4}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,color:textPrimary,flex:1}}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[{v:"all",l:"All"},{v:"farmer",l:"Farmers"},{v:"industry",l:"Industry"},{v:"flagged",l:"🚨 Flagged"},{v:"suspended",l:"🚫 Suspended"}].map(f=>(
            <button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"7px 14px",borderRadius:9,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",background:filter===f.v?`linear-gradient(135deg,${gd},${gm})`:"rgba(255,255,255,.04)",color:filter===f.v?"#fff":textSecondary,transition:"all .18s"}}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={card({padding:0,overflow:"hidden"})}>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr .9fr 1fr .8fr .8fr 1fr",padding:"11px 20px",background:bg3,borderBottom:"1px solid rgba(255,255,255,.04)"}}>
          {["User","Type","Location","Activity","Joined","GMV","Status"].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:700,color:textMuted,textTransform:"uppercase",letterSpacing:.7}}>{h}</div>
          ))}
        </div>
        {filtered.map(u=>(
          <div key={u.id} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr .9fr 1fr .8fr .8fr 1fr",padding:"13px 20px",borderBottom:"1px solid rgba(255,255,255,.03)",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=`${ac}06`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${navy},#2d3b6b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{u.avatar}</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:12,fontWeight:700,color:textPrimary}}>{u.name}</span>
                  {u.verified&&<span style={{fontSize:10,color:ac}}>✅</span>}
                </div>
                <div style={{...MONO({fontSize:9}),color:textMuted}}>{u.id}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center"}}><span style={badge(u.type==="farmer"?ac:teal,{fontSize:9})}>{u.type==="farmer"?"Farmer":"Industry"}</span></div>
            <div style={{display:"flex",alignItems:"center",fontSize:11,color:textSecondary}}>{u.state}</div>
            <div style={{display:"flex",alignItems:"center",fontSize:11,color:textSecondary}}>{u.trades} trades</div>
            <div style={{display:"flex",alignItems:"center",fontSize:11,color:textMuted}}>{u.joined}</div>
            <div style={{display:"flex",alignItems:"center",fontSize:11,color:ac,fontWeight:700,...MONO({})}}>{u.gmv}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <StatusPill status={u.status}/>
              <button style={ghostBtn({padding:"4px 8px",fontSize:10})}>•••</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FRAUD DETECTION PAGE ─── */
function FraudPage() {
  const [statuses, setStatuses] = useState({});
  const resolve = id => setStatuses(p=>({...p,[id]:"resolved"}));
  const escalate = id => setStatuses(p=>({...p,[id]:"escalated"}));

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>Fraud Detection</h1>
          <div style={{fontSize:12,color:textMuted}}>AI-powered monitoring · 7 active alerts · Updated in real-time</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{padding:"7px 14px",borderRadius:10,background:`${red}15`,border:`1px solid ${red}30`,fontSize:11,color:red,fontWeight:700}}>
            🚨 7 Unresolved Alerts
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Price Anomalies",v:"3",c:red,i:"💹"},
          {l:"Identity Fraud",c:red,i:"🪪",v:"1"},
          {l:"Behavior Flags",v:"2",c:amber,i:"🤖"},
          {l:"Doc Forgery",v:"1",c:amber,i:"📄"},
        ].map(s=>(
          <div key={s.l} style={{...card({padding:"14px 16px"}),display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${s.c}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{s.i}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
              <div style={{fontSize:10,color:textMuted,fontWeight:600}}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fraud cards */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {FRAUD_FLAGS.map(f=>{
          const st = statuses[f.id];
          const severityColor = f.severity==="high"?red:f.severity==="medium"?amber:ac;
          return(
            <div key={f.id} style={{...card({padding:"18px 22px"}),borderLeft:`3px solid ${severityColor}`,display:"flex",gap:16,alignItems:"flex-start"}} className="fu">
              <div style={{width:44,height:44,borderRadius:12,background:`${severityColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                {f.type==="price_anomaly"?"💹":f.type==="identity"?"🪪":f.type==="behavior"?"🤖":"📄"}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                  <span style={{fontSize:13,fontWeight:700,color:textPrimary}}>{f.title}</span>
                  <StatusPill status={f.severity}/>
                  {st && <span style={badge(st==="resolved"?ac:purple,{fontSize:10})}>{st==="resolved"?"✅ Resolved":"🔺 Escalated"}</span>}
                  <span style={{...MONO({fontSize:9}),color:textMuted,marginLeft:"auto"}}>{f.id}</span>
                </div>
                <div style={{fontSize:12,color:textSecondary,lineHeight:1.6,marginBottom:8}}>{f.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <span style={{fontSize:11,color:textMuted}}>👤 {f.user}</span>
                  <span style={{fontSize:11,color:textMuted}}>🕐 {f.time}</span>
                  {!st && (
                    <div style={{marginLeft:"auto",display:"flex",gap:7}}>
                      <button onClick={()=>resolve(f.id)} style={btn(gm,{padding:"5px 14px",fontSize:11})}>✓ Resolve</button>
                      <button onClick={()=>escalate(f.id)} style={btn(amber,{padding:"5px 14px",fontSize:11})}>🔺 Escalate</button>
                      <button style={ghostBtn({padding:"5px 12px",fontSize:11})}>View Account</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ANALYTICS PAGE ─── */
function AnalyticsPage() {
  const topCrops = [
    {name:"Potato",gmv:"₹2.4Cr",pct:28,color:amber},
    {name:"Wheat",gmv:"₹1.9Cr",pct:22,color:ac},
    {name:"Onion",gmv:"₹1.2Cr",pct:14,color:purple},
    {name:"Rice",gmv:"₹1.1Cr",pct:13,color:teal},
    {name:"Chilli",gmv:"₹0.8Cr",pct:9,color:red},
    {name:"Others",gmv:"₹1.2Cr",pct:14,color:textMuted},
  ];
  const topStates = [
    {name:"Maharashtra",pct:32,color:ac},
    {name:"Punjab",pct:24,color:teal},
    {name:"Uttar Pradesh",pct:18,color:purple},
    {name:"Gujarat",pct:12,color:amber},
    {name:"Andhra Pradesh",pct:9,color:red},
    {name:"Others",pct:5,color:textMuted},
  ];

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:24}}>
      <div>
        <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>Platform Analytics</h1>
        <div style={{fontSize:12,color:textMuted}}>All time data · Sep 2024 — Mar 2025</div>
      </div>

      {/* Growth KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        {[
          {l:"Total GMV",v:"₹8.42Cr",growth:"+18.4%",spark:[42,58,71,65,89,102,128],c:ac},
          {l:"Total Trades",v:"2,950",growth:"+24%",spark:[210,280,350,320,490,580,720],c:teal},
          {l:"Avg Order Value",v:"₹28,542",growth:"+6.2%",spark:[24,26,25,27,28,28,29],c:purple},
          {l:"Platform Take Rate",v:"2.1%",growth:"Stable",spark:[2,2,2.1,2,2.1,2.1,2.1],c:amber},
        ].map(k=>(
          <KpiCard key={k.l} label={k.l} value={k.v} sub={`↑ ${k.growth} vs last month`} color={k.c} spark={k.spark}/>
        ))}
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16}}>
        {/* GMV Trend */}
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:textPrimary}}>GMV Trend</div>
              <div style={{fontSize:11,color:textMuted,marginTop:2}}>Monthly Gross Merchandise Value</div>
            </div>
            <select style={{background:bg3,border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"5px 10px",fontSize:11,color:textSecondary,outline:"none",cursor:"pointer"}}>
              <option>Last 7 months</option>
            </select>
          </div>
          <BarChart data={MONTHLY_GMV} color={ac}/>
          <div style={{display:"flex",gap:16,marginTop:16}}>
            {MONTHLY_GMV.slice(-3).map(d=>(
              <div key={d.month} style={{flex:1,background:bg3,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:textMuted,marginBottom:4}}>{d.month}</div>
                <div style={{fontSize:14,fontWeight:800,color:ac,...MONO({})}}>{d.gmv}L</div>
                <div style={{fontSize:9,color:textMuted}}>{d.trades} trades</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top crops */}
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:16}}>Top Crops by GMV</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {topCrops.map(c=>(
              <div key={c.name}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:textSecondary,fontWeight:600}}>{c.name}</span>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{...MONO({fontSize:11}),color:c.color}}>{c.gmv}</span>
                    <span style={{fontSize:11,color:textMuted}}>{c.pct}%</span>
                  </div>
                </div>
                <div style={{height:5,borderRadius:100,background:`${c.color}18`}}>
                  <div style={{height:"100%",width:`${c.pct}%`,borderRadius:100,background:`linear-gradient(90deg,${c.color},${c.color}88)`,transition:"width .8s ease"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State breakdown */}
      <div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:16}}>State-wise User Distribution</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
          {topStates.map(s=>(
            <div key={s.name} style={{background:bg3,borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
              <Donut pct={s.pct} color={s.color} size={56}/>
              <div style={{fontSize:11,fontWeight:700,color:textSecondary,marginTop:8}}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── DISPUTES PAGE ─── */
function DisputesPage() {
  const [active, setActive] = useState(null);
  const [statuses, setStatuses] = useState({});

  const resolve = id => setStatuses(p=>({...p,[id]:"resolved"}));

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>Dispute Resolution</h1>
          <div style={{fontSize:12,color:textMuted}}>23 open disputes · Avg resolution: 3.2 days</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{padding:"7px 14px",borderRadius:10,background:`${amber}15`,border:`1px solid ${amber}30`,fontSize:11,color:amber,fontWeight:700}}>
            ⚖️ 2 Need Urgent Attention
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"Open",v:"15",c:red},{l:"In Mediation",v:"8",c:amber},{l:"Resolved (30d)",v:"41",c:ac},{l:"Avg Resolution",v:"3.2d",c:teal}].map(s=>(
          <div key={s.l} style={{...card({padding:"14px 16px",display:"flex",gap:10,alignItems:"center"})}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:textMuted,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Dispute list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {DISPUTES.map(d=>{
          const st = statuses[d.id] || d.status;
          const isExpanded = active===d.id;
          const pColor = d.priority==="high"?red:d.priority==="medium"?amber:ac;
          return(
            <div key={d.id} style={{...card({padding:"0",overflow:"hidden"}),borderLeft:`3px solid ${pColor}`}} className="fu">
              <div style={{padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14}} onClick={()=>setActive(isExpanded?null:d.id)}>
                <div style={{width:42,height:42,borderRadius:11,background:`${pColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>⚖️</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                    <span style={{...MONO({fontSize:10}),color:textMuted}}>{d.id}</span>
                    <StatusPill status={st}/>
                    <StatusPill status={d.priority}/>
                    <span style={{fontSize:11,color:ac,fontWeight:700,marginLeft:"auto"}}>{d.amount}</span>
                  </div>
                  <div style={{fontSize:12,color:textSecondary}}>{d.issue}</div>
                  <div style={{display:"flex",gap:16,marginTop:6}}>
                    <span style={{fontSize:10,color:textMuted}}>👨‍🌾 {d.farmer}</span>
                    <span style={{fontSize:10,color:textMuted}}>🏭 {d.industry}</span>
                    <span style={{fontSize:10,color:textMuted}}>📅 {d.opened}</span>
                    <span style={{fontSize:10,color:textMuted}}>💬 {d.messages} messages</span>
                  </div>
                </div>
                <div style={{fontSize:16,color:textMuted,transition:"transform .2s",transform:isExpanded?"rotate(180deg)":"rotate(0)"}}>⌄</div>
              </div>
              {isExpanded && (
                <div style={{padding:"0 20px 18px",borderTop:"1px solid rgba(255,255,255,.04)"}} className="fu">
                  <div style={{background:bg3,borderRadius:12,padding:"14px 16px",marginTop:14,fontSize:12,color:textSecondary,lineHeight:1.7}}>
                    <strong style={{color:textPrimary}}>Issue Summary:</strong> {d.issue}<br/>
                    <strong style={{color:textPrimary}}>Amount in Dispute:</strong> {d.amount}<br/>
                    <strong style={{color:textPrimary}}>Parties:</strong> {d.farmer} (Farmer) vs {d.industry} (Buyer)
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:14}}>
                    {st!=="resolved" && (
                      <>
                        <button onClick={()=>resolve(d.id)} style={btn(gm,{fontSize:11})}>✓ Mark Resolved</button>
                        <button style={btn(amber,{fontSize:11})}>📞 Schedule Mediation</button>
                        <button style={btn(teal,{fontSize:11})}>📋 View Full Thread</button>
                        <button style={ghostBtn({fontSize:11,marginLeft:"auto"})}>🚨 Escalate</button>
                      </>
                    )}
                    {st==="resolved" && <span style={badge(ac,{fontSize:11,padding:"6px 14px"})}>✅ This dispute has been resolved</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SETTINGS PAGE ─── */
function SettingsPage() {
  const [commission, setCommission] = useState("2.1");
  const [kycAuto, setKycAuto] = useState(true);
  const [fraudAI, setFraudAI] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const Toggle = ({ on, setOn }) => (
    <div onClick={()=>setOn(p=>!p)} style={{width:42,height:24,borderRadius:100,background:on?`linear-gradient(135deg,${gd},${gm})`:"rgba(255,255,255,.1)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:on?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 2px 6px rgba(0,0,0,.3)"}}/>
    </div>
  );

  return (
    <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:24}}>
      <div>
        <h1 style={PF({fontSize:26,fontWeight:700,color:textPrimary,marginBottom:4})}>System Settings</h1>
        <div style={{fontSize:12,color:textMuted}}>Platform configuration · Changes apply immediately</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Commission */}
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:4}}>💰 Commission Rate</div>
          <div style={{fontSize:11,color:textMuted,marginBottom:16}}>Platform fee applied to all completed trades</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <input type="number" value={commission} onChange={e=>setCommission(e.target.value)} min="0" max="10" step="0.1"
              style={{width:80,padding:"9px 12px",borderRadius:10,border:`1.5px solid rgba(163,196,92,.2)`,background:bg3,color:textPrimary,fontSize:16,fontWeight:800,outline:"none",...MONO({})}}/>
            <span style={{fontSize:16,color:textSecondary,fontWeight:700}}>%</span>
            <div style={{fontSize:11,color:textMuted}}>Current earnings at ₹8.42Cr GMV: <span style={{color:ac,fontWeight:700}}>~₹{(8420000*parseFloat(commission||0)/100/100000).toFixed(1)}L/mo</span></div>
          </div>
        </div>

        {/* KYC Settings */}
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:4}}>🛡️ KYC & Verification</div>
          <div style={{fontSize:11,color:textMuted,marginBottom:16}}>Control how new users are onboarded</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {l:"Auto-approve low-risk KYC",v:kycAuto,s:setKycAuto},
            ].map(({l,v,s})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:textSecondary}}>{l}</div>
                <Toggle on={v} setOn={s}/>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud AI */}
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:4}}>🤖 AI Fraud Detection</div>
          <div style={{fontSize:11,color:textMuted,marginBottom:16}}>Machine learning models monitoring listings and behavior</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {l:"Enable AI fraud monitoring",v:fraudAI,s:setFraudAI},
            ].map(({l,v,s})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:textSecondary}}>{l}</div>
                <Toggle on={v} setOn={s}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,padding:"10px 12px",borderRadius:10,background:`${ac}0d`,border:`1px solid ${ac}20`,fontSize:11,color:ac}}>
            ✅ AI models active · 99.4% precision · 7 flags today
          </div>
        </div>

        {/* Notifications */}
        <div style={card()}>
          <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:4}}>🔔 Admin Notifications</div>
          <div style={{fontSize:11,color:textMuted,marginBottom:16}}>How you receive platform alerts</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {l:"Email alerts (admin@grainos.in)",v:emailNotif,s:setEmailNotif},
              {l:"SMS alerts (+91 98765 XXXXX)",v:smsNotif,s:setSmsNotif},
            ].map(({l,v,s})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:textSecondary}}>{l}</div>
                <Toggle on={v} setOn={s}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform limits */}
      <div style={card()}>
        <div style={{fontSize:13,fontWeight:700,color:textPrimary,marginBottom:16}}>📋 Platform Limits</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {[
            {l:"Max listing price (₹/kg)",v:"500",h:"Prevents price anomalies"},
            {l:"Min listing quantity (kg)",v:"50",h:"Ensures viable trade size"},
            {l:"Max open tenders per buyer",v:"10",h:"Prevents market hoarding"},
            {l:"KYC auto-reject after (days)",v:"14",h:"Abandoned applications"},
          ].map(({l,v,h})=>(
            <div key={l}>
              <div style={{fontSize:10,color:textMuted,fontWeight:600,marginBottom:6}}>{l}</div>
              <input defaultValue={v} style={{width:"100%",padding:"8px 12px",borderRadius:9,border:"1px solid rgba(163,196,92,.15)",background:bg3,color:textPrimary,fontSize:14,fontWeight:700,outline:"none",...MONO({})}}/>
              <div style={{fontSize:9,color:textMuted,marginTop:4}}>{h}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        {saved && <span style={badge(ac,{padding:"9px 18px",fontSize:12})}>✅ Settings saved!</span>}
        <button onClick={save} style={btn(gm,{padding:"11px 28px",fontSize:13})}>💾 Save Changes</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
function Sidebar({ page, setPage }) {
  return (
    <div style={{ width:220, background:bg1, borderRight:"1px solid rgba(163,196,92,.06)", display:"flex", flexDirection:"column", height:"100%", flexShrink:0 }}>
      {/* Logo */}
      <div style={{padding:"22px 20px 16px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
          <div style={{width:36,height:36,borderRadius:11,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🌾</div>
          <div>
            <div style={PF({fontSize:17,fontWeight:700,color:textPrimary})}>GrainOS</div>
            <div style={{fontSize:9,color:textMuted,letterSpacing:.6,textTransform:"uppercase"}}>Admin Console</div>
          </div>
        </div>
      </div>

      {/* Admin user */}
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",background:"rgba(163,196,92,.06)",borderRadius:11,border:"1px solid rgba(163,196,92,.1)"}}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${gd},${gm})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🔐</div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:textPrimary}}>Super Admin</div>
            <div style={{fontSize:9,color:ac}}>admin@grainos.in</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 10px"}}>
        <div style={{fontSize:9,fontWeight:700,color:textMuted,letterSpacing:1,textTransform:"uppercase",padding:"6px 10px",marginBottom:2}}>Navigation</div>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,
            border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",
            background: page===n.id?`linear-gradient(135deg,${gd}cc,${gm}cc)`:"transparent",
            color: page===n.id?textPrimary:textSecondary,
            transition:"all .15s",
            position:"relative",
          }}
          onMouseEnter={e=>{ if(page!==n.id) e.currentTarget.style.background="rgba(255,255,255,.04)"; }}
          onMouseLeave={e=>{ if(page!==n.id) e.currentTarget.style.background="transparent"; }}
          >
            <span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span>
            <span style={{fontSize:12,fontWeight:page===n.id?700:500,flex:1}}>{n.label}</span>
            {n.badge && <span style={{background:page===n.id?"rgba(255,255,255,.2)":`${n.badge>10?red:amber}cc`,color:"#fff",borderRadius:100,fontSize:9,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{n.badge}</span>}
            {page===n.id && <div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,borderRadius:100,background:ac}}/>}
          </button>
        ))}
      </div>

      {/* Health indicator */}
      <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,.04)"}}>
        <div style={{background:`${ac}0d`,border:`1px solid ${ac}20`,borderRadius:11,padding:"10px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:10,fontWeight:700,color:ac}}>System Health</span>
            <span style={{fontSize:10,fontWeight:800,color:ac,...MONO({})}}>99.2%</span>
          </div>
          <div style={{height:4,borderRadius:100,background:`${ac}20`}}>
            <div style={{height:"100%",width:"99.2%",borderRadius:100,background:`linear-gradient(90deg,${ac},${gm})`}}/>
          </div>
          <div style={{fontSize:9,color:textMuted,marginTop:5}}>All 8 services operational</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function AdminPanel() {
  const [page, setPage] = useState("overview");

  const pages = {
    overview:  <OverviewPage/>,
    kyc:       <KycPage/>,
    users:     <UsersPage/>,
    fraud:     <FraudPage/>,
    analytics: <AnalyticsPage/>,
    disputes:  <DisputesPage/>,
    settings:  <SettingsPage/>,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{display:"flex",height:"100vh",background:bg0,overflow:"hidden"}}>
        <Sidebar page={page} setPage={setPage}/>
        <main style={{flex:1,overflowY:"auto",background:bg0}}>
          {pages[page]}
        </main>
      </div>
    </>
  );
}
