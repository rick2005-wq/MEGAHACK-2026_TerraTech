"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const T: Record<string, Record<string, string>> = {
  pageTitle:       { en:"Payments 💰", hi:"भुगतान 💰", mr:"पेमेंट 💰", pa:"ਭੁਗਤਾਨ 💰", gu:"ચુકવણી 💰", ta:"கட்டணங்கள் 💰", te:"చెల్లింపులు 💰", kn:"ಪಾವತಿಗಳು 💰", bn:"পেমেন্ট 💰", ar:"المدفوعات 💰" },
  pageSub:         { en:"Transaction history and bank account", hi:"लेनदेन इतिहास और बैंक खाता", mr:"व्यवहार इतिहास आणि बँक खाते", pa:"ਲੈਣਦੇਣ ਇਤਿਹਾਸ ਅਤੇ ਬੈਂਕ ਖਾਤਾ", gu:"વ્યવહાર ઇતિહાસ અને બેંક ખાતું", ta:"பரிவர்த்தனை வரலாறு மற்றும் வங்கி கணக்கு", te:"లావాదేవీ చరిత్ర మరియు బ్యాంక్ ఖాతా", kn:"ವಹಿವಾಟು ಇತಿಹಾಸ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ", bn:"লেনদেন ইতিহাস এবং ব্যাংক অ্যাকাউন্ট", ar:"سجل المعاملات والحساب البنكي" },
  txHistory:       { en:"Transaction History", hi:"लेनदेन इतिहास", mr:"व्यवहार इतिहास", pa:"ਲੈਣਦੇਣ ਇਤਿਹਾਸ", gu:"વ્યવહાર ઇતિહાસ", ta:"பரிவர்த்தனை வரலாறு", te:"లావాదేవీ చరిత్ర", kn:"ವಹಿವಾಟು ಇತಿಹಾಸ", bn:"লেনদেন ইতিহাস", ar:"سجل المعاملات" },
  linkedAccount:   { en:"Linked Account", hi:"लिंक्ड खाता", mr:"लिंक्ड खाते", pa:"ਲਿੰਕਡ ਖਾਤਾ", gu:"લિંક્ડ ખાતું", ta:"இணைக்கப்பட்ட கணக்கு", te:"లింక్డ్ ఖాతా", kn:"ಸಂಪರ್ಕಿತ ಖಾತೆ", bn:"সংযুক্ত অ্যাকাউন্ট", ar:"الحساب المرتبط" },
  sbiAccount:      { en:"SBI Savings Account", hi:"SBI बचत खाता", mr:"SBI बचत खाते", pa:"SBI ਬੱਚਤ ਖਾਤਾ", gu:"SBI બચત ખાતું", ta:"SBI சேமிப்பு கணக்கு", te:"SBI పొదుపు ఖాతా", kn:"SBI ಉಳಿತಾಯ ಖಾತೆ", bn:"SBI সঞ্চয় অ্যাকাউন্ট", ar:"حساب التوفير SBI" },
  availBal:        { en:"Available Balance", hi:"उपलब्ध शेष", mr:"उपलब्ध शिल्लक", pa:"ਉਪਲਬਧ ਬੈਲੇਂਸ", gu:"ઉપલબ્ધ બેલેન્સ", ta:"கிடைக்கும் இருப்பு", te:"అందుబాటులో నిల్వ", kn:"ಲಭ್ಯ ಬ್ಯಾಲೆನ್ಸ್", bn:"পাওয়া যোগ্য ব্যালেন্স", ar:"الرصيد المتاح" },
  withdraw:        { en:"Withdraw Earnings →", hi:"कमाई निकालें →", mr:"कमाई काढा →", pa:"ਕਮਾਈ ਕੱਢੋ →", gu:"કમાણી ઉપાડો →", ta:"வருமானம் எடுக்க →", te:"ఆదాయం విత్‌డ్రా చేయండి →", kn:"ಗಳಿಕೆ ಹಿಂತೆಗೆಯಿರಿ →", bn:"উপার্জন উত্তোলন করুন →", ar:"سحب الأرباح →" },
  febSummary:      { en:"February Summary", hi:"फरवरी सारांश", mr:"फेब्रुवारी सारांश", pa:"ਫਰਵਰੀ ਸਾਰਾਂਸ਼", gu:"ફેબ્રુઆરી સારાંશ", ta:"பிப்ரவரி சுருக்கம்", te:"ఫిబ్రవరి సారాంశం", kn:"ಫೆಬ್ರವರಿ ಸಾರಾಂಶ", bn:"ফেব্রুয়ারি সারসংক্ষেপ", ar:"ملخص فبراير" },
  totalReceived:   { en:"Total Received", hi:"कुल प्राप्त", mr:"एकूण मिळाले", pa:"ਕੁੱਲ ਪ੍ਰਾਪਤ", gu:"કુલ પ્રાપ્ત", ta:"மொத்தம் பெறப்பட்டது", te:"మొత్తం అందుకున్నది", kn:"ಒಟ್ಟು ಸ್ವೀಕರಿಸಿದ", bn:"মোট প্রাপ্ত", ar:"إجمالي المستلم" },
  platformFees:    { en:"Platform Fees", hi:"प्लेटफॉर्म शुल्क", mr:"प्लॅटफॉर्म शुल्क", pa:"ਪਲੇਟਫਾਰਮ ਫੀਸ", gu:"પ્લેટફોર્મ ફી", ta:"இயங்குதள கட்டணம்", te:"ప్లాట్‌ఫారమ్ రుసుము", kn:"ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ", bn:"প্ল্যাটফর্ম ফি", ar:"رسوم المنصة" },
  netEarnings:     { en:"Net Earnings", hi:"शुद्ध कमाई", mr:"निव्वळ कमाई", pa:"ਸ਼ੁੱਧ ਕਮਾਈ", gu:"ચોખ્ખી કમાણી", ta:"நிகர வருமானம்", te:"నికర ఆదాయం", kn:"ನಿವ್ವಳ ಗಳಿಕೆ", bn:"নেট উপার্জন", ar:"صافي الأرباح" },
  completed:       { en:"Completed", hi:"पूर्ण", mr:"पूर्ण", pa:"ਮੁਕੰਮਲ", gu:"પૂર્ણ", ta:"முடிந்தது", te:"పూర్తయింది", kn:"ಪೂರ್ಣಗೊಂಡಿದೆ", bn:"সম্পন্ন", ar:"مكتمل" },
  pending:         { en:"Pending", hi:"लंबित", mr:"प्रलंबित", pa:"ਬਕਾਇਆ", gu:"બાકી", ta:"நிலுவை", te:"పెండింగ్", kn:"ಬಾಕಿ", bn:"মুলতবি", ar:"معلق" },
  withdrawTo:      { en:"Withdraw to SBI xxxx4821", hi:"SBI xxxx4821 में निकालें", mr:"SBI xxxx4821 मध्ये काढा", pa:"SBI xxxx4821 ਵਿੱਚ ਕੱਢੋ", gu:"SBI xxxx4821 માં ઉપાડો", ta:"SBI xxxx4821க்கு எடுக்க", te:"SBI xxxx4821కి విత్‌డ్రా", kn:"SBI xxxx4821ಗೆ ತೆಗೆಯಿರಿ", bn:"SBI xxxx4821-এ উত্তোলন", ar:"سحب إلى SBI xxxx4821" },
  cancel:          { en:"Cancel", hi:"रद्द करें", mr:"रद्द करा", pa:"ਰੱਦ ਕਰੋ", gu:"રદ કરો", ta:"ரத்து செய்", te:"రద్దు చేయి", kn:"ರದ್ದುಮಾಡಿ", bn:"বাতিল করুন", ar:"إلغاء" },
  confirmWithdraw: { en:"Confirm Withdrawal", hi:"निकासी पुष्टि करें", mr:"निकासी पुष्टी करा", pa:"ਕਢਵਾਉਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", gu:"ઉપાડ ની પુષ્ટિ કરો", ta:"திரும்பப் பெறுதலை உறுதிப்படுத்தவும்", te:"విత్‌డ్రాయల్ నిర్ధారించండి", kn:"ಹಿಂತೆಗೆಯುವಿಕೆ ದೃಢೀಕರಿಸಿ", bn:"উত্তোলন নিশ্চিত করুন", ar:"تأكيد السحب" },
  withdrawInit:    { en:"Withdrawal Initiated!", hi:"निकासी शुरू हो गई!", mr:"निकासी सुरू झाली!", pa:"ਕਢਵਾਉਣਾ ਸ਼ੁਰੂ ਹੋਇਆ!", gu:"ઉપાડ શરૂ થઈ ગઈ!", ta:"திரும்பப் பெறுதல் தொடங்கியது!", te:"విత్‌డ్రాయల్ మొదలైంది!", kn:"ಹಿಂತೆಗೆಯುವಿಕೆ ಪ್ರಾರಂಭವಾಯಿತು!", bn:"উত্তোলন শুরু হয়েছে!", ar:"بدأ السحب!" },
};

const tl = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

const TRANSACTIONS = [
  { id:1, icon:"💰", name:"FreshSnacks Pvt Ltd",  meta:"Potato payment · 500 kg",      amount:"+₹12,000", credit:true,  date:"28 Feb 2026", statusKey:"completed" },
  { id:2, icon:"💰", name:"AgroFoods Industries", meta:"Corn payment · 1 ton",          amount:"+₹20,000", credit:true,  date:"24 Feb 2026", statusKey:"completed" },
  { id:3, icon:"📋", name:"Platform Fee",          meta:"February subscription",         amount:"-₹499",    credit:false, date:"01 Feb 2026", statusKey:"completed" },
  { id:4, icon:"💰", name:"NatureFresh Exports",  meta:"Chilli advance · 200 kg",       amount:"+₹17,600", credit:true,  date:"18 Feb 2026", statusKey:"completed" },
  { id:5, icon:"💰", name:"FreshSnacks Pvt Ltd",  meta:"Potato order deposit · 10 Feb", amount:"+₹6,000",  credit:true,  date:"10 Feb 2026", statusKey:"pending" },
  { id:6, icon:"📋", name:"Platform Fee",          meta:"January subscription",          amount:"-₹499",    credit:false, date:"01 Jan 2026", statusKey:"completed" },
];

export default function PaymentsPage() {
  const { lang } = useLang();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount] = useState("10,000");
  const [withdrawn, setWithdrawn] = useState(false);

  const summaryRows = [
    { labelKey: "totalReceived",  val: "₹55,600", color: "#2d6b30" },
    { labelKey: "platformFees",   val: "-₹499",   color: "#e53e3e" },
    { labelKey: "netEarnings",    val: "₹55,101", color: "#1a2e1a" },
  ];

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", position:"sticky", top:0, zIndex:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>{tl("pageTitle", lang)}</h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>{tl("pageSub", lang)}</p>
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24 }}>

          {/* Transactions */}
          <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:16 }}>{tl("txHistory", lang)}</div>
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid #f0f4ec" }}>
                <div style={{ width:42, height:42, borderRadius:12, background: tx.credit ? "#f0f7f0" : "#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{tx.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a2e1a" }}>{tx.name}</div>
                  <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{tx.meta} · {tx.date}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color: tx.credit ? "#2d6b30" : "#e53e3e" }}>{tx.amount}</div>
                  <div style={{ fontSize:10, fontWeight:600, color: tx.statusKey === "completed" ? "#16a34a" : "#d97706", marginTop:2 }}>{tl(tx.statusKey, lang)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bank + Summary */}
          <div>
            <div style={{ background:"linear-gradient(135deg,#1e4620,#2d6b30)", borderRadius:20, padding:24, color:"#fff", marginBottom:16 }}>
              <div style={{ fontSize:11, opacity:0.6, marginBottom:4, letterSpacing:1, textTransform:"uppercase" }}>{tl("linkedAccount", lang)}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:2 }}>{tl("sbiAccount", lang)}</div>
              <div style={{ fontSize:12, opacity:0.7, marginBottom:16 }}>xxxx xxxx 4821 · NASHIK BRANCH</div>
              <div style={{ fontSize:11, opacity:0.6, marginBottom:4 }}>{tl("availBal", lang)}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700 }}>₹48,340</div>
            </div>

            {!showWithdraw && !withdrawn && (
              <button onClick={() => setShowWithdraw(true)} style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 16px rgba(30,70,20,0.3)", marginBottom:16 }}>
                {tl("withdraw", lang)}
              </button>
            )}

            {showWithdraw && !withdrawn && (
              <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid rgba(30,70,20,0.07)", marginBottom:16 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#1a2e1a", marginBottom:12 }}>{tl("withdrawTo", lang)}</div>
                <input defaultValue="10000" style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12, background:"#fafafa" }} />
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setShowWithdraw(false)} style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{tl("cancel", lang)}</button>
                  <button onClick={() => { setShowWithdraw(false); setWithdrawn(true); }} style={{ flex:2, padding:11, borderRadius:12, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{tl("confirmWithdraw", lang)}</button>
                </div>
              </div>
            )}

            {withdrawn && (
              <div style={{ background:"#f0fdf4", borderRadius:16, padding:20, border:"1px solid #86efac", marginBottom:16, textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#166534", marginBottom:4 }}>✅ {tl("withdrawInit", lang)}</div>
                <div style={{ fontSize:12, color:"#16a34a" }}>₹{amount} will credit to SBI xxxx4821 in 2–3 business days.</div>
              </div>
            )}

            <div style={{ background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"#1a2e1a", marginBottom:14 }}>{tl("febSummary", lang)}</div>
              {summaryRows.map(({ labelKey, val, color }) => (
                <div key={labelKey} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f0f4ec" }}>
                  <span style={{ fontSize:13, color:"#6b7280" }}>{tl(labelKey, lang)}</span>
                  <span style={{ fontSize:14, fontWeight:700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
