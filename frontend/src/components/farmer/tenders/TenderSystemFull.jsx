import { useState, useRef, useEffect } from "react";

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#eef2e8;}
input,textarea,select,button{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:rgba(30,70,20,.15);border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}70%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
@keyframes slideR{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
.fu{animation:fadeUp .25s ease both;}
.fi{animation:fadeIn .2s ease both;}
.sr{animation:slideR .2s ease both;}
`;

/* ─── TOKENS ─── */
const gd="#1e4620",gm="#2d6b30",ac="#a3c45c",navy="#1e2a4a",cr="#f6f9f0";
const PF=s=>({fontFamily:"'Playfair Display',serif",...s});
const card=(x={})=>({background:"#fff",borderRadius:20,border:"1px solid rgba(30,70,20,.07)",...x});
const gBtn=(x={})=>({background:`linear-gradient(135deg,${gd},${gm})`,color:"#fff",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,transition:"all .18s",...x});
const ghBtn=(x={})=>({background:"#f0f4ec",color:"#374151",border:"1px solid rgba(30,70,20,.1)",borderRadius:12,padding:"10px 16px",fontWeight:600,cursor:"pointer",fontSize:13,...x});
const navyBtn=(x={})=>({background:`linear-gradient(135deg,${navy},#2d3b6b)`,color:"#fff",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,...x});

/* ─── TICKER ─── */
const TICKER=[
  {n:"Wheat",p:"₹28/kg",c:"+0.8%",up:true},{n:"Potato",p:"₹22/kg",c:"+4.2%",up:true},
  {n:"Onion",p:"₹14/kg",c:"-1.8%",up:false},{n:"Chilli",p:"₹85/kg",c:"+6.4%",up:true},
  {n:"Corn",p:"₹18/kg",c:"+2.1%",up:true},{n:"Tomato",p:"₹32/kg",c:"+12.3%",up:true},
  {n:"Soybean",p:"₹44/kg",c:"+1.2%",up:true},{n:"Rice",p:"₹52/kg",c:"-0.5%",up:false},
];

/* ─── INITIAL DATA ─── */
const TENDERS_INIT=[
  {id:1,company:"Britannia Industries",companyE:"🏭",crop:"Wheat",title:"50 ton Premium Wheat — Q2 2026",budget:"₹26–29",budgetMin:26,budgetMax:29,qty:"50 ton",qtyNum:50000,deadline:"15 Mar 2026",daysLeft:4,freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Protein content 11%+, moisture < 14%. Packaging in 50kg HDPE bags. Payment NET 7 days after delivery. Farm visit mandatory before contract signing. Preferred variety: Sharbati or Lokwan.",applied:12,shortlisted:3,status:"active",invited:true,myApplication:null,tag:"Best Match",match:94,urgent:true,postedOn:"12 Feb 2026"},
  {id:2,company:"PepsiCo India",companyE:"🏭",crop:"Potato",title:"Chip-Grade Potato Contract — Lays",budget:"₹22–25",budgetMin:22,budgetMax:25,qty:"100 ton",qtyNum:100000,deadline:"22 Mar 2026",daysLeft:11,freq:"Bi-weekly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Specific gravity >1.080, size 40–80mm, dry matter >19%. Storage potato preferred. Farm visit required before contract. Long-term contract available for consistent quality suppliers.",applied:8,shortlisted:2,status:"active",invited:true,myApplication:null,tag:"High Pay",match:87,urgent:false,postedOn:"15 Feb 2026"},
  {id:3,company:"NatureFresh Exports",companyE:"🌿",crop:"Chilli",title:"Red Chilli (Teja) Export to Dubai",budget:"₹80–90",budgetMin:80,budgetMax:90,qty:"20 ton",qtyNum:20000,deadline:"18 Mar 2026",daysLeft:7,freq:"One-time",grade:"Grade A",state:"Karnataka",cert:"APEDA",desc:"Teja/Byadgi variety. Capsaicin content certified. Export-quality packaging. APEDA registration mandatory. Documentation support provided by buyer.",applied:5,shortlisted:1,status:"active",invited:false,myApplication:null,tag:"Export",match:78,urgent:true,postedOn:"18 Feb 2026"},
  {id:4,company:"BigBasket",companyE:"🛒",crop:"Onion",title:"Onion Bulk Supply — Pan India Q2",budget:"₹13–16",budgetMin:13,budgetMax:16,qty:"200 ton",qtyNum:200000,deadline:"01 Apr 2026",daysLeft:21,freq:"Weekly",grade:"Any",state:"All India",cert:"None",desc:"Medium Nashik onion 40–60mm. Weekly pickup arranged by buyer. Our transport provided. Payment within same week of delivery.",applied:0,shortlisted:0,status:"active",invited:false,myApplication:null,tag:"New",match:91,urgent:false,postedOn:"20 Feb 2026"},
  {id:5,company:"Haldiram's",companyE:"🏭",crop:"Tomato",title:"Processing Tomato — Sauce Grade",budget:"₹28–35",budgetMin:28,budgetMax:35,qty:"80 ton",qtyNum:80000,deadline:"10 Apr 2026",daysLeft:30,freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Round hybrid tomato, Brix 5.2+, 60–80mm. Sorting and grading by farmer preferred. Consistent monthly supply. Premium bonus for zero-rejection batches.",applied:3,shortlisted:1,status:"active",invited:false,myApplication:null,tag:null,match:82,urgent:false,postedOn:"22 Feb 2026"},
  {id:6,company:"Organic India",companyE:"🌱",crop:"Soybean",title:"Organic Soybean — Premium Contract",budget:"₹48–55",budgetMin:48,budgetMax:55,qty:"30 ton",qtyNum:30000,deadline:"30 Mar 2026",daysLeft:19,freq:"Quarterly",grade:"Grade A",state:"Madhya Pradesh",cert:"Organic",desc:"Certified organic, non-GMO. Protein 40%+. Long-term premium contract available for consistent certified supply. NPOP certification required.",applied:3,shortlisted:0,status:"active",invited:false,myApplication:null,tag:"Organic Premium",match:69,urgent:false,postedOn:"22 Feb 2026"},
  {id:7,company:"ITC Foods",companyE:"🏭",crop:"Wheat",title:"Atta Grade Wheat — Aashirvaad",budget:"₹27–31",budgetMin:27,budgetMax:31,qty:"200 ton",qtyNum:200000,deadline:"05 Apr 2026",daysLeft:25,freq:"Monthly",grade:"Grade A",state:"Punjab",cert:"FSSAI",desc:"High-protein atta grade wheat. Protein 12%+, gluten strength required. Punjab/Haryana origin preferred. Long-term annual contract possible.",applied:19,shortlisted:4,status:"active",invited:false,myApplication:null,tag:null,match:72,urgent:false,postedOn:"23 Feb 2026"},
];

const INDUSTRY_TENDERS_INIT=[
  {id:1,title:"50 ton Premium Wheat — Q2 2026",crop:"Wheat",budget:"₹26–29",qty:"50 ton",deadline:"15 Mar 2026",daysLeft:4,freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Protein content 11%+, moisture < 14%. Packaging in 50kg HDPE bags. Payment NET 7 days after delivery.",status:"active",bids:[
    {id:1,farmer:"Ramesh Patil",fe:"👨‍🌾",loc:"Nashik, MH",rating:4.9,verified:true,offer:27.5,qty:"50 ton",time:"20 min ago",status:"new",note:"Grade A certified, freshly harvested. Bi-weekly delivery possible. FSSAI cert ready.",docs:true,score:96},
    {id:2,farmer:"Gopal Singh",fe:"🧑‍🌾",loc:"Nagpur, MH",rating:4.5,verified:false,offer:26,qty:"40 ton",time:"1 day ago",status:"new",note:"Bulk wheat available, can scale to 80 ton next season.",docs:false,score:72},
    {id:3,farmer:"Arjun Mehta",fe:"👨‍🌾",loc:"Amravati, MH",rating:4.6,verified:true,offer:27,qty:"50 ton",time:"3h ago",status:"shortlisted",note:"Certified organic-free. Moisture tested at 12.8%. FSSAI cert attached.",docs:true,score:84},
  ],posted:"12 Feb 2026",views:147},
  {id:2,title:"Chip-Grade Potato Contract — Lays",crop:"Potato",budget:"₹22–25",qty:"100 ton",deadline:"22 Mar 2026",daysLeft:11,freq:"Bi-weekly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Specific gravity >1.080, size 40–80mm, dry matter >19%. Storage potato preferred.",status:"active",bids:[
    {id:4,farmer:"Sunita Devi",fe:"👩‍🌾",loc:"Pune, MH",rating:4.7,verified:true,offer:23.5,qty:"80 ton",time:"2h ago",status:"shortlisted",note:"Chipping potatoes s.g. 1.085. 40 ton/month consistent supply.",docs:true,score:89},
    {id:5,farmer:"Ramesh Patil",fe:"👨‍🌾",loc:"Nashik, MH",rating:4.9,verified:true,offer:24,qty:"100 ton",time:"5h ago",status:"new",note:"Grade A chip potatoes. Farm visit welcome anytime.",docs:true,score:96},
  ],posted:"15 Feb 2026",views:89},
  {id:3,title:"Onion Bulk Supply — Pan India Q2",crop:"Onion",budget:"₹13–16",qty:"200 ton",deadline:"01 Apr 2026",daysLeft:21,freq:"Weekly",grade:"Any",state:"All India",cert:"None",desc:"Medium Nashik onion 40–60mm. Weekly pickup arranged by buyer.",status:"draft",bids:[],posted:"20 Feb 2026",views:0},
  {id:4,title:"Processing Tomato — Sauce Grade",crop:"Tomato",budget:"₹28–35",qty:"80 ton",deadline:"10 Apr 2026",daysLeft:30,freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Round hybrid tomato, Brix 5.2+, 60–80mm.",status:"active",bids:[
    {id:6,farmer:"Sunita Devi",fe:"👩‍🌾",loc:"Pune, MH",rating:4.7,verified:true,offer:34,qty:"60 ton",time:"1h ago",status:"new",note:"Hybrid tomato, Brix 5.4. Greenhouse grown, consistent quality.",docs:true,score:89},
  ],posted:"22 Feb 2026",views:62},
];

/* ─── SHARED COMPONENTS ─── */
function Badge({color="green",size="sm",children}){
  const C={green:{bg:"#f0f7f0",fg:"#2d6b30"},amber:{bg:"#fef3c7",fg:"#92400e"},blue:{bg:"#eff6ff",fg:"#1d4ed8"},red:{bg:"#fee2e2",fg:"#991b1b"},gray:{bg:"#f3f4f6",fg:"#6b7280"},purple:{bg:"#f3e8ff",fg:"#7e22ce"},teal:{bg:"#f0fdfa",fg:"#0f766e"},navy:{bg:"#eff6ff",fg:"#1e2a4a"}};
  const s=C[color]||C.gray;
  return <span style={{fontSize:size==="xs"?8:9,fontWeight:700,padding:size==="xs"?"2px 6px":"3px 9px",borderRadius:100,background:s.bg,color:s.fg,display:"inline-flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>{children}</span>;
}

function Modal({onClose,children,w=580}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:24,padding:28,width:w,maxWidth:"95vw",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.25)",position:"relative",animation:"modalIn .22s ease"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:30,height:30,borderRadius:"50%",border:"none",background:"#f0f4ec",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Field({label,type="text",placeholder,opts,value,onChange,rows=3,hint}){
  const base={width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,outline:"none",background:"#fafafa",transition:"border .15s",color:"#1a2e1a"};
  return(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:6,display:"block"}}>{label}</label>
      {type==="select"
        ?<select value={value} onChange={e=>onChange(e.target.value)} style={{...base,cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
        :type==="textarea"
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...base,resize:"vertical"}}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e=>e.target.style.borderColor=gm} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
      }
      {hint&&<div style={{fontSize:10,color:"#9ca3af",marginTop:4}}>{hint}</div>}
    </div>
  );
}

function TickerBar(){
  return(
    <div style={{background:gd,padding:"7px 0",display:"flex",alignItems:"center",overflow:"hidden",flexShrink:0,zIndex:60,position:"relative"}}>
      <div style={{padding:"0 18px",flexShrink:0,borderRight:"1px solid rgba(255,255,255,.1)"}}>
        <span style={{fontSize:9,fontWeight:800,color:ac,letterSpacing:1.2,textTransform:"uppercase"}}>MANDI LIVE</span>
      </div>
      <div style={{overflow:"hidden",flex:1}}>
        <div style={{display:"flex",gap:24,animation:"ticker 22s linear infinite",paddingLeft:24}}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>{t.n}</span>
              <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{t.p}</span>
              <span style={{fontSize:10,fontWeight:700,color:t.up?ac:"#fc8181"}}>{t.up?"▲":"▼"}{t.c}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Topbar({title,sub,actions}){
  return(
    <div style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(30,42,74,.07)",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40}}>
      <div>
        <h1 style={PF({fontSize:19,fontWeight:600,color:"#1a1f36"})}>{title}</h1>
        {sub&&<p style={{fontSize:11,color:"#6b7280",marginTop:1}}>{sub}</p>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>{actions}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APPLY TO TENDER MODAL (farmer side)
═══════════════════════════════════════════════════════ */
function ApplyModal({tender,onClose,onApplied}){
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({offer:"",qty:"",delivery:"Within 2 weeks",note:"",hasCert:false,visitOk:false});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const aiSuggest=Math.round(tender.budgetMax*0.97);
  const pNum=parseFloat(form.offer)||0;
  const inBudget=pNum>=tender.budgetMin&&pNum<=tender.budgetMax;
  const aboveMax=pNum>tender.budgetMax;

  if(done) return(
    <div style={{textAlign:"center",padding:"22px 0"}} className="fu">
      <div style={{fontSize:60,marginBottom:14}}>✅</div>
      <div style={PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>Application Submitted!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.9,marginBottom:22}}>
        Your bid of <strong>₹{form.offer}/kg</strong> for <strong>{form.qty}</strong> has been sent to <strong>{tender.company}</strong>.<br/>
        You'll receive a reply within <strong style={{color:gm}}>24–48 hours</strong>.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:22}}>
        {[{i:"🏭",l:"Company",v:tender.company},{i:"💰",l:"Your Offer",v:`₹${form.offer}/kg`},{i:"📦",l:"Quantity",v:form.qty}].map(({i,l,v})=>(
          <div key={l} style={{background:cr,borderRadius:14,padding:"11px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:5}}>{i}</div>
            <div style={{fontSize:10,color:"#6b7280",marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:700,color:gd}}>{v}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>{onApplied&&onApplied(tender.id,{offer:form.offer,qty:form.qty,note:form.note,status:"submitted",time:"Just now"});onClose();}} style={gBtn({padding:"11px 36px"})}>Done</button>
    </div>
  );

  return(
    <>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${navy},#2d3b6b)`,borderRadius:16,padding:"16px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:46,height:46,borderRadius:13,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{tender.companyE}</div>
        <div style={{flex:1}}>
          <div style={PF({fontSize:14,fontWeight:700,color:"#fff"})}>{tender.title}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>🏭 {tender.company} · 📦 {tender.qty} · Budget: {tender.budget}/kg</div>
        </div>
        {tender.match&&<div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:800,color:tender.match>85?ac:"#fbbf24"}}>{tender.match}%</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>AI Match</div>
        </div>}
      </div>
      <div style={PF({fontSize:16,fontWeight:700,color:"#1a2e1a",marginBottom:14})}>Submit Your Application</div>
      {/* AI tip */}
      <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:13,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center",border:"1px solid rgba(45,107,48,.12)"}}>
        <span style={{fontSize:18,flexShrink:0}}>🤖</span>
        <div style={{fontSize:11,color:"#1a2e1a",lineHeight:1.7}}>
          <strong>AI Tip:</strong> Budget is <strong>{tender.budget}/kg</strong>. Bids near <strong style={{color:gm}}>₹{aiSuggest}/kg</strong> have 3× higher acceptance rate. Today's mandi: <strong>₹{tender.budgetMin+1}/kg</strong>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div>
          <Field label="Your Offer ₹/kg *" placeholder={`Budget: ${tender.budget}`} value={form.offer} onChange={v=>set("offer",v)}/>
          {form.offer&&<div style={{fontSize:10,fontWeight:600,padding:"4px 10px",borderRadius:7,marginTop:-10,marginBottom:12,background:aboveMax?"#fee2e2":inBudget?"#f0f7f0":"#fffbeb",color:aboveMax?"#991b1b":inBudget?gm:"#92400e"}}>
            {aboveMax?"⚠️ Above buyer's budget — may be rejected":inBudget?"✅ Within budget range":"ℹ️ Below budget — good chance of acceptance"}
          </div>}
        </div>
        <Field label="Quantity You Can Supply *" placeholder={`Tender: ${tender.qty}`} value={form.qty} onChange={v=>set("qty",v)}/>
      </div>
      <Field label="Delivery Timeline" type="select" opts={["Within 1 week","Within 2 weeks","Within 1 month","As per buyer schedule"]} value={form.delivery} onChange={v=>set("delivery",v)}/>
      <Field label="Note to Buyer" type="textarea" placeholder="Mention your produce quality, certifications, experience, farm location, why you're the best fit…" value={form.note} onChange={v=>set("note",v)} rows={3}/>
      <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
        {tender.cert!=="None"&&(
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#374151"}}>
            <div onClick={()=>set("hasCert",!form.hasCert)} style={{width:16,height:16,borderRadius:4,background:form.hasCert?gd:"transparent",border:`1.5px solid ${form.hasCert?gd:"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
              {form.hasCert&&<span style={{color:"#fff",fontSize:9}}>✓</span>}
            </div>
            I have <strong style={{margin:"0 4px"}}>{tender.cert}</strong> certification
          </label>
        )}
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#374151"}}>
          <div onClick={()=>set("visitOk",!form.visitOk)} style={{width:16,height:16,borderRadius:4,background:form.visitOk?gd:"transparent",border:`1.5px solid ${form.visitOk?gd:"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
            {form.visitOk&&<span style={{color:"#fff",fontSize:9}}>✓</span>}
          </div>
          Farm visit welcome anytime
        </label>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Cancel</button>
        <button onClick={()=>form.offer&&form.qty&&setDone(true)} disabled={!form.offer||!form.qty} style={{...gBtn({flex:2,padding:12,opacity:form.offer&&form.qty?1:.5})}}>Submit Application →</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   TENDER DETAIL MODAL (farmer side)
═══════════════════════════════════════════════════════ */
function TenderDetailModal({tender,onClose,onApply,applied}){
  const [tab,setTab]=useState("overview");

  return(
    <>
      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${navy},#2d3b6b)`,borderRadius:16,padding:"20px 18px",marginBottom:20,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:54,height:54,borderRadius:15,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{tender.companyE}</div>
          <div style={{flex:1}}>
            <div style={PF({fontSize:16,fontWeight:700,color:"#fff",marginBottom:4})}>{tender.title}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>🏭 {tender.company} · 📍 {tender.state} · 🔄 {tender.freq}</div>
          </div>
          {applied&&<div style={{background:"rgba(163,196,92,.2)",border:"1px solid rgba(163,196,92,.4)",borderRadius:10,padding:"6px 12px",color:ac,fontSize:11,fontWeight:700,flexShrink:0}}>✅ Applied</div>}
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {tender.tag&&<Badge color={tender.tag==="Best Match"||tender.tag==="High Pay"?"amber":tender.tag==="Export"?"purple":tender.tag==="New"?"blue":"teal"}>{tender.tag}</Badge>}
          {tender.urgent&&<Badge color="red">⚡ Urgent</Badge>}
          {tender.invited&&<Badge color="green">✉️ You were invited</Badge>}
          <Badge color="gray">{tender.daysLeft} days left</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:11,padding:3,marginBottom:18}}>
        {["overview","requirements","company"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px",borderRadius:9,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize",transition:"all .15s"}}>{t}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[{i:"💰",l:"Budget",v:tender.budget+"/kg"},{i:"📦",l:"Quantity",v:tender.qty},{i:"⏰",l:"Deadline",v:tender.deadline},{i:"🔄",l:"Frequency",v:tender.freq},{i:"🏅",l:"Certification",v:tender.cert},{i:"👨‍🌾",l:"Applied",v:`${tender.applied} farmers`}].map(({i,l,v})=>(
              <div key={l} style={{background:cr,borderRadius:13,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:18,marginBottom:3}}>{i}</div>
                <div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{l}</div>
                <div style={{fontSize:11,fontWeight:700,color:gd}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#f9fdf9",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid rgba(30,70,20,.06)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b7280",marginBottom:6}}>Tender Description</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{tender.desc}</div>
          </div>
          {/* AI match breakdown */}
          {tender.match&&(
            <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:13,padding:"12px 14px",border:"1px solid rgba(45,107,48,.12)",display:"flex",gap:10,alignItems:"flex-start",marginBottom:16}}>
              <span style={{fontSize:20,flexShrink:0}}>🤖</span>
              <div style={{fontSize:11,color:"#1a2e1a",lineHeight:1.7}}>
                <strong>AI Match Score: {tender.match}%</strong> — Based on your produce ({tender.crop}), location ({tender.state}), and certifications. Budget is <strong>{tender.budget}/kg</strong>. Today's mandi rate: <strong style={{color:gm}}>₹{tender.budgetMin+1}/kg</strong>. This is a <strong style={{color:gm}}>good deal</strong>.
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="requirements"&&(
        <div className="fu">
          {[{i:"🌾",l:"Crop",v:tender.crop},{i:"⭐",l:"Grade Required",v:tender.grade},{i:"💧",l:"Quality Standard",v:"Moisture < 14%, No aflatoxin"},{i:"📦",l:"Packaging",v:"50kg HDPE bags (provided by buyer)"},{i:"🚚",l:"Delivery",v:"Farm pickup OR delivery to nearest depot"},{i:"💳",l:"Payment Terms",v:"NET 7 days after delivery"},{i:"🏅",l:"Cert Required",v:tender.cert},{i:"🔍",l:"Farm Visit",v:"Required before contract"}].map(({i,l,v})=>(
            <div key={l} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:"1px solid #f5f5f5",alignItems:"flex-start"}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{i}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#1a2e1a"}}>{v}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="company"&&(
        <div className="fu">
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:`linear-gradient(135deg,${navy},#2d3b6b)`,borderRadius:14,marginBottom:16}}>
            <div style={{fontSize:36}}>{tender.companyE}</div>
            <div>
              <div style={PF({fontSize:16,fontWeight:700,color:"#fff"})}>{tender.company}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>✅ GST Verified · Bangalore, India</div>
            </div>
          </div>
          {[{i:"📋",l:"Total Tenders Posted",v:"24"},{i:"🤝",l:"Contracts Completed",v:"186"},{i:"⭐",l:"Farmer Rating",v:"4.7 / 5"},{i:"💰",l:"Avg. Payment Time",v:"6.2 days"},{i:"📅",l:"Member Since",v:"2022"},{i:"🌾",l:"Categories",v:"Grains, Spices, Vegetables"}].map(({i,l,v})=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5",fontSize:12}}>
              <span style={{color:"#6b7280"}}>{i} {l}</span>
              <span style={{fontWeight:700,color:"#1a2e1a"}}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Close</button>
        {!applied
          ?<button onClick={()=>{onApply(tender);onClose();}} style={gBtn({flex:2,padding:12})}>Apply for This Tender →</button>
          :<div style={{flex:2,padding:"12px",borderRadius:12,background:"#f0f7f0",textAlign:"center",fontSize:12,fontWeight:700,color:gm}}>✅ Application Submitted</div>
        }
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MY APPLICATION DETAIL MODAL
═══════════════════════════════════════════════════════ */
function MyApplicationModal({tender,onClose}){
  const app=tender.myApplication;
  const statusMap={submitted:{color:"amber",label:"Submitted",icon:"📤",msg:"Your application is under review by the buyer."},shortlisted:{color:"blue",label:"Shortlisted",icon:"⭐",msg:"You've been shortlisted! Buyer may contact you for a farm visit."},awarded:{color:"green",label:"Contract Awarded",icon:"🏆",msg:"Congratulations! You've been awarded this contract."},rejected:{color:"gray",label:"Not Selected",icon:"✕",msg:"The buyer selected another farmer this time. Keep applying!"}};
  const s=statusMap[app?.status]||statusMap.submitted;

  return(
    <>
      <div style={PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:16})}>My Application — {tender.title}</div>
      {/* Status */}
      <div style={{background:app?.status==="awarded"?"#f0f7f0":app?.status==="rejected"?"#f9f9f9":app?.status==="shortlisted"?"#eff6ff":"#fffbeb",borderRadius:14,padding:"16px 18px",marginBottom:18,border:`1px solid ${app?.status==="awarded"?"rgba(45,107,48,.2)":app?.status==="shortlisted"?"rgba(29,78,216,.2)":"rgba(245,158,11,.2)"}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <span style={{fontSize:24}}>{s.icon}</span>
          <div style={PF({fontSize:16,fontWeight:700,color:"#1a2e1a"})}>{s.label}</div>
        </div>
        <div style={{fontSize:12,color:"#6b7280",lineHeight:1.6}}>{s.msg}</div>
      </div>
      {/* Application details */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{i:"💰",l:"Your Offer",v:`₹${app?.offer}/kg`},{i:"📦",l:"Quantity",v:app?.qty},{i:"🕐",l:"Submitted",v:app?.time},{i:"🏭",l:"Company",v:tender.company}].map(({i,l,v})=>(
          <div key={l} style={{background:cr,borderRadius:12,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#9ca3af",marginBottom:3}}>{i} {l}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{v}</div>
          </div>
        ))}
      </div>
      {app?.note&&<div style={{background:"#f9fdf9",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid rgba(30,70,20,.06)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#6b7280",marginBottom:5}}>Your Note</div>
        <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>"{app.note}"</div>
      </div>}
      {/* Timeline */}
      <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:10}}>Application Timeline</div>
      {[{icon:"📤",label:"Application submitted",time:app?.time,done:true},{icon:"👁️",label:"Viewed by buyer",time:"1h after submission",done:app?.status!=="submitted"},{icon:"⭐",label:"Shortlisted",time:app?.status==="shortlisted"||app?.status==="awarded"?"Under review":"—",done:app?.status==="shortlisted"||app?.status==="awarded"},{icon:"🏆",label:"Contract awarded",time:app?.status==="awarded"?"Awarded!":"—",done:app?.status==="awarded"}].map(({icon,label,time,done},i)=>(
        <div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:done?`linear-gradient(135deg,${ac},${gm})`:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{done?icon:"○"}</div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{fontSize:12,fontWeight:done?600:400,color:done?"#1a2e1a":"#9ca3af"}}>{label}</div>
            <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>{time}</div>
          </div>
        </div>
      ))}
      <button onClick={onClose} style={gBtn({width:"100%",padding:11,marginTop:6})}>Close</button>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOAT TENDER MODAL (industry side) — 2 steps
═══════════════════════════════════════════════════════ */
function FloatTenderModal({onClose,onDone}){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({crop:"Wheat",qty:"",unit:"ton",priceMin:"",priceMax:"",deadline:"",freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"",notify:true,visit:false,payment:"NET 7 days"});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const match=Math.floor(Math.random()*12)+15;
  const aiPrice={"Wheat":28,"Potato":22,"Onion":14,"Chilli":85,"Corn":18,"Tomato":32,"Soybean":44}[form.crop]||25;

  if(done) return(
    <div style={{textAlign:"center",padding:"20px 0"}} className="fu">
      <div style={{fontSize:60,marginBottom:14}}>🎉</div>
      <div style={PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>Tender Floated!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.9,marginBottom:22}}>
        Your tender for <strong>{form.qty} {form.unit} of {form.crop}</strong> is now live.<br/>
        <strong style={{color:gm}}>{match} verified farmers</strong> in {form.state} notified via SMS & App.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
        {[{i:"👨‍🌾",l:"Matching Farmers",v:match},{i:"⏰",l:"Deadline",v:form.deadline||"5 days"},{i:"📱",l:"Notified via",v:"SMS + App"}].map(({i,l,v})=>(
          <div key={l} style={{background:cr,borderRadius:14,padding:"12px 10px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:5}}>{i}</div>
            <div style={{fontSize:10,color:"#6b7280",marginBottom:2}}>{l}</div>
            <div style={{fontSize:14,fontWeight:700,color:gd}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={onClose} style={ghBtn({padding:"10px 24px"})}>Close</button>
        <button onClick={()=>{onDone&&onDone(form);onClose();}} style={gBtn({padding:"10px 24px"})}>View My Tenders →</button>
      </div>
    </div>
  );

  return(
    <>
      <div style={PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:4})}>Float New Tender 📋</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Step {step} of 2 · Reach 12,000+ verified farmers instantly</div>
      <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:12,padding:3,marginBottom:20}}>
        {["Basic Details","Requirements & Reach"].map((s,i)=>(
          <button key={s} onClick={()=>setStep(i+1)} style={{flex:1,padding:"8px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:step===i+1?"#fff":"transparent",color:step===i+1?gd:"#9ca3af",transition:"all .15s"}}>{s}</button>
        ))}
      </div>

      {step===1&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Crop / Produce *" type="select" opts={["Wheat","Potato","Onion","Chilli","Corn","Tomato","Soybean","Rice","Turmeric","Ginger","Garlic"]} value={form.crop} onChange={v=>set("crop",v)}/>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
              <Field label="Quantity *" placeholder="e.g. 50" value={form.qty} onChange={v=>set("qty",v)}/>
              <Field label="Unit" type="select" opts={["ton","kg","quintal"]} value={form.unit} onChange={v=>set("unit",v)}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Budget Min ₹/kg" placeholder={`e.g. ${aiPrice-3}`} value={form.priceMin} onChange={v=>set("priceMin",v)}/>
            <Field label="Budget Max ₹/kg" placeholder={`e.g. ${aiPrice+1}`} value={form.priceMax} onChange={v=>set("priceMax",v)}/>
          </div>
          {/* AI price tip */}
          <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:12,padding:"9px 13px",marginBottom:14,display:"flex",gap:8,alignItems:"center",border:"1px solid rgba(45,107,48,.1)"}}>
            <span>🤖</span>
            <div style={{fontSize:11,color:"#1a2e1a"}}>Today's mandi rate for <strong>{form.crop}</strong>: <strong style={{color:gm}}>₹{aiPrice}/kg</strong>. Set budget ±5% to attract quality bids quickly.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Deadline *" type="date" value={form.deadline} onChange={v=>set("deadline",v)}/>
            <Field label="Supply Frequency" type="select" opts={["One-time","Weekly","Bi-weekly","Monthly","Quarterly"]} value={form.freq} onChange={v=>set("freq",v)}/>
          </div>
          <Field label="Grade Required" type="select" opts={["Grade A (Premium)","Grade B (Standard)","Any Grade"]} value={form.grade} onChange={v=>set("grade",v)}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={onClose} style={ghBtn()}>Cancel</button>
            <button onClick={()=>setStep(2)} disabled={!form.qty} style={{...gBtn({opacity:form.qty?1:.5})}}>Next →</button>
          </div>
        </div>
      )}

      {step===2&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Target State" type="select" opts={["Maharashtra","Punjab","UP","MP","Karnataka","Rajasthan","Gujarat","All India"]} value={form.state} onChange={v=>set("state",v)}/>
            <Field label="Certification Required" type="select" opts={["FSSAI","Organic","APEDA","ISO 22000","None Required"]} value={form.cert} onChange={v=>set("cert",v)}/>
          </div>
          <Field label="Payment Terms" type="select" opts={["Advance (before delivery)","NET 7 days","NET 15 days","NET 30 days","On delivery"]} value={form.payment} onChange={v=>set("payment",v)}/>
          <Field label="Tender Description" type="textarea" placeholder="Quality standards, packaging requirements, delivery terms, any special requirements…" value={form.desc} onChange={v=>set("desc",v)} rows={4}/>
          <div style={{display:"flex",gap:16,marginBottom:14}}>
            {[["Notify matching farmers via SMS","notify"],["Farm visit required","visit"]].map(([l,k])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#374151"}}>
                <div onClick={()=>set(k,!form[k])} style={{width:16,height:16,borderRadius:4,background:form[k]?gd:"transparent",border:`1.5px solid ${form[k]?gd:"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
                  {form[k]&&<span style={{color:"#fff",fontSize:9}}>✓</span>}
                </div>{l}
              </label>
            ))}
          </div>
          {/* Farmer match preview */}
          <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:14,padding:"12px 16px",marginBottom:18,border:"1px solid rgba(45,107,48,.15)"}}>
            <span style={{fontSize:12,fontWeight:700,color:gm}}>🤖 AI Match Preview: </span>
            <span style={{fontSize:12,color:"#374151"}}><strong style={{color:gm}}>{match} verified farmers</strong> in {form.state} grow {form.crop}. Avg. rate today: <strong>₹{aiPrice}/kg</strong>. Expected bids within <strong>24 hours</strong>.</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
            <button onClick={()=>setStep(1)} style={ghBtn()}>← Back</button>
            <div style={{display:"flex",gap:8}}>
              <button style={ghBtn({fontSize:12})}>💾 Save Draft</button>
              <button onClick={()=>setDone(true)} disabled={!form.qty} style={{...gBtn({opacity:form.qty?1:.5})}}>🚀 Float Tender Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   BID REVIEW MODAL (industry side — review farmer bids)
═══════════════════════════════════════════════════════ */
function BidReviewModal({tender,onClose,onAct}){
  const [bids,setBids]=useState(tender.bids||[]);
  const [awarded,setAwarded]=useState(null);

  const act=(id,status)=>{
    if(status==="awarded") setAwarded(id);
    setBids(p=>p.map(b=>b.id===id?{...b,status}:b));
    onAct&&onAct(tender.id,id,status);
  };

  if(awarded) return(
    <div style={{textAlign:"center",padding:"22px 0"}} className="fu">
      <div style={{fontSize:56,marginBottom:14}}>🏆</div>
      <div style={PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>Contract Awarded!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.8,marginBottom:22}}>
        You've awarded the <strong>{tender.title}</strong> contract.<br/>
        The farmer has been notified. Delivery contract will be generated.
      </div>
      <button onClick={onClose} style={gBtn({padding:"11px 36px"})}>Done</button>
    </div>
  );

  return(
    <>
      <div style={PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:4})}>Bids for: {tender.title}</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>{bids.length} applications received · Compare and award</div>
      {bids.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#9ca3af",fontSize:13}}>No bids yet. Farmers are being notified.</div>}
      {bids.map(b=>(
        <div key={b.id} style={{border:`1.5px solid ${b.status==="awarded"?"rgba(45,107,48,.3)":b.status==="shortlisted"?"rgba(29,78,216,.2)":b.status==="rejected"?"rgba(0,0,0,.06)":"rgba(30,42,74,.08)"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,background:b.status==="awarded"?"#f0f7f0":b.status==="rejected"?"#fafafa":"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{b.fe}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{b.farmer}</span>
                {b.verified&&<span style={{fontSize:10,color:gm}}>✅</span>}
                <Badge color={b.status==="new"?"amber":b.status==="shortlisted"?"blue":b.status==="awarded"?"green":"gray"}>{b.status.toUpperCase()}</Badge>
                {b.docs&&<Badge color="teal" size="xs">📄 Docs</Badge>}
              </div>
              <div style={{fontSize:11,color:"#9ca3af"}}>⭐{b.rating} · 📍{b.loc} · Trust: {b.score}/100</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={PF({fontSize:18,fontWeight:800,color:gd})}>₹{b.offer}/kg</div>
              <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>for {b.qty}</div>
            </div>
          </div>
          {/* Trust bar */}
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3}}>
              <span style={{color:"#9ca3af"}}>Trust Score</span>
              <span style={{fontWeight:700,color:b.score>80?gm:"#d97706"}}>{b.score}/100</span>
            </div>
            <div style={{height:4,background:"#f0f0f0",borderRadius:100}}>
              <div style={{height:"100%",width:`${b.score}%`,background:b.score>80?`linear-gradient(90deg,${ac},${gd})`:"linear-gradient(90deg,#fde68a,#d97706)",borderRadius:100}}/>
            </div>
          </div>
          <div style={{fontSize:12,color:"#374151",background:"#f9fdf9",padding:"7px 10px",borderRadius:8,marginBottom:10,lineHeight:1.5}}>"{b.note}"</div>
          {(b.status==="new"||b.status==="shortlisted")&&!awarded&&(
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>act(b.id,"rejected")} style={{...ghBtn({flex:1,padding:"7px 0",fontSize:11}),color:"#991b1b",background:"#fee2e2",border:"none"}}>✕ Reject</button>
              {b.status==="new"&&<button onClick={()=>act(b.id,"shortlisted")} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>⭐ Shortlist</button>}
              <button onClick={()=>act(b.id,"awarded")} style={gBtn({flex:2,padding:"7px 0",fontSize:11})}>🏆 Award Contract</button>
            </div>
          )}
          {b.status==="awarded"&&<div style={{fontSize:11,fontWeight:700,color:gm,textAlign:"center",padding:"6px 0"}}>🏆 Contract Awarded</div>}
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR — FARMER
═══════════════════════════════════════════════════════ */
const FARMER_NAV=[
  {id:"browse",icon:"🔍",label:"Browse Tenders"},
  {id:"myapps",icon:"📤",label:"My Applications",badge:3},
  {id:"invited",icon:"✉️",label:"Invited",badge:2,ac:true},
  {id:"saved",icon:"🔖",label:"Saved Tenders"},
  {id:"history",icon:"📅",label:"History"},
];

function FarmerSidebar({page,setPage}){
  return(
    <aside style={{width:214,background:navy,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:50,overflowY:"auto"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌾</div>
        <div>
          <div style={PF({fontSize:16,fontWeight:700,color:"#fff"})}>GrainOS</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:.8}}>Farmer Portal</div>
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
        <div style={{width:38,height:38,borderRadius:11,background:`linear-gradient(135deg,${gm},#4caf50)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨‍🌾</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Ramesh Patil</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>✅ eKYC · Nashik, MH</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 10px",position:"relative",zIndex:1}}>
        <div style={{fontSize:9,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.2)",padding:"8px 8px 4px",fontWeight:600}}>Tenders</div>
        {FARMER_NAV.map(({id,icon,label,badge,ac:acBadge})=>{
          const a=page===id;
          return(
            <div key={id} onClick={()=>setPage(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:11,marginBottom:2,fontSize:12,fontWeight:a?600:500,color:a?"#fff":"rgba(255,255,255,.4)",background:a?"rgba(255,255,255,.09)":"transparent",cursor:"pointer",transition:"all .15s",borderLeft:`3px solid ${a?ac:"transparent"}`,paddingLeft:a?"11px":"14px"}} onMouseEnter={e=>{if(!a)e.currentTarget.style.background="rgba(255,255,255,.04)"}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:15}}>{icon}</span>
              <span style={{flex:1}}>{label}</span>
              {badge&&<span style={{background:acBadge?`rgba(163,196,92,.3)`:"rgba(255,255,255,.12)",color:acBadge?ac:"#fff",borderRadius:100,padding:"1px 7px",fontSize:9,fontWeight:700}}>{badge}</span>}
            </div>
          );
        })}
      </nav>
      <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:13,padding:13,border:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontSize:10,fontWeight:700,color:ac,marginBottom:4}}>💡 Today's Tip</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)",lineHeight:1.5}}>Tenders with farm visit requests pay 12% more on average.</div>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR — INDUSTRY
═══════════════════════════════════════════════════════ */
const INDUSTRY_NAV=[
  {id:"mytenders",icon:"📋",label:"My Tenders",badge:4},
  {id:"floattender",icon:"➕",label:"Float New Tender"},
  {id:"bidsreview",icon:"🤝",label:"Bids to Review",badge:6,red:true},
  {id:"contracts",icon:"📄",label:"Contracts",badge:2},
  {id:"analytics",icon:"📊",label:"Analytics"},
];

function IndustrySidebar({page,setPage}){
  return(
    <aside style={{width:214,background:"#1a1a2e",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:50,overflowY:"auto"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌾</div>
        <div>
          <div style={PF({fontSize:16,fontWeight:700,color:"#fff"})}>GrainOS</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:.8}}>Industry Portal</div>
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
        <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#3b5998,#667eea)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏭</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Britannia Industries</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>✅ GST Verified</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 10px",position:"relative",zIndex:1}}>
        <div style={{fontSize:9,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.2)",padding:"8px 8px 4px",fontWeight:600}}>Tenders</div>
        {INDUSTRY_NAV.map(({id,icon,label,badge,red})=>{
          const a=page===id;
          return(
            <div key={id} onClick={()=>setPage(id==="floattender"?"floattender":id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:11,marginBottom:2,fontSize:12,fontWeight:a?600:500,color:a?"#fff":"rgba(255,255,255,.4)",background:a?"rgba(255,255,255,.09)":"transparent",cursor:"pointer",transition:"all .15s",borderLeft:`3px solid ${a?ac:"transparent"}`,paddingLeft:a?"11px":"14px"}} onMouseEnter={e=>{if(!a)e.currentTarget.style.background="rgba(255,255,255,.04)"}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:15}}>{icon}</span>
              <span style={{flex:1}}>{label}</span>
              {badge&&<span style={{background:red?"#e53e3e":"rgba(255,255,255,.12)",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:9,fontWeight:700,animation:red?"pulseRed 2s infinite":""}}>{badge}</span>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════
   FARMER PAGE: BROWSE TENDERS
═══════════════════════════════════════════════════════ */
function FarmerBrowse({tenders,setTenders}){
  const [search,setSearch]=useState("");
  const [cropFilter,setCropFilter]=useState("All");
  const [sort,setSort]=useState("Best Match");
  const [applying,setApplying]=useState(null);
  const [viewDetail,setViewDetail]=useState(null);
  const [expanded,setExpanded]=useState(null);
  const crops=["All",...new Set(tenders.map(t=>t.crop))];

  let filtered=tenders.filter(t=>{
    if(cropFilter!=="All"&&t.crop!==cropFilter)return false;
    if(search&&!t.title.toLowerCase().includes(search.toLowerCase())&&!t.company.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  if(sort==="Best Match")filtered=[...filtered].sort((a,b)=>b.match-a.match);
  if(sort==="Highest Pay")filtered=[...filtered].sort((a,b)=>b.budgetMax-a.budgetMax);
  if(sort==="Deadline First")filtered=[...filtered].sort((a,b)=>a.daysLeft-b.daysLeft);
  if(sort==="Most Applied")filtered=[...filtered].sort((a,b)=>b.applied-a.applied);

  const doApply=(id,appData)=>{
    setTenders(p=>p.map(t=>t.id===id?{...t,applied:t.applied+1,myApplication:{...appData,status:"submitted"}}:t));
  };

  const tagColor=tag=>tag==="Best Match"||tag==="High Pay"?"amber":tag==="Export"?"purple":tag==="New"?"blue":tag==="Organic Premium"?"teal":"green";

  return(
    <>
      <Topbar title="Browse Tenders 📑" sub={`${filtered.length} open tenders · AI-matched to your produce`} actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search crop, company…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:190}}/>
          {search&&<button onClick={()=>setSearch("")} style={{border:"none",background:"none",cursor:"pointer",color:"#9ca3af",fontSize:11}}>✕</button>}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 12px",borderRadius:11,border:"1px solid #e5e7eb",fontSize:12,background:"#fff",outline:"none",cursor:"pointer"}}>
          {["Best Match","Highest Pay","Deadline First","Most Applied"].map(o=><option key={o}>{o}</option>)}
        </select>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {/* Crop filter pills */}
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {crops.map(c=>(
            <button key={c} onClick={()=>setCropFilter(c)} style={{padding:"6px 16px",borderRadius:100,border:`1.5px solid ${cropFilter===c?gm:"#e5e7eb"}`,background:cropFilter===c?"#f0f7f0":"#fff",color:cropFilter===c?gm:"#374151",fontSize:11,fontWeight:cropFilter===c?700:500,cursor:"pointer",transition:"all .12s"}}>{c}</button>
          ))}
        </div>
        {filtered.length===0&&<div style={{...card({textAlign:"center",padding:"48px",color:"#9ca3af"})}}>No tenders match your search.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(t=>{
            const isExp=expanded===t.id;
            const applied=!!t.myApplication;
            return(
              <div key={t.id} style={{...card({padding:0,overflow:"hidden",transition:"all .2s",border:applied?"1.5px solid rgba(45,107,48,.2)":"1px solid rgba(30,70,20,.07)",borderLeft:t.invited?`4px solid ${ac}`:"1px solid rgba(30,70,20,.07)"})}}>
                <div style={{padding:"17px 20px",cursor:"pointer"}} onClick={()=>setExpanded(isExp?null:t.id)}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#f0f4f8,#e2e8f0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{t.companyE}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={PF({fontSize:14,fontWeight:700,color:"#1a1f36"})}>{t.title}</span>
                        {t.tag&&<Badge color={tagColor(t.tag)}>{t.tag}</Badge>}
                        {t.urgent&&<Badge color="red" size="xs">⚡ Urgent</Badge>}
                        {t.invited&&<Badge color="teal" size="xs">✉️ Invited</Badge>}
                        {applied&&<Badge color="green" size="xs">✅ Applied</Badge>}
                      </div>
                      <div style={{fontSize:11,color:"#9ca3af",marginBottom:6}}>🏭 {t.company} · 📦 {t.qty} · 🔄 {t.freq} · ⏰ {t.daysLeft} days left</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <Badge color="green" size="xs">{t.grade}</Badge>
                        <Badge color="blue" size="xs">{t.cert==="None"?"No cert needed":t.cert}</Badge>
                        <Badge color="gray" size="xs">📍 {t.state}</Badge>
                        <Badge color="amber" size="xs">👨‍🌾 {t.applied} applied</Badge>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={PF({fontSize:20,fontWeight:800,color:gd})}>{t.budget}<span style={{fontSize:11,fontWeight:400}}>/kg</span></div>
                      {t.match&&<div style={{marginTop:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
                          <div style={{height:4,width:46,background:"#f0f0f0",borderRadius:100}}>
                            <div style={{height:"100%",width:`${t.match}%`,background:t.match>85?`linear-gradient(90deg,${ac},${gd})`:"linear-gradient(90deg,#fde68a,#d97706)",borderRadius:100}}/>
                          </div>
                          <span style={{fontSize:10,fontWeight:700,color:t.match>85?gm:"#d97706"}}>{t.match}%</span>
                        </div>
                        <div style={{fontSize:8,color:"#9ca3af",marginTop:1,textAlign:"right"}}>AI match</div>
                      </div>}
                    </div>
                  </div>
                </div>
                {/* Expanded */}
                {isExp&&(
                  <div style={{borderTop:"1px solid #f0f0f0",padding:"16px 20px",background:"#fafdf9"}} className="fi">
                    <div style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:14}}>{t.desc}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                      {[{i:"💰",l:"Budget",v:t.budget+"/kg"},{i:"🔄",l:"Frequency",v:t.freq},{i:"🏅",l:"Cert",v:t.cert},{i:"📅",l:"Posted",v:t.postedOn}].map(({i,l,v})=>(
                        <div key={l} style={{background:"#fff",borderRadius:11,padding:"9px 10px",textAlign:"center",border:"1px solid #f0f0f0"}}>
                          <div style={{fontSize:16,marginBottom:3}}>{i}</div>
                          <div style={{fontSize:9,color:"#9ca3af",marginBottom:1}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,color:"#1a2e1a"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{setViewDetail(t);setExpanded(null);}} style={ghBtn({flex:1,padding:"9px 0",fontSize:12})}>📋 Full Details</button>
                      <button onClick={()=>!applied&&setApplying(t)} style={{...gBtn({flex:2,padding:"9px 0",fontSize:12}),background:applied?`linear-gradient(135deg,${ac},${gm})`:""}}>
                        {applied?"✅ Applied — View Application":"Apply for This Tender →"}
                      </button>
                    </div>
                  </div>
                )}
                {/* Collapsed footer */}
                {!isExp&&(
                  <div style={{borderTop:"1px solid #f5f5f5",padding:"9px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafafa"}}>
                    <span style={{fontSize:11,color:"#9ca3af"}}>⏰ Closes {t.deadline} · {t.applied} applications</span>
                    <button onClick={e=>{e.stopPropagation();!applied?setApplying(t):setViewDetail(t);}} style={{...gBtn({padding:"6px 18px",fontSize:11}),background:applied?`linear-gradient(135deg,${ac},${gm})`:""}}>
                      {applied?"✅ View Application":"Apply Now →"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {applying&&<Modal onClose={()=>setApplying(null)} w={560}><ApplyModal tender={applying} onClose={()=>setApplying(null)} onApplied={(id,data)=>doApply(id,data)}/></Modal>}
      {viewDetail&&<Modal onClose={()=>setViewDetail(null)} w={580}><TenderDetailModal tender={viewDetail} onClose={()=>setViewDetail(null)} onApply={t=>setApplying(t)} applied={!!viewDetail.myApplication}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   FARMER PAGE: MY APPLICATIONS
═══════════════════════════════════════════════════════ */
function FarmerMyApps({tenders}){
  const [detail,setDetail]=useState(null);
  const [tab,setTab]=useState("all");
  const apps=tenders.filter(t=>t.myApplication);
  const filtered=tab==="all"?apps:apps.filter(t=>t.myApplication.status===tab);
  const statusColor={submitted:"amber",shortlisted:"blue",awarded:"green",rejected:"gray"};

  return(
    <>
      <Topbar title="My Applications 📤" sub={`${apps.length} applications submitted`}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {["all","submitted","shortlisted","awarded","rejected"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:10,border:"1px solid",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?navy:"#fff",color:tab===t?"#fff":"#374151",borderColor:tab===t?"transparent":"#e5e7eb",textTransform:"capitalize",transition:"all .12s"}}>
              {t}{t==="all"&&` (${apps.length})`}
            </button>
          ))}
        </div>
        {filtered.length===0&&<div style={{...card({textAlign:"center",padding:"40px",color:"#9ca3af",fontSize:13})}}>No {tab} applications.</div>}
        <div style={card({padding:0,overflow:"hidden"})}>
          {filtered.map((t,i)=>(
            <div key={t.id} style={{padding:"16px 20px",borderBottom:i<filtered.length-1?"1px solid #f5f5f5":"none",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>setDetail(t)}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:46,height:46,borderRadius:13,background:"linear-gradient(135deg,#f0f4f8,#e2e8f0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{t.companyE}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{t.title}</span>
                    <Badge color={statusColor[t.myApplication.status]||"gray"}>{t.myApplication.status.toUpperCase()}</Badge>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>🏭 {t.company} · 🕐 {t.myApplication.time} · 📦 {t.myApplication.qty}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={PF({fontSize:17,fontWeight:700,color:gd})}>₹{t.myApplication.offer}/kg</div>
                  <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>Your offer</div>
                </div>
              </div>
              {/* Application note preview */}
              {t.myApplication.note&&<div style={{fontSize:11,color:"#6b7280",marginTop:8,padding:"6px 10px",background:"#f9fdf9",borderRadius:8,lineHeight:1.5}}>"{t.myApplication.note}"</div>}
              {/* Status row */}
              <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
                {t.myApplication.status==="shortlisted"&&<div style={{fontSize:11,color:"#1d4ed8",fontWeight:600,padding:"4px 10px",background:"#eff6ff",borderRadius:7}}>⭐ You're shortlisted! Buyer may contact you.</div>}
                {t.myApplication.status==="awarded"&&<div style={{fontSize:11,color:gm,fontWeight:600,padding:"4px 10px",background:"#f0f7f0",borderRadius:7}}>🏆 Contract awarded! Check messages.</div>}
                {t.myApplication.status==="rejected"&&<div style={{fontSize:11,color:"#6b7280",padding:"4px 10px",background:"#f5f5f5",borderRadius:7}}>Buyer selected another farmer this time.</div>}
              </div>
            </div>
          ))}
        </div>
        {apps.length===0&&(
          <div style={{...card({textAlign:"center",padding:"56px 40px",marginTop:16})}}>
            <div style={{fontSize:52,marginBottom:14}}>📤</div>
            <div style={PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>No applications yet</div>
            <div style={{fontSize:13,color:"#6b7280"}}>Browse open tenders and start applying</div>
          </div>
        )}
      </div>
      {detail&&<Modal onClose={()=>setDetail(null)} w={500}><MyApplicationModal tender={detail} onClose={()=>setDetail(null)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   FARMER PAGE: INVITED
═══════════════════════════════════════════════════════ */
function FarmerInvited({tenders,setTenders}){
  const [applying,setApplying]=useState(null);
  const invited=tenders.filter(t=>t.invited);
  const doApply=(id,data)=>setTenders(p=>p.map(t=>t.id===id?{...t,applied:t.applied+1,myApplication:{...data,status:"submitted"}}:t));

  return(
    <>
      <Topbar title="Invited Tenders ✉️" sub="Buyers personally invited you to these tenders"/>
      <div style={{padding:"22px 28px"}} className="fu">
        {invited.length===0&&<div style={{...card({textAlign:"center",padding:"56px 40px"})}}>
          <div style={{fontSize:52,marginBottom:14}}>✉️</div>
          <div style={PF({fontSize:18,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>No invitations yet</div>
          <div style={{fontSize:13,color:"#6b7280"}}>Keep improving your trust score to get direct invitations</div>
        </div>}
        {invited.map(t=>(
          <div key={t.id} style={{...card({marginBottom:14,padding:0,overflow:"hidden",border:`2px solid rgba(163,196,92,.3)`})}}>
            <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",padding:"12px 18px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid rgba(163,196,92,.15)"}}>
              <span style={{fontSize:16}}>✉️</span>
              <span style={{fontSize:12,fontWeight:700,color:gm}}>{t.company} personally invited you to this tender</span>
              {t.match&&<span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:gm}}>{t.match}% AI match</span>}
            </div>
            <div style={{padding:"16px 18px"}}>
              <div style={PF({fontSize:15,fontWeight:700,color:"#1a1f36",marginBottom:6})}>{t.title}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>📦 {t.qty} · {t.budget}/kg · ⏰ {t.daysLeft} days left · 🔄 {t.freq}</div>
              <div style={{fontSize:12,color:"#374151",lineHeight:1.6,marginBottom:14}}>{t.desc}</div>
              <div style={{display:"flex",gap:10}}>
                {t.myApplication
                  ?<div style={{flex:1,padding:"9px",borderRadius:11,background:"#f0f7f0",textAlign:"center",fontSize:12,fontWeight:700,color:gm}}>✅ Applied · ₹{t.myApplication.offer}/kg</div>
                  :<button onClick={()=>setApplying(t)} style={gBtn({flex:1,padding:"9px 0",fontSize:12})}>Apply Now →</button>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      {applying&&<Modal onClose={()=>setApplying(null)} w={560}><ApplyModal tender={applying} onClose={()=>setApplying(null)} onApplied={(id,data)=>doApply(id,data)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   FARMER PAGE: SAVED
═══════════════════════════════════════════════════════ */
function FarmerSaved({tenders,setTenders}){
  const [saved,setSaved]=useState([3,5]);
  const [applying,setApplying]=useState(null);
  const savedT=tenders.filter(t=>saved.includes(t.id));
  const unsave=id=>setSaved(p=>p.filter(x=>x!==id));
  const doApply=(id,data)=>setTenders(p=>p.map(t=>t.id===id?{...t,applied:t.applied+1,myApplication:{...data,status:"submitted"}}:t));

  return(
    <>
      <Topbar title="Saved Tenders 🔖" sub={`${savedT.length} tenders saved`}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {savedT.length===0&&<div style={{...card({textAlign:"center",padding:"56px 40px"})}}>
          <div style={{fontSize:52,marginBottom:14}}>🔖</div>
          <div style={PF({fontSize:18,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>No saved tenders</div>
          <div style={{fontSize:13,color:"#6b7280"}}>Bookmark tenders you want to apply to later</div>
        </div>}
        {savedT.map(t=>(
          <div key={t.id} style={{...card({marginBottom:12,padding:"16px 18px"})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div style={PF({fontSize:14,fontWeight:700,color:"#1a1f36"})}>{t.title}</div>
              <button onClick={()=>unsave(t.id)} style={{fontSize:16,cursor:"pointer",border:"none",background:"none",color:"#9ca3af"}}>🔖</button>
            </div>
            <div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>🏭 {t.company} · {t.budget}/kg · ⏰ {t.daysLeft} days left</div>
            <div style={{display:"flex",gap:8}}>
              {t.myApplication
                ?<div style={{flex:1,padding:"7px",borderRadius:10,background:"#f0f7f0",textAlign:"center",fontSize:11,fontWeight:700,color:gm}}>✅ Applied</div>
                :<button onClick={()=>setApplying(t)} style={gBtn({flex:1,padding:"7px 0",fontSize:11})}>Apply Now →</button>
              }
            </div>
          </div>
        ))}
      </div>
      {applying&&<Modal onClose={()=>setApplying(null)} w={560}><ApplyModal tender={applying} onClose={()=>setApplying(null)} onApplied={(id,data)=>doApply(id,data)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   FARMER PAGE: HISTORY
═══════════════════════════════════════════════════════ */
function FarmerHistory(){
  const history=[
    {id:1,title:"Wheat Supply Q3 2025",company:"Britannia",companyE:"🏭",offer:"₹27/kg",qty:"30 ton",status:"completed",date:"Nov 2025",earned:"₹81,000"},
    {id:2,title:"Chip Potato — Nov Batch",company:"PepsiCo",companyE:"🏭",offer:"₹23/kg",qty:"20 ton",status:"completed",date:"Oct 2025",earned:"₹46,000"},
    {id:3,title:"Red Chilli Export Dubai",company:"NatureFresh",companyE:"🌿",offer:"₹86/kg",qty:"5 ton",status:"completed",date:"Sep 2025",earned:"₹43,000"},
    {id:4,title:"Onion Q2 2025",company:"BigBasket",companyE:"🛒",offer:"₹14/kg",qty:"50 ton",status:"rejected",date:"Aug 2025",earned:"—"},
  ];

  return(
    <>
      <Topbar title="Application History 📅" sub="Past tenders and outcomes"/>
      <div style={{padding:"22px 28px"}} className="fu">
        {/* Summary */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
          {[{i:"✅",l:"Contracts Won",v:"3"},{i:"💰",l:"Total Earned",v:"₹1.7L"},{i:"📤",l:"Total Applied",v:"12"}].map(({i,l,v})=>(
            <div key={l} style={card({padding:18,textAlign:"center"})}>
              <div style={{fontSize:26,marginBottom:8}}>{i}</div>
              <div style={PF({fontSize:24,fontWeight:700,color:"#1a1f36"})}>{v}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={card({padding:0,overflow:"hidden"})}>
          {history.map((h,i)=>(
            <div key={h.id} style={{padding:"14px 18px",borderBottom:i<history.length-1?"1px solid #f5f5f5":"none",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#f0f4f8,#e2e8f0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{h.companyE}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{h.title}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>🏭 {h.company} · {h.offer} · {h.qty} · {h.date}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,fontWeight:700,color:h.status==="completed"?gm:"#9ca3af"}}>{h.earned}</div>
                <Badge color={h.status==="completed"?"green":"gray"} size="xs">{h.status.toUpperCase()}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   INDUSTRY PAGE: MY TENDERS
═══════════════════════════════════════════════════════ */
function IndustryMyTenders({tenders,setTenders,setPage,setFloatOpen}){
  const [tab,setTab]=useState("active");
  const [bidModal,setBidModal]=useState(null);
  const filtered=tab==="all"?tenders:tenders.filter(t=>t.status===tab);
  const publish=id=>setTenders(p=>p.map(t=>t.id===id?{...t,status:"active"}:t));
  const close=id=>setTenders(p=>p.map(t=>t.id===id?{...t,status:"closed"}:t));

  return(
    <>
      <Topbar title="My Tenders 📋" sub="All tenders you've floated" actions={<>
        <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:10,padding:3}}>
          {["all","active","draft","closed"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 13px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize",transition:"all .12s"}}>{t}</button>
          ))}
        </div>
        <button onClick={()=>setFloatOpen(true)} style={gBtn({padding:"8px 16px",fontSize:12})}>+ Float New Tender</button>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{i:"📋",l:"Active Tenders",v:tenders.filter(t=>t.status==="active").length,c:gm},{i:"🤝",l:"Total Bids",v:tenders.reduce((a,t)=>a+t.bids.length,0),c:navy},{i:"⭐",l:"Shortlisted",v:tenders.reduce((a,t)=>a+t.bids.filter(b=>b.status==="shortlisted").length,0),c:"#7e22ce"},{i:"🏆",l:"Contracts Awarded",v:tenders.reduce((a,t)=>a+t.bids.filter(b=>b.status==="awarded").length,0),c:"#d97706"}].map(({i,l,v,c})=>(
            <div key={l} style={{...card({position:"relative",overflow:"hidden",padding:18})}}>
              <div style={{position:"absolute",top:-20,right:-20,width:70,height:70,borderRadius:"50%",background:c,opacity:.07}}/>
              <div style={{fontSize:22,marginBottom:8}}>{i}</div>
              <div style={PF({fontSize:26,fontWeight:700,color:"#1a1f36"})}>{v}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={card({padding:0,overflow:"hidden"})}>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"32px",color:"#9ca3af",fontSize:13}}>No {tab} tenders.</div>}
          {filtered.map(t=>(
            <div key={t.id} style={{padding:"17px 20px",borderBottom:"1px solid #f5f5f5",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#fafdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={PF({fontSize:14,fontWeight:700,color:"#1a1f36"})}>{t.title}</span>
                    <Badge color={t.status==="active"?"green":t.status==="draft"?"gray":"red"}>{t.status.toUpperCase()}</Badge>
                    {t.daysLeft<=5&&t.status==="active"&&<Badge color="red" size="xs">⚡ Closes in {t.daysLeft}d</Badge>}
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>📦 {t.qty} · {t.budget}/kg · ⏰ {t.deadline} · 👁️ {t.views} views</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"flex-end"}}>
                    <span style={{fontSize:11,color:"#374151",fontWeight:600}}>👨‍🌾 {t.bids.length} bids</span>
                    {t.bids.filter(b=>b.status==="new").length>0&&<span style={{fontSize:10,fontWeight:700,color:"#ef4444",padding:"2px 7px",background:"#fee2e2",borderRadius:100}}>{t.bids.filter(b=>b.status==="new").length} new</span>}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {t.status==="draft"&&<button onClick={()=>publish(t.id)} style={gBtn({padding:"7px 14px",fontSize:11})}>▶ Publish</button>}
                {t.status==="active"&&<button onClick={()=>close(t.id)} style={{...ghBtn({padding:"7px 14px",fontSize:11}),color:"#ef4444"}}>Close</button>}
                {t.status==="closed"&&<button onClick={()=>setTenders(p=>p.map(x=>x.id===t.id?{...x,status:"active"}:x))} style={ghBtn({padding:"7px 14px",fontSize:11})}>Reopen</button>}
                <button onClick={()=>setBidModal(t)} style={navyBtn({padding:"7px 14px",fontSize:11})}>📋 Review {t.bids.length} Bids {t.bids.filter(b=>b.status==="new").length>0&&`(${t.bids.filter(b=>b.status==="new").length} new)`}</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>setFloatOpen(true)} style={{width:"100%",marginTop:12,padding:"10px",borderRadius:12,border:`2px dashed #c5d9b8`,background:"transparent",color:gm,fontWeight:600,fontSize:12,cursor:"pointer"}}>+ Float Another Tender</button>
      </div>
      {bidModal&&<Modal onClose={()=>setBidModal(null)} w={600}><BidReviewModal tender={bidModal} onClose={()=>setBidModal(null)} onAct={(tid,bid,status)=>setTenders(p=>p.map(t=>t.id===tid?{...t,bids:t.bids.map(b=>b.id===bid?{...b,status}:b)}:t))}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   INDUSTRY PAGE: BIDS TO REVIEW
═══════════════════════════════════════════════════════ */
function IndustryBidsReview({tenders,setTenders}){
  const [tab,setTab]=useState("new");
  const [bidModal,setBidModal]=useState(null);
  const [search,setSearch]=useState("");
  const allBids=tenders.flatMap(t=>t.bids.map(b=>({...b,tender:t})));
  const filtered=(tab==="all"?allBids:allBids.filter(b=>b.status===tab)).filter(b=>b.farmer.toLowerCase().includes(search.toLowerCase())||b.tender.title.toLowerCase().includes(search.toLowerCase()));
  const statusColor={new:"amber",shortlisted:"blue",awarded:"green",rejected:"gray"};

  const act=(tid,bid,status)=>setTenders(p=>p.map(t=>t.id===tid?{...t,bids:t.bids.map(b=>b.id===bid?{...b,status}:b)}:t));

  return(
    <>
      <Topbar title="Bids to Review 🤝" sub="All farmer applications across your tenders" actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search farmer, tender…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:190}}/>
        </div>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {["new","shortlisted","awarded","rejected","all"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:10,border:"1px solid",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?navy:"#fff",color:tab===t?"#fff":"#374151",borderColor:tab===t?"transparent":"#e5e7eb",textTransform:"capitalize",transition:"all .12s"}}>
              {t}{t==="new"&&` (${allBids.filter(b=>b.status==="new").length})`}
              {t==="all"&&` (${allBids.length})`}
            </button>
          ))}
        </div>
        {filtered.length===0&&<div style={card({textAlign:"center",padding:"40px",color:"#9ca3af",fontSize:13})}>No {tab} bids.</div>}
        <div style={card({padding:0,overflow:"hidden"})}>
          {filtered.map((b,i)=>(
            <div key={b.id} style={{padding:"16px 20px",borderBottom:i<filtered.length-1?"1px solid #f5f5f5":"none",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
                <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{b.fe}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{b.farmer}</span>
                    {b.verified&&<span style={{fontSize:10,color:gm}}>✅</span>}
                    <Badge color={statusColor[b.status]||"gray"}>{b.status.toUpperCase()}</Badge>
                    {b.docs&&<Badge color="teal" size="xs">📄 Docs</Badge>}
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>📋 {b.tender.title} · ⭐{b.rating} · 📍{b.loc} · 🕐{b.time}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={PF({fontSize:18,fontWeight:800,color:gd})}>₹{b.offer}/kg</div>
                  <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>for {b.qty}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#374151",background:"#f9fdf9",padding:"7px 10px",borderRadius:8,marginBottom:10,lineHeight:1.5}}>"{b.note}"</div>
              {(b.status==="new"||b.status==="shortlisted")&&(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>act(b.tender.id,b.id,"rejected")} style={{...ghBtn({flex:1,padding:"7px 0",fontSize:11}),color:"#991b1b",background:"#fee2e2",border:"none"}}>✕ Reject</button>
                  {b.status==="new"&&<button onClick={()=>act(b.tender.id,b.id,"shortlisted")} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>⭐ Shortlist</button>}
                  <button onClick={()=>act(b.tender.id,b.id,"awarded")} style={gBtn({flex:2,padding:"7px 0",fontSize:11})}>🏆 Award Contract</button>
                </div>
              )}
              {b.status==="awarded"&&<div style={{padding:"7px",borderRadius:8,background:"#f0f7f0",textAlign:"center",fontSize:11,fontWeight:700,color:gm}}>🏆 Contract Awarded</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   INDUSTRY PAGE: CONTRACTS
═══════════════════════════════════════════════════════ */
function IndustryContracts({tenders}){
  const awarded=tenders.flatMap(t=>t.bids.filter(b=>b.status==="awarded").map(b=>({...b,tender:t})));

  return(
    <>
      <Topbar title="Contracts 📄" sub="Awarded contracts and delivery tracking"/>
      <div style={{padding:"22px 28px"}} className="fu">
        {awarded.length===0&&<div style={{...card({textAlign:"center",padding:"56px 40px"})}}>
          <div style={{fontSize:52,marginBottom:14}}>📄</div>
          <div style={PF({fontSize:18,fontWeight:700,color:"#1a2e1a",marginBottom:8})}>No contracts yet</div>
          <div style={{fontSize:13,color:"#6b7280"}}>Award bids to generate contracts</div>
        </div>}
        <div style={card({padding:0,overflow:"hidden"})}>
          {awarded.map((c,i)=>(
            <div key={c.id} style={{padding:"16px 20px",borderBottom:i<awarded.length-1?"1px solid #f5f5f5":"none",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.fe}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{c.farmer}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>📋 {c.tender.title} · 📦 {c.qty} · ₹{c.offer}/kg</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Badge color="green">🏆 Awarded</Badge>
                <button style={ghBtn({padding:"6px 12px",fontSize:11})}>📄 View Contract</button>
                <button style={gBtn({padding:"6px 12px",fontSize:11})}>💬 Message</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   INDUSTRY PAGE: ANALYTICS
═══════════════════════════════════════════════════════ */
function IndustryAnalytics({tenders}){
  const months=["Sep","Oct","Nov","Dec","Jan","Feb"];
  const spend=[420,580,490,920,760,1080];
  const mx=Math.max(...spend);

  return(
    <>
      <Topbar title="Analytics 📊" sub="Tender performance and procurement insights"/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{i:"📋",l:"Total Tenders",v:tenders.length},{i:"🤝",l:"Total Bids",v:tenders.reduce((a,t)=>a+t.bids.length,0)},{i:"🏆",l:"Contracts",v:tenders.reduce((a,t)=>a+t.bids.filter(b=>b.status==="awarded").length,0)},{i:"💰",l:"Avg Bid Rate",v:"₹26.8"}].map(({i,l,v})=>(
            <div key={l} style={card({padding:18})}><div style={{fontSize:22,marginBottom:8}}>{i}</div><div style={PF({fontSize:26,fontWeight:700,color:"#1a1f36"})}>{v}</div><div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div></div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={card({padding:22})}>
            <div style={PF({fontSize:14,fontWeight:600,color:"#1a1f36",marginBottom:16})}>Monthly Spend (₹L)</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:120}}>
              {spend.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:9,fontWeight:700,color:navy}}>₹{(v/100).toFixed(1)}L</div>
                  <div style={{width:"100%",height:`${Math.round(v/mx*100)}%`,borderRadius:"5px 5px 0 0",background:`linear-gradient(180deg,#667eea,${navy})`,minHeight:4,cursor:"pointer",transition:"filter .2s"}} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.25)"} onMouseLeave={e=>e.currentTarget.style.filter=""}/>
                  <div style={{fontSize:9,color:"#9ca3af"}}>{months[i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={card({padding:22})}>
            <div style={PF({fontSize:14,fontWeight:600,color:"#1a1f36",marginBottom:16})}>Tender Performance</div>
            {tenders.slice(0,4).map(t=>(
              <div key={t.id} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                  <span style={{color:"#374151"}}>{t.crop}</span>
                  <span style={{fontWeight:700,color:gd}}>{t.bids.length} bids</span>
                </div>
                <div style={{height:5,background:"#f0f0f0",borderRadius:100}}>
                  <div style={{height:"100%",width:`${Math.min(t.bids.length*15,100)}%`,background:`linear-gradient(90deg,${ac},${gd})`,borderRadius:100}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTAL SWITCHER
═══════════════════════════════════════════════════════ */
function PortalSwitcher({portal,setPortal}){
  return(
    <div style={{position:"fixed",top:14,right:20,zIndex:200,display:"flex",gap:3,background:"rgba(255,255,255,.92)",borderRadius:14,padding:4,border:"1px solid rgba(30,42,74,.1)",backdropFilter:"blur(10px)",boxShadow:"0 4px 20px rgba(0,0,0,.1)"}}>
      {[{id:"farmer",label:"👨‍🌾 Farmer",color:gm},{id:"industry",label:"🏭 Industry",color:navy}].map(({id,label,color})=>(
        <button key={id} onClick={()=>setPortal(id)} style={{padding:"7px 16px",borderRadius:11,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:portal===id?color:"transparent",color:portal===id?"#fff":"#374151",transition:"all .2s"}}>{label}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function TenderSystemApp(){
  const [portal,setPortal]=useState("farmer");
  const [farmerPage,setFarmerPage]=useState("browse");
  const [industryPage,setIndustryPage]=useState("mytenders");
  const [tenders,setTenders]=useState(TENDERS_INIT);
  const [industryTenders,setIndustryTenders]=useState(INDUSTRY_TENDERS_INIT);
  const [floatOpen,setFloatOpen]=useState(false);

  const renderFarmer=()=>{
    switch(farmerPage){
      case "browse":  return <FarmerBrowse tenders={tenders} setTenders={setTenders}/>;
      case "myapps":  return <FarmerMyApps tenders={tenders}/>;
      case "invited": return <FarmerInvited tenders={tenders} setTenders={setTenders}/>;
      case "saved":   return <FarmerSaved tenders={tenders} setTenders={setTenders}/>;
      case "history": return <FarmerHistory/>;
      default: return null;
    }
  };

  const renderIndustry=()=>{
    switch(industryPage){
      case "mytenders":   return <IndustryMyTenders tenders={industryTenders} setTenders={setIndustryTenders} setPage={setIndustryPage} setFloatOpen={setFloatOpen}/>;
      case "floattender": return <IndustryMyTenders tenders={industryTenders} setTenders={setIndustryTenders} setPage={setIndustryPage} setFloatOpen={setFloatOpen}/>;
      case "bidsreview":  return <IndustryBidsReview tenders={industryTenders} setTenders={setIndustryTenders}/>;
      case "contracts":   return <IndustryContracts tenders={industryTenders}/>;
      case "analytics":   return <IndustryAnalytics tenders={industryTenders}/>;
      default: return null;
    }
  };

  return(
    <>
      <style>{CSS}</style>
      <PortalSwitcher portal={portal} setPortal={p=>{setPortal(p);if(p==="farmer")setFarmerPage("browse");else setIndustryPage("mytenders");}}/>
      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <TickerBar/>
        <div style={{display:"flex",flex:1}}>
          {portal==="farmer"
            ?<FarmerSidebar page={farmerPage} setPage={setFarmerPage}/>
            :<IndustrySidebar page={industryPage} setPage={setIndustryPage}/>
          }
          <div style={{marginLeft:214,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",background:"#eef2e8"}}>
            {portal==="farmer"?renderFarmer():renderIndustry()}
          </div>
        </div>
      </div>
      {floatOpen&&<Modal onClose={()=>setFloatOpen(false)} w={580}><FloatTenderModal onClose={()=>setFloatOpen(false)} onDone={form=>{setIndustryTenders(p=>[{id:Date.now(),title:`${form.qty} ${form.unit} ${form.crop} Tender`,crop:form.crop,budget:`₹${form.priceMin||"—"}–${form.priceMax||"—"}`,qty:`${form.qty} ${form.unit}`,deadline:form.deadline||"TBD",daysLeft:14,freq:form.freq,grade:form.grade,state:form.state,cert:form.cert,desc:form.desc,status:"active",bids:[],posted:"Today",views:0},...p]);setIndustryPage("mytenders");}}/></Modal>}
    </>
  );
}
