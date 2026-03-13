"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";

const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";

const T: Record<string, Record<string, string>> = {
  pageTitle:    { en:"Available Tenders 📋", hi:"उपलब्ध टेंडर 📋", mr:"उपलब्ध टेंडर 📋", pa:"ਉਪਲਬਧ ਟੈਂਡਰ 📋", gu:"ઉપલબ્ધ ટેન્ડર 📋", ta:"கிடைக்கும் டெண்டர்கள் 📋", te:"అందుబాటులో టెండర్లు 📋", kn:"ಲಭ್ಯ ಟೆಂಡರ್‌ಗಳು 📋", bn:"পাওয়া যাচ্ছে টেন্ডার 📋", ar:"المناقصات المتاحة 📋" },
  pageSub:      { en:"AI-matched based on your active listings", hi:"आपकी सक्रिय लिस्टिंग के आधार पर AI-मिलान", mr:"तुमच्या सक्रिय लिस्टिंगवर आधारित AI-जुळणी", pa:"ਤੁਹਾਡੀਆਂ ਲਿਸਟਿੰਗਾਂ ਦੇ ਆਧਾਰ ਤੇ AI-ਮੇਲ", gu:"તમારી સક્રિય લિસ્ટિંગ આધારે AI-મેળ", ta:"உங்கள் பட்டியல்களின் அடிப்படையில் AI-பொருத்தம்", te:"మీ జాబితాల ఆధారంగా AI-మ్యాచ్", kn:"ನಿಮ್ಮ ಪಟ್ಟಿಗಳ ಆಧಾರದ ಮೇಲೆ AI-ಹೊಂದಾಣಿಕೆ", bn:"আপনার তালিকার ভিত্তিতে AI-ম্যাচ", ar:"مطابقة بالذكاء الاصطناعي بناءً على قوائمك" },
  allTenders:   { en:"All Tenders", hi:"सभी टेंडर", mr:"सर्व टेंडर", pa:"ਸਭ ਟੈਂਡਰ", gu:"બધા ટેન્ડર", ta:"அனைத்து டெண்டர்கள்", te:"అన్ని టెండర్లు", kn:"ಎಲ್ಲಾ ಟೆಂಡರ್‌ಗಳು", bn:"সব টেন্ডার", ar:"جميع المناقصات" },
  notApplied:   { en:"Not Applied", hi:"आवेदन नहीं", mr:"अर्ज नाही", pa:"ਅਰਜ਼ੀ ਨਹੀਂ", gu:"અરજ નથી", ta:"விண்ணப்பிக்கவில்லை", te:"దరఖాస్తు చేయలేదు", kn:"ಅರ್ಜಿ ಸಲ್ಲಿಸಿಲ್ಲ", bn:"আবেদন করা হয়নি", ar:"لم يتقدم" },
  applied:      { en:"Applied", hi:"आवेदित", mr:"अर्ज केले", pa:"ਅਰਜ਼ੀ ਦਿੱਤੀ", gu:"અરજ કરેલ", ta:"விண்ணப்பித்தவை", te:"దరఖాస్తు చేసినవి", kn:"ಅರ್ಜಿ ಸಲ್ಲಿಸಿದವು", bn:"আবেদিত", ar:"المقدم عليها" },
  aiMatched:    { en:"tenders AI-matched to your listings", hi:"टेंडर AI-मिलान", mr:"टेंडर AI-जुळणी", pa:"ਟੈਂਡਰ AI-ਮੇਲ", gu:"ટેન્ડર AI-મેળ", ta:"டெண்டர்கள் AI-பொருத்தம்", te:"టెండర్లు AI-మ్యాచ్", kn:"ಟೆಂಡರ್‌ಗಳು AI-ಹೊಂದಾಣಿಕೆ", bn:"টেন্ডার AI-ম্যাচ", ar:"مناقصات متطابقة بالذكاء الاصطناعي" },
  aiSub:        { en:"Based on your listings in Maharashtra", hi:"महाराष्ट्र में आपकी लिस्टिंग के आधार पर", mr:"महाराष्ट्रातील तुमच्या लिस्टिंगवर आधारित", pa:"ਮਹਾਰਾਸ਼ਟਰ ਵਿੱਚ ਤੁਹਾਡੀਆਂ ਲਿਸਟਿੰਗਾਂ ਦੇ ਆਧਾਰ ਤੇ", gu:"મહારાષ્ટ્રમાં તમારી લિસ્ટિંગ આધારે", ta:"மகாராஷ்டிராவில் உங்கள் பட்டியல்கள் அடிப்படையில்", te:"మహారాష్ట్రలో మీ జాబితాల ఆధారంగా", kn:"ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ನಿಮ್ಮ ಪಟ್ಟಿಗಳ ಆಧಾರದ ಮೇಲೆ", bn:"মহারাষ্ট্রে আপনার তালিকার ভিত্তিতে", ar:"بناءً على قوائمك في ماهاراشترا" },
  loading:      { en:"⏳ Loading tenders…", hi:"⏳ टेंडर लोड हो रहे हैं…", mr:"⏳ टेंडर लोड होत आहे…", pa:"⏳ ਟੈਂਡਰ ਲੋਡ ਹੋ ਰਹੇ ਹਨ…", gu:"⏳ ટેન્ડર લોડ થઈ રહ્યા છે…", ta:"⏳ டெண்டர்கள் ஏற்றப்படுகிறது…", te:"⏳ టెండర్లు లోడ్ అవుతున్నాయి…", kn:"⏳ ಟೆಂಡರ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ…", bn:"⏳ টেন্ডার লোড হচ্ছে…", ar:"⏳ تحميل المناقصات…" },
  noTenders:    { en:"No tenders yet", hi:"अभी कोई टेंडर नहीं", mr:"अजून टेंडर नाही", pa:"ਅਜੇ ਕੋਈ ਟੈਂਡਰ ਨਹੀਂ", gu:"હજી ટેન્ડર નથી", ta:"இன்னும் டெண்டர்கள் இல்லை", te:"ఇంకా టెండర్లు లేవు", kn:"ಇನ್ನೂ ಟೆಂಡರ್‌ಗಳಿಲ್ಲ", bn:"এখনো টেন্ডার নেই", ar:"لا توجد مناقصات بعد" },
  noTendersSub: { en:"Tenders posted by industry buyers will appear here", hi:"उद्योग खरीदारों के टेंडर यहाँ दिखेंगे", mr:"उद्योग खरेदीदारांचे टेंडर येथे दिसतील", pa:"ਉਦਯੋਗ ਖਰੀਦਦਾਰਾਂ ਦੇ ਟੈਂਡਰ ਇੱਥੇ ਦਿਖਣਗੇ", gu:"ઉદ્યોગ ખરીદદારો દ્વારા ટેન্ડર અહીં દેખાશે", ta:"தொழில் வாங்குபவர்கள் இட்ட டெண்டர்கள் இங்கே தெரியும்", te:"పరిశ్రమ కొనుగోలుదారులు పోస్ట్ చేసిన టెండర్లు ఇక్కడ కనిపిస్తాయి", kn:"ಕೈಗಾರಿಕಾ ಖರೀದಿದಾರರ ಟೆಂಡರ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ", bn:"শিল্প ক্রেতাদের টেন্ডার এখানে দেখাবে", ar:"ستظهر المناقصات التي يقدمها المشترون هنا" },
  kgRequired:   { en:"kg required", hi:"किग्रा आवश्यक", mr:"किग्रा आवश्यक", pa:"ਕਿਲੋ ਲੋੜੀਂਦਾ", gu:"કિ.ગ્રા. જોઈએ", ta:"கிகி தேவை", te:"కి.గ్రా అవసరం", kn:"ಕೆಜಿ ಅಗತ್ಯ", bn:"কেজি প্রয়োজন", ar:"كغ مطلوب" },
  deadline:     { en:"Deadline", hi:"अंतिम तिथि", mr:"अंतिम तारीख", pa:"ਆਖਰੀ ਮਿਤੀ", gu:"છેલ્લી તારીખ", ta:"கடைசி தேதி", te:"చివరి తేదీ", kn:"ಕೊನೆಯ ದಿನಾಂಕ", bn:"শেষ তারিখ", ar:"الموعد النهائي" },
  viewDetails:  { en:"View details", hi:"विवरण देखें", mr:"तपशील पहा", pa:"ਵੇਰਵਾ ਦੇਖੋ", gu:"વિગત જુઓ", ta:"விவரம் பார்க்க", te:"వివరాలు చూడండి", kn:"ವಿವರ ನೋಡಿ", bn:"বিস্তারিত দেখুন", ar:"عرض التفاصيل" },
  hideDetails:  { en:"Hide details", hi:"विवरण छुपाएं", mr:"तपशील लपवा", pa:"ਵੇਰਵਾ ਲੁਕਾਓ", gu:"વિગત છુપાવો", ta:"விவரத்தை மறை", te:"వివరాలు దాచు", kn:"ವಿವರ ಮರೆಮಾಡಿ", bn:"বিস্তারিত লুকান", ar:"إخفاء التفاصيل" },
  applyNow:     { en:"Apply Now →", hi:"अभी आवेदन करें →", mr:"आता अर्ज करा →", pa:"ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ →", gu:"અત્યારે અરજ કરો →", ta:"இப்போது விண்ணப்பிக்கவும் →", te:"ఇప్పుడే దరఖాస్తు చేయండి →", kn:"ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ →", bn:"এখনই আবেদন করুন →", ar:"قدّم الآن →" },
  applying:     { en:"⏳ Applying…", hi:"⏳ आवेदन हो रहा है…", mr:"⏳ अर्ज होत आहे…", pa:"⏳ ਅਰਜ਼ੀ ਹੋ ਰਹੀ ਹੈ…", gu:"⏳ અરજ થઈ રહી છે…", ta:"⏳ விண்ணப்பிக்கிறது…", te:"⏳ దరఖాస్తు చేస్తోంది…", kn:"⏳ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ…", bn:"⏳ আবেদন হচ্ছে…", ar:"⏳ جاري التقديم…" },
  appliedBadge: { en:"Applied ✓", hi:"आवेदित ✓", mr:"अर्ज केला ✓", pa:"ਅਰਜ਼ੀ ਦਿੱਤੀ ✓", gu:"અરજ કરી ✓", ta:"விண்ணப்பித்தது ✓", te:"దరఖాస్తు చేసారు ✓", kn:"ಅರ್ಜಿ ಸಲ್ಲಿಸಿದೆ ✓", bn:"আবেদন হয়েছে ✓", ar:"تم التقديم ✓" },
  perKg:        { en:"kg", hi:"किग्रा", mr:"किग्रा", pa:"ਕਿਲੋ", gu:"કિ.ગ્રા.", ta:"கிகி", te:"కి.గ్రా", kn:"ಕೆಜಿ", bn:"কেজি", ar:"كغ" },
};
const tt = (k: string, lang: string) => T[k]?.[lang] || T[k]?.en || k;

function getTagStyle(tag: string) {
  const map: Record<string,{tc:string;tt:string}> = { Wheat:{tc:"#fef3c7",tt:"#92400e"}, Potato:{tc:"#f0f7f0",tt:"#2d6b30"}, Chilli:{tc:"#eff6ff",tt:"#1d4ed8"}, Onion:{tc:"#fef3c7",tt:"#92400e"}, Tomato:{tc:"#fdf4ff",tt:"#7e22ce"}, Corn:{tc:"#f0f7f0",tt:"#2d6b30"} };
  return map[tag] || { tc:"#f0f4ec", tt:"#374151" };
}

export default function TendersPage() {
  const { lang } = useLang();
  const [tenders, setTenders] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const [expandId, setExpandId] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      const { data:td } = await supabase.from("tenders").select("*").eq("status","open").order("created_at",{ascending:false});
      const { data:bd } = await supabase.from("bids").select("tender_id").eq("farmer_id",DEMO_FARMER_ID);
      setAppliedIds(new Set((bd||[]).map((b:any)=>b.tender_id)));
      setTenders(td||[]);
      setLoading(false);
    };
    load();
  }, []);

  const applyToTender = async (tender:any) => {
    setApplyingId(tender.id);
    const { error } = await supabase.from("bids").insert({ tender_id:tender.id, farmer_id:DEMO_FARMER_ID, price_per_kg:tender.budget_per_kg, message:`I am interested in supplying ${tender.crop}.`, status:"pending" });
    if (!error) setAppliedIds(prev=>new Set([...prev,tender.id]));
    setApplyingId(null);
  };

  const filtered = filter==="applied" ? tenders.filter(t=>appliedIds.has(t.id)) : filter==="new" ? tenders.filter(t=>!appliedIds.has(t.id)) : tenders;
  const filterLabels: Record<string,string> = { all:tt("allTenders",lang), new:tt("notApplied",lang), applied:tt("applied",lang) };

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>{tt("pageTitle",lang)}</h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>{tt("pageSub",lang)}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["all","new","applied"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px", borderRadius:10, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, cursor:"pointer", background:filter===f?"#1e4620":"#f0f4ec", color:filter===f?"#fff":"#374151", transition:"all 0.2s" }}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ background:"linear-gradient(135deg,#1e4620,#2d6b30)", borderRadius:16, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:28 }}>🤖</span>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#fff", marginBottom:2 }}>{tenders.length} {tt("aiMatched",lang)}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{tt("aiSub",lang)}</div>
          </div>
        </div>

        <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
          {loading && <div style={{ textAlign:"center", padding:"40px 0", color:"#9ca3af", fontSize:14 }}>{tt("loading",lang)}</div>}

          {!loading && tenders.length===0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#9ca3af" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
              <div style={{ fontSize:14, fontWeight:600, color:"#374151", marginBottom:4 }}>{tt("noTenders",lang)}</div>
              <div style={{ fontSize:12 }}>{tt("noTendersSub",lang)}</div>
            </div>
          )}

          {filtered.map(t => {
            const isApplied = appliedIds.has(t.id);
            const isApplying = applyingId===t.id;
            const tagStyle = getTagStyle(t.crop);
            return (
              <div key={t.id} style={{ border:"1px solid rgba(30,70,20,0.08)", borderRadius:16, padding:16, marginBottom:12, transition:"all 0.2s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(163,196,92,0.35)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(30,70,20,0.06)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(30,70,20,0.08)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontWeight:700, color:"#1a2e1a" }}>{t.crop} — {t.quantity} kg</span>
                    {isApplied && <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:100, background:"#f0f7f0", color:"#2d6b30", marginLeft:8 }}>✓ {tt("applied",lang).toUpperCase()}</span>}
                  </div>
                  <span style={{ fontSize:15, fontWeight:800, color:"#2d6b30", flexShrink:0, marginLeft:12 }}>₹{t.budget_per_kg}/{tt("perKg",lang)}</span>
                </div>
                <div style={{ fontSize:12, color:"#6b7280", marginBottom:10 }}>
                  📦 {t.quantity} {tt("kgRequired",lang)}
                  {t.deadline && ` · ⏰ ${tt("deadline",lang)}: ${new Date(t.deadline).toLocaleDateString("en-IN")}`}
                </div>
                {expandId===t.id && t.description && <div style={{ background:"#f6f9f0", borderRadius:12, padding:"12px 14px", marginBottom:10, fontSize:13, color:"#374151", lineHeight:1.6 }}>{t.description}</div>}
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:100, background:tagStyle.tc, color:tagStyle.tt }}>{t.crop}</span>
                  <span style={{ marginLeft:"auto" }} />
                  {t.description && <button onClick={()=>setExpandId(expandId===t.id?null:t.id)} style={{ padding:"5px 12px", borderRadius:8, border:"none", fontSize:11, fontWeight:600, background:"#f0f4ec", color:"#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{expandId===t.id?tt("hideDetails",lang):tt("viewDetails",lang)}</button>}
                  {!isApplied
                    ? <button onClick={()=>applyToTender(t)} disabled={isApplying} style={{ padding:"6px 16px", borderRadius:10, border:"none", background:isApplying?"#9ca3af":"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontSize:11, fontWeight:700, cursor:isApplying?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif" }}>{isApplying?tt("applying",lang):tt("applyNow",lang)}</button>
                    : <button style={{ padding:"6px 16px", borderRadius:10, border:"none", background:"#f0f4ec", color:"#9ca3af", fontSize:11, fontWeight:700, cursor:"not-allowed", fontFamily:"'DM Sans',sans-serif" }}>{tt("appliedBadge",lang)}</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
