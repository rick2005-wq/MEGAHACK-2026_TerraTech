"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const T: Record<string, Record<string, string>> = {
  pageTitle:       { en:"Settings ⚙️", hi:"सेटिंग्स ⚙️", mr:"सेटिंग्ज ⚙️", pa:"ਸੈਟਿੰਗਾਂ ⚙️", gu:"સેટિંગ્સ ⚙️", ta:"அமைப்புகள் ⚙️", te:"సెట్టింగ్‌లు ⚙️", kn:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು ⚙️", bn:"সেটিংস ⚙️", ar:"الإعدادات ⚙️" },
  pageSub:         { en:"Manage your profile and preferences", hi:"अपनी प्रोफ़ाइल और प्राथमिकताएँ प्रबंधित करें", mr:"तुमचे प्रोफाइल आणि प्राधान्ये व्यवस्थापित करा", pa:"ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਤਰਜੀਹਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ", gu:"તમારી પ્રોફાઇલ અને પ્રાધાન્યો સંચાલિત કરો", ta:"உங்கள் சுயவிவரம் மற்றும் விருப்பங்களை நிர்வகிக்கவும்", te:"మీ ప్రొఫైల్ మరియు ప్రాధాన్యతలు నిర్వహించండి", kn:"ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ", bn:"আপনার প্রোফাইল এবং পছন্দ পরিচালনা করুন", ar:"إدارة ملفك الشخصي وتفضيلاتك" },
  changesSaved:    { en:"✅ Changes saved!", hi:"✅ बदलाव सहेजे गए!", mr:"✅ बदल जतन झाले!", pa:"✅ ਬਦਲਾਅ ਸੁਰੱਖਿਅਤ ਕੀਤੇ!", gu:"✅ ફેરફારો સાચવ્યા!", ta:"✅ மாற்றங்கள் சேமிக்கப்பட்டன!", te:"✅ మార్పులు సేవ్ అయ్యాయి!", kn:"✅ ಬದಲಾವಣೆಗಳು ಉಳಿಸಲಾಗಿದೆ!", bn:"✅ পরিবর্তন সংরক্ষিত!", ar:"✅ تم حفظ التغييرات!" },
  profileInfo:     { en:"Profile Information", hi:"प्रोफ़ाइल जानकारी", mr:"प्रोफाइल माहिती", pa:"ਪ੍ਰੋਫਾਈਲ ਜਾਣਕਾਰੀ", gu:"પ્રોફાઇલ માહિતી", ta:"சுயவிவர தகவல்", te:"ప్రొఫైల్ సమాచారం", kn:"ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ", bn:"প্রোফাইল তথ্য", ar:"معلومات الملف الشخصي" },
  farmerNashik:    { en:"Farmer · Nashik, Maharashtra", hi:"किसान · नाशिक, महाराष्ट्र", mr:"शेतकरी · नाशिक, महाराष्ट्र", pa:"ਕਿਸਾਨ · ਨਾਸਿਕ, ਮਹਾਰਾਸ਼ਟਰ", gu:"ખેડૂત · નાસિક, મહારાષ્ટ્ર", ta:"விவசாயி · நாசிக், மகாராஷ்டிரா", te:"రైతు · నాసిక్, మహారాష్ట్ర", kn:"ರೈತ · ನಾಸಿಕ್, ಮಹಾರಾಷ್ಟ್ರ", bn:"কৃষক · নাসিক, মহারাষ্ট্র", ar:"مزارع · ناسيك، ماهاراشترا" },
  govtVerified:    { en:"✅ Govt. Verified via Aadhaar", hi:"✅ आधार द्वारा सरकारी सत्यापित", mr:"✅ आधारद्वारे सरकारी सत्यापित", pa:"✅ ਆਧਾਰ ਰਾਹੀਂ ਸਰਕਾਰੀ ਤਸਦੀਕ", gu:"✅ આધાર દ્વારા સરકારી ચકાસણી", ta:"✅ ஆதார் மூலம் அரசு சரிபார்ப்பு", te:"✅ ఆధార్ ద్వారా ప్రభుత్వ ధృవీకరణ", kn:"✅ ಆಧಾರ್ ಮೂಲಕ ಸರ್ಕಾರಿ ಪರಿಶೀಲನೆ", bn:"✅ আধার মাধ্যমে সরকারী যাচাই", ar:"✅ التحقق الحكومي عبر آدهار" },
  fullName:        { en:"Full Name", hi:"पूरा नाम", mr:"पूर्ण नाव", pa:"ਪੂਰਾ ਨਾਮ", gu:"પૂરું નામ", ta:"முழு பெயர்", te:"పూర్తి పేరు", kn:"ಪೂರ್ಣ ಹೆಸರು", bn:"পুরো নাম", ar:"الاسم الكامل" },
  phone:           { en:"Phone", hi:"फ़ोन", mr:"फोन", pa:"ਫੋਨ", gu:"ફોન", ta:"தொலைபேசி", te:"ఫోన్", kn:"ಫೋನ್", bn:"ফোন", ar:"الهاتف" },
  email:           { en:"Email", hi:"ईमेल", mr:"ईमेल", pa:"ਈਮੇਲ", gu:"ઈ-મેઈલ", ta:"மின்னஞ்சல்", te:"ఇమెయిల్", kn:"ಇಮೇಲ್", bn:"ইমেইল", ar:"البريد الإلكتروني" },
  villageDistrict: { en:"Village / District", hi:"गाँव / जिला", mr:"गाव / जिल्हा", pa:"ਪਿੰਡ / ਜ਼ਿਲ੍ਹਾ", gu:"ગામ / જિલ્લો", ta:"கிராமம் / மாவட்டம்", te:"గ్రామం / జిల్లా", kn:"ಗ್ರಾಮ / ಜಿಲ್ಲೆ", bn:"গ্রাম / জেলা", ar:"القرية / المنطقة" },
  aadhaarVerified: { en:"Aadhaar Number (Verified ✅)", hi:"आधार नंबर (सत्यापित ✅)", mr:"आधार नंबर (सत्यापित ✅)", pa:"ਆਧਾਰ ਨੰਬਰ (ਤਸਦੀਕ ✅)", gu:"આધાર નંબર (ચકાસ્યો ✅)", ta:"ஆதார் எண் (சரிபார்க்கப்பட்டது ✅)", te:"ఆధార్ నంబర్ (ధృవీకరించబడింది ✅)", kn:"ಆಧಾರ್ ಸಂಖ್ಯೆ (ಪರಿಶೀಲಿಸಲಾಗಿದೆ ✅)", bn:"আধার নম্বর (যাচাইকৃত ✅)", ar:"رقم آدهار (تم التحقق ✅)" },
  preferences:     { en:"Preferences", hi:"प्राथमिकताएँ", mr:"प्राधान्ये", pa:"ਤਰਜੀਹਾਂ", gu:"પ્રાધાન્યો", ta:"விருப்பங்கள்", te:"ప్రాధాన్యతలు", kn:"ಆದ್ಯತೆಗಳು", bn:"পছন্দ", ar:"التفضيلات" },
  geoTag:          { en:"GeoTag All Photos", hi:"सभी फोटो को GeoTag करें", mr:"सर्व फोटो GeoTag करा", pa:"ਸਾਰੀਆਂ ਫੋਟੋਆਂ GeoTag ਕਰੋ", gu:"બધા ફોટો GeoTag કરો", ta:"அனைத்து புகைப்படங்களையும் GeoTag செய்யுங்கள்", te:"అన్ని ఫోటోలను GeoTag చేయండి", kn:"ಎಲ್ಲಾ ಫೋಟೋಗಳನ್ನು GeoTag ಮಾಡಿ", bn:"সব ফটো GeoTag করুন", ar:"وضع علامة جيو على كل الصور" },
  bidNotif:        { en:"Bid Notifications", hi:"बोली सूचनाएं", mr:"बोली सूचना", pa:"ਬੋਲੀ ਸੂਚਨਾਵਾਂ", gu:"બોલી સૂચનાઓ", ta:"ஏல அறிவிப்புகள்", te:"బిడ్ నోటిఫికేషన్‌లు", kn:"ಬಿಡ್ ಅಧಿಸೂಚನೆಗಳು", bn:"বিড নোটিফিকেশন", ar:"إشعارات العروض" },
  whatsappAlerts:  { en:"WhatsApp Alerts", hi:"WhatsApp अलर्ट", mr:"WhatsApp अलर्ट", pa:"WhatsApp ਅਲਰਟ", gu:"WhatsApp અલર્ટ", ta:"WhatsApp எச்சரிக்கைகள்", te:"WhatsApp అలెర్ట్‌లు", kn:"WhatsApp ಎಚ್ಚರಿಕೆಗಳು", bn:"WhatsApp অ্যালার্ট", ar:"تنبيهات واتساب" },
  smsFallback:     { en:"SMS Fallback", hi:"SMS बैकअप", mr:"SMS बॅकअप", pa:"SMS ਫਾਲਬੈਕ", gu:"SMS ફૉલ્બૅક", ta:"SMS மாற்று", te:"SMS ఫాల్‌బ్యాక్", kn:"SMS ಫಾಲ್‌ಬ್ಯಾಕ್", bn:"SMS ব্যাকআপ", ar:"الرسائل الاحتياطية" },
  hindiInterface:  { en:"Hindi Interface", hi:"हिंदी इंटरफेस", mr:"हिंदी इंटरफेस", pa:"ਹਿੰਦੀ ਇੰਟਰਫੇਸ", gu:"હિન્દી ઇન્ટરફેસ", ta:"இந்தி இடைமுகம்", te:"హిందీ ఇంటర్‌ఫేస్", kn:"ಹಿಂದಿ ಇಂಟರ್ಫೇಸ್", bn:"হিন্দি ইন্টারফেস", ar:"واجهة الهندية" },
  twoFA:           { en:"Two-Factor Auth (2FA)", hi:"दो-कारक प्रमाणीकरण", mr:"दोन-घटक प्रमाणीकरण", pa:"ਦੋ-ਕਾਰਕ ਪ੍ਰਮਾਣਿਕਤਾ", gu:"ટૂ-ફૈક્ટર ઓથ", ta:"இரு-காரணி அங்கீகாரம்", te:"రెండు-కారకాల ప్రమాణీకరణ", kn:"ಎರಡು-ಅಂಶ ದೃಢೀಕರಣ", bn:"দুই-ফ্যাক্টর যাচাই", ar:"المصادقة الثنائية" },
  dangerZone:      { en:"Danger Zone", hi:"खतरनाक क्षेत्र", mr:"धोकादायक विभाग", pa:"ਖ਼ਤਰੇ ਦਾ ਖੇਤਰ", gu:"જોખમ ઝોન", ta:"ஆபத்து மண்டலம்", te:"ప్రమాద జోన్", kn:"ಅಪಾಯ ವಲಯ", bn:"বিপদ অঞ্চল", ar:"منطقة الخطر" },
  deactivate:      { en:"🔒 Deactivate Account", hi:"🔒 खाता निष्क्रिय करें", mr:"🔒 खाते निष्क्रिय करा", pa:"🔒 ਖਾਤਾ ਅਕਿਰਿਆਸ਼ੀਲ ਕਰੋ", gu:"🔒 ખાતું નિષ્ક્રિય કરો", ta:"🔒 கணக்கை செயலிழக்கச் செய்யுங்கள்", te:"🔒 ఖాతా నిష్క్రియం చేయి", kn:"🔒 ಖಾತೆ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ", bn:"🔒 অ্যাকাউন্ট নিষ্ক্রিয় করুন", ar:"🔒 تعطيل الحساب" },
  deleteAccount:   { en:"🗑️ Delete Account", hi:"🗑️ खाता हटाएं", mr:"🗑️ खाते हटवा", pa:"🗑️ ਖਾਤਾ ਮਿਟਾਓ", gu:"🗑️ ખાતું ડિલીટ કરો", ta:"🗑️ கணக்கை நீக்கு", te:"🗑️ ఖాతా తొలగించు", kn:"🗑️ ಖಾತೆ ಅಳಿಸಿ", bn:"🗑️ অ্যাকাউন্ট মুছুন", ar:"🗑️ حذف الحساب" },
  saveChanges:     { en:"Save All Changes ✓", hi:"सभी बदलाव सहेजें ✓", mr:"सर्व बदल जतन करा ✓", pa:"ਸਾਰੇ ਬਦਲਾਅ ਸੁਰੱਖਿਅਤ ਕਰੋ ✓", gu:"બધા ફેરફારો સાચવો ✓", ta:"அனைத்து மாற்றங்களையும் சேமி ✓", te:"అన్ని మార్పులు సేవ్ చేయండి ✓", kn:"ಎಲ್ಲಾ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ ✓", bn:"সব পরিবর্তন সেভ করুন ✓", ar:"حفظ كل التغييرات ✓" },
};

const tl = (key: string, lang: string) => T[key]?.[lang] || T[key]?.en || key;

// Preference subs in English only (too long to translate all — shown for readability)
const PREF_SUBS: Record<string, Record<string, string>> = {
  geo:      { en:"Auto-stamp GPS on every farm photo (recommended)", hi:"हर फार्म फोटो पर GPS स्वतः-स्टैम्प", mr:"प्रत्येक फार्म फोटोवर GPS आपोआप", pa:"ਹਰ ਫਾਰਮ ਫੋਟੋ ਤੇ GPS ਆਪੇ ਲਾਓ", gu:"દરેક ખેતર ફોટો પર GPS ઓટો-સ્ટૅમ્પ", ta:"ஒவ்வொரு பண்ணை புகைப்படத்திலும் GPS", te:"ప్రతి ఫార్మ్ ఫోటోలో GPS ఆటో-స్టాంప్", kn:"ಪ್ರತಿ ಫಾರ್ಮ್ ಫೋಟೋದಲ್ಲಿ GPS ಸ್ವಯಂ", bn:"প্রতিটি খামার ফটোতে GPS অটো-স্ট্যাম্প", ar:"ختم GPS تلقائي على كل صورة" },
  bids:     { en:"Get instant alerts for new bids on your listings", hi:"लिस्टिंग पर नई बोलियों के लिए तुरंत अलर्ट", mr:"लिस्टिंगवर नवीन बोलींसाठी तात्काळ सूचना", pa:"ਲਿਸਟਿੰਗਾਂ ਤੇ ਨਵੀਆਂ ਬੋਲੀਆਂ ਲਈ ਤੁਰੰਤ ਅਲਰਟ", gu:"તમારી લિસ્ટિંગ પર નવી બોલી માટે ત્વરિત સૂચનાઓ", ta:"உங்கள் பட்டியல்களில் புதிய ஏலங்களுக்கு உடனடி எச்சரிக்கைகள்", te:"మీ జాబితాలపై కొత్త బిడ్‌లకు తక్షణ అలెర్ట్‌లు", kn:"ನಿಮ್ಮ ಪಟ್ಟಿಗಳಲ್ಲಿ ಹೊಸ ಬಿಡ್‌ಗಳಿಗೆ ತ್ವರಿತ ಎಚ್ಚರಿಕೆಗಳು", bn:"আপনার তালিকায় নতুন বিডের জন্য তাৎক্ষণিক সতর্কতা", ar:"تنبيهات فورية للعروض الجديدة" },
  whatsapp: { en:"Receive bids and messages on WhatsApp", hi:"WhatsApp पर बोलियाँ और संदेश पाएं", mr:"WhatsApp वर बोली आणि संदेश मिळवा", pa:"WhatsApp ਤੇ ਬੋਲੀਆਂ ਅਤੇ ਸੁਨੇਹੇ ਪ੍ਰਾਪਤ ਕਰੋ", gu:"WhatsApp પર બોલી અને સંદેશ", ta:"WhatsApp மூலம் ஏலங்கள் மற்றும் செய்திகள்", te:"WhatsApp లో బిడ్లు మరియు సందేశాలు", kn:"WhatsApp ನಲ್ಲಿ ಬಿಡ್ ಮತ್ತು ಸಂದೇಶಗಳು", bn:"WhatsApp এ বিড এবং বার্তা পান", ar:"استلام العروض والرسائل على واتساب" },
  sms:      { en:"Get SMS alerts when internet is unavailable", hi:"इंटरनेट न हो तो SMS अलर्ट मिलेगा", mr:"इंटरनेट नसेल तेव्हा SMS सूचना", pa:"ਇੰਟਰਨੈੱਟ ਨਾ ਹੋਣ ਤੇ SMS ਅਲਰਟ", gu:"ઇન્ટરનેટ ઉપલબ્ધ ન હોય ત્યારે SMS", ta:"இணையம் இல்லாதபோது SMS எச்சரிக்கை", te:"ఇంటర్నెట్ అందుబాటులో లేనప్పుడు SMS", kn:"ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದಾಗ SMS ಎಚ್ಚರಿಕೆ", bn:"ইন্টারনেট না থাকলে SMS সতর্কতা", ar:"تنبيهات SMS عند عدم توفر الإنترنت" },
  hindi:    { en:"Switch the entire app to Hindi language", hi:"पूरे ऐप को हिंदी में बदलें", mr:"संपूर्ण अॅप हिंदीत बदला", pa:"ਪੂਰੀ ਐਪ ਨੂੰ ਹਿੰਦੀ ਵਿੱਚ ਬਦਲੋ", gu:"સમગ્ર એપ્લિકેશન હિન્દીમાં બદલો", ta:"முழு பயன்பாட்டையும் இந்தியில் மாற்றுங்கள்", te:"యాప్ మొత్తం హిందీకి మార్చండి", kn:"ಇಡೀ ಅಪ್ ಅನ್ನು ಹಿಂದಿಗೆ ಬದಲಾಯಿಸಿ", bn:"পুরো অ্যাপ হিন্দিতে পরিবর্তন করুন", ar:"تبديل التطبيق بأكمله إلى اللغة الهندية" },
  twofa:    { en:"Extra security: OTP login required each session", hi:"अतिरिक्त सुरक्षा: हर सत्र में OTP", mr:"अतिरिक्त सुरक्षा: प्रत्येक सत्रात OTP", pa:"ਵਾਧੂ ਸੁਰੱਖਿਆ: ਹਰ ਸੈਸ਼ਨ ਵਿੱਚ OTP", gu:"વધારાની સુરક્ષા: OTP", ta:"கூடுதல் பாதுகாப்பு: OTP உள்நுழைவு", te:"అదనపు భద్రత: ప్రతి సెషన్‌లో OTP", kn:"ಹೆಚ್ಚುವರಿ ಭದ್ರತೆ: OTP", bn:"অতিরিক্ত নিরাপত্তা: OTP", ar:"حماية إضافية: تسجيل دخول OTP" },
};

export default function SettingsPage() {
  const { lang } = useLang();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name:"Ramesh Patil", phone:"+91 98765 43210", village:"Nashik, Maharashtra", email:"ramesh.patil@gmail.com" });
  const [toggles, setToggles] = useState({ geo:true, bids:true, hindi:false, twofa:true, whatsapp:true, sms:false });
  const set = (k:string, v:string) => setForm(p => ({...p,[k]:v}));
  const tog = (k:string) => setToggles(p => ({...p,[k]:!p[k as keyof typeof p]}));

  function Toggle({ k }: { k:string }) {
    const on = toggles[k as keyof typeof toggles];
    return (
      <div onClick={() => tog(k)} style={{ width:44, height:24, borderRadius:100, background:on?"#2d6b30":"#e5e7eb", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?23:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    );
  }

  const profileFields = [
    { labelKey:"fullName",       key:"name",    placeholder:"Your full name" },
    { labelKey:"phone",          key:"phone",   placeholder:"+91 XXXXX XXXXX" },
    { labelKey:"email",          key:"email",   placeholder:"email@example.com" },
    { labelKey:"villageDistrict",key:"village", placeholder:"Village, District, State" },
  ];

  const prefItems = [
    { key:"geo",      labelKey:"geoTag" },
    { key:"bids",     labelKey:"bidNotif" },
    { key:"whatsapp", labelKey:"whatsappAlerts" },
    { key:"sms",      labelKey:"smsFallback" },
    { key:"hindi",    labelKey:"hindiInterface" },
    { key:"twofa",    labelKey:"twoFA" },
  ];

  return (
    <>
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:"#1a2e1a" }}>{tl("pageTitle", lang)}</h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:1 }}>{tl("pageSub", lang)}</p>
        </div>
        {saved && <span style={{ fontSize:12, fontWeight:600, color:"#16a34a", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"6px 14px" }}>{tl("changesSaved", lang)}</span>}
      </div>

      <div style={{ padding:"28px 32px" }} className="fade-up">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

          {/* Profile */}
          <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:18 }}>{tl("profileInfo", lang)}</div>

            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, padding:16, background:"#f6f9f0", borderRadius:14 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#3a7d35,#a3c45c)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👨‍🌾</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1a2e1a" }}>Ramesh Patil</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{tl("farmerNashik", lang)}</div>
                <div style={{ display:"inline-flex", background:"rgba(163,196,92,0.15)", border:"1px solid rgba(163,196,92,0.3)", borderRadius:100, padding:"2px 8px", fontSize:10, color:"#2d6b30", fontWeight:700, marginTop:4 }}>{tl("govtVerified", lang)}</div>
              </div>
            </div>

            {profileFields.map(({ labelKey, key, placeholder }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>{tl(labelKey, lang)}</label>
                <input value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#fafafa" }} />
              </div>
            ))}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>{tl("aadhaarVerified", lang)}</label>
              <input disabled value="XXXX XXXX 4821" style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:12, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f5f5f5", color:"#9ca3af" }} />
            </div>
          </div>

          <div>
            {/* Preferences */}
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid rgba(30,70,20,0.07)", marginBottom:16 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#1a2e1a", marginBottom:18 }}>{tl("preferences", lang)}</div>
              {prefItems.map(({ key, labelKey }) => (
                <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:12, background:"#f6f9f0", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1a2e1a" }}>{tl(labelKey, lang)}</div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{PREF_SUBS[key]?.[lang] || PREF_SUBS[key]?.en}</div>
                  </div>
                  <Toggle k={key} />
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid #fee2e2" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"#991b1b", marginBottom:14 }}>{tl("dangerZone", lang)}</div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ flex:1, padding:"10px", borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", fontWeight:600, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{tl("deactivate", lang)}</button>
                <button style={{ flex:1, padding:"10px", borderRadius:12, border:"none", background:"#fee2e2", color:"#991b1b", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>{tl("deleteAccount", lang)}</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            style={{ padding:"13px 32px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#1e4620,#2d6b30)", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 16px rgba(30,70,20,0.3)" }}>
            {tl("saveChanges", lang)}
          </button>
        </div>
      </div>
    </>
  );
}
