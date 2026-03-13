"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const T: Record<string, Record<string, string>> = {
  pageTitle:      { en:"Analytics 📊", hi:"विश्लेषण 📊", mr:"विश्लेषण 📊", pa:"ਵਿਸ਼ਲੇਸ਼ਣ 📊", gu:"વિશ્લેષણ 📊", ta:"பகுப்பாய்வு 📊", te:"విశ్లేషణలు 📊", kn:"ವಿಶ್ಲೇಷಣೆ 📊", bn:"বিশ্লেষণ 📊", ar:"التحليلات 📊" },
  pageSub:        { en:"Your earnings, sales and performance insights", hi:"आपकी कमाई, बिक्री और प्रदर्शन जानकारी", mr:"तुमची कमाई, विक्री आणि कामगिरी", pa:"ਤੁਹਾਡੀ ਕਮਾਈ, ਵਿਕਰੀ ਅਤੇ ਪ੍ਰਦਰਸ਼ਨ", gu:"તમારી કમાણી, વેચાણ અને પ્રદર્શન", ta:"உங்கள் வருமானம், விற்பனை மற்றும் செயல்திறன்", te:"మీ ఆదాయం, అమ్మకాలు మరియు పనితీరు", kn:"ನಿಮ್ಮ ಗಳಿಕೆ, ಮಾರಾಟ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆ", bn:"আপনার উপার্জন, বিক্রয় এবং পারফরম্যান্স", ar:"أرباحك ومبيعاتك وأداؤك" },
  totalRevenue:   { en:"Total Revenue", hi:"कुल राजस्व", mr:"एकूण महसूल", pa:"ਕੁੱਲ ਆਮਦਨ", gu:"કુલ આવક", ta:"மொத்த வருவாய்", te:"మొత్తం ఆదాయం", kn:"ಒಟ್ಟು ಆದಾಯ", bn:"মোট রাজস্ব", ar:"إجمالي الإيرادات" },
  totalSold:      { en:"Total Sold", hi:"कुल बिकी", mr:"एकूण विकले", pa:"ਕੁੱਲ ਵਿਕਿਆ", gu:"કુલ વેચ્યું", ta:"மொத்தம் விற்றது", te:"మొత్తం విక్రయించబడింది", kn:"ಒಟ್ಟು ಮಾರಿದ", bn:"মোট বিক্রিত", ar:"إجمالي المباع" },
  avgPrice:       { en:"Avg. Price", hi:"औसत कीमत", mr:"सरासरी किंमत", pa:"ਔਸਤ ਕੀਮਤ", gu:"સરેરાશ ભાવ", ta:"சராசரி விலை", te:"సగటు ధర", kn:"ಸರಾಸರಿ ಬೆಲೆ", bn:"গড় মূল্য", ar:"متوسط السعر" },
  buyerRating:    { en:"Buyer Rating", hi:"खरीदार रेटिंग", mr:"खरेदीदार रेटिंग", pa:"ਖਰੀਦਦਾਰ ਰੇਟਿੰਗ", gu:"ખરીદદાર રેટિંગ", ta:"வாங்குபவர் மதிப்பீடு", te:"కొనుగోలుదారు రేటింగ్", kn:"ಖರೀದಿದಾರರ ರೇಟಿಂಗ್", bn:"ক্রেতা রেটিং", ar:"تقييم المشتري" },
  monthlyPerf:    { en:"Monthly Performance", hi:"मासिक प्रदर्शन", mr:"मासिक कामगिरी", pa:"ਮਾਸਿਕ ਪ੍ਰਦਰਸ਼ਨ", gu:"માસિક પ્રદર્શન", ta:"மாதாந்திர செயல்திறன்", te:"నెలవారీ పనితీరు", kn:"ಮಾಸಿಕ ಕಾರ್ಯಕ್ಷಮতৈ", bn:"মাসিক কর্মক্ষমতা", ar:"الأداء الشهري" },
  earnings:       { en:"₹ Earnings", hi:"₹ कमाई", mr:"₹ कमाई", pa:"₹ ਕਮਾਈ", gu:"₹ કમાણી", ta:"₹ வருவாய்", te:"₹ ఆదాయం", kn:"₹ ಗಳಿಕೆ", bn:"₹ উপার্জন", ar:"₹ الأرباح" },
  quantity:       { en:"🌾 Quantity", hi:"🌾 मात्रा", mr:"🌾 प्रमाण", pa:"🌾 ਮਾਤਰਾ", gu:"🌾 જથ્થો", ta:"🌾 அளவு", te:"🌾 పరిమాణం", kn:"🌾 ಪ್ರಮಾಣ", bn:"🌾 পরিমাণ", ar:"🌾 الكمية" },
  topBuyers:      { en:"Top Buyers", hi:"शीर्ष खरीदार", mr:"अव्वल खरेदीदार", pa:"ਚੋਟੀ ਦੇ ਖਰੀਦਦਾਰ", gu:"ટોચના ખરીદદારો", ta:"சிறந்த வாங்குபவர்கள்", te:"అగ్రశ్రేణి కొనుగోలుదారులు", kn:"ಅಗ್ರ ಖರೀದಿದಾರರು", bn:"শীর্ষ ক্রেতারা", ar:"أفضل المشترين" },
  producePerf:    { en:"Produce Performance", hi:"उत्पाद प्रदर्शन", mr:"उत्पादन कामगिरी", pa:"ਫਸਲ ਪ੍ਰਦਰਸ਼ਨ", gu:"ઉત્પાદ પ્રદર્શન", ta:"விளைபொருள் செயல்திறன்", te:"పంట పనితీరు", kn:"ಉತ್ಪನ್ನ ಕಾರ್ಯಕ್ಷಮತೆ", bn:"পণ্যের কর্মক্ষমতা", ar:"أداء المنتجات" },
  sold:           { en:"sold", hi:"बिका", mr:"विकले", pa:"ਵਿਕਿਆ", gu:"વેચ્યું", ta:"விற்றது", te:"అమ్మారు", kn:"ಮಾರಿದ", bn:"বিক্রিত", ar:"مباع" },
  avg:            { en:"Avg", hi:"औसत", mr:"सरासरी", pa:"ਔਸਤ", gu:"સરેરાশ", ta:"சரா", te:"సగటు", kn:"ಸರಾ", bn:"গড়", ar:"متوسط" },
  thisYear:       { en:"This financial year", hi:"इस वित्त वर्ष", mr:"या वित्त वर्षात", pa:"ਇਸ ਵਿੱਤੀ ਸਾਲ", gu:"આ નાણાકીય વર્ષ", ta:"இந்த நிதி ஆண்டு", te:"ఈ ఆర్థిక సంవత్సరం", kn:"ಈ ಆರ್ಥಿಕ ವರ್ಷ", bn:"এই আর্থিক বছর", ar:"هذا العام المالي" },
  top5:           { en:"Top 5% sellers", hi:"शीर्ष 5% विक्रेता", mr:"अव्वल 5% विक्रेते", pa:"ਚੋਟੀ 5% ਵਿਕਰੇਤਾ", gu:"ટોચના 5% વેચાણ", ta:"சிறந்த 5% விற்பனையாளர்கள்", te:"అగ్రశ్రేణి 5% విక్రేతలు", kn:"ಅಗ್ರ 5% ವಿಕ್ರೇತರು", bn:"শীর্ষ 5% বিক্রেতা", ar:"أفضل 5٪ من البائعين" },
};

const tl = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

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
  const { lang } = useLang();
  const [tab, setTab] = useState<"earnings"|"quantity">("earnings");
  const maxEarn = Math.max(...MONTHLY.map(m => m.earn));
  const maxQty  = Math.max(...MONTHLY.map(m => m.qty));

  const kpiCards = [
    { icon:"💰", labelKey:"totalRevenue", value:"₹1,24,600", subKey:"thisYear",  up:true  },
    { icon:"📦", labelKey:"totalSold",    value:"3.2 ton",   sub:"Across 8 transactions", up:true },
    { icon:"📈", labelKey:"avgPrice",     value:"₹24.6/kg",  sub:"+12% above market",     up:true },
    { icon:"⭐", labelKey:"buyerRating",  value:"4.9 / 5",   subKey:"top5",               up:true },
  ];

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", position:"sticky", top:0, zIndex:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>{tl("pageTitle", lang)}</h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>{tl("pageSub", lang)}</p>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        {/* KPI cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
          {kpiCards.map(({ icon, labelKey, value, subKey, sub }) => (
            <div key={labelKey} style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#1a2e1a" }}>{value}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:3, fontWeight:500 }}>{tl(labelKey, lang)}</div>
              <div style={{ fontSize:11, color:"#2d6b30", marginTop:3, fontWeight:600 }}>{subKey ? tl(subKey, lang) : sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a" }}>{tl("monthlyPerf", lang)}</span>
            <div style={{ display:"flex", gap:8 }}>
              {(["earnings","quantity"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding:"6px 14px", borderRadius:10, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", background:tab===t?"#1e4620":"#f0f4ec", color:tab===t?"#fff":"#374151" }}>
                  {tl(t, lang)}
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
                  <div style={{ width:"100%", height:`${h}%`, borderRadius:"8px 8px 0 0", background:"linear-gradient(180deg,#a3c45c,#1e4620)", minHeight:4, transition:"height 0.4s ease", cursor:"pointer" }} />
                  <div style={{ fontSize:10, color:"#9ca3af" }}>{month}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Top buyers */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>{tl("topBuyers", lang)}</div>
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
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>{tl("producePerf", lang)}</div>
            {PRODUCE_PERF.map(({ emoji, name, sold, avg, revenue, trend }) => (
              <div key={name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", borderRadius:14, marginBottom:8, background:"#f6f9f0" }}>
                <span style={{ fontSize:28 }}>{emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a2e1a" }}>{name}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{sold} {tl("sold", lang)} · {tl("avg", lang)} {avg}</div>
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
