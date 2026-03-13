"use client";
import { useState, useRef, useEffect } from "react";

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#eef2e8;}
input,textarea,select,button{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:rgba(30,70,20,.15);border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fu{animation:fadeUp .22s ease both;}
.fi{animation:fadeIn .18s ease both;}
.mi{animation:msgIn .2s ease both;}
.pi{animation:popIn .18s cubic-bezier(.34,1.56,.64,1) both;}
.pulse{animation:pulse 1.4s ease infinite;}
.spin{animation:spin .7s linear infinite;}
`;

/* ─── TOKENS ─── */
const gd="#1e4620",gm="#2d6b30",ac="#a3c45c",navy="#1e2a4a",cr="#f6f9f0";
const PF=s=>({fontFamily:"'Playfair Display',serif",...s});
const gBtn=(x={})=>({background:`linear-gradient(135deg,${gd},${gm})`,color:"#fff",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,...x});
const ghBtn=(x={})=>({background:"#f0f4ec",color:"#374151",border:"1px solid rgba(30,70,20,.1)",borderRadius:12,padding:"10px 16px",fontWeight:600,cursor:"pointer",fontSize:13,...x});

/* ─── TICKER ─── */
const TICKER=[
  {n:"Wheat",p:"₹28/kg",c:"+0.8%",up:true},{n:"Potato",p:"₹22/kg",c:"+4.2%",up:true},
  {n:"Onion",p:"₹14/kg",c:"-1.8%",up:false},{n:"Chilli",p:"₹85/kg",c:"+6.4%",up:true},
  {n:"Corn",p:"₹18/kg",c:"+2.1%",up:true},{n:"Tomato",p:"₹32/kg",c:"+12.3%",up:true},
];

/* ─── LANGUAGES ─── */
const LANGUAGES=[
  {code:"en",label:"English",native:"English"},
  {code:"hi",label:"Hindi",native:"हिन्दी"},
  {code:"mr",label:"Marathi",native:"मराठी"},
  {code:"pa",label:"Punjabi",native:"ਪੰਜਾਬੀ"},
  {code:"gu",label:"Gujarati",native:"ગુજરાતી"},
  {code:"ta",label:"Tamil",native:"தமிழ்"},
  {code:"te",label:"Telugu",native:"తెలుగు"},
  {code:"kn",label:"Kannada",native:"ಕನ್ನಡ"},
  {code:"bn",label:"Bengali",native:"বাংলা"},
  {code:"ar",label:"Arabic",native:"العربية"},
];

/* ─── MOCK TRANSLATIONS (simulated) ─── */
const MOCK_TRANSLATIONS={
  en:{
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":"I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":"Our factory needs the potatoes by March 20. Can you guarantee that date?",
    "Yes, I can deliver by March 18. I'll send you a sample first.":"Yes, I can deliver by March 18. I'll send you a sample first.",
  },
  hi:{
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":"मैं ₹23/किग्रा पर 500 किग्रा ग्रेड A आलू की आपूर्ति कर सकता हूं। आपको डिलीवरी कब चाहिए?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":"हमारे कारखाने को 20 मार्च तक आलू चाहिए। क्या आप उस तारीख की गारंटी दे सकते हैं?",
    "Yes, I can deliver by March 18. I'll send you a sample first.":"हां, मैं 18 मार्च तक डिलीवरी कर सकता हूं। पहले मैं आपको एक नमूना भेजूंगा।",
  },
  mr:{
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":"मी ₹23/किलोने 500 किलो ग्रेड A बटाटे पुरवू शकतो. तुम्हाला डिलिव्हरी केव्हा हवी?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":"आमच्या कारखान्याला 20 मार्चपर्यंत बटाटे हवे आहेत. तुम्ही ती तारीख हमी देऊ शकता का?",
    "Yes, I can deliver by March 18. I'll send you a sample first.":"होय, मी 18 मार्चपर्यंत डिलिव्हरी करू शकतो. मी आधी तुम्हाला नमुना पाठवतो.",
  },
  pa:{
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":"ਮੈਂ ₹23/ਕਿਲੋ 'ਤੇ 500 ਕਿਲੋ ਗ੍ਰੇਡ A ਆਲੂ ਸਪਲਾਈ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਹਾਨੂੰ ਡਿਲੀਵਰੀ ਕਦੋਂ ਚਾਹੀਦੀ ਹੈ?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":"ਸਾਡੀ ਫੈਕਟਰੀ ਨੂੰ 20 ਮਾਰਚ ਤੱਕ ਆਲੂ ਚਾਹੀਦੇ ਹਨ। ਕੀ ਤੁਸੀਂ ਉਸ ਤਾਰੀਖ ਦੀ ਗਾਰੰਟੀ ਦੇ ਸਕਦੇ ਹੋ?",
    "Yes, I can deliver by March 18. I'll send you a sample first.":"ਹਾਂ, ਮੈਂ 18 ਮਾਰਚ ਤੱਕ ਡਿਲੀਵਰ ਕਰ ਸਕਦਾ ਹਾਂ। ਪਹਿਲਾਂ ਮੈਂ ਤੁਹਾਨੂੰ ਇੱਕ ਨਮੂਨਾ ਭੇਜਾਂਗਾ।",
  },
};

function getTranslation(text,lang){
  if(lang==="en") return text;
  const t=MOCK_TRANSLATIONS[lang];
  if(t&&t[text]) return t[text];
  // fallback — simulate
  const prefixes={hi:"[हिंदी] ",mr:"[मराठी] ",pa:"[ਪੰਜਾਬੀ] ",gu:"[ગુ.] ",ta:"[த.] ",te:"[తె.] ",kn:"[ಕ.] ",bn:"[বাং.] ",ar:"[ع.] "};
  return (prefixes[lang]||"[Translated] ")+text;
}

/* ─── CONVERSATION DATA ─── */
const CONVERSATIONS_INIT=[
  {
    id:1,name:"PepsiCo India",avatar:"🏭",role:"buyer",verified:true,online:true,
    unread:2,lastMsg:"We need the potatoes by March 20.",lastTime:"2m ago",
    about:"Regarding: Chip-Grade Potato Tender",crop:"Potato",tender:"Chip-Grade Potato Contract",
    messages:[
      {id:1,from:"them",text:"Hello Ramesh ji! We saw your listing for Grade A Potatoes. Are you interested in supplying for our Lays chip production?",time:"10:02 AM",type:"text",status:"read"},
      {id:2,from:"me",text:"Namaste! Yes, absolutely. I have 800 kg available right now. What quality specs do you need?",time:"10:05 AM",type:"text",status:"read"},
      {id:3,from:"them",text:"We need specific gravity >1.080, size 40–80mm. Can you do that?",time:"10:07 AM",type:"text",status:"read"},
      {id:4,from:"me",text:"I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?",time:"10:10 AM",type:"text",status:"read"},
      {id:5,from:"them",text:"Our factory needs the potatoes by March 20. Can you guarantee that date?",time:"10:13 AM",type:"text",status:"read"},
      {id:6,from:"me",text:"Yes, I can deliver by March 18. I'll send you a sample first.",time:"10:15 AM",type:"text",status:"read"},
      {id:7,from:"them",file:{name:"Quality_Requirements.pdf",size:"1.2 MB",type:"doc"},time:"10:18 AM",type:"file",status:"read"},
      {id:8,from:"me",img:"🥔",imgLabel:"Farm photo — Grade A Potatoes",time:"10:22 AM",type:"image",status:"read"},
      {id:9,from:"them",text:"We need the potatoes by March 20.",time:"Just now",type:"text",status:"delivered"},
      {id:10,from:"them",text:"Can you confirm the order for 500 kg?",time:"Just now",type:"text",status:"delivered"},
    ]
  },
  {
    id:2,name:"Britannia Industries",avatar:"🏭",role:"buyer",verified:true,online:false,
    unread:0,lastMsg:"Please share the FSSAI certificate.",lastTime:"1h ago",
    about:"Regarding: Wheat Tender Q2",crop:"Wheat",tender:"50 ton Premium Wheat",
    messages:[
      {id:1,from:"them",text:"Hi! We are interested in your wheat listing. Are you FSSAI certified?",time:"Yesterday",type:"text",status:"read"},
      {id:2,from:"me",text:"Yes, FSSAI certified. Protein content is 12.5%, well within your requirement.",time:"Yesterday",type:"text",status:"read"},
      {id:3,from:"them",text:"Please share the FSSAI certificate.",time:"1h ago",type:"text",status:"read"},
      {id:4,from:"me",file:{name:"FSSAI_Certificate_2026.pdf",size:"890 KB",type:"doc"},time:"45m ago",type:"file",status:"read"},
    ]
  },
  {
    id:3,name:"BigBasket",avatar:"🛒",role:"buyer",verified:true,online:true,
    unread:1,lastMsg:"Can you do weekly supply?",lastTime:"30m ago",
    about:"Regarding: Onion Supply",crop:"Onion",tender:"Onion Bulk Supply",
    messages:[
      {id:1,from:"them",text:"We need 2 ton of Nashik onions weekly. Are you able to supply consistently?",time:"30m ago",type:"text",status:"read"},
      {id:2,from:"them",text:"Can you do weekly supply?",time:"28m ago",type:"text",status:"delivered"},
    ]
  },
  {
    id:4,name:"NatureFresh Exports",avatar:"🌿",role:"buyer",verified:false,online:false,
    unread:0,lastMsg:"Thank you, we'll review your application.",lastTime:"2 days ago",
    about:"Regarding: Red Chilli Export",crop:"Chilli",tender:"Red Chilli Export Dubai",
    messages:[
      {id:1,from:"me",text:"I have Teja variety chilli, APEDA certified. Interested in your export tender.",time:"2 days ago",type:"text",status:"read"},
      {id:2,from:"them",text:"Thank you, we'll review your application.",time:"2 days ago",type:"text",status:"read"},
    ]
  },
  {
    id:5,name:"Haldiram's",avatar:"🏭",role:"buyer",verified:true,online:false,
    unread:0,lastMsg:"Send us a sample batch first.",lastTime:"3 days ago",
    about:"Regarding: Tomato Processing",crop:"Tomato",tender:"Processing Tomato",
    messages:[
      {id:1,from:"them",text:"We need Brix 5.2+ tomatoes for sauce. Do you have lab report?",time:"3 days ago",type:"text",status:"read"},
      {id:2,from:"me",img:"🍅",imgLabel:"Greenhouse Tomatoes — Brix 5.4",time:"3 days ago",type:"image",status:"read"},
      {id:3,from:"them",text:"Send us a sample batch first.",time:"3 days ago",type:"text",status:"read"},
    ]
  },
];

/* ─── QUICK REPLIES ─── */
const QUICK_REPLIES=[
  "What's your best price?","Can you arrange delivery?","Please share certificate",
  "I'm interested in bulk order","When can you deliver?","Can you send a sample?",
  "What are the payment terms?","Is farm visit possible?",
];

/* ─── FILE TYPE ICON ─── */
function fileIcon(type){
  if(type==="doc") return "📄";
  if(type==="pdf") return "📋";
  if(type==="video") return "🎬";
  return "📎";
}

/* ─── TICKER ─── */
function TickerBar(){
  return(
    <div style={{background:gd,padding:"7px 0",display:"flex",alignItems:"center",overflow:"hidden",flexShrink:0,zIndex:60}}>
      <div style={{padding:"0 18px",flexShrink:0,borderRight:"1px solid rgba(255,255,255,.1)"}}>
        <span style={{fontSize:9,fontWeight:800,color:ac,letterSpacing:1.2,textTransform:"uppercase"}}>MANDI LIVE</span>
      </div>
      <div style={{overflow:"hidden",flex:1}}>
        <div style={{display:"flex",gap:24,animation:"ticker 20s linear infinite",paddingLeft:24}}>
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

/* ─── PORTAL SWITCHER ─── */
function PortalSwitcher({portal,setPortal}){
  return(
    <div style={{position:"fixed",top:14,right:20,zIndex:200,display:"flex",gap:3,background:"rgba(255,255,255,.95)",borderRadius:14,padding:4,border:"1px solid rgba(30,42,74,.1)",backdropFilter:"blur(10px)",boxShadow:"0 4px 20px rgba(0,0,0,.1)"}}>
      {[{id:"farmer",label:"👨‍🌾 Farmer"},{id:"buyer",label:"🏭 Buyer"}].map(({id,label})=>(
        <button key={id} onClick={()=>setPortal(id)} style={{padding:"7px 16px",borderRadius:11,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:portal===id?(id==="farmer"?gd:navy):"transparent",color:portal===id?"#fff":"#374151",transition:"all .2s"}}>{label}</button>
      ))}
    </div>
  );
}

/* ─── TRANSLATE BUTTON ─── */
function TranslateBtn({text,lang,setLang}){
  const [open,setOpen]=useState(false);
  const [translated,setTranslated]=useState(null);
  const [loading,setLoading]=useState(false);
  const ref=useRef();

  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);

  const translate=(code)=>{
    if(code==="en"){setTranslated(null);setOpen(false);return;}
    setLoading(true);setOpen(false);
    setTimeout(()=>{
      setTranslated(getTranslation(text,code));
      setLoading(false);
    },600);
  };

  return(
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button
        onClick={()=>setOpen(p=>!p)}
        title="Translate with Google Translate"
        style={{background:"none",border:"none",cursor:"pointer",padding:"3px 6px",borderRadius:6,display:"flex",alignItems:"center",gap:3,color:"#9ca3af",fontSize:10,fontWeight:600,transition:"all .15s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="#f0f4ec";e.currentTarget.style.color=gm;}}
        onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="#9ca3af";}}
      >
        <span style={{fontSize:11}}>🌐</span>
        {loading?<span className="pulse">Translating…</span>:translated?"Translated":"Translate"}
      </button>
      {translated&&!loading&&(
        <button onClick={()=>setTranslated(null)} style={{background:"none",border:"none",cursor:"pointer",padding:"3px 5px",borderRadius:6,color:"#9ca3af",fontSize:10}} title="Show original">↩ Original</button>
      )}
      {/* Dropdown */}
      {open&&(
        <div style={{position:"absolute",bottom:"calc(100% + 6px)",left:0,background:"#fff",borderRadius:14,border:"1px solid rgba(30,70,20,.1)",boxShadow:"0 8px 32px rgba(0,0,0,.15)",zIndex:100,minWidth:180,padding:"6px 0",animation:"popIn .15s ease"}} className="pi">
          <div style={{padding:"7px 14px 5px",fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:.8,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}>
            <span>🌐</span> Google Translate
          </div>
          {LANGUAGES.map(l=>(
            <div key={l.code} onClick={()=>translate(l.code)} style={{padding:"8px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{color:"#374151",fontWeight:500}}>{l.label}</span>
              <span style={{color:"#9ca3af",fontSize:11}}>{l.native}</span>
            </div>
          ))}
        </div>
      )}
      {/* Translated text overlay */}
      {translated&&!loading&&(
        <div style={{marginTop:4,padding:"6px 10px",background:"#f0f7f0",borderRadius:9,fontSize:12,color:gd,lineHeight:1.5,border:"1px solid rgba(45,107,48,.12)",fontStyle:"italic"}}>
          {translated}
          <div style={{fontSize:9,color:"#9ca3af",marginTop:3,display:"flex",alignItems:"center",gap:3}}><span>🌐</span>Translated via Google Translate</div>
        </div>
      )}
    </div>
  );
}

/* ─── MESSAGE BUBBLE ─── */
function MessageBubble({msg,isMe,showTranslate}){
  const bubbleStyle={
    maxWidth:"72%",padding:msg.type==="image"?"6px":"10px 14px",
    borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
    background:isMe?`linear-gradient(135deg,${gd},${gm})`:"#fff",
    color:isMe?"#fff":"#1a2e1a",
    boxShadow:"0 2px 8px rgba(0,0,0,.07)",
    border:isMe?"none":"1px solid rgba(30,70,20,.06)",
  };

  return(
    <div style={{display:"flex",flexDirection:isMe?"row-reverse":"row",gap:8,marginBottom:4,alignItems:"flex-end"}} className="mi">
      {/* Avatar */}
      {!isMe&&<div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${navy},#2d3b6b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginBottom:2}}>🏭</div>}
      <div style={{maxWidth:"72%",display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start"}}>
        <div style={bubbleStyle}>
          {/* TEXT */}
          {msg.type==="text"&&(
            <div style={{fontSize:13,lineHeight:1.55}}>{msg.text}</div>
          )}
          {/* IMAGE */}
          {msg.type==="image"&&(
            <div style={{borderRadius:12,overflow:"hidden",minWidth:160}}>
              {msg.imgUrl
                ?<img src={msg.imgUrl} alt={msg.imgLabel||"photo"} style={{width:"100%",maxWidth:260,maxHeight:200,objectFit:"cover",display:"block"}}/>
                :<div style={{background:`linear-gradient(135deg,${gd}33,${gm}33)`,padding:"28px 24px",textAlign:"center",fontSize:56}}>{msg.img||"🖼️"}</div>
              }
              <div style={{padding:"6px 10px",background:isMe?"rgba(0,0,0,.15)":"#f9fdf9",fontSize:10,fontWeight:600,color:isMe?"rgba(255,255,255,.7)":"#6b7280"}}>{msg.imgLabel}</div>
              <div style={{padding:"4px 10px 8px",display:"flex",gap:6}}>
                <button style={{fontSize:10,padding:"3px 9px",borderRadius:7,border:"none",cursor:"pointer",background:isMe?"rgba(255,255,255,.15)":"#f0f4ec",color:isMe?"#fff":"#374151",fontWeight:600}}>View Full</button>
                <button style={{fontSize:10,padding:"3px 9px",borderRadius:7,border:"none",cursor:"pointer",background:isMe?"rgba(255,255,255,.15)":"#f0f4ec",color:isMe?"#fff":"#374151",fontWeight:600}}>⬇ Save</button>
              </div>
            </div>
          )}
          {/* VIDEO */}
          {msg.type==="video"&&(
            <div style={{borderRadius:12,overflow:"hidden",minWidth:180}}>
              <div style={{background:"#1a1a2e",padding:"24px",textAlign:"center",fontSize:40,position:"relative"}}>
                🎬
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}}>▶</div>
                </div>
              </div>
              <div style={{padding:"6px 10px 8px",background:isMe?"rgba(0,0,0,.15)":"#f9fdf9"}}>
                <div style={{fontSize:10,fontWeight:600,color:isMe?"rgba(255,255,255,.7)":"#6b7280"}}>{msg.videoLabel}</div>
                <div style={{fontSize:9,color:isMe?"rgba(255,255,255,.4)":"#9ca3af",marginTop:1}}>{msg.videoDuration||"0:32"} · {msg.videoSize||"4.2 MB"}</div>
              </div>
            </div>
          )}
          {/* FILE/DOC */}
          {msg.type==="file"&&(
            <div style={{display:"flex",alignItems:"center",gap:10,padding:2,minWidth:180}}>
              <div style={{width:38,height:38,borderRadius:10,background:isMe?"rgba(255,255,255,.15)":"#f0f7f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{fileIcon(msg.file?.type)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:isMe?"#fff":"#1a2e1a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{msg.file?.name}</div>
                <div style={{fontSize:10,color:isMe?"rgba(255,255,255,.55)":"#9ca3af",marginTop:1}}>{msg.file?.size}</div>
              </div>
              <button style={{width:30,height:30,borderRadius:"50%",border:"none",cursor:"pointer",background:isMe?"rgba(255,255,255,.15)":"#f0f4ec",color:isMe?"#fff":"#374151",fontSize:13,flexShrink:0}}>⬇</button>
            </div>
          )}
        </div>
        {/* Meta row */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexDirection:isMe?"row-reverse":"row",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:"#9ca3af"}}>{msg.time}</span>
          {isMe&&<span style={{fontSize:9,color:msg.status==="read"?gm:"#9ca3af"}}>{msg.status==="read"?"✓✓":msg.status==="delivered"?"✓✓":"✓"}</span>}
          {/* Translate button — only for text messages */}
          {msg.type==="text"&&<TranslateBtn text={msg.text}/>}
        </div>
      </div>
    </div>
  );
}

/* ─── ATTACHMENT PICKER ─── */
function AttachmentPicker({onAttach,onClose}){
  const [hover,setHover]=useState(null);
  const photoRef=useRef();
  const videoRef=useRef();
  const docRef=useRef();
  const certRef=useRef();

  const handleFile=(e,type)=>{
    const file=e.target.files[0];
    if(!file) return;
    onAttach({id:type,file});
    e.target.value="";
  };

  const opts=[
    {id:"photo",icon:"🖼️",label:"Photo",sub:"JPG, PNG, WebP",ref:photoRef,accept:"image/*"},
    {id:"video",icon:"🎬",label:"Video",sub:"MP4, MOV, AVI",ref:videoRef,accept:"video/*"},
    {id:"document",icon:"📄",label:"Document",sub:"PDF, DOCX, XLSX",ref:docRef,accept:".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"},
    {id:"certificate",icon:"🏅",label:"Certificate",sub:"FSSAI, Organic, APEDA",ref:certRef,accept:".pdf,.jpg,.jpeg,.png"},
    {id:"location",icon:"📍",label:"Location",sub:"Share farm location",ref:null,accept:null},
    {id:"contact",icon:"👤",label:"Contact",sub:"Share contact card",ref:null,accept:null},
  ];

  return(
    <div style={{position:"absolute",bottom:"calc(100% + 10px)",left:0,background:"#fff",borderRadius:18,border:"1px solid rgba(30,70,20,.1)",boxShadow:"0 12px 40px rgba(0,0,0,.15)",zIndex:100,padding:"14px 12px",width:260,animation:"popIn .18s ease"}} className="pi">
      {/* Hidden real file inputs */}
      <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e,"photo")}/>
      <input ref={videoRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>handleFile(e,"video")}/>
      <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" style={{display:"none"}} onChange={e=>handleFile(e,"document")}/>
      <input ref={certRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>handleFile(e,"certificate")}/>

      <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:10,textTransform:"uppercase",letterSpacing:.8,padding:"0 4px"}}>Share</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {opts.map(o=>(
          <div key={o.id}
            onClick={()=>o.ref?o.ref.current.click():onAttach({id:o.id,file:null})}
            onMouseEnter={()=>setHover(o.id)}
            onMouseLeave={()=>setHover(null)}
            style={{padding:"10px 12px",borderRadius:12,cursor:"pointer",border:`1.5px solid ${hover===o.id?"rgba(45,107,48,.3)":"rgba(30,70,20,.07)"}`,background:hover===o.id?"#f9fdf9":"#fafafa",transition:"all .15s"}}>
            <div style={{fontSize:22,marginBottom:5}}>{o.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:"#1a2e1a"}}>{o.label}</div>
            <div style={{fontSize:9,color:"#9ca3af",marginTop:1}}>{o.sub}</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",marginTop:10,padding:"7px",borderRadius:10,border:"none",background:"#f0f4ec",cursor:"pointer",fontSize:11,color:"#374151",fontWeight:600}}>Cancel</button>
    </div>
  );
}

/* ─── MEDIA UPLOAD PREVIEW ─── */
function MediaPreview({type,file,onSend,onCancel}){
  const [caption,setCaption]=useState("");
  const [previewUrl,setPreviewUrl]=useState(null);
  const icons={photo:"🖼️",video:"🎬",document:"📄",certificate:"🏅",location:"📍",contact:"👤"};

  useEffect(()=>{
    if(file&&(type==="photo")){
      const url=URL.createObjectURL(file);
      setPreviewUrl(url);
      return()=>URL.revokeObjectURL(url);
    }
  },[file,type]);

  const fileName=file?file.name:(type==="location"?"GPS Coordinates":type==="contact"?"Contact Card":"—");
  const fileSize=file?file.size>1048576?(file.size/1048576).toFixed(1)+" MB":(file.size/1024).toFixed(0)+" KB":"—";

  return(
    <div style={{padding:"14px 16px",background:"#f9fdf9",borderTop:"1px solid rgba(30,70,20,.08)",animation:"fadeUp .2s ease"}} className="fu">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        {/* Show real image preview if photo */}
        {type==="photo"&&previewUrl
          ?<img src={previewUrl} alt="preview" style={{width:50,height:50,borderRadius:12,objectFit:"cover",flexShrink:0}}/>
          :<div style={{width:50,height:50,borderRadius:12,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{icons[type]}</div>
        }
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:"#1a2e1a",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fileName}</div>
          {fileSize!=="—"&&<div style={{fontSize:10,color:"#9ca3af"}}>{fileSize}</div>}
        </div>
        <button onClick={onCancel} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"#fee2e2",cursor:"pointer",fontSize:13,color:"#991b1b",flexShrink:0}}>✕</button>
      </div>
      {(type==="photo"||type==="video")&&(
        <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Add a caption…" style={{width:"100%",padding:"8px 12px",border:"1.5px solid #e5e7eb",borderRadius:10,fontSize:12,outline:"none",marginBottom:10}}/>
      )}
      <button onClick={()=>onSend(type,file,caption)} style={gBtn({width:"100%",padding:"9px",fontSize:12})}>Send {icons[type]}</button>
    </div>
  );
}

/* ─── CONVERSATION LIST ITEM ─── */
function ConvoItem({convo,active,onClick,portal}){
  return(
    <div onClick={onClick} style={{display:"flex",gap:10,padding:"12px 14px",cursor:"pointer",background:active?"rgba(255,255,255,.08)":"transparent",borderLeft:active?`3px solid ${ac}`:"3px solid transparent",transition:"all .15s"}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,.04)"}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
      <div style={{position:"relative",flexShrink:0}}>
        <div style={{width:42,height:42,borderRadius:13,background:portal==="farmer"?"linear-gradient(135deg,#1e2a4a,#2d3b6b)":"linear-gradient(135deg,#1e4620,#2d6b30)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{convo.avatar}</div>
        {convo.online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"2px solid #1e2a4a"}}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <span style={{fontSize:12,fontWeight:active?700:600,color:active?"#fff":"rgba(255,255,255,.75)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convo.name}</span>
            {convo.verified&&<span style={{fontSize:9,color:ac}}>✅</span>}
          </div>
          <span style={{fontSize:9,color:"rgba(255,255,255,.3)",flexShrink:0}}>{convo.lastTime}</span>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.35)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{convo.lastMsg}</div>
      </div>
      {convo.unread>0&&<div style={{width:18,height:18,borderRadius:"50%",background:ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",flexShrink:0}}>{convo.unread}</div>}
    </div>
  );
}

/* ─── CALL MODAL ─── */
function CallModal({contact,type,onClose}){
  const [status,setStatus]=useState("calling");
  useEffect(()=>{
    const t=setTimeout(()=>setStatus("connected"),2200);
    return()=>clearTimeout(t);
  },[]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${navy},#2d3b6b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{contact.avatar}</div>
      <div style={PF({fontSize:22,fontWeight:700,color:"#fff"})}>{contact.name}</div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>{status==="calling"?`${type==="video"?"Video":"Voice"} calling…`:"Connected"}</div>
      {status==="calling"&&<div style={{fontSize:12,color:ac}} className="pulse">Ringing…</div>}
      {status==="connected"&&<div style={{fontSize:12,color:"#22c55e"}}>00:04</div>}
      <div style={{display:"flex",gap:16,marginTop:16}}>
        {type==="video"&&<button style={{width:54,height:54,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.1)",cursor:"pointer",fontSize:22}} title="Toggle camera">📷</button>}
        <button style={{width:54,height:54,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.1)",cursor:"pointer",fontSize:22}} title="Mute">🎤</button>
        <button style={{width:54,height:54,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.1)",cursor:"pointer",fontSize:22}} title="Speaker">🔊</button>
        <button onClick={onClose} style={{width:54,height:54,borderRadius:"50%",border:"none",background:"#ef4444",cursor:"pointer",fontSize:22}} title="End call">📵</button>
      </div>
    </div>
  );
}

/* ─── CHAT WINDOW ─── */
function ChatWindow({convo,onSend,portal}){
  const [input,setInput]=useState("");
  const [showAttach,setShowAttach]=useState(false);
  const [mediaPreview,setMediaPreview]=useState(null);
  const [showQuick,setShowQuick]=useState(false);
  const [showInfo,setShowInfo]=useState(false);
  const [callType,setCallType]=useState(null);
  const [msgReactions,setMsgReactions]=useState({});
  const [showReactionPicker,setShowReactionPicker]=useState(null);
  const endRef=useRef();

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[convo]);

  const send=()=>{
    if(!input.trim()) return;
    onSend(convo.id,{type:"text",text:input.trim(),from:"me",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),status:"sent"});
    setInput("");
    setShowQuick(false);
  };

  const sendMedia=(type,file,caption)=>{
    let msg;
    if(type==="photo"){
      const url=file?URL.createObjectURL(file):null;
      msg={type:"image",img:url?"":( "🖼️"),imgLabel:caption||file?.name||"Photo",imgUrl:url};
    } else if(type==="video"){
      msg={type:"video",videoLabel:caption||file?.name||"Video",videoDuration:"—",videoSize:file?(file.size>1048576?(file.size/1048576).toFixed(1)+" MB":(file.size/1024).toFixed(0)+" KB"):"—"};
    } else if(type==="document"||type==="certificate"){
      const kb=file?(file.size>1048576?(file.size/1048576).toFixed(1)+" MB":(file.size/1024).toFixed(0)+" KB"):"—";
      msg={type:"file",file:{name:file?.name||"document.pdf",size:kb,type:"doc"}};
    } else if(type==="location"){
      msg={type:"text",text:"📍 Farm Location: 19.9975° N, 73.7898° E — Nashik, Maharashtra"};
    } else if(type==="contact"){
      msg={type:"text",text:"👤 Contact: Ramesh Patil · +91 98765 43210"};
    }
    if(msg) onSend(convo.id,{...msg,from:"me",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),status:"sent"});
    setMediaPreview(null);
    setShowAttach(false);
  };

  const reactions=["👍","❤️","😊","🙏","✅","🌾"];
  const addReaction=(msgId,emoji)=>{
    setMsgReactions(p=>({...p,[msgId]:emoji}));
    setShowReactionPicker(null);
  };

  const myColor=portal==="farmer"?gd:navy;
  const headerBg=portal==="farmer"?`linear-gradient(135deg,${gd},${gm})`:`linear-gradient(135deg,${navy},#2d3b6b)`;

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      {/* ── HEADER ── */}
      <div style={{background:headerBg,padding:"13px 18px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{convo.avatar}</div>
          {convo.online&&<div style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:"#22c55e",border:"2px solid rgba(0,0,0,.3)"}}/>}
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{convo.name}</span>
            {convo.verified&&<span style={{fontSize:11,color:ac}}>✅</span>}
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.5)",marginTop:1}}>
            {convo.online?"🟢 Online now":`Last seen ${convo.lastTime}`} · {convo.about}
          </div>
        </div>
        {/* Action buttons */}
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setCallType("voice")} style={{width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.12)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}} title="Voice call">📞</button>
          <button onClick={()=>setCallType("video")} style={{width:34,height:34,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.12)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}} title="Video call">📹</button>
          <button onClick={()=>setShowInfo(p=>!p)} style={{width:34,height:34,borderRadius:"50%",border:"none",background:showInfo?"rgba(255,255,255,.25)":"rgba(255,255,255,.12)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}} title="Info">ℹ️</button>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* ── MESSAGES ── */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",background:"#f5f8f2"}}>
          {/* Date divider */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <span style={{fontSize:10,color:"#9ca3af",background:"rgba(255,255,255,.7)",padding:"3px 12px",borderRadius:100,backdropFilter:"blur(4px)"}}>Today</span>
          </div>

          {convo.messages.map((msg,i)=>{
            const isMe=msg.from==="me";
            return(
              <div key={msg.id||i} style={{position:"relative"}} onMouseEnter={()=>setShowReactionPicker(msg.id)} onMouseLeave={()=>setShowReactionPicker(null)}>
                <MessageBubble msg={msg} isMe={isMe}/>
                {/* Reaction display */}
                {msgReactions[msg.id]&&(
                  <div style={{position:"absolute",bottom:-4,right:isMe?8:"auto",left:isMe?"auto":44,background:"#fff",borderRadius:100,padding:"2px 7px",fontSize:14,border:"1px solid #f0f0f0",boxShadow:"0 2px 6px rgba(0,0,0,.1)",cursor:"pointer",zIndex:10}}
                    onClick={()=>setMsgReactions(p=>({...p,[msg.id]:null}))}
                  >{msgReactions[msg.id]}</div>
                )}
                {/* Reaction picker */}
                {showReactionPicker===msg.id&&!msgReactions[msg.id]&&(
                  <div style={{position:"absolute",bottom:24,right:isMe?8:"auto",left:isMe?"auto":44,background:"#fff",borderRadius:100,padding:"5px 10px",display:"flex",gap:6,boxShadow:"0 4px 16px rgba(0,0,0,.15)",border:"1px solid #f0f0f0",zIndex:10}} className="pi">
                    {reactions.map(r=>(
                      <span key={r} onClick={()=>addReaction(msg.id,r)} style={{fontSize:18,cursor:"pointer",transition:"transform .1s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>

        {/* ── INFO PANEL ── */}
        {showInfo&&(
          <div style={{width:240,background:"#fff",borderLeft:"1px solid rgba(30,70,20,.07)",overflowY:"auto",padding:"18px 16px"}} className="sr">
            <div style={PF({fontSize:14,fontWeight:700,color:"#1a1f36",marginBottom:14})}>Contact Info</div>
            <div style={{width:60,height:60,borderRadius:16,background:`linear-gradient(135deg,${navy},#2d3b6b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px"}}>
              {convo.avatar}
            </div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700,color:"#1a2e1a"}}>{convo.name}</div>
              <div style={{fontSize:10,color:"#9ca3af",marginTop:3}}>{convo.online?"🟢 Online":"⚫ Offline"}</div>
            </div>
            {[{i:"🌾",l:"Crop",v:convo.crop},{i:"📋",l:"Tender",v:convo.tender},{i:"✅",l:"Verified",v:convo.verified?"Yes":"No"},{i:"💬",l:"Messages",v:convo.messages.length}].map(({i,l,v})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}}>
                <span style={{color:"#9ca3af"}}>{i} {l}</span>
                <span style={{fontWeight:600,color:"#1a2e1a"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:7}}>
              <button style={gBtn({padding:"8px",fontSize:11,width:"100%"})}>📋 View Tender</button>
              <button style={{...ghBtn({padding:"8px",fontSize:11,width:"100%"}),color:"#ef4444"}}>🚫 Block</button>
            </div>
          </div>
        )}
      </div>

      {/* ── QUICK REPLIES ── */}
      {showQuick&&(
        <div style={{padding:"8px 14px 0",background:"#fff",borderTop:"1px solid rgba(30,70,20,.06)",overflowX:"auto",display:"flex",gap:7,flexShrink:0}} className="fu">
          {QUICK_REPLIES.map(q=>(
            <button key={q} onClick={()=>{setInput(q);setShowQuick(false);}} style={{whiteSpace:"nowrap",padding:"5px 12px",borderRadius:100,border:`1.5px solid rgba(30,70,20,.15)`,background:"#f9fdf9",color:gm,fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0,transition:"all .12s"}} onMouseEnter={e=>{e.currentTarget.style.background=cr;e.currentTarget.style.borderColor=gm;}} onMouseLeave={e=>{e.currentTarget.style.background="#f9fdf9";e.currentTarget.style.borderColor="rgba(30,70,20,.15)";}}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── MEDIA PREVIEW ── */}
      {mediaPreview&&<MediaPreview type={mediaPreview.type} file={mediaPreview.file} onSend={sendMedia} onCancel={()=>setMediaPreview(null)}/>}

      {/* ── INPUT BAR ── */}
      <div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid rgba(30,70,20,.07)",flexShrink:0,position:"relative"}}>
        {showAttach&&<AttachmentPicker onAttach={o=>{setMediaPreview({type:o.id,file:o.file});setShowAttach(false);}} onClose={()=>setShowAttach(false)}/>}
        <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
          {/* Attach button */}
          <button onClick={()=>{setShowAttach(p=>!p);setShowQuick(false);}} style={{width:38,height:38,borderRadius:12,border:"none",background:showAttach?`linear-gradient(135deg,${gd},${gm})`:"#f0f4ec",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .18s"}}>
            <span style={{color:showAttach?"#fff":"#374151",transform:showAttach?"rotate(45deg)":"rotate(0)",transition:"transform .2s",display:"inline-block"}}>📎</span>
          </button>
          {/* Text input */}
          <div style={{flex:1,background:"#f5f8f2",borderRadius:16,padding:"9px 14px",border:"1.5px solid rgba(30,70,20,.09)",display:"flex",alignItems:"flex-end",gap:8,transition:"border .15s"}} onFocus={()=>{}} onClick={()=>setShowAttach(false)}>
            <textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              placeholder="Type a message…"
              rows={1}
              style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,resize:"none",lineHeight:1.5,maxHeight:100,color:"#1a2e1a"}}
            />
            {/* Quick replies toggle */}
            <button onClick={()=>{setShowQuick(p=>!p);setShowAttach(false);}} style={{fontSize:16,cursor:"pointer",border:"none",background:"none",flexShrink:0,opacity:showQuick?1:.5,transition:"opacity .15s"}} title="Quick replies">⚡</button>
          </div>
          {/* Send */}
          <button onClick={send} disabled={!input.trim()} style={{width:38,height:38,borderRadius:12,border:"none",background:input.trim()?`linear-gradient(135deg,${myColor},${portal==="farmer"?gm:"#2d3b6b"})`:"#f0f4ec",cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,transition:"all .18s",transform:input.trim()?"scale(1)":"scale(.95)"}}>
            <span style={{color:input.trim()?"#fff":"#9ca3af"}}>➤</span>
          </button>
        </div>
      </div>

      {/* Call modal */}
      {callType&&<CallModal contact={convo} type={callType} onClose={()=>setCallType(null)}/>}
    </div>
  );
}

/* ─── SIDEBAR LEFT (conversation list) ─── */
function ChatSidebar({convos,active,setActive,portal,search,setSearch}){
  const bg=portal==="farmer"?navy:"#1a1a2e";
  const totalUnread=convos.reduce((a,c)=>a+c.unread,0);

  const filtered=convos.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  return(
    <div style={{width:270,background:bg,display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:"18px 16px 12px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌾</div>
          <div>
            <div style={PF({fontSize:16,fontWeight:700,color:"#fff"})}>GrainOS</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:.8}}>{portal==="farmer"?"Farmer Portal":"Industry Portal"}</div>
          </div>
          {totalUnread>0&&<div style={{marginLeft:"auto",width:20,height:20,borderRadius:"50%",background:ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{totalUnread}</div>}
        </div>
        {/* User */}
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",background:"rgba(255,255,255,.06)",borderRadius:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${portal==="farmer"?gm:"#3b5998"},${portal==="farmer"?"#4caf50":"#667eea"})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
            {portal==="farmer"?"👨‍🌾":"🏭"}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{portal==="farmer"?"Ramesh Patil":"Britannia Industries"}</div>
            <div style={{fontSize:9,color:ac}}>🟢 Active now</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.06)",borderRadius:11,padding:"8px 12px"}}>
          <span style={{fontSize:12,opacity:.4}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…" style={{border:"none",background:"transparent",outline:"none",fontSize:11,color:"rgba(255,255,255,.7)",flex:1}}/>
          {search&&<button onClick={()=>setSearch("")} style={{border:"none",background:"none",cursor:"pointer",color:"rgba(255,255,255,.3)",fontSize:10}}>✕</button>}
        </div>
      </div>

      {/* List */}
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{padding:"8px 6px 2px 14px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:.8,marginTop:6}}>
          Messages ({filtered.length})
        </div>
        {filtered.map(c=>(
          <ConvoItem key={c.id} convo={c} active={active===c.id} onClick={()=>setActive(c.id)} portal={portal}/>
        ))}
        {filtered.length===0&&<div style={{padding:"20px 14px",textAlign:"center",fontSize:11,color:"rgba(255,255,255,.2)"}}>No conversations found</div>}
      </div>

      {/* Bottom tip */}
      <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:"10px 12px",border:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{fontSize:10,fontWeight:700,color:ac,marginBottom:3}}>💡 Tip</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.3)",lineHeight:1.5}}>Use 🌐 Translate on any message to read it in your language.</div>
        </div>
      </div>
    </div>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyState({portal}){
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,background:"#f5f8f2"}}>
      <div style={{fontSize:60}}>💬</div>
      <div style={PF({fontSize:20,fontWeight:700,color:"#1a2e1a"})}>Your Messages</div>
      <div style={{fontSize:13,color:"#9ca3af",textAlign:"center",maxWidth:280,lineHeight:1.6}}>
        Select a conversation to start chatting. You can share photos, videos, documents and translate any message instantly.
      </div>
      <div style={{display:"flex",gap:12,marginTop:8}}>
        {["📷 Photos","🎬 Videos","📄 Docs","🌐 Translate"].map(t=>(
          <div key={t} style={{padding:"6px 12px",borderRadius:100,background:cr,fontSize:11,color:gm,fontWeight:600,border:"1px solid rgba(45,107,48,.15)"}}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function MessagesPage(){
  const portal="farmer";
  const [activeId,setActiveId]=useState(1);
  const [convos,setConvos]=useState(CONVERSATIONS_INIT);
  const [search,setSearch]=useState("");

  // Mark as read when opened
  const setActive=(id)=>{
    setActiveId(id);
    setConvos(p=>p.map(c=>c.id===id?{...c,unread:0}:c));
  };

  const sendMessage=(convoId,msg)=>{
    const newMsg={id:Date.now(),...msg};
    setConvos(p=>p.map(c=>{
      if(c.id!==convoId) return c;
      const lastMsg=msg.type==="text"?msg.text:msg.type==="image"?"📷 Photo":msg.type==="video"?"🎬 Video":"📎 File";
      return{...c,messages:[...c.messages,newMsg],lastMsg,lastTime:"Just now",unread:0};
    }));
  };

  const activeConvo=convos.find(c=>c.id===activeId);

  return(
    <>
      <style>{CSS}</style>
            <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 52px)"}}>
                <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <ChatSidebar convos={convos} active={activeId} setActive={setActive} portal={portal} search={search} setSearch={setSearch}/>
          {activeConvo
            ?<ChatWindow key={activeId} convo={activeConvo} onSend={sendMessage} portal={portal}/>
            :<EmptyState portal={portal}/>
          }
        </div>
      </div>
    </>
  );
}
