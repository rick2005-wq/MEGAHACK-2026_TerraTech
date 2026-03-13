"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/context/LanguageContext";

const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";

// ── All translations embedded directly ──
const T: Record<string, Record<string, string>> = {
  pageTitle:      { en:"My Listings 📦", hi:"मेरी लिस्टिंग 📦", mr:"माझ्या लिस्टिंग 📦", pa:"ਮੇਰੀਆਂ ਲਿਸਟਿੰਗ 📦", gu:"મારી લિસ્ટિંગ 📦", ta:"என் பட்டியல்கள் 📦", te:"నా జాబితాలు 📦", kn:"ನನ್ನ ಪಟ್ಟಿಗಳು 📦", bn:"আমার তালিকা 📦", ar:"قوائمي 📦" },
  pageSub:        { en:"Add, manage and geotag your farm produce", hi:"अपनी फसल जोड़ें, प्रबंधित करें और जियोटैग करें", mr:"तुमचे उत्पादन जोडा, व्यवस्थापित करा", pa:"ਆਪਣੀ ਫਸਲ ਜੋੜੋ ਅਤੇ ਪ੍ਰਬੰਧਿਤ ਕਰੋ", gu:"તમારી ઉપજ ઉમેરો અને સંચાલિત કરો", ta:"உங்கள் விளைபொருளை சேர்க்கவும்", te:"మీ పంటను జోడించండి మరియు నిర్వహించండి", kn:"ನಿಮ್ಮ ಉತ್ಪನ್ನ ಸೇರಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ", bn:"আপনার ফসল যোগ করুন এবং পরিচালনা করুন", ar:"أضف وأدر منتجاتك الزراعية" },
  addListing:     { en:"+ Add Listing", hi:"+ लिस्टिंग जोड़ें", mr:"+ लिस्टिंग जोडा", pa:"+ ਲਿਸਟਿੰਗ ਜੋੜੋ", gu:"+ લિસ્ટિંગ ઉમેરો", ta:"+ பட்டியல் சேர்க்க", te:"+ జాబితా జోడించు", kn:"+ ಪಟ್ಟಿ ಸೇರಿಸಿ", bn:"+ তালিকা যোগ করুন", ar:"+ إضافة قائمة" },
  allListings:    { en:"All Listings", hi:"सभी लिस्टिंग", mr:"सर्व लिस्टिंग", pa:"ਸਭ ਲਿਸਟਿੰਗ", gu:"બધી લિસ્ટિંગ", ta:"அனைத்து பட்டியல்கள்", te:"అన్ని జాబితాలు", kn:"ಎಲ್ಲಾ ಪಟ್ಟಿಗಳು", bn:"সব তালিকা", ar:"جميع القوائم" },
  active:         { en:"active", hi:"सक्रिय", mr:"सक्रिय", pa:"ਸਰਗਰਮ", gu:"સક્રિય", ta:"செயலில்", te:"చురుకైన", kn:"ಸಕ್ರಿಯ", bn:"সক্রিয়", ar:"نشط" },
  pendingReview:  { en:"Pending Review", hi:"समीक्षा लंबित", mr:"आढावा प्रलंबित", pa:"ਸਮੀਖਿਆ ਬਾਕੀ", gu:"સમીક્ષા બાકી", ta:"மதிப்பாய்வு நிலுவை", te:"సమీక్ష పెండింగ్", kn:"ಪರಿಶೀಲನೆ ಬಾಕಿ", bn:"পর্যালোচনা মুলতবি", ar:"قيد المراجعة" },
  activeBids:     { en:"active bids", hi:"सक्रिय बोलियाँ", mr:"सक्रिय बोली", pa:"ਸਰਗਰਮ ਬੋਲੀਆਂ", gu:"સક્રિય બોલીઓ", ta:"செயலில் உள்ள ஏலங்கள்", te:"చురుకైన బిడ్లు", kn:"ಸಕ್ರಿಯ ಬಿಡ್‌ಗಳು", bn:"সক্রিয় বিড", ar:"عروض نشطة" },
  edit:           { en:"✏️ Edit", hi:"✏️ संपादित करें", mr:"✏️ संपादित करा", pa:"✏️ ਸੰਪਾਦਿਤ ਕਰੋ", gu:"✏️ સંપાદિત કરો", ta:"✏️ திருத்து", te:"✏️ సవరించు", kn:"✏️ ಸಂಪಾದಿಸಿ", bn:"✏️ সম্পাদনা করুন", ar:"✏️ تحرير" },
  remove:         { en:"🗑️ Remove", hi:"🗑️ हटाएं", mr:"🗑️ हटवा", pa:"🗑️ ਹਟਾਓ", gu:"🗑️ દૂર કરો", ta:"🗑️ நீக்கு", te:"🗑️ తొలగించు", kn:"🗑️ ತೆಗೆದುಹಾಕಿ", bn:"🗑️ সরান", ar:"🗑️ حذف" },
  noListings:     { en:"No listings yet", hi:"अभी कोई लिस्टिंग नहीं", mr:"अजून लिस्टिंग नाही", pa:"ਅਜੇ ਕੋਈ ਲਿਸਟਿੰਗ ਨਹੀਂ", gu:"હજી કોઈ લિસ્ટિંગ નથી", ta:"இன்னும் பட்டியல்கள் இல்லை", te:"ఇంకా జాబితాలు లేవు", kn:"ಇನ್ನೂ ಪಟ್ಟಿಗಳಿಲ್ಲ", bn:"এখনো তালিকা নেই", ar:"لا توجد قوائم بعد" },
  noListingsSub:  { en:"Add your first listing to start receiving bids", hi:"बोलियाँ पाने के लिए पहली लिस्टिंग जोड़ें", mr:"बोली मिळण्यासाठी पहिली लिस्टिंग जोडा", pa:"ਬੋਲੀਆਂ ਲੈਣ ਲਈ ਪਹਿਲੀ ਲਿਸਟਿੰਗ ਜੋੜੋ", gu:"બોલી મેળવવા પ્રથમ લિસ્ટિંગ ઉમેરો", ta:"முதல் பட்டியலை சேர்க்கவும்", te:"మొదటి జాబితా జోడించండి", kn:"ಮೊದಲ ಪಟ್ಟಿ ಸೇರಿಸಿ", bn:"প্রথম তালিকা যোগ করুন", ar:"أضف قائمتك الأولى" },
  addNewProduce:  { en:"Add New Produce Listing", hi:"नई उत्पाद लिस्टिंग जोड़ें", mr:"नवीन उत्पादन लिस्टिंग जोडा", pa:"ਨਵੀਂ ਫਸਲ ਲਿਸਟਿੰਗ ਜੋੜੋ", gu:"નવી ઉપજ લિસ્ટિંગ ઉમેરો", ta:"புதிய விளைபொருள் பட்டியல் சேர்க்க", te:"కొత్త పంట జాబితా జోడించు", kn:"ಹೊಸ ಉತ್ಪನ್ನ ಪಟ್ಟಿ ಸೇರಿಸಿ", bn:"নতুন উৎপাদন তালিকা যোগ করুন", ar:"إضافة قائمة منتج جديد" },
  addNewSub:      { en:"Upload photos with auto GPS stamp · Live to 2,000+ buyers", hi:"GPS के साथ फोटो अपलोड करें · 2,000+ खरीदारों तक", mr:"GPS सह फोटो अपलोड करा · 2,000+ खरेदीदारांपर्यंत", pa:"GPS ਨਾਲ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ · 2,000+ ਖਰੀਦਦਾਰਾਂ ਤੱਕ", gu:"GPS સાથે ફોટો અપલોડ કરો · 2,000+ ખરીદદારો", ta:"GPS உடன் புகைப்படம் பதிவேற்றவும்", te:"GPS తో ఫోటో అప్‌లోడ్ చేయండి", kn:"GPS ನೊಂದಿಗೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", bn:"GPS সহ ফটো আপলোড করুন", ar:"تحميل صور مع ختم GPS تلقائي" },
  loading:        { en:"⏳ Loading listings…", hi:"⏳ लिस्टिंग लोड हो रही है…", mr:"⏳ लिस्टिंग लोड होत आहे…", pa:"⏳ ਲਿਸਟਿੰਗ ਲੋਡ ਹੋ ਰਹੀ ਹੈ…", gu:"⏳ લિસ્ટિંગ લોડ થઈ રહી છે…", ta:"⏳ பட்டியல்கள் ஏற்றப்படுகிறது…", te:"⏳ జాబితాలు లోడ్ అవుతున్నాయి…", kn:"⏳ ಪಟ್ಟಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ…", bn:"⏳ তালিকা লোড হচ্ছে…", ar:"⏳ تحميل القوائم…" },
  // Modal strings
  modalTitle:     { en:"Add New Produce Listing", hi:"नई उत्पाद लिस्टिंग जोड़ें", mr:"नवीन उत्पादन लिस्टिंग जोडा", pa:"ਨਵੀਂ ਫਸਲ ਲਿਸਟਿੰਗ ਜੋੜੋ", gu:"નવી ઉપજ લિસ્ટિંગ", ta:"புதிய பட்டியல் சேர்க்க", te:"కొత్త జాబితా జోడించు", kn:"ಹೊಸ ಪಟ್ಟಿ ಸೇರಿಸಿ", bn:"নতুন তালিকা যোগ করুন", ar:"إضافة قائمة جديدة" },
  modalSub:       { en:"Your listing goes live to 2,000+ verified buyers after review.", hi:"आपकी लिस्टिंग समीक्षा के बाद 2,000+ खरीदारों को दिखेगी।", mr:"तुमची लिस्टिंग आढाव्यानंतर 2,000+ खरेदीदारांना दिसेल.", pa:"ਤੁਹਾਡੀ ਲਿਸਟਿੰਗ ਸਮੀਖਿਆ ਤੋਂ ਬਾਅਦ 2,000+ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਦਿਖੇਗੀ।", gu:"તમારી લિસ્ટિંગ સમીક્ષા પછી 2,000+ ખરીદદારોને દેખાશે.", ta:"மதிப்பாய்வுக்குப் பிறகு 2,000+ வாங்குபவர்களுக்கு தெரியும்.", te:"సమీక్ష తర్వాత 2,000+ కొనుగోలుదారులకు కనిపిస్తుంది.", kn:"ಪರಿಶೀಲನೆಯ ನಂತರ 2,000+ ಖರೀದಿದಾರರಿಗೆ ಗೋಚರಿಸುತ್ತದೆ.", bn:"পর্যালোচনার পরে 2,000+ ক্রেতাদের কাছে দেখাবে।", ar:"ستظهر قائمتك لأكثر من 2,000 مشتري بعد المراجعة." },
  produceType:    { en:"Produce Type", hi:"उत्पाद प्रकार", mr:"उत्पादनाचा प्रकार", pa:"ਫਸਲ ਦੀ ਕਿਸਮ", gu:"ઉપજ પ્રકાર", ta:"விளைபொருள் வகை", te:"పంట రకం", kn:"ಉತ್ಪನ್ನ ಪ್ರಕಾರ", bn:"পণ্যের ধরন", ar:"نوع المنتج" },
  quantityKg:     { en:"Quantity (kg)", hi:"मात्रा (किग्रा)", mr:"प्रमाण (किग्रा)", pa:"ਮਾਤਰਾ (ਕਿਲੋ)", gu:"જથ્થો (કિ.ગ્રા.)", ta:"அளவு (கிகி)", te:"పరిమాణం (కి.గ్రా)", kn:"ಪ್ರಮಾಣ (ಕೆಜಿ)", bn:"পরিমাণ (কেজি)", ar:"الكمية (كغ)" },
  pricePerKg:     { en:"Price (₹/kg)", hi:"कीमत (₹/किग्रा)", mr:"किंमत (₹/किग्रा)", pa:"ਕੀਮਤ (₹/ਕਿਲੋ)", gu:"ભાવ (₹/કિ.ગ્રા.)", ta:"விலை (₹/கிகி)", te:"ధర (₹/కి.గ్రా)", kn:"ಬೆಲೆ (₹/ಕೆಜಿ)", bn:"মূল্য (₹/কেজি)", ar:"السعر (₹/كغ)" },
  harvestDate:    { en:"Harvest Date", hi:"कटाई तिथि", mr:"कापणीची तारीख", pa:"ਵਾਢੀ ਦੀ ਮਿਤੀ", gu:"લણણીની તારીખ", ta:"அறுவடை தேதி", te:"పంట తేదీ", kn:"ಕೊಯ್ಲು ದಿನಾಂಕ", bn:"ফসল কাটার তারিখ", ar:"تاريخ الحصاد" },
  description:    { en:"Description", hi:"विवरण", mr:"वर्णन", pa:"ਵੇਰਵਾ", gu:"વર્ણન", ta:"விளக்கம்", te:"వివరణ", kn:"ವಿವರಣೆ", bn:"বিবরণ", ar:"الوصف" },
  optional:       { en:"(optional)", hi:"(वैकल्पिक)", mr:"(पर्यायी)", pa:"(ਵਿਕਲਪਿਕ)", gu:"(વૈકલ્પિક)", ta:"(விரும்பினால்)", te:"(ఐచ్ఛికం)", kn:"(ಐಚ್ಛಿಕ)", bn:"(ঐচ্ছিক)", ar:"(اختياري)" },
  cancel:         { en:"Cancel", hi:"रद्द करें", mr:"रद्द करा", pa:"ਰੱਦ ਕਰੋ", gu:"રદ કરો", ta:"ரத்து செய்", te:"రద్దు చేయి", kn:"ರದ್ದುಮಾಡಿ", bn:"বাতিল করুন", ar:"إلغاء" },
  listNow:        { en:"🌾 List Produce Now", hi:"🌾 अभी उत्पाद सूचीबद्ध करें", mr:"🌾 आता उत्पादन सूचीबद्ध करा", pa:"🌾 ਹੁਣੇ ਫਸਲ ਸੂਚੀਬੱਧ ਕਰੋ", gu:"🌾 હવે ઉપજ સૂચિબદ્ધ કરો", ta:"🌾 இப்போது பட்டியலிடுங்கள்", te:"🌾 ఇప్పుడు జాబితా చేయండి", kn:"🌾 ಈಗ ಪಟ್ಟಿ ಮಾಡಿ", bn:"🌾 এখনই তালিকাভুক্ত করুন", ar:"🌾 أضف الآن" },
  saving:         { en:"⏳ Saving…", hi:"⏳ सहेज रहे हैं…", mr:"⏳ सेव्ह होत आहे…", pa:"⏳ ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ…", gu:"⏳ સેવ થઈ રહ્યું છે…", ta:"⏳ சேமிக்கிறது…", te:"⏳ సేవ్ అవుతోంది…", kn:"⏳ ಉಳಿಸಲಾಗುತ್ತಿದೆ…", bn:"⏳ সেভ হচ্ছে…", ar:"⏳ جاري الحفظ…" },
  saveFailed:     { en:"Failed to save. Please try again.", hi:"सहेजना विफल। कृपया पुनः प्रयास करें।", mr:"सेव्ह अयशस्वी. कृपया पुन्हा प्रयत्न करा.", pa:"ਸੇਵ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", gu:"સેવ નિષ્ફળ. ફરી પ્રયાસ કરો.", ta:"சேமிப்பு தோல்வி. மீண்டும் முயற்சி செய்யுங்கள்.", te:"సేవ్ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.", kn:"ಉಳಿಸಲು ವಿಫಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", bn:"সেভ ব্যর্থ। আবার চেষ্টা করুন।", ar:"فشل الحفظ. حاول مجدداً." },
  gpsPhotos:      { en:"📸 Farm & Produce Photos", hi:"📸 खेत और फसल की तस्वीरें", mr:"📸 शेत आणि पिकाचे फोटो", pa:"📸 ਖੇਤ ਅਤੇ ਫਸਲ ਦੀਆਂ ਫੋਟੋਆਂ", gu:"📸 ખેત અને ઉપજ ના ફોટો", ta:"📸 வயல் மற்றும் விளைபொருள் புகைப்படங்கள்", te:"📸 వ్యవసాయ మరియు పంట ఫోటోలు", kn:"📸 ಹೊಲ ಮತ್ತು ಬೆಳೆ ಫೋಟೋಗಳು", bn:"📸 খামার ও ফসলের ছবি", ar:"📸 صور المزرعة والمنتج" },
  gpsAuto:        { en:"(GPS auto-stamped)", hi:"(GPS स्वतः-स्टैम्प)", mr:"(GPS आपोआप)", pa:"(GPS ਆਪੇ)", gu:"(GPS ઓટો)", ta:"(GPS தானாக)", te:"(GPS ఆటో)", kn:"(GPS ಸ್ವಯಂ)", bn:"(GPS অটো)", ar:"(ختم GPS تلقائي)" },
  gpsAcquiring:   { en:"📡 Acquiring GPS… please wait", hi:"📡 GPS प्राप्त हो रहा है… प्रतीक्षा करें", mr:"📡 GPS मिळवत आहे… थांबा", pa:"📡 GPS ਪ੍ਰਾਪਤ ਹੋ ਰਿਹਾ ਹੈ… ਉਡੀਕ ਕਰੋ", gu:"📡 GPS મેળવી રહ્યા છીએ…", ta:"📡 GPS பெறுகிறது… காத்திருங்கள்", te:"📡 GPS పొందుతోంది… వేచి ఉండండి", kn:"📡 GPS ಪಡೆಯಲಾಗುತ್ತಿದೆ…", bn:"📡 GPS পাওয়া হচ্ছে…", ar:"📡 جلب GPS… يرجى الانتظار" },
  gpsLocked:      { en:"GPS Locked!", hi:"GPS लॉक हो गया!", mr:"GPS लॉक झाला!", pa:"GPS ਲਾਕ ਹੋ ਗਿਆ!", gu:"GPS લૉક થઈ ગઈ!", ta:"GPS பூட்டப்பட்டது!", te:"GPS లాక్ అయింది!", kn:"GPS ಲಾಕ್ ಆಯಿತು!", bn:"GPS লক হয়েছে!", ar:"!تم قفل GPS" },
  clickDrop:      { en:"Click or drag & drop farm photos", hi:"खेत की तस्वीरें क्लिक करें या खींचें", mr:"शेताचे फोटो क्लिक करा किंवा ड्रॅग करा", pa:"ਖੇਤ ਦੀਆਂ ਫੋਟੋਆਂ ਕਲਿੱਕ ਕਰੋ ਜਾਂ ਖਿੱਚੋ", gu:"ખેત ફોટો ક્લિક અથવા ખેંચો", ta:"ஒரு புகைப்படத்தை கிளிக் செய்யுங்கள்", te:"ఫోటో క్లిక్ చేయండి లేదా లాగండి", kn:"ಫೋಟೋ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಎಳೆಯಿರಿ", bn:"ফটো ক্লিক বা টেনে আনুন", ar:"انقر أو اسحب صور المزرعة" },
};
const tl = (k: string, lang: string) => T[k]?.[lang] || T[k]?.en || k;

const S = {
  topbar: { background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(30,70,20,0.07)", padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 } as React.CSSProperties,
  page:   { padding:"28px 32px" } as React.CSSProperties,
  card:   { background:"#fff", borderRadius:20, padding:20, border:"1px solid rgba(30,70,20,0.07)", marginBottom:16 } as React.CSSProperties,
};

type GeoData = { lat:string; lng:string; district:string; state:string; acc:number };
type PhotoItem = { url?:string; emoji:string; geo:GeoData; verifying?:boolean };

function mockGPS(): Promise<GeoData> {
  return new Promise(res => setTimeout(() => res({ lat:(20.0+Math.random()*0.15).toFixed(5), lng:(73.8+Math.random()*0.15).toFixed(5), district:"Nashik", state:"Maharashtra", acc:Math.floor(Math.random()*6+3) }), 1800));
}

function GeoUploader({ photos, setPhotos, lang }: { photos:PhotoItem[]; setPhotos:(fn:(p:PhotoItem[])=>PhotoItem[])=>void; lang:string }) {
  const [gpsState, setGpsState] = useState<"idle"|"acquiring"|"locked">("idle");
  const [gps, setGps] = useState<GeoData|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojis = ["🥔","🌽","🧅","🌶️","🌾","🍅","🥕","🥦"];

  const getGPS = async () => { setGpsState("acquiring"); const g = await mockGPS(); setGps(g); setGpsState("locked"); return g; };
  const handleFiles = async (files:FileList|null) => {
    if (!files || files.length === 0) return;
    const g = gps ?? await getGPS();
    const newPhotos:PhotoItem[] = Array.from(files).map((file,i) => ({ url:URL.createObjectURL(file), emoji:emojis[Math.floor(Math.random()*emojis.length)], geo:{...g, lat:(parseFloat(g.lat)+i*0.0001).toFixed(5), lng:(parseFloat(g.lng)+i*0.0001).toFixed(5)}, verifying:true }));
    setPhotos(p => [...p, ...newPhotos]);
    setTimeout(() => setPhotos(p => p.map(ph => ({...ph, verifying:false}))), 1600);
  };

  return (
    <div>
      <label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>
        {tl("gpsPhotos",lang)} <span style={{ color:"#9ca3af", fontWeight:400 }}>{tl("gpsAuto",lang)}</span>
      </label>
      {gpsState==="acquiring" && <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px", marginBottom:12 }}><div style={{ width:10,height:10,borderRadius:"50%",background:"#f59e0b",flexShrink:0 }} /><span style={{ fontSize:12,color:"#92400e",fontWeight:500 }}>{tl("gpsAcquiring",lang)}</span></div>}
      {gpsState==="locked" && gps && <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12, padding:"12px 16px", marginBottom:12 }}><span style={{ fontSize:18 }}>✅</span><span style={{ fontSize:12, color:"#166534", fontWeight:600, lineHeight:1.6 }}><strong>{tl("gpsLocked",lang)}</strong><br />📍 {gps.lat}°N, {gps.lng}°E · {gps.district}, {gps.state} · ±{gps.acc}m</span></div>}
      {photos.length > 0 && <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>{photos.map((ph,i) => (<div key={i} style={{ width:96,height:96,borderRadius:14,overflow:"hidden",position:"relative",border:"2px solid #e5e7eb",flexShrink:0 }}>{ph.url ? <img src={ph.url} alt="farm" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,background:"#f6f9f0" }}>{ph.emoji}</div>}{ph.verifying ? <div style={{ position:"absolute",inset:0,background:"rgba(255,255,255,0.8)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}><div style={{ width:20,height:20,border:"2px solid #a3c45c",borderTopColor:"transparent",borderRadius:"50%" }} /><span style={{ fontSize:8,color:"#2d6b30",fontWeight:700 }}>GPS…</span></div> : <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(30,70,20,0.88))",padding:"14px 5px 4px",textAlign:"center" }}><div style={{ fontSize:9,color:"#a3c45c",fontWeight:800 }}>📍 GPS</div><div style={{ fontSize:7,color:"#fff",fontWeight:700 }}>{ph.geo.lat}°N</div></div>}<button onClick={() => setPhotos(p => p.filter((_,idx)=>idx!==i))} style={{ position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button></div>))}</div>}
      <div onClick={() => { fileRef.current?.click(); if(gpsState==="idle") getGPS(); }} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}} style={{ border:"2.5px dashed #c5d9b8",borderRadius:16,padding:24,textAlign:"center",cursor:"pointer",background:"#f9fdf5",transition:"all 0.2s" }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2d6b30";(e.currentTarget as HTMLElement).style.background="#f0f7f0";}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#c5d9b8";(e.currentTarget as HTMLElement).style.background="#f9fdf5";}}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e=>handleFiles(e.target.files)} style={{ display:"none" }} />
        <div style={{ fontSize:36, marginBottom:8 }}>📷</div>
        <div style={{ fontSize:14, fontWeight:700, color:"#1a2e1a", marginBottom:4 }}>{photos.length > 0 ? `${photos.length} photo${photos.length>1?"s":""} — click to add more` : tl("clickDrop",lang)}</div>
        <div style={{ fontSize:12, color:"#9ca3af" }}>JPG, PNG, HEIC · {tl("gpsAuto",lang)}</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AddModal({ onClose, onSave, lang }: { onClose:()=>void; onSave:(l:any)=>void; lang:string }) {
  const [form, setForm] = useState({ type:"🥔 Potatoes", qty:"", price:"", date:"", desc:"" });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}));

  const handleSave = async () => {
    if (!form.qty || !form.price) return;
    setSaving(true); setError("");
    const cropName = form.type.split(" ").slice(1).join(" ");
    const emoji = form.type.split(" ")[0];
    const { data, error:err } = await supabase.from("listings").insert({ farmer_id:DEMO_FARMER_ID, crop:cropName, quantity:parseFloat(form.qty), price_per_kg:parseFloat(form.price), grade:"A", state:"Maharashtra", description:form.desc, status:"pending" }).select().single();
    setSaving(false);
    if (err) { setError(tl("saveFailed",lang)); console.error(err); return; }
    onSave({ id:data.id, emoji, name:cropName, qty:form.qty, price:`₹${form.price}/kg`, loc:"Nashik, MH", bids:0, status:"pending", tags:photos.length?["⏳ Pending","📍 GPS"]:["⏳ Pending"], images:photos });
    onClose();
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:24,padding:28,width:620,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.2)",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:20,right:20,width:32,height:32,borderRadius:"50%",border:"none",background:"#f0f4ec",cursor:"pointer",fontSize:16 }}>✕</button>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:4 }}>{tl("modalTitle",lang)}</div>
        <div style={{ fontSize:13,color:"#6b7280",marginBottom:22 }}>{tl("modalSub",lang)}</div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block" }}>{tl("produceType",lang)}</label>
            <select value={form.type} onChange={e=>set("type",e.target.value)} style={{ width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#fafafa" }}>
              {["🥔 Potatoes","🌽 Sweet Corn","🧅 Onions","🌶️ Red Chilli","🌾 Wheat","🍅 Tomatoes","🥕 Carrots","🥦 Broccoli"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block" }}>{tl("quantityKg",lang)}</label>
            <input value={form.qty} onChange={e=>set("qty",e.target.value)} placeholder="e.g. 500" style={{ width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#fafafa" }} />
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block" }}>{tl("pricePerKg",lang)}</label>
            <input value={form.price} onChange={e=>set("price",e.target.value)} placeholder="e.g. 22" style={{ width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#fafafa" }} />
          </div>
          <div>
            <label style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block" }}>{tl("harvestDate",lang)}</label>
            <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={{ width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#fafafa" }} />
          </div>
        </div>
        <label style={{ fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block" }}>{tl("description",lang)} <span style={{ color:"#9ca3af",fontWeight:400 }}>{tl("optional",lang)}</span></label>
        <textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={2} placeholder="Grade A, no pesticides, certified organic…" style={{ width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#fafafa",resize:"none",marginBottom:20 }} />
        <div style={{ height:1,background:"#f0f0f0",marginBottom:20 }} />
        <GeoUploader photos={photos} setPhotos={setPhotos} lang={lang} />
        {error && <div style={{ marginTop:12,padding:"10px 14px",background:"#fee2e2",borderRadius:10,fontSize:12,color:"#991b1b",fontWeight:600 }}>❌ {error}</div>}
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          <button onClick={onClose} style={{ padding:"12px 20px",borderRadius:12,border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{tl("cancel",lang)}</button>
          <button onClick={handleSave} disabled={!form.qty||!form.price||saving} style={{ flex:1,padding:13,borderRadius:12,border:"none",background:"linear-gradient(135deg,#1e4620,#2d6b30)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:form.qty&&form.price&&!saving?1:0.5 }}>
            {saving ? tl("saving",lang) : tl("listNow",lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const { lang } = useLang();
  const [listings, setListings] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("listings").select("*").eq("farmer_id",DEMO_FARMER_ID).order("created_at",{ascending:false}).then(({data,error}) => {
      if (!error) setListings((data||[]).map((r:any) => ({ id:r.id, emoji:"🌾", name:r.crop, qty:`${r.quantity} kg`, price:`₹${r.price_per_kg}/kg`, loc:r.state||"Maharashtra", bids:0, status:r.status, tags:r.status==="active"?["✅ Verified"]:["⏳ Pending Review"], description:r.description })));
      setLoading(false);
    });
  }, []);

  const deleteListing = async (id:any) => { await supabase.from("listings").delete().eq("id",id); setListings(p=>p.filter(l=>l.id!==id)); };

  return (
    <>
      <div style={S.topbar}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:"#1a2e1a" }}>{tl("pageTitle",lang)}</h1>
          <p style={{ fontSize:13,color:"#6b7280",marginTop:1 }}>{tl("pageSub",lang)}</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ display:"flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#1e4620,#2d6b30)",color:"#fff",padding:"9px 18px",borderRadius:12,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
          {tl("addListing",lang)}
        </button>
      </div>

      <div style={S.page} className="fade-up">
        <div style={S.card}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1a2e1a" }}>{tl("allListings",lang)} ({listings.length})</span>
            <span style={{ fontSize:12,color:"#9ca3af" }}>{listings.filter(l=>l.status==="active").length} {tl("active",lang)} · {listings.filter(l=>l.status==="pending").length} {tl("pendingReview",lang)}</span>
          </div>

          {loading && <div style={{ textAlign:"center",padding:"40px 0",color:"#9ca3af",fontSize:14 }}>{tl("loading",lang)}</div>}

          {!loading && listings.length === 0 && (
            <div style={{ textAlign:"center",padding:"40px 0",color:"#9ca3af" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>📦</div>
              <div style={{ fontSize:14,fontWeight:600,color:"#374151",marginBottom:4 }}>{tl("noListings",lang)}</div>
              <div style={{ fontSize:12 }}>{tl("noListingsSub",lang)}</div>
            </div>
          )}

          {listings.map(l => (
            <div key={l.id} style={{ border:"1px solid rgba(30,70,20,0.08)",borderRadius:18,padding:16,marginBottom:12,transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(163,196,92,0.4)";(e.currentTarget as HTMLElement).style.boxShadow="0 6px 20px rgba(30,70,20,0.07)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(30,70,20,0.08)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              <div style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                <div style={{ width:64,height:64,borderRadius:12,background:"#f6f9f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0 }}>{l.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#1a2e1a",marginBottom:3 }}>{l.name}</div>
                  <div style={{ fontSize:11,color:"#9ca3af",marginBottom:6 }}>📍 {l.loc} · {l.bids} {tl("activeBids",lang)}</div>
                  {l.description && <div style={{ fontSize:11,color:"#6b7280",marginBottom:6 }}>{l.description}</div>}
                  <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                    {l.tags.map((t:string)=><span key={t} style={{ fontSize:9,fontWeight:600,padding:"2px 7px",borderRadius:100,background:t.includes("GPS")?"#eff6ff":t.includes("Verified")?"#f0f7f0":"#fef3c7",color:t.includes("GPS")?"#1d4ed8":t.includes("Verified")?"#2d6b30":"#92400e" }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:17,fontWeight:800,color:"#2d6b30" }}>{l.price}</div>
                  <div style={{ fontSize:11,color:"#9ca3af" }}>{l.qty}</div>
                </div>
              </div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,paddingTop:10,borderTop:"1px solid #f0f0f0" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:l.status==="active"?"#22c55e":"#f59e0b" }} />
                  <span style={{ fontSize:11,fontWeight:600,color:l.status==="active"?"#16a34a":"#d97706" }}>
                    {l.status==="active" ? tl("active",lang) : tl("pendingReview",lang)}
                  </span>
                </div>
                <div style={{ display:"flex",gap:6 }}>
                  <button style={{ padding:"5px 12px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,background:"#f0f7f0",color:"#2d6b30",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{tl("edit",lang)}</button>
                  <button onClick={()=>deleteListing(l.id)} style={{ padding:"5px 12px",borderRadius:8,border:"none",fontSize:11,fontWeight:600,background:"#fee2e2",color:"#991b1b",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>{tl("remove",lang)}</button>
                </div>
              </div>
            </div>
          ))}

          {!loading && (
            <div onClick={()=>setModal(true)} style={{ border:"2px dashed #c5d9b8",borderRadius:18,padding:28,textAlign:"center",cursor:"pointer",background:"#f9fdf5",transition:"all 0.2s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#2d6b30";(e.currentTarget as HTMLElement).style.background="#f0f7f0";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#c5d9b8";(e.currentTarget as HTMLElement).style.background="#f9fdf5";}}>
              <div style={{ fontSize:32,marginBottom:8 }}>📦</div>
              <div style={{ fontSize:14,fontWeight:700,color:"#374151",marginBottom:4 }}>{tl("addNewProduce",lang)}</div>
              <div style={{ fontSize:12,color:"#9ca3af" }}>{tl("addNewSub",lang)}</div>
            </div>
          )}
        </div>
      </div>
      {modal && <AddModal onClose={()=>setModal(false)} onSave={l=>setListings(p=>[l,...p])} lang={lang} />}
    </>
  );
}
