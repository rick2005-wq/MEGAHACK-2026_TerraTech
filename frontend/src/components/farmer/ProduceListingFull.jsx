import { useState, useRef, useEffect } from "react";

/* ─── GLOBAL CSS ─── */
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
@keyframes slideR{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(45,107,48,.35)}70%{box-shadow:0 0 0 8px rgba(45,107,48,0)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
.fu{animation:fadeUp .25s ease both;}
.fi{animation:fadeIn .2s ease both;}
.spin{animation:spin .7s linear infinite;}
.shimmer{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.2s infinite;}
`;

/* ─── DESIGN TOKENS ─── */
const gd="#1e4620", gm="#2d6b30", ac="#a3c45c", cr="#f6f9f0", navy="#1e2a4a";
const PF = s => ({ fontFamily:"'Playfair Display',serif", ...s });
const card = (x={}) => ({ background:"#fff", borderRadius:20, border:"1px solid rgba(30,70,20,.07)", ...x });
const gBtn = (x={}) => ({ background:`linear-gradient(135deg,${gd},${gm})`, color:"#fff", border:"none", borderRadius:12, padding:"10px 20px", fontWeight:700, cursor:"pointer", fontSize:13, transition:"all .18s", ...x });
const ghBtn = (x={}) => ({ background:"#f0f4ec", color:"#374151", border:"1px solid rgba(30,70,20,.1)", borderRadius:12, padding:"10px 16px", fontWeight:600, cursor:"pointer", fontSize:13, transition:"all .15s", ...x });

/* ─── TICKER DATA ─── */
const TICKER=[
  {n:"Wheat",p:"₹28/kg",c:"+0.8%",up:true},{n:"Potato",p:"₹22/kg",c:"+4.2%",up:true},
  {n:"Onion",p:"₹14/kg",c:"-1.8%",up:false},{n:"Chilli",p:"₹85/kg",c:"+6.4%",up:true},
  {n:"Corn",p:"₹18/kg",c:"+2.1%",up:true},{n:"Tomato",p:"₹32/kg",c:"+12.3%",up:true},
  {n:"Soybean",p:"₹44/kg",c:"+1.2%",up:true},{n:"Rice",p:"₹52/kg",c:"-0.5%",up:false},
];

/* ─── PRODUCE DATA ─── */
const CATEGORIES = ["All","Vegetables","Grains","Spices","Fruits","Pulses","Dairy"];
const GRADES = ["Grade A","Grade B","Any Grade"];
const CROPS_BY_CAT = {
  Vegetables:["Potato","Tomato","Onion","Brinjal","Capsicum","Cabbage","Cauliflower","Spinach","Garlic"],
  Grains:["Wheat","Rice","Corn","Barley","Jowar","Bajra","Ragi"],
  Spices:["Red Chilli","Turmeric","Ginger","Coriander","Cumin","Fennel","Cardamom"],
  Fruits:["Mango","Banana","Pomegranate","Grapes","Papaya","Guava","Watermelon"],
  Pulses:["Soybean","Toor Dal","Moong","Chana","Masoor","Urad"],
  Dairy:["Milk","Ghee","Butter","Paneer","Curd"],
};

const PRODUCE_INIT = [
  {id:1,e:"🥔",name:"Grade A Potatoes",cat:"Vegetables",farmer:"Ramesh Patil",loc:"Nashik, MH",price:22,qty:"800 kg",qtyNum:800,grade:"Grade A",fresh:"3 days ago",geo:true,verified:true,bids:[
    {id:1,buyer:"Britannia Industries",emoji:"🏭",offer:24,qty:"500 kg",time:"2h ago",status:"new",note:"Need for chip production. Can pickup from farm."},
    {id:2,buyer:"PepsiCo India",emoji:"🏭",offer:23,qty:"800 kg",time:"5h ago",status:"new",note:"Bulk order. FSSAI cert needed."},
  ],desc:"Freshly harvested Grade A potatoes. FSSAI certified. No pesticides last 30 days. Daily cold storage available. Available for pickup or we can arrange delivery.",imgs:["🥔","🌱","📦"],cert:["FSSAI"],harvest:"25 Feb 2026",moisture:"< 14%",myListing:true},
  {id:2,e:"🌶️",name:"Red Chilli Teja",cat:"Spices",farmer:"Kavitha Rao",loc:"Kolhapur, MH",price:85,qty:"500 kg",qtyNum:500,grade:"Grade A",fresh:"1 week ago",geo:true,verified:true,bids:[
    {id:3,buyer:"NatureFresh",emoji:"🏭",offer:88,qty:"200 kg",time:"1h ago",status:"new",note:"Export quality required. APEDA cert?"},
  ],desc:"Teja variety, APEDA certified. High capsaicin content (14%). Export quality packaging available. Regular supplier to Dubai market.",imgs:["🌶️","🌿","📦"],cert:["FSSAI","APEDA"],harvest:"20 Feb 2026",moisture:"12%",myListing:false},
  {id:3,e:"🌽",name:"Sweet Corn Hybrid",cat:"Vegetables",farmer:"Sunita Devi",loc:"Pune, MH",price:18,qty:"1.2 ton",qtyNum:1200,grade:"Grade A",fresh:"2 days ago",geo:true,verified:true,bids:[],desc:"Hybrid sweet corn, freshly harvested. Ideal for processing and direct consumption. Consistent weekly supply available.",imgs:["🌽","🌱","🌿"],cert:["FSSAI"],harvest:"26 Feb 2026",moisture:"< 15%",myListing:false},
  {id:4,e:"🧅",name:"Nashik Onion",cat:"Vegetables",farmer:"Ramesh Patil",loc:"Nashik, MH",price:14,qty:"2 ton",qtyNum:2000,grade:"Grade B",fresh:"5 days ago",geo:true,verified:true,bids:[
    {id:4,buyer:"BigBasket",emoji:"🏭",offer:15,qty:"2 ton",time:"3h ago",status:"shortlisted",note:"Regular weekly supply needed."},
  ],desc:"Medium Nashik onion 40–60mm. Stored in cool warehouse. Pickup available anytime. Can also arrange delivery within Maharashtra.",imgs:["🧅","📦","🌿"],cert:["FSSAI"],harvest:"22 Feb 2026",moisture:"< 13%",myListing:true},
  {id:5,e:"🌾",name:"Sharbati Wheat",cat:"Grains",farmer:"Gopal Singh",loc:"Nagpur, MH",price:28,qty:"10 ton",qtyNum:10000,grade:"Grade A",fresh:"2 weeks ago",geo:false,verified:false,bids:[],desc:"Premium Sharbati wheat, protein 12.5%. Suitable for premium flour brands. Bulk quantity available.",imgs:["🌾","📦"],cert:[],harvest:"15 Feb 2026",moisture:"< 14%",myListing:false},
  {id:6,e:"🍅",name:"Hybrid Tomato",cat:"Vegetables",farmer:"Sunita Devi",loc:"Pune, MH",price:32,qty:"600 kg",qtyNum:600,grade:"Grade A",fresh:"1 day ago",geo:true,verified:true,bids:[
    {id:5,buyer:"Haldiram's",emoji:"🏭",offer:34,qty:"400 kg",time:"30m ago",status:"new",note:"Sauce production. Need brix 5.2+"},
    {id:6,buyer:"ITC Foods",emoji:"🏭",offer:33,qty:"600 kg",time:"4h ago",status:"new",note:"Looking for consistent weekly supply."},
  ],desc:"Round hybrid tomato, 60–80mm, Brix 5.2+. Direct from greenhouse. Sorted, graded and packed.",imgs:["🍅","🌿","📦"],cert:["FSSAI"],harvest:"27 Feb 2026",moisture:"< 95%",myListing:false},
  {id:7,e:"🫘",name:"Organic Soybean",cat:"Pulses",farmer:"Arjun Mehta",loc:"Amravati, MH",price:44,qty:"5 ton",qtyNum:5000,grade:"Grade A",fresh:"1 week ago",geo:true,verified:true,bids:[],desc:"Certified organic, non-GMO. Protein 41%. Available Q1 and Q3. Long-term contract welcome.",imgs:["🫘","📦","🌱"],cert:["FSSAI","Organic"],harvest:"21 Feb 2026",moisture:"< 13%",myListing:false},
  {id:8,e:"🧄",name:"Premium Garlic",cat:"Vegetables",farmer:"Lakshmi Bai",loc:"Satara, MH",price:72,qty:"400 kg",qtyNum:400,grade:"Grade A",fresh:"4 days ago",geo:true,verified:true,bids:[
    {id:7,buyer:"MDH Spices",emoji:"🏭",offer:75,qty:"300 kg",time:"1h ago",status:"new",note:"Export grade required. Strong aroma variety."},
  ],desc:"Organic garlic, certified chemical-free. Strong aroma variety. Bulk orders available.",imgs:["🧄","🌿","📦"],cert:["FSSAI","Organic"],harvest:"24 Feb 2026",moisture:"< 10%",myListing:false},
];

/* ─── SHARED ─── */
function Badge({color="green",size="sm",children}){
  const C={green:{bg:"#f0f7f0",fg:"#2d6b30"},amber:{bg:"#fef3c7",fg:"#92400e"},blue:{bg:"#eff6ff",fg:"#1d4ed8"},red:{bg:"#fee2e2",fg:"#991b1b"},gray:{bg:"#f3f4f6",fg:"#6b7280"},purple:{bg:"#f3e8ff",fg:"#7e22ce"},teal:{bg:"#f0fdfa",fg:"#0f766e"}};
  const s=C[color]||C.gray;
  return <span style={{fontSize:size==="xs"?8:9,fontWeight:700,padding:size==="xs"?"2px 6px":"3px 9px",borderRadius:100,background:s.bg,color:s.fg,display:"inline-flex",alignItems:"center",gap:3,whiteSpace:"nowrap"}}>{children}</span>;
}

function Modal({onClose,children,w=560}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:24,padding:28,width:w,maxWidth:"95vw",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.25)",position:"relative",animation:"modalIn .22s ease"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:30,height:30,borderRadius:"50%",border:"none",background:"#f0f4ec",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Field({label,type="text",placeholder,opts,value,onChange,rows=3,hint}){
  const base={width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,outline:"none",background:"#fafafa",transition:"border .15s",color:"#1a2e1a"};
  return(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:6,display:"block",letterSpacing:.2}}>{label}</label>
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
    <div style={{background:gd,padding:"7px 0",display:"flex",alignItems:"center",gap:0,overflow:"hidden",flexShrink:0,zIndex:60,position:"relative"}}>
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

/* ═══════════════════════════════════════════════════════
   GPS PHOTO UPLOAD COMPONENT
═══════════════════════════════════════════════════════ */
function GeoImageUploader({onCapture}){
  const [state,setState]=useState("idle"); // idle | capturing | captured
  const [gps,setGps]=useState(null);
  const [img,setImg]=useState(null);
  const fileRef=useRef();

  const capture=()=>{
    setState("capturing");
    // Simulate GPS fetch
    setTimeout(()=>{
      setGps({lat:"19.9975° N",lng:"73.7898° E",acc:"±3m",loc:"Nashik, Maharashtra"});
      setState("captured");
    },1800);
  };

  const handleFile=e=>{
    const f=e.target.files[0];
    if(!f)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      setImg(ev.target.result);
      capture();
    };
    reader.readAsDataURL(f);
  };

  if(state==="idle") return(
    <div style={{border:"2px dashed #c5d9b8",borderRadius:16,padding:"24px 20px",textAlign:"center",background:"#f9fdf6",cursor:"pointer"}} onClick={()=>fileRef.current.click()}>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={handleFile}/>
      <div style={{fontSize:36,marginBottom:10}}>📷</div>
      <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a",marginBottom:4}}>Upload Produce Photos</div>
      <div style={{fontSize:11,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>Photos are GPS-tagged & timestamped automatically.<br/>Buyers trust verified geo-photos 3× more.</div>
      <button style={gBtn({fontSize:11,padding:"8px 18px"})}>📷 Take Photo / Upload</button>
    </div>
  );

  if(state==="capturing") return(
    <div style={{border:"2px dashed #c5d9b8",borderRadius:16,padding:"24px 20px",textAlign:"center",background:"#f9fdf6"}}>
      <div style={{fontSize:11,color:gm,fontWeight:700,marginBottom:10}}>
        <span className="spin" style={{display:"inline-block",marginRight:6}}>⚙️</span>
        {img?"Tagging GPS coordinates…":"Fetching your location…"}
      </div>
      {img&&<img src={img} alt="" style={{width:"100%",maxHeight:120,objectFit:"cover",borderRadius:12,marginBottom:10,opacity:.6}}/>}
      <div style={{height:4,background:"#e5e7eb",borderRadius:100,overflow:"hidden"}}>
        <div style={{height:"100%",width:"70%",background:`linear-gradient(90deg,${ac},${gm})`,borderRadius:100,animation:"shimmer 1s infinite"}}/>
      </div>
    </div>
  );

  return(
    <div style={{border:"2px solid rgba(45,107,48,.2)",borderRadius:16,overflow:"hidden",background:"#f9fdf6"}}>
      {img
        ?<div style={{position:"relative"}}>
          <img src={img} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover"}}/>
          <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,.7)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:8,display:"flex",gap:5,alignItems:"center"}}>
            <span>📍</span><span>{gps?.loc}</span>
          </div>
        </div>
        :<div style={{height:100,background:cr,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>📷</div>
      }
      <div style={{padding:"12px 14px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {[{i:"📍",l:"Latitude",v:gps?.lat},{i:"📍",l:"Longitude",v:gps?.lng},{i:"🎯",l:"Accuracy",v:gps?.acc},{i:"🏙️",l:"Location",v:gps?.loc}].map(({i,l,v})=>(
            <div key={l} style={{background:"#fff",borderRadius:8,padding:"7px 10px",fontSize:10}}>
              <div style={{color:"#9ca3af",marginBottom:2}}>{i} {l}</div>
              <div style={{fontWeight:700,color:gm,fontSize:11}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{flex:1,padding:"6px 10px",background:cr,borderRadius:8,fontSize:10,fontWeight:700,color:gm}}>✅ GPS Verified · Tamper-proof · {new Date().toLocaleDateString()}</div>
          <button onClick={()=>{setState("idle");setImg(null);setGps(null);}} style={ghBtn({fontSize:10,padding:"6px 10px"})}>Retake</button>
        </div>
        <button onClick={()=>onCapture&&onCapture({gps,img})} style={{...gBtn({width:"100%",marginTop:10,padding:9,fontSize:12})}}>✓ Use This Photo</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CREATE LISTING MODAL
═══════════════════════════════════════════════════════ */
function CreateListingModal({onClose,onDone}){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [photoOk,setPhotoOk]=useState(false);
  const [form,setForm]=useState({cat:"Vegetables",crop:"Potato",variety:"",grade:"Grade A",qty:"",unit:"kg",price:"",minOrder:"",harvest:"",moisture:"",desc:"",certs:[],delivery:"Pickup from farm",negotiable:true,organic:false});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleCert=c=>set("certs",form.certs.includes(c)?form.certs.filter(x=>x!==c):[...form.certs,c]);
  const crops=CROPS_BY_CAT[form.cat]||[];
  const canNext1=form.crop&&form.qty&&form.price;

  const aiPrice={"Potato":22,"Wheat":28,"Onion":14,"Tomato":32,"Chilli":85,"Corn":18,"Soybean":44,"Garlic":72}[form.crop]||25;
  const pNum=parseFloat(form.price)||0;
  const priceStatus=pNum===0?"":pNum<aiPrice*0.9?"Below market — may attract more buyers!":pNum>aiPrice*1.1?"Above market — consider revising":pNum===aiPrice?"Exactly at market rate":"Competitive market price ✓";
  const priceColor=pNum===0?"":pNum<aiPrice*0.9?gm:pNum>aiPrice*1.1?"#d97706":gm;

  if(done) return(
    <div style={{textAlign:"center",padding:"20px 0"}} className="fu">
      <div style={{fontSize:64,marginBottom:14}}>🎉</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>Listing Published!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.9,marginBottom:24}}>
        Your listing for <strong>{form.qty} of {form.crop}</strong> is now live.<br/>
        <strong style={{color:gm}}>12 matching buyers</strong> in your area have been notified.<br/>
        Today's mandi rate: <strong style={{color:gm}}>₹{aiPrice}/kg</strong> — you listed at <strong style={{color:gm}}>₹{form.price}/kg</strong>.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
        {[{i:"👁️",l:"Listing Visible",v:"Live Now"},{i:"📱",l:"Buyers Notified",v:"12 nearby"},{i:"🤝",l:"Expected Bids",v:"2–5 bids"}].map(({i,l,v})=>(
          <div key={l} style={{background:cr,borderRadius:14,padding:"13px 10px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:6}}>{i}</div>
            <div style={{fontSize:10,color:"#6b7280",marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:700,color:gd}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={onClose} style={ghBtn({padding:"10px 24px"})}>Close</button>
        <button onClick={()=>{onDone&&onDone(form);onClose();}} style={gBtn({padding:"10px 24px"})}>View My Listings →</button>
      </div>
    </div>
  );

  return(
    <>
      <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>📝 Create New Listing</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Step {step} of 3 · Reach 2,000+ verified buyers instantly</div>
      {/* Step indicator */}
      <div style={{display:"flex",gap:3,marginBottom:22}}>
        {["Produce Details","Pricing & Quantity","Photos & Publish"].map((s,i)=>(
          <div key={s} style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
            <div style={{height:3,borderRadius:100,background:i+1<=step?`linear-gradient(90deg,${ac},${gm})`:"#e5e7eb",transition:"background .3s"}}/>
            <div style={{fontSize:9,fontWeight:600,color:i+1===step?gm:"#9ca3af",textAlign:"center"}}>{s}</div>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step===1&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Category *" type="select" opts={Object.keys(CROPS_BY_CAT)} value={form.cat} onChange={v=>{set("cat",v);set("crop",CROPS_BY_CAT[v][0]);}}/>
            <Field label="Crop / Produce *" type="select" opts={crops} value={form.crop} onChange={v=>set("crop",v)}/>
          </div>
          <Field label="Variety / Type" placeholder="e.g. Teja, Sharbati, Desi…" value={form.variety} onChange={v=>set("variety",v)} hint="Optional — helps buyers find you faster"/>
          <Field label="Grade" type="select" opts={GRADES} value={form.grade} onChange={v=>set("grade",v)}/>
          <Field label="Harvest Date" type="date" value={form.harvest} onChange={v=>set("harvest",v)}/>
          <Field label="Moisture Content" placeholder="e.g. < 14%" value={form.moisture} onChange={v=>set("moisture",v)}/>
          <Field label="Description" type="textarea" placeholder="Quality details, packaging, delivery terms, any certifications…" value={form.desc} onChange={v=>set("desc",v)} rows={3}/>
          {/* Cert checkboxes */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:8,display:"block"}}>Certifications</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["FSSAI","Organic","APEDA","ISO 22000"].map(c=>(
                <div key={c} onClick={()=>toggleCert(c)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:100,border:`1.5px solid ${form.certs.includes(c)?gm:"#e5e7eb"}`,background:form.certs.includes(c)?"#f0f7f0":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:form.certs.includes(c)?gm:"#6b7280",transition:"all .15s"}}>
                  {form.certs.includes(c)&&<span style={{color:gm}}>✓</span>}{c}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
            <button onClick={onClose} style={ghBtn()}>Cancel</button>
            <button onClick={()=>setStep(2)} disabled={!form.crop} style={{...gBtn({opacity:form.crop?1:.5})}}>Next →</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step===2&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
            <Field label="Total Quantity *" placeholder="e.g. 500" value={form.qty} onChange={v=>set("qty",v)}/>
            <Field label="Unit" type="select" opts={["kg","ton","quintal","bag","crate"]} value={form.unit} onChange={v=>set("unit",v)}/>
          </div>
          <div>
            <Field label={`Asking Price ₹/${form.unit} *`} placeholder={`Market rate: ₹${aiPrice}/${form.unit}`} value={form.price} onChange={v=>set("price",v)}/>
            {form.price&&<div style={{fontSize:11,fontWeight:600,color:priceColor,marginTop:-10,marginBottom:12,padding:"6px 12px",background:priceColor==="#d97706"?"#fef3c7":"#f0f7f0",borderRadius:8}}>💡 {priceStatus}</div>}
          </div>
          <Field label="Minimum Order Quantity" placeholder={`e.g. 100 ${form.unit}`} value={form.minOrder} onChange={v=>set("minOrder",v)} hint="Leave blank if no minimum"/>
          <Field label="Delivery / Pickup" type="select" opts={["Pickup from farm","I can deliver within 50km","I can deliver anywhere in state","Buyer must arrange transport"]} value={form.delivery} onChange={v=>set("delivery",v)}/>
          {/* Toggles */}
          <div style={{display:"flex",gap:16,marginBottom:16}}>
            {[["Price Negotiable","negotiable"],["Organic / Chemical-free","organic"]].map(([l,k])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#374151"}}>
                <div onClick={()=>set(k,!form[k])} style={{width:38,height:20,borderRadius:100,background:form[k]?gm:"#e5e7eb",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:form[k]?21:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                </div>{l}
              </label>
            ))}
          </div>
          {/* AI tip */}
          <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:14,padding:"12px 15px",marginBottom:18,border:"1px solid rgba(45,107,48,.12)",display:"flex",gap:11,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>🤖</span>
            <div style={{fontSize:11,color:"#1a2e1a",lineHeight:1.7}}>
              <strong>AI Pricing Insight:</strong> {form.crop} is trading at <strong>₹{aiPrice}/kg</strong> on Nashik mandi today. Listings priced within 5% of market get <strong>2.8× more bids</strong>. Your price: <strong style={{color:priceColor||gm}}>₹{form.price||"—"}/{form.unit}</strong>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"space-between"}}>
            <button onClick={()=>setStep(1)} style={ghBtn()}>← Back</button>
            <button onClick={()=>setStep(3)} disabled={!canNext1} style={{...gBtn({opacity:canNext1?1:.5})}}>Next: Add Photos →</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step===3&&(
        <div className="fu">
          <div style={{fontSize:12,color:"#6b7280",marginBottom:14,padding:"9px 13px",background:"#fffbeb",borderRadius:10,border:"1px solid #fde68a"}}>
            📍 <strong>GPS-tagged photos</strong> increase buyer trust by 3× and get 40% more bids.
          </div>
          <GeoImageUploader onCapture={()=>setPhotoOk(true)}/>
          {/* Also allow skipping */}
          {!photoOk&&(
            <div style={{textAlign:"center",marginTop:10}}>
              <span onClick={()=>setPhotoOk(true)} style={{fontSize:11,color:"#9ca3af",cursor:"pointer",textDecoration:"underline"}}>Skip for now (not recommended)</span>
            </div>
          )}
          {photoOk&&(
            <div style={{marginTop:16,padding:"12px 14px",background:"#f0f7f0",borderRadius:12,display:"flex",alignItems:"center",gap:10,border:"1px solid rgba(45,107,48,.15)"}}>
              <span style={{fontSize:20}}>✅</span>
              <div style={{flex:1,fontSize:12,color:gm,fontWeight:600}}>Photo GPS-tagged successfully!</div>
            </div>
          )}
          {/* Summary */}
          {photoOk&&(
            <div style={{marginTop:16,padding:"14px 16px",background:cr,borderRadius:14,border:"1px solid rgba(30,70,20,.07)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1a2e1a",marginBottom:10}}>Listing Summary</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{l:"Crop",v:form.crop},{l:"Grade",v:form.grade},{l:"Quantity",v:`${form.qty} ${form.unit}`},{l:"Price",v:`₹${form.price}/${form.unit}`},{l:"Delivery",v:form.delivery.split(" ").slice(0,3).join(" ")+"…"},{l:"Certs",v:form.certs.length?form.certs.join(", "):"None"}].map(({l,v})=>(
                  <div key={l} style={{fontSize:11}}>
                    <span style={{color:"#9ca3af"}}>{l}: </span>
                    <span style={{fontWeight:700,color:"#1a2e1a"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16}}>
            <button onClick={()=>setStep(2)} style={ghBtn()}>← Back</button>
            <div style={{display:"flex",gap:8}}>
              <button style={ghBtn({fontSize:12})}>💾 Save Draft</button>
              <button onClick={()=>setDone(true)} disabled={!photoOk} style={{...gBtn({opacity:photoOk?1:.5})}}>🚀 Publish Listing</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   LISTING DETAIL MODAL (with full bid management)
═══════════════════════════════════════════════════════ */
function ListingDetailModal({item,onClose,onBidAction}){
  const [tab,setTab]=useState("details");
  const [imgIdx,setImgIdx]=useState(0);
  const [bids,setBids]=useState(item.bids||[]);
  const [awarded,setAwarded]=useState(null);
  const [contactSent,setContactSent]=useState({});
  const tabs=item.myListing?["details","bids","analytics"]:["details","contact"];

  const actBid=(id,status)=>{
    if(status==="awarded") setAwarded(id);
    setBids(p=>p.map(b=>b.id===id?{...b,status}:b));
    onBidAction&&onBidAction(item.id,id,status);
  };

  return(
    <>
      {/* Image carousel header */}
      <div style={{height:160,background:`linear-gradient(135deg,${gd},${gm})`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",marginBottom:18,overflow:"hidden"}}>
        <div style={{fontSize:80}}>{item.imgs?.[imgIdx]||item.e}</div>
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5}}>
          {(item.imgs||[item.e]).map((_,i)=>(
            <div key={i} onClick={()=>setImgIdx(i)} style={{width:i===imgIdx?18:7,height:7,borderRadius:100,background:i===imgIdx?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .2s"}}/>
          ))}
        </div>
        {item.geo&&<div style={{position:"absolute",bottom:10,left:14,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",color:"#fff",fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100}}>📍 GPS Verified · {item.loc}</div>}
        {item.verified&&<div style={{position:"absolute",top:12,right:14,background:"rgba(255,255,255,.9)",color:gm,fontSize:9,fontWeight:700,padding:"4px 10px",borderRadius:100}}>✅ Farmer Verified</div>}
        {item.myListing&&<div style={{position:"absolute",top:12,left:14}}><Badge color="amber">My Listing</Badge></div>}
      </div>

      <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:2})}}>{item.name}</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>👨‍🌾 {item.farmer} · 📍 {item.loc}</div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        <Badge color="green">{item.grade}</Badge>
        {item.cert?.map(c=><Badge key={c} color="teal">🏅 {c}</Badge>)}
        {item.verified&&<Badge color="blue">✅ Verified</Badge>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:11,padding:3,marginBottom:18}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px",borderRadius:9,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize",transition:"all .15s",position:"relative"}}>
            {t}
            {t==="bids"&&bids.filter(b=>b.status==="new").length>0&&<span style={{position:"absolute",top:4,right:6,width:7,height:7,borderRadius:"50%",background:"#e53e3e"}}/>}
          </button>
        ))}
      </div>

      {tab==="details"&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[{i:"💰",l:"Asking Price",v:`₹${item.price}/kg`},{i:"📦",l:"Available",v:item.qty},{i:"🤝",l:"Bids",v:`${bids.length} received`},{i:"🌱",l:"Freshness",v:item.fresh},{i:"💧",l:"Moisture",v:item.moisture||"< 14%"},{i:"📅",l:"Harvest",v:item.harvest||"Feb 2026"}].map(({i,l,v})=>(
              <div key={l} style={{background:cr,borderRadius:13,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:18,marginBottom:3}}>{i}</div>
                <div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{l}</div>
                <div style={{fontSize:11,fontWeight:700,color:gd}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#f9fdf9",borderRadius:12,padding:"12px 14px",marginBottom:16,border:"1px solid rgba(30,70,20,.06)"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#6b7280",marginBottom:5}}>Description</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.65}}>{item.desc}</div>
          </div>
          {/* AI pricing */}
          <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:13,padding:"12px 14px",border:"1px solid rgba(45,107,48,.12)",display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>🤖</span>
            <div style={{fontSize:11,color:"#1a2e1a",lineHeight:1.65}}>
              <strong>Market Insight:</strong> Today's mandi rate for {item.name.split(" ")[0]} is <strong style={{color:gm}}>₹{item.price}/kg</strong>. This listing is priced <strong style={{color:gm}}>at market rate</strong>. Expect bids within 24–48 hours.
            </div>
          </div>
        </div>
      )}

      {tab==="bids"&&item.myListing&&(
        <div className="fu">
          {bids.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:13}}>No bids yet. Buyers will be notified automatically.</div>}
          {awarded&&<div style={{background:"#f0f7f0",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,fontWeight:700,color:gm,textAlign:"center"}}>🏆 Contract awarded! Delivery details will be sent to the buyer.</div>}
          {bids.map(b=>(
            <div key={b.id} style={{border:`1.5px solid ${b.status==="awarded"?"rgba(45,107,48,.3)":b.status==="shortlisted"?"rgba(29,78,216,.2)":b.status==="rejected"?"rgba(153,27,27,.1)":"rgba(30,42,74,.08)"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,background:b.status==="awarded"?"#f0f7f0":b.status==="rejected"?"#fafafa":"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{fontSize:26,flexShrink:0}}>{b.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{b.buyer}</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>🕐 {b.time} · 📦 {b.qty}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:17,fontWeight:800,color:gd}}>₹{b.offer}/kg</div>
                  <Badge color={b.status==="new"?"amber":b.status==="shortlisted"?"blue":b.status==="awarded"?"green":"gray"} size="xs">{b.status.toUpperCase()}</Badge>
                </div>
              </div>
              <div style={{fontSize:12,color:"#374151",background:"#f9fdf9",padding:"7px 10px",borderRadius:8,marginBottom:10,lineHeight:1.5}}>"{b.note}"</div>
              {(b.status==="new"||b.status==="shortlisted")&&!awarded&&(
                <div style={{display:"flex",gap:7}}>
                  <button onClick={()=>actBid(b.id,"rejected")} style={{...ghBtn({flex:1,padding:"7px 0",fontSize:11}),color:"#991b1b",background:"#fee2e2",border:"none"}}>✕ Reject</button>
                  {b.status==="new"&&<button onClick={()=>actBid(b.id,"shortlisted")} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>⭐ Shortlist</button>}
                  <button onClick={()=>actBid(b.id,"awarded")} style={gBtn({flex:2,padding:"7px 0",fontSize:11})}>🏆 Award</button>
                </div>
              )}
              {b.status==="awarded"&&<div style={{fontSize:11,fontWeight:700,color:gm,textAlign:"center",padding:"6px 0"}}>🏆 Contract Awarded</div>}
            </div>
          ))}
        </div>
      )}

      {tab==="analytics"&&item.myListing&&(
        <div className="fu">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{i:"👁️",l:"Total Views",v:"147"},{i:"🤝",l:"Bids Received",v:bids.length},{i:"📤",l:"Share Count",v:"12"},{i:"⭐",l:"Watchlisted",v:"34"}].map(({i,l,v})=>(
              <div key={l} style={{background:cr,borderRadius:13,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:5}}>{i}</div>
                <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a"})}}>{v}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#f9fdf9",borderRadius:14,padding:"14px 16px",border:"1px solid rgba(30,70,20,.06)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1a2e1a",marginBottom:12}}>View Activity (last 7 days)</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:70}}>
              {[12,28,15,42,38,55,147].map((v,i)=>{
                const days=["M","T","W","T","F","S","S"];
                return(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:"100%",height:`${Math.round(v/147*100)}%`,borderRadius:"5px 5px 0 0",background:`linear-gradient(180deg,${ac},${gd})`,minHeight:4,transition:"height .4s"}}/>
                    <div style={{fontSize:8,color:"#9ca3af"}}>{days[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab==="contact"&&!item.myListing&&(
        <div className="fu">
          {[{i:"👨‍🌾",l:"Farmer",v:item.farmer},{i:"📍",l:"Location",v:item.loc},{i:"📞",l:"Response Time",v:"< 2 hours"},{i:"⭐",l:"Rating",v:"4.8 / 5"}].map(({i,l,v})=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5",fontSize:13}}>
              <span style={{color:"#6b7280"}}>{i} {l}</span>
              <span style={{fontWeight:600,color:"#1a2e1a"}}>{v}</span>
            </div>
          ))}
          <button style={{...gBtn({width:"100%",padding:11,marginTop:16,fontSize:13})}} onClick={()=>setContactSent(p=>({...p,[item.id]:true}))}>
            {contactSent[item.id]?"✓ Message Sent!":"💬 Message Farmer"}
          </button>
        </div>
      )}

      <div style={{marginTop:20,display:"flex",gap:10}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Close</button>
        {!item.myListing&&<button style={gBtn({flex:2,padding:12})}>🤝 Place Bid</button>}
        {item.myListing&&<button style={ghBtn({flex:1,fontSize:12})}>✏️ Edit Listing</button>}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════════════════════ */
const NAV_ITEMS=[
  {id:"marketplace",icon:"🛒",label:"Marketplace"},
  {id:"mylistings",icon:"📋",label:"My Listings",badge:2},
  {id:"bidsreceived",icon:"🤝",label:"Bids Received",badge:7,red:true},
  {id:"drafts",icon:"📝",label:"Drafts"},
  {id:"analytics",icon:"📊",label:"Analytics"},
];

function Sidebar({page,setPage}){
  return(
    <aside style={{width:214,background:navy,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:50,overflowY:"auto"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌾</div>
        <div>
          <div style={{...PF({fontSize:16,fontWeight:700,color:"#fff"})}}>GrainOS</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:.8}}>Farmer Portal</div>
        </div>
      </div>
      {/* Farmer */}
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
        <div style={{width:38,height:38,borderRadius:11,background:`linear-gradient(135deg,${gm},#4caf50)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👨‍🌾</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Ramesh Patil</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>✅ eKYC · Nashik, MH</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{flex:1,padding:"10px 10px",position:"relative",zIndex:1}}>
        <div style={{fontSize:9,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.2)",padding:"8px 8px 4px",fontWeight:600}}>Listings</div>
        {NAV_ITEMS.map(({id,icon,label,badge,red})=>{
          const a=page===id;
          return(
            <div key={id} onClick={()=>setPage(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:11,marginBottom:2,fontSize:12,fontWeight:a?600:500,color:a?"#fff":"rgba(255,255,255,.4)",background:a?"rgba(255,255,255,.09)":"transparent",cursor:"pointer",transition:"all .15s",borderLeft:`3px solid ${a?ac:"transparent"}`,paddingLeft:a?"11px":"14px"}}>
              <span style={{fontSize:15}}>{icon}</span>
              <span style={{flex:1}}>{label}</span>
              {badge&&<span style={{background:red?"#e53e3e":"rgba(255,255,255,.12)",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:9,fontWeight:700}}>{badge}</span>}
            </div>
          );
        })}
        <div style={{height:1,background:"rgba(255,255,255,.05)",margin:"10px 0"}}/>
        <div style={{fontSize:9,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.2)",padding:"4px 8px 4px",fontWeight:600}}>Other</div>
        {[{id:"tenders",icon:"📑",label:"Browse Tenders"},{id:"messages",icon:"💬",label:"Messages"},{id:"settings",icon:"⚙️",label:"Settings"}].map(({id,icon,label})=>{
          const a=page===id;
          return(
            <div key={id} onClick={()=>setPage(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:11,marginBottom:2,fontSize:12,fontWeight:a?600:500,color:a?"#fff":"rgba(255,255,255,.4)",background:a?"rgba(255,255,255,.09)":"transparent",cursor:"pointer",transition:"all .15s",borderLeft:`3px solid ${a?ac:"transparent"}`,paddingLeft:a?"11px":"14px"}}>
              <span style={{fontSize:15}}>{icon}</span>
              <span style={{flex:1}}>{label}</span>
            </div>
          );
        })}
      </nav>
      {/* Tips */}
      <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:13,padding:13,border:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontSize:10,fontWeight:700,color:ac,marginBottom:4}}>💡 Tip of the Day</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)",lineHeight:1.5}}>GPS-tagged listings get 3× more bids. Always upload a photo!</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({title,sub,actions}){
  return(
    <div style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(30,42,74,.07)",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40}}>
      <div>
        <h1 style={{...PF({fontSize:19,fontWeight:600,color:"#1a1f36"})}}>{title}</h1>
        {sub&&<p style={{fontSize:11,color:"#6b7280",marginTop:1}}>{sub}</p>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>{actions}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: MARKETPLACE (Browse all produce)
═══════════════════════════════════════════════════════ */
function PageMarketplace({produce,setProduce}){
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const [sort,setSort]=useState("Newest");
  const [view,setView]=useState("grid"); // grid | list
  const [detail,setDetail]=useState(null);
  const [showCreate,setShowCreate]=useState(false);
  const [priceRange,setPriceRange]=useState([0,100]);
  const [showVerified,setShowVerified]=useState(false);
  const [showGeo,setShowGeo]=useState(false);

  let filtered=produce.filter(p=>{
    if(cat!=="All"&&p.cat!==cat)return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.farmer.toLowerCase().includes(search.toLowerCase()))return false;
    if(showVerified&&!p.verified)return false;
    if(showGeo&&!p.geo)return false;
    return true;
  });
  if(sort==="Price: Low")filtered=[...filtered].sort((a,b)=>a.price-b.price);
  if(sort==="Price: High")filtered=[...filtered].sort((a,b)=>b.price-a.price);
  if(sort==="Most Bids")filtered=[...filtered].sort((a,b)=>b.bids.length-a.bids.length);

  return(
    <>
      <Topbar
        title="Marketplace 🛒"
        sub={`${filtered.length} verified listings · Click any card to view and bid`}
        actions={<>
          <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
            <span style={{opacity:.4,fontSize:13}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search produce, farmer…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:200}}/>
            {search&&<button onClick={()=>setSearch("")} style={{border:"none",background:"none",cursor:"pointer",color:"#9ca3af",fontSize:11}}>✕</button>}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 12px",borderRadius:11,border:"1px solid #e5e7eb",fontSize:12,background:"#fff",outline:"none",cursor:"pointer"}}>
            {["Newest","Price: Low","Price: High","Most Bids"].map(o=><option key={o}>{o}</option>)}
          </select>
          <div style={{display:"flex",border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
            {["grid","list"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 11px",border:"none",cursor:"pointer",background:view===v?"#1e2a4a":"#fff",color:view===v?"#fff":"#6b7280",fontSize:13}}>
                {v==="grid"?"▦":"☰"}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowCreate(true)} style={gBtn({padding:"8px 16px",fontSize:12})}>+ New Listing</button>
        </>}
      />
      <div style={{padding:"22px 28px",display:"flex",gap:18}} className="fu">
        {/* Sidebar filters */}
        <div style={{...card({width:176,flexShrink:0,padding:16,height:"fit-content",position:"sticky",top:70})}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a",marginBottom:12}}>Filters</div>
          <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Category</div>
          {CATEGORIES.map(c=>(
            <div key={c} onClick={()=>setCat(c)} style={{padding:"6px 10px",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:cat===c?700:400,color:cat===c?gd:"#6b7280",background:cat===c?"#f0f7f0":"transparent",marginBottom:2,transition:"all .12s"}}>
              {c}
            </div>
          ))}
          <div style={{height:1,background:"#f0f0f0",margin:"12px 0"}}/>
          <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Quality</div>
          {[{l:"GPS Verified",k:"geo",v:showGeo,set:setShowGeo},{l:"Farmer Verified",k:"v",v:showVerified,set:setShowVerified}].map(({l,k,v,set})=>(
            <label key={l} style={{display:"flex",alignItems:"center",gap:7,marginBottom:9,cursor:"pointer",fontSize:11,color:"#374151"}}>
              <div onClick={()=>set(p=>!p)} style={{width:14,height:14,borderRadius:4,background:v?gd:"transparent",border:`1.5px solid ${v?gd:"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
                {v&&<span style={{color:"#fff",fontSize:8}}>✓</span>}
              </div>{l}
            </label>
          ))}
          <div style={{height:1,background:"#f0f0f0",margin:"12px 0"}}/>
          <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>My Listings</div>
          <div onClick={()=>setSearch("")} style={{padding:"6px 10px",borderRadius:8,fontSize:11,cursor:"pointer",color:gm,fontWeight:600,background:"#f0f7f0",textAlign:"center"}}>View My Listings →</div>
        </div>

        {/* Grid / List */}
        <div style={{flex:1}}>
          {view==="grid"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
              {filtered.map(p=>(
                <div key={p.id} onClick={()=>setDetail(p)} style={{...card({padding:0,overflow:"hidden",cursor:"pointer",transition:"all .2s"})}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(30,70,20,.1)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                  <div style={{height:110,background:`linear-gradient(135deg,#f0f7f0,#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,position:"relative"}}>
                    {p.e}
                    {p.myListing&&<div style={{position:"absolute",top:8,left:8}}><Badge color="amber" size="xs">Mine</Badge></div>}
                    {p.geo&&<div style={{position:"absolute",bottom:7,left:8,background:"rgba(30,70,20,.8)",color:"#fff",fontSize:7,fontWeight:700,padding:"2px 7px",borderRadius:100}}>📍 GPS</div>}
                    {p.verified&&<div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,.9)",color:gm,fontSize:7,fontWeight:700,padding:"2px 7px",borderRadius:100}}>✅</div>}
                    {p.bids.length>0&&<div style={{position:"absolute",bottom:7,right:8,background:gd,color:"#fff",fontSize:7,fontWeight:700,padding:"2px 7px",borderRadius:100}}>🤝 {p.bids.length}</div>}
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a",marginBottom:1}}>{p.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af",marginBottom:4}}>👨‍🌾 {p.farmer} · {p.loc}</div>
                    <div style={{fontSize:9,color:ac,fontWeight:600,marginBottom:8}}>🌱 {p.fresh}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <span style={{...PF({fontSize:17,fontWeight:700,color:gd})}}>₹{p.price}/kg</span>
                      <span style={{fontSize:10,color:"#9ca3af"}}>{p.qty}</span>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      <Badge color="green" size="xs">{p.grade}</Badge>
                      {p.cert?.slice(0,1).map(c=><Badge key={c} color="teal" size="xs">{c}</Badge>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view==="list"&&(
            <div style={card({padding:0,overflow:"hidden"})}>
              {filtered.map((p,i)=>(
                <div key={p.id} onClick={()=>setDetail(p)} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",borderBottom:i<filtered.length-1?"1px solid #f5f5f5":"none",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,#f0f7f0,#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{p.e}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{p.name}</span>
                      {p.myListing&&<Badge color="amber" size="xs">Mine</Badge>}
                      {p.verified&&<Badge color="green" size="xs">✅ Verified</Badge>}
                      {p.geo&&<Badge color="blue" size="xs">📍 GPS</Badge>}
                    </div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>👨‍🌾 {p.farmer} · 📍 {p.loc} · 🌱 {p.fresh}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{...PF({fontSize:17,fontWeight:700,color:gd})}}> ₹{p.price}/kg</div>
                    <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{p.qty}</div>
                  </div>
                  {p.bids.length>0&&<Badge color="amber">🤝 {p.bids.length} bids</Badge>}
                  <button style={gBtn({padding:"7px 14px",fontSize:11,flexShrink:0})}>View</button>
                </div>
              ))}
            </div>
          )}

          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"48px 0",color:"#9ca3af"}}>
              <div style={{fontSize:40,marginBottom:12}}>🔍</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>No listings found</div>
              <div style={{fontSize:12}}>Try different filters or be the first to list {cat!=="All"?cat:"this produce"}</div>
            </div>
          )}
        </div>
      </div>

      {detail&&<Modal onClose={()=>setDetail(null)} w={560}><ListingDetailModal item={detail} onClose={()=>setDetail(null)}/></Modal>}
      {showCreate&&<Modal onClose={()=>setShowCreate(false)} w={580}><CreateListingModal onClose={()=>setShowCreate(false)} onDone={(form)=>{setProduce(p=>[{id:Date.now(),e:"🌾",name:form.crop,cat:form.cat,farmer:"Ramesh Patil",loc:"Nashik, MH",price:parseFloat(form.price)||0,qty:`${form.qty} ${form.unit}`,qtyNum:parseFloat(form.qty)||0,grade:form.grade,fresh:"Just now",geo:true,verified:true,bids:[],desc:form.desc||"Fresh listing",imgs:["🌾"],cert:form.certs,harvest:form.harvest,moisture:form.moisture,myListing:true},...p]);}}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: MY LISTINGS
═══════════════════════════════════════════════════════ */
function PageMyListings({produce,setProduce}){
  const [detail,setDetail]=useState(null);
  const [showCreate,setShowCreate]=useState(false);
  const [tab,setTab]=useState("active");
  const myProduce=produce.filter(p=>p.myListing);
  const totalBids=myProduce.reduce((a,p)=>a+p.bids.length,0);
  const newBids=myProduce.reduce((a,p)=>a+p.bids.filter(b=>b.status==="new").length,0);

  const del=id=>setProduce(p=>p.filter(x=>x.id!==id));

  return(
    <>
      <Topbar title="My Listings 📋" sub={`${myProduce.length} listings · ${totalBids} total bids · ${newBids} new`} actions={<>
        <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:10,padding:3}}>
          {["active","paused"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize",transition:"all .12s"}}>{t}</button>
          ))}
        </div>
        <button onClick={()=>setShowCreate(true)} style={gBtn({padding:"8px 16px",fontSize:12})}>+ New Listing</button>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {myProduce.length===0&&(
          <div style={{textAlign:"center",padding:"56px 0"}}>
            <div style={{fontSize:52,marginBottom:14}}>📋</div>
            <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>No listings yet</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:24}}>Start selling your produce to 2,000+ verified buyers</div>
            <button onClick={()=>setShowCreate(true)} style={gBtn({padding:"12px 28px",fontSize:14})}>+ Create First Listing</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
          {myProduce.map(p=>(
            <div key={p.id} style={{...card({padding:0,overflow:"hidden"})}}>
              <div style={{display:"flex",gap:0}}>
                <div style={{width:90,background:`linear-gradient(135deg,${gd},${gm})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,flexShrink:0}}>
                  {p.e}
                </div>
                <div style={{flex:1,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{...PF({fontSize:14,fontWeight:700,color:"#1a2e1a"})}}>{p.name}</div>
                    <span style={{...PF({fontSize:16,fontWeight:700,color:gd})}}>₹{p.price}/kg</span>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>{p.qty} · {p.grade} · 🌱 {p.fresh}</div>
                  <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                    {p.geo&&<Badge color="blue" size="xs">📍 GPS</Badge>}
                    {p.verified&&<Badge color="green" size="xs">✅ Verified</Badge>}
                    {p.cert?.slice(0,2).map(c=><Badge key={c} color="teal" size="xs">{c}</Badge>)}
                  </div>
                  {/* Bid mini summary */}
                  {p.bids.length>0?(
                    <div style={{background:cr,borderRadius:9,padding:"7px 10px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:11,color:"#374151"}}>🤝 <strong>{p.bids.length}</strong> bids · <strong style={{color:newBids>0?"#e53e3e":gm}}>{p.bids.filter(b=>b.status==="new").length} new</strong></span>
                      <span style={{fontSize:12,fontWeight:800,color:gm}}>Best: ₹{Math.max(...p.bids.map(b=>b.offer))}/kg</span>
                    </div>
                  ):<div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>No bids yet · Buyers are being notified</div>}
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>setDetail(p)} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>View Bids</button>
                    <button onClick={()=>setDetail(p)} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>✏️ Edit</button>
                    <button onClick={()=>del(p.id)} style={{...ghBtn({padding:"7px 12px",fontSize:11}),color:"#ef4444"}}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {detail&&<Modal onClose={()=>setDetail(null)} w={560}><ListingDetailModal item={detail} onClose={()=>setDetail(null)}/></Modal>}
      {showCreate&&<Modal onClose={()=>setShowCreate(false)} w={580}><CreateListingModal onClose={()=>setShowCreate(false)} onDone={(form)=>{setProduce(p=>[{id:Date.now(),e:"🌾",name:form.crop,cat:form.cat,farmer:"Ramesh Patil",loc:"Nashik, MH",price:parseFloat(form.price)||0,qty:`${form.qty} ${form.unit}`,qtyNum:parseFloat(form.qty)||0,grade:form.grade,fresh:"Just now",geo:true,verified:true,bids:[],desc:form.desc||"Fresh listing",imgs:["🌾"],cert:form.certs,harvest:form.harvest,moisture:form.moisture,myListing:true},...p]);}}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: BIDS RECEIVED
═══════════════════════════════════════════════════════ */
function PageBidsReceived({produce,setProduce}){
  const [tab,setTab]=useState("new");
  const [detail,setDetail]=useState(null);
  const [search,setSearch]=useState("");

  // flatten all bids from my listings
  const allBids=produce.filter(p=>p.myListing).flatMap(p=>p.bids.map(b=>({...b,listing:p})));
  const filtered=(tab==="all"?allBids:allBids.filter(b=>b.status===tab)).filter(b=>b.buyer.toLowerCase().includes(search.toLowerCase())||b.listing.name.toLowerCase().includes(search.toLowerCase()));

  const act=(listingId,bidId,status)=>{
    setProduce(prev=>prev.map(p=>p.id===listingId?{...p,bids:p.bids.map(b=>b.id===bidId?{...b,status}:b)}:p));
  };

  const statusColors={new:"amber",shortlisted:"blue",awarded:"green",rejected:"gray"};

  return(
    <>
      <Topbar title="Bids Received 🤝" sub="All buyer applications to your produce listings" actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search buyer, listing…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:190}}/>
        </div>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {["new","shortlisted","awarded","rejected","all"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:10,border:"1px solid",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?navy:"#fff",color:tab===t?"#fff":"#374151",borderColor:tab===t?"transparent":"#e5e7eb",textTransform:"capitalize",transition:"all .12s"}}>
              {t} {t==="new"&&`(${allBids.filter(b=>b.status==="new").length})`}
              {t==="all"&&`(${allBids.length})`}
            </button>
          ))}
        </div>
        {filtered.length===0&&<div style={{...card({textAlign:"center",padding:"40px",color:"#9ca3af",fontSize:13})}}>No {tab} bids. Keep listing quality produce!</div>}
        <div style={card({padding:0,overflow:"hidden"})}>
          {filtered.map((b,i)=>(
            <div key={b.id} style={{padding:"16px 20px",borderBottom:i<filtered.length-1?"1px solid #f5f5f5":"none",transition:"all .15s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>setDetail({...b.listing,bids:b.listing.bids})}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
                <div style={{width:46,height:46,borderRadius:13,background:`linear-gradient(135deg,#eff6ff,#dbeafe)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{b.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{b.buyer}</span>
                    <Badge color={statusColors[b.status]||"gray"}>{b.status.toUpperCase()}</Badge>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>📋 {b.listing.name} · 📦 {b.qty} · 🕐 {b.time}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{...PF({fontSize:19,fontWeight:700,color:gd})}}>₹{b.offer}/kg</div>
                  <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>Market: ₹{b.listing.price}/kg</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#374151",background:"#f9fdf9",padding:"8px 12px",borderRadius:9,marginBottom:10,lineHeight:1.5}}>" {b.note} "</div>
              {(b.status==="new"||b.status==="shortlisted")&&(
                <div style={{display:"flex",gap:8}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>act(b.listing.id,b.id,"rejected")} style={{...ghBtn({flex:1,padding:"8px 0",fontSize:11}),color:"#991b1b",background:"#fee2e2",border:"none"}}>✕ Reject</button>
                  {b.status==="new"&&<button onClick={()=>act(b.listing.id,b.id,"shortlisted")} style={ghBtn({flex:1,padding:"8px 0",fontSize:11})}>⭐ Shortlist</button>}
                  <button onClick={()=>act(b.listing.id,b.id,"awarded")} style={gBtn({flex:2,padding:"8px 0",fontSize:11})}>🏆 Award Deal</button>
                </div>
              )}
              {b.status==="awarded"&&<div style={{padding:"8px 12px",borderRadius:9,background:"#f0f7f0",textAlign:"center",fontSize:12,fontWeight:700,color:gm}}>🏆 Deal Awarded · Delivery confirmation pending</div>}
            </div>
          ))}
        </div>
      </div>
      {detail&&<Modal onClose={()=>setDetail(null)} w={560}><ListingDetailModal item={detail} onClose={()=>setDetail(null)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: ANALYTICS
═══════════════════════════════════════════════════════ */
function PageAnalytics({produce}){
  const myListings=produce.filter(p=>p.myListing);
  const totalBids=myListings.reduce((a,p)=>a+p.bids.length,0);
  const views=[12,28,15,42,38,55,74,92,38,62,88,147];
  const months=["Sep","Oct","Nov","Dec","Jan","Feb"];

  return(
    <>
      <Topbar title="Analytics 📊" sub="Your listing performance and earnings"/>
      <div style={{padding:"22px 28px"}} className="fu">
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{i:"💰",l:"Total Earnings",v:"₹4.2L",c:gm},{i:"📋",l:"Active Listings",v:myListings.length,c:navy},{i:"🤝",l:"Bids Received",v:totalBids,c:"#7e22ce"},{i:"👁️",l:"Total Views",v:"1,247",c:"#d97706"}].map(({i,l,v,c})=>(
            <div key={l} style={{...card({position:"relative",overflow:"hidden",padding:18})}}>
              <div style={{position:"absolute",top:-20,right:-20,width:70,height:70,borderRadius:"50%",background:c,opacity:.07}}/>
              <div style={{fontSize:22,marginBottom:8}}>{i}</div>
              <div style={{...PF({fontSize:26,fontWeight:700,color:"#1a1f36"})}}>{v}</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          {/* Views chart */}
          <div style={card({padding:22})}>
            <div style={{...PF({fontSize:14,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Views Last 12 Days</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
              {views.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{width:"100%",height:`${Math.round(v/147*100)}%`,borderRadius:"4px 4px 0 0",background:`linear-gradient(180deg,${ac},${gd})`,minHeight:3,cursor:"pointer",transition:"filter .2s"}} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.2)"} onMouseLeave={e=>e.currentTarget.style.filter=""}/>
                </div>
              ))}
            </div>
            <div style={{fontSize:10,color:"#9ca3af",marginTop:8,textAlign:"right"}}>Peak: 147 views today 🔥</div>
          </div>
          {/* Earnings by crop */}
          <div style={card({padding:22})}>
            <div style={{...PF({fontSize:14,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Earnings by Crop (₹)</div>
            {[{n:"Potato",v:180000,pct:42},{n:"Onion",v:95000,pct:23},{n:"Wheat",v:82000,pct:19},{n:"Others",v:63000,pct:16}].map(({n,v,pct})=>(
              <div key={n} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span style={{color:"#374151"}}>{n}</span>
                  <span style={{fontWeight:700,color:gd}}>₹{(v/1000).toFixed(0)}k</span>
                </div>
                <div style={{height:6,background:"#f0f0f0",borderRadius:100}}>
                  <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${ac},${gd})`,borderRadius:100}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* My listing performance table */}
        <div style={card({padding:0,overflow:"hidden"})}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #f5f5f5",...PF({fontSize:14,fontWeight:600,color:"#1a1f36"})}}>Listing Performance</div>
          {myListings.length===0&&<div style={{textAlign:"center",padding:"24px",color:"#9ca3af",fontSize:13}}>Create listings to see performance data.</div>}
          {myListings.map((p,i)=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",borderBottom:i<myListings.length-1?"1px solid #f5f5f5":"none"}}>
              <div style={{fontSize:24,width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,#f0f7f0,#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.e}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{p.name}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{p.qty} · {p.grade}</div>
              </div>
              {[{l:"Price",v:`₹${p.price}`},{l:"Bids",v:p.bids.length},{l:"Views",v:Math.floor(Math.random()*120+30)},{l:"Best Bid",v:p.bids.length?`₹${Math.max(...p.bids.map(b=>b.offer))}`:"—"}].map(({l,v})=>(
                <div key={l} style={{textAlign:"center",minWidth:60}}>
                  <div style={{fontSize:14,fontWeight:700,color:gd}}>{v}</div>
                  <div style={{fontSize:9,color:"#9ca3af"}}>{l}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
/* ═══════════════════════════════════════════════════════
   PAGE: DRAFTS — fully working
═══════════════════════════════════════════════════════ */
const DRAFTS_INIT = [
  {id:101,e:"🌽",crop:"Corn",cat:"Vegetables",grade:"Grade A",qty:"600",unit:"kg",price:"19",desc:"Hybrid sweet corn batch 2. Freshly harvested.",certs:["FSSAI"],harvest:"",moisture:"",delivery:"Pickup from farm",savedAt:"Today, 10:42 AM",pct:72},
  {id:102,e:"🧅",crop:"Onion",cat:"Vegetables",grade:"Grade B",qty:"3000",unit:"kg",price:"",desc:"",certs:[],harvest:"",moisture:"",delivery:"Pickup from farm",savedAt:"Yesterday, 4:15 PM",pct:40},
  {id:103,e:"🌾",crop:"Wheat",cat:"Grains",grade:"Grade A",qty:"5000",unit:"kg",price:"27",desc:"Rabi season wheat freshly harvested. Moisture tested.",certs:["FSSAI"],harvest:"2026-02-20",moisture:"< 14%",delivery:"I can deliver within 50km",savedAt:"22 Feb, 9:00 AM",pct:88},
];

function DraftEditModal({draft,onSave,onClose}){
  const [form,setForm]=useState({...draft});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const crops=CROPS_BY_CAT[form.cat]||[];
  const fields=[form.crop,form.qty,form.price,form.desc,form.harvest];
  const completeness=Math.round((fields.filter(Boolean).length/fields.length)*100);

  return(
    <>
      <div style={{...PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>✏️ Edit Draft</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Complete missing fields then publish</div>
      {/* Completeness bar */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}>
          <span style={{color:"#6b7280"}}>Draft Completeness</span>
          <span style={{fontWeight:700,color:completeness>80?gm:completeness>50?"#d97706":"#ef4444"}}>{completeness}%</span>
        </div>
        <div style={{height:5,background:"#f0f0f0",borderRadius:100}}>
          <div style={{height:"100%",width:`${completeness}%`,background:completeness>80?`linear-gradient(90deg,${ac},${gm})`:completeness>50?"linear-gradient(90deg,#fde68a,#d97706)":"linear-gradient(90deg,#fca5a5,#ef4444)",borderRadius:100,transition:"width .4s"}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Category" type="select" opts={Object.keys(CROPS_BY_CAT)} value={form.cat} onChange={v=>{set("cat",v);set("crop",CROPS_BY_CAT[v][0]);}}/>
        <Field label="Crop *" type="select" opts={crops} value={form.crop} onChange={v=>set("crop",v)}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
        <Field label="Quantity *" placeholder="e.g. 500" value={form.qty} onChange={v=>set("qty",v)}/>
        <Field label="Unit" type="select" opts={["kg","ton","quintal"]} value={form.unit} onChange={v=>set("unit",v)}/>
      </div>
      <Field label="Asking Price ₹/kg *" placeholder="e.g. 22" value={form.price} onChange={v=>set("price",v)}/>
      <Field label="Grade" type="select" opts={GRADES} value={form.grade} onChange={v=>set("grade",v)}/>
      <Field label="Harvest Date" type="date" value={form.harvest} onChange={v=>set("harvest",v)}/>
      <Field label="Description" type="textarea" placeholder="Quality, packaging, delivery terms…" value={form.desc} onChange={v=>set("desc",v)} rows={3}/>
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Cancel</button>
        <button onClick={()=>onSave({...form,pct:completeness})} style={ghBtn({flex:1})}>💾 Save Draft</button>
        <button onClick={()=>onSave({...form,pct:completeness,publish:true})} disabled={!form.qty||!form.price} style={{...gBtn({flex:2,opacity:form.qty&&form.price?1:.5})}}>🚀 Publish Now</button>
      </div>
    </>
  );
}

function PageDrafts({produce,setProduce}){
  const [drafts,setDrafts]=useState(DRAFTS_INIT);
  const [editing,setEditing]=useState(null);
  const [justPublished,setJustPublished]=useState({});

  const deleteDraft=id=>setDrafts(p=>p.filter(d=>d.id!==id));

  const handleSave=(id,data)=>{
    if(data.publish){
      setProduce(p=>[{
        id:Date.now(),e:data.e,name:`${data.crop} (${data.grade})`,cat:data.cat,
        farmer:"Ramesh Patil",loc:"Nashik, MH",
        price:parseFloat(data.price)||0,
        qty:`${data.qty} ${data.unit}`,qtyNum:parseFloat(data.qty)||0,
        grade:data.grade,fresh:"Just now",geo:true,verified:true,bids:[],
        desc:data.desc||"",imgs:[data.e],cert:data.certs||[],
        harvest:data.harvest,moisture:data.moisture,myListing:true
      },...p]);
      setJustPublished(p=>({...p,[id]:true}));
      setTimeout(()=>{
        setDrafts(p=>p.filter(d=>d.id!==id));
        setJustPublished(p=>{const n={...p};delete n[id];return n;});
      },1500);
    } else {
      setDrafts(p=>p.map(d=>d.id===id?{...d,...data}:d));
    }
    setEditing(null);
  };

  return(
    <>
      <Topbar title="Drafts 📝" sub={`${drafts.length} saved drafts — complete and publish when ready`} actions={
        <button onClick={()=>setEditing("new")} style={gBtn({padding:"8px 16px",fontSize:12})}>+ New Draft</button>
      }/>
      <div style={{padding:"22px 28px"}} className="fu">
        {drafts.length===0&&(
          <div style={{...card({textAlign:"center",padding:"56px 40px"})}}>
            <div style={{fontSize:52,marginBottom:14}}>📝</div>
            <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>No drafts saved</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:22}}>When you save a listing as draft, it appears here</div>
            <button onClick={()=>setEditing("new")} style={gBtn({padding:"11px 24px"})}>+ Start a Draft</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
          {drafts.map(d=>(
            <div key={d.id} style={{...card({padding:0,overflow:"hidden",transition:"all .2s"}),opacity:justPublished[d.id]?.5:1}}>
              {justPublished[d.id]&&(
                <div style={{padding:"10px 16px",background:"#f0f7f0",textAlign:"center",fontSize:12,fontWeight:700,color:gm}}>🎉 Published to Marketplace!</div>
              )}
              <div style={{display:"flex",gap:0}}>
                <div style={{width:80,background:`linear-gradient(135deg,${gd}cc,${gm}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,flexShrink:0}}>{d.e}</div>
                <div style={{flex:1,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{...PF({fontSize:14,fontWeight:700,color:"#1a2e1a"})}}>{d.crop} — {d.grade}</div>
                    <span style={{fontSize:10,color:"#9ca3af"}}>{d.savedAt}</span>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",marginBottom:10}}>
                    {d.qty?`📦 ${d.qty} ${d.unit}`:"📦 Qty not set"} · {d.price?`₹${d.price}/kg`:"💰 Price not set"}
                  </div>
                  {/* Completeness */}
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:4}}>
                      <span style={{color:"#9ca3af"}}>Completeness</span>
                      <span style={{fontWeight:700,color:d.pct>80?gm:d.pct>50?"#d97706":"#ef4444"}}>{d.pct}%</span>
                    </div>
                    <div style={{height:4,background:"#f0f0f0",borderRadius:100}}>
                      <div style={{height:"100%",width:`${d.pct}%`,background:d.pct>80?`linear-gradient(90deg,${ac},${gd})`:d.pct>50?"linear-gradient(90deg,#fde68a,#d97706)":"linear-gradient(90deg,#fca5a5,#ef4444)",borderRadius:100,transition:"width .4s"}}/>
                    </div>
                  </div>
                  {/* Missing fields warning */}
                  {(!d.price||!d.desc||!d.harvest)&&(
                    <div style={{fontSize:10,color:"#d97706",background:"#fffbeb",borderRadius:7,padding:"4px 9px",marginBottom:10,border:"1px solid #fde68a"}}>
                      ⚠️ Missing: {[!d.price&&"price",!d.desc&&"description",!d.harvest&&"harvest date"].filter(Boolean).join(", ")}
                    </div>
                  )}
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>setEditing(d)} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>✏️ Edit</button>
                    <button onClick={()=>handleSave(d.id,{...d,publish:true})} disabled={!d.qty||!d.price} style={{...gBtn({flex:2,padding:"7px 0",fontSize:11,opacity:d.qty&&d.price?1:.5})}}>🚀 Publish</button>
                    <button onClick={()=>deleteDraft(d.id)} style={{...ghBtn({padding:"7px 11px",fontSize:11}),color:"#ef4444"}}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Tips */}
        {drafts.length>0&&(
          <div style={{...card({marginTop:16,padding:"14px 18px",display:"flex",gap:12,alignItems:"flex-start",background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",border:"1px solid rgba(45,107,48,.1)"})}}>
            <span style={{fontSize:20,flexShrink:0}}>💡</span>
            <div style={{fontSize:12,color:"#1a2e1a",lineHeight:1.7}}>
              <strong>Tip:</strong> Drafts with photos get <strong>3× more bids</strong>. Complete the missing fields, add a GPS photo and publish to reach 2,000+ buyers today.
            </div>
          </div>
        )}
      </div>
      {editing&&editing!=="new"&&<Modal onClose={()=>setEditing(null)} w={540}><DraftEditModal draft={editing} onSave={(data)=>handleSave(editing.id,data)} onClose={()=>setEditing(null)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: BROWSE TENDERS — farmer side, full apply flow
═══════════════════════════════════════════════════════ */
const TENDERS_DATA = [
  {id:1,company:"Britannia Industries",companyE:"🏭",crop:"Wheat",title:"50 ton Wheat Supply — Q1 2026",budget:"₹26–29",budgetMax:29,qty:"50 ton",deadline:"15 Mar 2026",freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Protein content 11%+, moisture < 14%. Packaging 50kg HDPE bags. Payment NET 7 days after delivery. Farm visit mandatory before contract.",applied:12,match:94,tag:"Best Match",urgent:true},
  {id:2,company:"PepsiCo India",companyE:"🏭",crop:"Potato",title:"Potato Chip Grade — 100 ton",budget:"₹22–25",budgetMax:25,qty:"100 ton",deadline:"22 Mar 2026",freq:"Bi-weekly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Specific gravity >1.080, size 40–80mm, dry matter >19%. Storage potato preferred. Farm visit required before contract.",applied:8,match:87,tag:"High Pay",urgent:false},
  {id:3,company:"NatureFresh",companyE:"🌿",crop:"Chilli",title:"Red Chilli (Teja) Export — Dubai",budget:"₹80–90",budgetMax:90,qty:"20 ton",deadline:"18 Mar 2026",freq:"One-time",grade:"Grade A",state:"Karnataka",cert:"APEDA",desc:"Teja/Byadgi variety. Capsaicin certified. Export-quality packaging. APEDA registration required. Documentation support provided.",applied:5,match:78,tag:"Export",urgent:true},
  {id:4,company:"BigBasket",companyE:"🛒",crop:"Onion",title:"Onion Bulk Supply — Pan India",budget:"₹13–16",budgetMax:16,qty:"200 ton",deadline:"01 Apr 2026",freq:"Weekly",grade:"Any",state:"All India",cert:"None",desc:"Medium Nashik onion 40–60mm. Weekly pickup from farm. Our transport provided. Payment same week.",applied:0,match:91,tag:"New",urgent:false},
  {id:5,company:"Haldiram's",companyE:"🏭",crop:"Tomato",title:"Processing Tomato Supply",budget:"₹28–35",budgetMax:35,qty:"80 ton",deadline:"10 Apr 2026",freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"Round hybrid tomato, Brix 5.2+, 60–80mm. Sorting and grading by farmer preferred. Consistent monthly supply.",applied:3,match:82,tag:null,urgent:false},
  {id:6,company:"Organic India",companyE:"🌱",crop:"Soybean",title:"Organic Soybean — Premium Contract",budget:"₹48–55",budgetMax:55,qty:"30 ton",deadline:"30 Mar 2026",freq:"Quarterly",grade:"Grade A",state:"Madhya Pradesh",cert:"Organic",desc:"Certified organic, non-GMO. Protein 40%+. Long-term premium contract available for consistent certified supply.",applied:3,match:69,tag:"Organic Premium",urgent:false},
];

function ApplyTenderModal({tender,onClose,onApplied}){
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({offer:"",qty:"",delivery:"Within 2 weeks",note:"",hasCert:false});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const aiSuggest=Math.round((tender.budgetMax*0.97));

  if(done) return(
    <div style={{textAlign:"center",padding:"22px 0"}} className="fu">
      <div style={{fontSize:60,marginBottom:14}}>✅</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>Application Submitted!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.9,marginBottom:22}}>
        Your bid of <strong>₹{form.offer}/kg</strong> for <strong>{form.qty}</strong> has been sent to <strong>{tender.company}</strong>.<br/>
        You'll receive a reply within <strong style={{color:gm}}>24–48 hours</strong>. Track it under <strong>Bids Received</strong>.
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
      <button onClick={()=>{onApplied&&onApplied(tender.id);onClose();}} style={gBtn({padding:"11px 36px"})}>Done</button>
    </div>
  );

  return(
    <>
      {/* Company header */}
      <div style={{background:`linear-gradient(135deg,${navy},#2d3b6b)`,borderRadius:16,padding:"16px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:46,height:46,borderRadius:13,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{tender.companyE}</div>
        <div style={{flex:1}}>
          <div style={{...PF({fontSize:15,fontWeight:700,color:"#fff"})}}>{tender.title}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2}}>🏭 {tender.company} · 📦 {tender.qty} · {tender.budget}/kg</div>
        </div>
      </div>
      <div style={{...PF({fontSize:16,fontWeight:700,color:"#1a2e1a",marginBottom:14})}}>Submit Your Application</div>
      {/* AI suggestion */}
      <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:13,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center",border:"1px solid rgba(45,107,48,.12)"}}>
        <span style={{fontSize:18,flexShrink:0}}>🤖</span>
        <div style={{fontSize:11,color:"#1a2e1a",lineHeight:1.7}}>
          <strong>AI Tip:</strong> {tender.company} usually accepts bids near the upper range. Try <strong style={{color:gm}}>₹{aiSuggest}/kg</strong> for best chances. Budget: <strong>{tender.budget}/kg</strong>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label={`Your Offer ₹/kg *`} placeholder={`Budget: ${tender.budget}`} value={form.offer} onChange={v=>set("offer",v)}/>
        <Field label="Quantity You Can Supply *" placeholder={`Max: ${tender.qty}`} value={form.qty} onChange={v=>set("qty",v)}/>
      </div>
      <Field label="Expected Delivery" type="select" opts={["Within 1 week","Within 2 weeks","Within 1 month","As per schedule"]} value={form.delivery} onChange={v=>set("delivery",v)}/>
      <Field label="Note to Buyer" type="textarea" placeholder="Mention quality, certifications, your experience, why you're the best fit…" value={form.note} onChange={v=>set("note",v)} rows={3}/>
      {/* Cert checkbox */}
      {tender.cert!=="None"&&(
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#374151",marginBottom:14}}>
          <div onClick={()=>set("hasCert",!form.hasCert)} style={{width:16,height:16,borderRadius:4,background:form.hasCert?gd:"transparent",border:`1.5px solid ${form.hasCert?gd:"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
            {form.hasCert&&<span style={{color:"#fff",fontSize:9}}>✓</span>}
          </div>
          I have <strong style={{margin:"0 4px"}}>{tender.cert}</strong> certification ready to share
        </label>
      )}
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Cancel</button>
        <button onClick={()=>form.offer&&form.qty&&setDone(true)} disabled={!form.offer||!form.qty} style={{...gBtn({flex:2,padding:12,opacity:form.offer&&form.qty?1:.5})}}>Submit Application →</button>
      </div>
    </>
  );
}

function PageBrowseTenders(){
  const [search,setSearch]=useState("");
  const [cropFilter,setCropFilter]=useState("All");
  const [sort,setSort]=useState("Best Match");
  const [applying,setApplying]=useState(null);
  const [applied,setApplied]=useState({});
  const [expanded,setExpanded]=useState(null);
  const [tenders,setTenders]=useState(TENDERS_DATA);

  const crops=["All",...new Set(TENDERS_DATA.map(t=>t.crop))];
  let filtered=tenders.filter(t=>{
    if(cropFilter!=="All"&&t.crop!==cropFilter)return false;
    if(search&&!t.title.toLowerCase().includes(search.toLowerCase())&&!t.company.toLowerCase().includes(search.toLowerCase())&&!t.crop.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  if(sort==="Best Match")filtered=[...filtered].sort((a,b)=>b.match-a.match);
  if(sort==="Highest Pay")filtered=[...filtered].sort((a,b)=>b.budgetMax-a.budgetMax);
  if(sort==="Deadline")filtered=[...filtered].sort((a,b)=>new Date(a.deadline)-new Date(b.deadline));

  const doApplied=id=>{
    setApplied(p=>({...p,[id]:true}));
    setTenders(p=>p.map(t=>t.id===id?{...t,applied:t.applied+1}:t));
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
          {["Best Match","Highest Pay","Deadline"].map(o=><option key={o}>{o}</option>)}
        </select>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {/* Crop filter pills */}
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
          {crops.map(c=>(
            <button key={c} onClick={()=>setCropFilter(c)} style={{padding:"6px 16px",borderRadius:100,border:`1.5px solid ${cropFilter===c?gm:"#e5e7eb"}`,background:cropFilter===c?"#f0f7f0":"#fff",color:cropFilter===c?gm:"#374151",fontSize:11,fontWeight:cropFilter===c?700:500,cursor:"pointer",transition:"all .12s"}}>{c}</button>
          ))}
        </div>

        {filtered.length===0&&(
          <div style={{...card({textAlign:"center",padding:"48px 0",color:"#9ca3af"})}}>
            <div style={{fontSize:40,marginBottom:12}}>📑</div>
            <div style={{fontSize:14,fontWeight:600}}>No tenders match your search</div>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {filtered.map(t=>{
            const isExpanded=expanded===t.id;
            const isApplied=applied[t.id];
            return(
              <div key={t.id} style={{...card({padding:0,overflow:"hidden",transition:"all .2s",border:isApplied?"1.5px solid rgba(45,107,48,.25)":"1px solid rgba(30,70,20,.07)"})}}>
                {/* Main row */}
                <div style={{padding:"18px 20px",cursor:"pointer"}} onClick={()=>setExpanded(isExpanded?null:t.id)}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    {/* Company icon */}
                    <div style={{width:50,height:50,borderRadius:14,background:`linear-gradient(135deg,#f0f4f8,#e2e8f0)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{t.companyE}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{...PF({fontSize:15,fontWeight:700,color:"#1a1f36"})}}>{t.title}</span>
                        {t.tag&&<Badge color={tagColor(t.tag)}>{t.tag}</Badge>}
                        {t.urgent&&<Badge color="red" size="xs">⚡ Urgent</Badge>}
                        {isApplied&&<Badge color="green">✅ Applied</Badge>}
                      </div>
                      <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>🏭 {t.company} · 📦 {t.qty} · 🔄 {t.freq} · ⏰ {t.deadline}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <Badge color="green">{t.grade}</Badge>
                        <Badge color="blue">{t.cert!=="None"?`🏅 ${t.cert}`:"No cert needed"}</Badge>
                        <Badge color="gray">📍 {t.state}</Badge>
                        <Badge color="amber">{t.applied} applied</Badge>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{...PF({fontSize:20,fontWeight:800,color:gd})}}>{t.budget}<span style={{fontSize:11,fontWeight:400}}>/kg</span></div>
                      {/* AI match score */}
                      <div style={{display:"flex",alignItems:"center",gap:5,marginTop:6,justifyContent:"flex-end"}}>
                        <div style={{height:5,width:50,background:"#f0f0f0",borderRadius:100}}>
                          <div style={{height:"100%",width:`${t.match}%`,background:t.match>85?`linear-gradient(90deg,${ac},${gd})`:"linear-gradient(90deg,#fde68a,#d97706)",borderRadius:100}}/>
                        </div>
                        <span style={{fontSize:10,fontWeight:700,color:t.match>85?gm:"#d97706"}}>{t.match}% match</span>
                      </div>
                      <div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>AI match score</div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded&&(
                  <div style={{borderTop:"1px solid #f0f0f0",padding:"16px 20px",background:"#fafdf9",animation:"fadeIn .2s ease"}} className="fi">
                    <div style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:16}}>{t.desc}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                      {[{i:"💰",l:"Budget",v:t.budget+"/kg"},{i:"📦",l:"Required",v:t.qty},{i:"🔄",l:"Frequency",v:t.freq},{i:"🏅",l:"Certification",v:t.cert}].map(({i,l,v})=>(
                        <div key={l} style={{background:"#fff",borderRadius:12,padding:"10px 12px",textAlign:"center",border:"1px solid #f0f0f0"}}>
                          <div style={{fontSize:18,marginBottom:4}}>{i}</div>
                          <div style={{fontSize:9,color:"#9ca3af",marginBottom:2}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,color:"#1a2e1a"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={()=>setExpanded(null)} style={ghBtn({flex:1,padding:"9px 0",fontSize:12})}>Close Details</button>
                      <button onClick={()=>!isApplied&&setApplying(t)} style={{...gBtn({flex:2,padding:"9px 0",fontSize:12}),background:isApplied?`linear-gradient(135deg,${ac},${gm})`:""}}>
                        {isApplied?"✅ Application Sent":"Apply for This Tender →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Collapsed action strip */}
                {!isExpanded&&(
                  <div style={{borderTop:"1px solid #f5f5f5",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fafafa"}}>
                    <span style={{fontSize:11,color:"#9ca3af"}}>Click to expand · {t.applied} farmers applied</span>
                    <button onClick={e=>{e.stopPropagation();!isApplied&&setApplying(t);}} style={{...gBtn({padding:"6px 18px",fontSize:11}),background:isApplied?`linear-gradient(135deg,${ac},${gm})`:""}}>
                      {isApplied?"✅ Applied":"Apply Now →"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {applying&&<Modal onClose={()=>setApplying(null)} w={540}><ApplyTenderModal tender={applying} onClose={()=>setApplying(null)} onApplied={doApplied}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE: SETTINGS (simple, working)
═══════════════════════════════════════════════════════ */
function PageSettings(){
  const [saved,setSaved]=useState(false);
  const [notif,setNotif]=useState({sms:true,email:true,app:true,bid:true});
  const [profile,setProfile]=useState({name:"Ramesh Patil",phone:"+91 98765 43210",village:"Igatpuri",district:"Nashik",state:"Maharashtra",land:"4.5 acres",crops:"Potato, Onion, Wheat"});
  const set=(k,v)=>setProfile(p=>({...p,[k]:v}));

  return(
    <>
      <Topbar title="Settings ⚙️" sub="Profile, notifications, bank account"/>
      <div style={{padding:"22px 28px",maxWidth:680}} className="fu">
        {saved&&<div style={{background:"#f0f7f0",border:"1px solid rgba(45,107,48,.2)",borderRadius:12,padding:"10px 16px",marginBottom:16,fontSize:13,color:gm,fontWeight:600}}>✅ Settings saved!</div>}
        <div style={{...card({marginBottom:16,padding:22})}}>
          <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Farmer Profile</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Full Name" value={profile.name} onChange={v=>set("name",v)}/>
            <Field label="Phone" value={profile.phone} onChange={v=>set("phone",v)}/>
            <Field label="Village" value={profile.village} onChange={v=>set("village",v)}/>
            <Field label="District" value={profile.district} onChange={v=>set("district",v)}/>
            <Field label="State" type="select" opts={["Maharashtra","Punjab","UP","MP","Karnataka","Gujarat"]} value={profile.state} onChange={v=>set("state",v)}/>
            <Field label="Land Holding" value={profile.land} onChange={v=>set("land",v)}/>
          </div>
          <Field label="Main Crops" value={profile.crops} onChange={v=>set("crops",v)}/>
        </div>
        <div style={card({marginBottom:16,padding:22})}>
          <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Notifications</div>
          {[{k:"sms",l:"SMS Alerts",d:"Bid updates and tender matches via SMS"},{k:"email",l:"Email",d:"Daily digest"},{k:"app",l:"In-App",d:"Real-time alerts"},{k:"bid",l:"New Bid Alert",d:"Instantly when a buyer bids on your listing"}].map(({k,l,d})=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f5f5f5"}}>
              <div><div style={{fontSize:13,fontWeight:600,color:"#1a2e1a"}}>{l}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{d}</div></div>
              <div onClick={()=>setNotif(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:100,background:notif[k]?gm:"#e5e7eb",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:notif[k]?21:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>setSaved(true)} style={gBtn({padding:"11px 32px",fontSize:13})}>Save Changes</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function ProduceListingApp(){
  const [page,setPage]=useState("marketplace");
  const [produce,setProduce]=useState(PRODUCE_INIT);

  const renderPage=()=>{
    switch(page){
      case "marketplace":  return <PageMarketplace produce={produce} setProduce={setProduce}/>;
      case "mylistings":   return <PageMyListings produce={produce} setProduce={setProduce}/>;
      case "bidsreceived": return <PageBidsReceived produce={produce} setProduce={setProduce}/>;
      case "drafts":       return <PageDrafts produce={produce} setProduce={setProduce}/>;
      case "analytics":    return <PageAnalytics produce={produce}/>;
      case "tenders":      return <PageBrowseTenders/>;
      case "messages":     return (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:40}}>
          <div style={{fontSize:52}}>💬</div>
          <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a"})}}>Messages</div>
          <div style={{fontSize:13,color:"#9ca3af"}}>Full chat system — building next</div>
        </div>
      );
      case "settings": return <PageSettings/>;
      default: return null;
    }
  };

  return(
    <>
      <style>{CSS}</style>
      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <TickerBar/>
        <div style={{display:"flex",flex:1}}>
          <Sidebar page={page} setPage={setPage}/>
          <div style={{marginLeft:214,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",background:"#eef2e8"}}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
