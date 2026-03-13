"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const T: Record<string, Record<string, string>> = {
  pageTitle:      { en:"Bids & Offers 🤝", hi:"बोलियाँ और ऑफर 🤝", mr:"बोली आणि ऑफर 🤝", pa:"ਬੋਲੀਆਂ ਅਤੇ ਪੇਸ਼ਕਸ਼ਾਂ 🤝", gu:"બોલી અને ઓફર 🤝", ta:"ஏலங்கள் மற்றும் சலுகைகள் 🤝", te:"బిడ్లు మరియు ఆఫర్లు 🤝", kn:"ಬಿಡ್‌ಗಳು ಮತ್ತು ಕೊಡುಗೆಗಳು 🤝", bn:"বিড এবং অফার 🤝", ar:"العروض والمزايدات 🤝" },
  pageSub:        { en:"Manage incoming bids and your tender applications", hi:"आने वाली बोलियाँ और टेंडर आवेदन प्रबंधित करें", mr:"येणारी बोली आणि टेंडर अर्ज व्यवस्थापित करा", pa:"ਆਉਣ ਵਾਲੀਆਂ ਬੋਲੀਆਂ ਅਤੇ ਟੈਂਡਰ ਅਰਜ਼ੀਆਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ", gu:"આવતી બોલીઓ અને ટેન્ડર અરજીઓ સંચાલિત કરો", ta:"வரும் ஏலங்கள் மற்றும் டெண்டர் விண்ணப்பங்களை நிர்வகிக்கவும்", te:"వచ్చే బిడ్లు మరియు టెండర్ దరఖాస్తులు నిర్వహించండి", kn:"ಬರುವ ಬಿಡ್‌ಗಳು ಮತ್ತು ಟೆಂಡರ್ ಅರ್ಜಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ", bn:"আসছে বিড এবং টেন্ডার আবেদন পরিচালনা করুন", ar:"إدارة العروض الواردة وطلبات المناقصات" },
  incomingBids:   { en:"Incoming Bids", hi:"आने वाली बोलियाँ", mr:"येणारी बोली", pa:"ਆਉਣ ਵਾਲੀਆਂ ਬੋਲੀਆਂ", gu:"આવતી બોલીઓ", ta:"வரும் ஏலங்கள்", te:"వచ్చే బిడ్లు", kn:"ಬರುವ ಬಿಡ್‌ಗಳು", bn:"আসছে বিড", ar:"العروض الواردة" },
  needResponse:   { en:"need response", hi:"प्रतिक्रिया चाहिए", mr:"प्रतिसाद हवा", pa:"ਜਵਾਬ ਚਾਹੀਦਾ ਹੈ", gu:"પ્રતિસાદ જોઈએ", ta:"பதில் தேவை", te:"స్పందన అవసరం", kn:"ಪ್ರತಿಕ್ರಿಯೆ ಬೇಕು", bn:"সাড়া দরকার", ar:"يحتاج استجابة" },
  myTenderApps:   { en:"My Tender Applications", hi:"मेरे टेंडर आवेदन", mr:"माझे टेंडर अर्ज", pa:"ਮੇਰੀਆਂ ਟੈਂਡਰ ਅਰਜ਼ੀਆਂ", gu:"મારી ટેન્ડર અરજીઓ", ta:"என் டெண்டர் விண்ணப்பங்கள்", te:"నా టెండర్ దరఖాస్తులు", kn:"ನನ್ನ ಟೆಂಡರ್ ಅರ್ಜಿಗಳು", bn:"আমার টেন্ডার আবেদন", ar:"طلبات مناقصاتي" },
  decline:        { en:"✕ Decline", hi:"✕ अस्वीकार", mr:"✕ नाकार", pa:"✕ ਰੱਦ ਕਰੋ", gu:"✕ નકારો", ta:"✕ நிராகரி", te:"✕ తిరస్కరించు", kn:"✕ ತಿರಸ್ಕರಿಸಿ", bn:"✕ প্রত্যাখ্যান", ar:"✕ رفض" },
  accept:         { en:"✓ Accept", hi:"✓ स्वीकार", mr:"✓ स्वीकार करा", pa:"✓ ਸਵੀਕਾਰ ਕਰੋ", gu:"✓ સ્વીકારો", ta:"✓ ஏற்றுக்கொள்", te:"✓ అంగీకరించు", kn:"✓ ಒಪ್ಪಿಕೊಳ್ಳಿ", bn:"✓ গ্রহণ করুন", ar:"✓ قبول" },
  accepted:       { en:"accepted", hi:"स्वीकृत", mr:"स्वीकारले", pa:"ਸਵੀਕਾਰ ਕੀਤਾ", gu:"સ્વીકૃત", ta:"ஏற்கப்பட்டது", te:"అంగీకరించబడింది", kn:"ಒಪ್ಪಿಕೊಂಡಿದೆ", bn:"গৃহীত", ar:"مقبول" },
  declined:       { en:"declined", hi:"अस्वीकृत", mr:"नाकारले", pa:"ਰੱਦ ਕੀਤਾ", gu:"નાકારેલ", ta:"நிராகரிக்கப்பட்டது", te:"తిరస్కరించబడింది", kn:"ತಿರಸ್ಕರಿಸಲಾಗಿದೆ", bn:"প্রত্যাখ্যাত", ar:"مرفوض" },
  pending:        { en:"pending", hi:"लंबित", mr:"प्रलंबित", pa:"ਬਕਾਇਆ", gu:"બાકી", ta:"நிலுவை", te:"పెండింగ్", kn:"ಬಾಕಿ", bn:"অপেক্ষায়", ar:"معلق" },
  aboveMkt:       { en:"ABOVE MKT", hi:"बाजार से ऊपर", mr:"बाजारापेक्षा जास्त", pa:"ਬਾਜ਼ਾਰ ਤੋਂ ਵੱਧ", gu:"બજારથી ઉપર", ta:"சந்தைக்கு மேலே", te:"మార్కెట్ కంటే ఎక్కువ", kn:"ಮಾರುಕಟ್ಟೆಗಿಂತ ಹೆಚ್ಚು", bn:"বাজারের উপরে", ar:"فوق السوق" },
  updated:        { en:"Updated", hi:"अपडेट", mr:"अपडेट", pa:"ਅਪਡੇਟ", gu:"અપડેટ", ta:"புதுப்பிக்கப்பட்டது", te:"అప్‌డేట్ చేయబడింది", kn:"ನವೀಕರಿಸಲಾಗಿದೆ", bn:"আপডেট হয়েছে", ar:"تم التحديث" },
  shortlisted:    { en:"Shortlisted", hi:"शॉर्टलिस्ट", mr:"शॉर्टलिस्ट", pa:"ਸ਼ੌਰਟਲਿਸਟ", gu:"શૉર્ટલિસ્ટ", ta:"தேர்ந்தெடுக்கப்பட்டது", te:"షార్ట్‌లిస్ట్ చేయబడింది", kn:"ಆಯ್ಕೆಪಟ್ಟಿ", bn:"শর্টলিস্টেড", ar:"مدرج في القائمة" },
  underReview:    { en:"Under Review", hi:"समीक्षा में", mr:"आढाव्यात", pa:"ਸਮੀਖਿਆ ਅਧੀਨ", gu:"સમીક્ષા હેઠળ", ta:"மதிப்பாய்வில்", te:"పరిశీలనలో", kn:"ಪರಿಶೀಲನೆಯಲ್ಲಿ", bn:"পর্যালোচনাধীন", ar:"قيد المراجعة" },
  rejected:       { en:"Rejected", hi:"अस्वीकृत", mr:"नाकारले", pa:"ਰੱਦ ਕੀਤਾ", gu:"નકારેલ", ta:"நிராகரிக்கப்பட்டது", te:"తిరస్కరించబడింది", kn:"ತಿರಸ್ಕರಿಸಲಾಗಿದೆ", bn:"প্রত্যাখ্যাত", ar:"مرفوض" },
};

const tl = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

const INCOMING = [
  { id:1, company:"FreshSnacks Pvt Ltd",  produce:"Potatoes · 500 kg",   amount:"₹24/kg", time:"2 min ago", isNew:true,  isHigh:true,  status:"pending" },
  { id:2, company:"AgroFoods Industries", produce:"Sweet Corn · 1 ton",  amount:"₹20/kg", time:"1 hr ago",  isNew:false, isHigh:true,  status:"pending" },
  { id:3, company:"NatureFresh Exports",  produce:"Red Chilli · 400 kg", amount:"₹88/kg", time:"3 hr ago",  isNew:false, isHigh:false, status:"pending" },
  { id:4, company:"LocalMart Chain",      produce:"Onions · 1.5 ton",    amount:"₹15/kg", time:"6 hr ago",  isNew:false, isHigh:false, status:"accepted" },
];

const APPLIED = [
  { tender:"50 ton Wheat",   company:"Britannia Industries", statusKey:"shortlisted", price:"₹28/kg", updated:"2 hr ago" },
  { tender:"Potato Supply",  company:"PepsiCo India",        statusKey:"underReview", price:"₹23/kg", updated:"1 day ago" },
  { tender:"Organic Tomato", company:"Godrej Nature's",      statusKey:"rejected",    price:"₹30/kg", updated:"2 days ago" },
];

export default function BidsPage() {
  const { lang } = useLang();
  const [bids, setBids] = useState(INCOMING);
  const act = (id: number, action: "accepted"|"declined") => setBids(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));

  const statusColor = (s: string) => s === "accepted" ? { bg:"#f0f7f0", color:"#16a34a" } : s === "declined" ? { bg:"#fee2e2", color:"#991b1b" } : { bg:"#fef3c7", color:"#92400e" };
  const appStatusColor = (s: string) => s === "shortlisted" ? { bg:"#f0f7f0", color:"#2d6b30" } : s === "rejected" ? { bg:"#fee2e2", color:"#991b1b" } : { bg:"#fef3c7", color:"#92400e" };

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", position:"sticky", top:0, zIndex:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>{tl("pageTitle", lang)}</h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>{tl("pageSub", lang)}</p>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Incoming bids */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a" }}>{tl("incomingBids", lang)}</span>
              <span style={{ fontSize:11, color:"#e53e3e", fontWeight:600 }}>{bids.filter(b=>b.status==="pending").length} {tl("needResponse", lang)}</span>
            </div>
            {bids.map(b => (
              <div key={b.id} style={{ padding:14, borderRadius:14, marginBottom:10, background:"#f6f9f0", border:"1px solid rgba(30,70,20,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#1a2e1a" }}>
                    🏭 {b.company}
                    {b.isNew && <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:100, background:"#fef3c7", color:"#92400e", marginLeft:5 }}>NEW</span>}
                    {b.isHigh && <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:100, background:"#f0f7f0", color:"#2d6b30", marginLeft:4 }}>{tl("aboveMkt", lang)}</span>}
                  </span>
                  <span style={{ fontSize:15, fontWeight:700, color:"#2d6b30" }}>{b.amount}</span>
                </div>
                <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>📦 {b.produce}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"#9ca3af" }}>🕐 {b.time}</span>
                  {b.status === "pending"
                    ? <div style={{ display:"flex", gap:6 }}>
                        <button onClick={() => act(b.id, "declined")} style={{ padding:"5px 14px", borderRadius:8, border:"none", fontSize:11, fontWeight:700, background:"#fee2e2", color:"#991b1b", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{tl("decline", lang)}</button>
                        <button onClick={() => act(b.id, "accepted")} style={{ padding:"5px 14px", borderRadius:8, border:"none", fontSize:11, fontWeight:700, background:"#1e4620", color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{tl("accept", lang)}</button>
                      </div>
                    : <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:100, background: statusColor(b.status).bg, color: statusColor(b.status).color }}>{tl(b.status, lang)}</span>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Applied tenders */}
          <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>{tl("myTenderApps", lang)}</div>
            {APPLIED.map(({ tender, company, statusKey, price, updated }) => (
              <div key={tender} style={{ padding:14, borderRadius:14, marginBottom:10, background:"#f6f9f0", border:"1px solid rgba(30,70,20,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1a2e1a" }}>📋 {tender}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:"#2d6b30" }}>{price}</span>
                </div>
                <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>🏭 {company}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"#9ca3af" }}>{tl("updated", lang)} {updated}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:100, background: appStatusColor(statusKey).bg, color: appStatusColor(statusKey).color }}>{tl(statusKey, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
