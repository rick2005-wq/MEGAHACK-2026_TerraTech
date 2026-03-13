import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";

const DEMO_INDUSTRY_ID = "00000000-0000-0000-0000-000000000002";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#eef2e8;}
input,textarea,select,button{font-family:'DM Sans',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-thumb{background:rgba(30,70,20,0.18);border-radius:10px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes slideR{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse2{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}70%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
.fu{animation:fadeUp .28s ease both;}
.sr{animation:slideR .22s ease both;}
`;

/* ─── DATA ─── */

/* ─── i18n ─── */
const LANGUAGES=[
  {code:"en",native:"English",flag:"🇬🇧"},{code:"hi",native:"हिन्दी",flag:"🇮🇳"},
  {code:"mr",native:"मराठी",flag:"🇮🇳"},{code:"pa",native:"ਪੰਜਾਬੀ",flag:"🇮🇳"},
  {code:"gu",native:"ગુજરાતી",flag:"🇮🇳"},{code:"ta",native:"தமிழ்",flag:"🇮🇳"},
  {code:"te",native:"తెలుగు",flag:"🇮🇳"},{code:"kn",native:"ಕನ್ನಡ",flag:"🇮🇳"},
  {code:"bn",native:"বাংলা",flag:"🇮🇳"},{code:"ar",native:"العربية",flag:"🇸🇦"},
];
const TT={
  dashboard:     {en:"Dashboard",hi:"डैशबोर्ड",mr:"डॅशबोर्ड",pa:"ਡੈਸ਼ਬੋਰਡ",gu:"ડૅશબોર્ડ",ta:"டாஷ்போர்ட்",te:"డాష్‌బోర్డ్",kn:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",bn:"ড্যাশবোর্ড",ar:"لوحة القيادة"},
  browse:        {en:"Browse Listings",hi:"लिस्टिंग ब्राउज़",mr:"लिस्टिंग ब्राउझ",pa:"ਲਿਸਟਿੰਗ ਬ੍ਰਾਊਜ਼",gu:"લિસ્ટિંગ બ્રાઉઝ",ta:"பட்டியல்களை உலாவுக",te:"జాబితాలు చూడు",kn:"ಪಟ್ಟಿಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",bn:"তালিকা দেখুন",ar:"تصفح القوائم"},
  tenders:       {en:"My Tenders",hi:"मेरे टेंडर",mr:"माझे टेंडर",pa:"ਮੇਰੇ ਟੈਂਡਰ",gu:"મારા ટેન્ડર",ta:"என் டெண்டர்கள்",te:"నా టెండర్లు",kn:"ನನ್ನ ಟೆಂಡರ್‌ಗಳು",bn:"আমার টেন্ডার",ar:"مناقصاتي"},
  bids:          {en:"Bids Received",hi:"बोलियाँ प्राप्त",mr:"बोली मिळाल्या",pa:"ਬੋਲੀਆਂ ਪ੍ਰਾਪਤ",gu:"બોલીઓ મળી",ta:"ஏலங்கள் பெற்றன",te:"బిడ్‌లు అందాయి",kn:"ಬಿಡ್‌ಗಳು ಸ್ವೀಕರಿಸಿದವು",bn:"বিড পাওয়া গেছে",ar:"العطاءات المستلمة"},
  farmers:       {en:"My Farmers",hi:"मेरे किसान",mr:"माझे शेतकरी",pa:"ਮੇਰੇ ਕਿਸਾਨ",gu:"મારા ખેડૂત",ta:"என் விவசாயிகள்",te:"నా రైతులు",kn:"ನನ್ನ ರೈತರು",bn:"আমার কৃষকরা",ar:"مزارعوي"},
  messages:      {en:"Messages",hi:"संदेश",mr:"संदेश",pa:"ਸੁਨੇਹੇ",gu:"સંદેશ",ta:"செய்திகள்",te:"సందేశాలు",kn:"ಸಂದೇಶಗಳು",bn:"বার্তা",ar:"الرسائل"},
  payments:      {en:"Payments",hi:"भुगतान",mr:"पेमेंट",pa:"ਭੁਗਤਾਨ",gu:"ચુકવણી",ta:"கொடுப்பனவுகள்",te:"చెల్లింపులు",kn:"ಪಾವತಿಗಳు",bn:"পেমেন্ট",ar:"المدفوعات"},
  analytics:     {en:"Analytics",hi:"विश्लेषण",mr:"विश्लेषण",pa:"ਵਿਸ਼ਲੇਸ਼ਣ",gu:"વિશ્લેષણ",ta:"பகுப்பாய்வு",te:"విశ్లేషణలు",kn:"ವಿಶ್ಲೇಷಣೆ",bn:"বিশ্লেষণ",ar:"التحليلات"},
  settings:      {en:"Settings",hi:"सेटिंग्स",mr:"सेटिंग्ज",pa:"ਸੈਟਿੰਗਜ਼",gu:"સેટિંગ્સ",ta:"அமைப்புகள்",te:"సెట్టింగులు",kn:"ಸೆಟ್ಟಿಂಗ್‌ಗಳు",bn:"সেটিংস",ar:"الإعدادات"},
  language:      {en:"Language",hi:"भाषा",mr:"भाषा",pa:"ਭਾਸ਼ਾ",gu:"ભાષા",ta:"மொழி",te:"భాష",kn:"ಭಾಷೆ",bn:"ভাষা",ar:"اللغة"},
  goodMorning:   {en:"Good morning, Sourcing Team 🏭",hi:"शुभ प्रभात, सोर्सिंग टीम 🏭",mr:"शुभ सकाळ, सोर्सिंग टीम 🏭",pa:"ਸ਼ੁਭ ਸਵੇਰ, ਸੋਰਸਿੰਗ ਟੀਮ 🏭",gu:"શુભ સવાર, સોર્સિંગ ટીમ 🏭",ta:"காலை வணக்கம், சோர்சிங் டீம் 🏭",te:"శుభోదయం, సోర్సింగ్ టీమ్ 🏭",kn:"ಶುಭ ಬೆಳಗು, ಸೋರ್ಸಿಂಗ್ ಟೀಮ್ 🏭",bn:"শুভ সকাল, সোর্সিং টিম 🏭",ar:"صباح الخير، فريق التوريد 🏭"},
  q4phase:       {en:"GrainOS Industry Portal · Q4 Procurement",hi:"GrainOS उद्योग पोर्टल · Q4 खरीद",mr:"GrainOS उद्योग पोर्टल · Q4 खरेदी",pa:"GrainOS ਉਦਯੋਗ ਪੋਰਟਲ · Q4 ਖਰੀਦ",gu:"GrainOS ઉદ્યોગ પોર્ટલ · Q4 ખરીદ",ta:"GrainOS தொழில் போர்டல் · Q4 கொள்முதல்",te:"GrainOS పోర్టల్ · Q4 సేకరణ",kn:"GrainOS ಪೋರ್ಟಲ್ · Q4 ಖರೀದಿ",bn:"GrainOS পোর্টাল · Q4 সংগ্রহ",ar:"بوابة GrainOS · Q4 مشتريات"},
  totalSpent:    {en:"Total Spent YTD",hi:"कुल खर्च YTD",mr:"एकूण खर्च YTD",pa:"ਕੁੱਲ ਖਰਚ YTD",gu:"કુલ ખર્ચ YTD",ta:"மொத்த செலவு YTD",te:"మొత్తం ఖర్చు YTD",kn:"ಒಟ್ಟು ವೆಚ್ಚ YTD",bn:"মোট ব্যয় YTD",ar:"إجمالي الإنفاق"},
  activeTenders: {en:"Active Tenders",hi:"सक्रिय टेंडर",mr:"सक्रिय टेंडर",pa:"ਸਰਗਰਮ ਟੈਂਡਰ",gu:"સક્રિય ટેન્ડર",ta:"செயலில் டெண்டர்கள்",te:"చురుకైన టెండర్లు",kn:"ಸಕ್ರಿಯ ಟೆಂಡರ್‌ಗಳು",bn:"সক্রিয় টেন্ডার",ar:"المناقصات النشطة"},
  newBidsLbl:    {en:"New Bids",hi:"नई बोलियाँ",mr:"नवीन बोली",pa:"ਨਵੀਆਂ ਬੋਲੀਆਂ",gu:"નવી બોલીઓ",ta:"புதிய ஏலங்கள்",te:"కొత్త బిడ్లు",kn:"ಹೊಸ ಬಿಡ್‌ಗಳು",bn:"নতুন বিড",ar:"عروض جديدة"},
  pendingDel:    {en:"Pending Deliveries",hi:"लंबित डिलीवरी",mr:"प्रलंबित डिलीव्हरी",pa:"ਬਕਾਇਆ ਡਿਲੀਵਰੀ",gu:"બાકી ડિલિવરી",ta:"நிலுவை டெலிவரி",te:"పెండింగ్ డెలివరీలు",kn:"ಬಾಕಿ ಡೆಲಿವರಿಗಳು",bn:"মুলতবি ডেলিভারি",ar:"التسليمات المعلقة"},
  liveOnPlatform:{en:"Live on platform",hi:"प्लेटफॉर्म पर लाइव",mr:"प्लॅटफॉर्मवर लाइव",pa:"ਪਲੇਟਫਾਰਮ ਤੇ ਲਾਈਵ",gu:"પ્લેટફોર્મ પર લાઇવ",ta:"தளத்தில் நேரடி",te:"ప్లాట్‌ఫారమ్‌లో లైవ్",kn:"ವೇದಿಕೆಯಲ್ಲಿ ಲೈವ್",bn:"প্ল্যাটফর্মে লাইভ",ar:"مباشر على المنصة"},
  awaitingResp:  {en:"Awaiting your response",hi:"आपके जवाब का इंतज़ार",mr:"तुमच्या प्रतिसादाची प्रतीक्षा",pa:"ਤੁਹਾਡੇ ਜਵਾਬ ਦੀ ਉਡੀਕ",gu:"તમારા જવાબની રાહ",ta:"உங்கள் பதிலை எதிர்பார்க்கிறோம்",te:"మీ స్పందన కోసం వేచి ఉంది",kn:"ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ನಿರೀಕ್ಷಿಸುತ್ತಿದೆ",bn:"আপনার সাড়ার অপেক্ষায়",ar:"في انتظار ردك"},
  inTransit:     {en:"₹14.2L in transit",hi:"₹14.2L ट्रांज़िट में",mr:"₹14.2L ट्रांझिटमध्ये",pa:"₹14.2L ਟਰਾਂਜ਼ਿਟ ਵਿੱਚ",gu:"₹14.2L ટ્રાન્ઝિટ",ta:"₹14.2L போக்குவரத்தில்",te:"₹14.2L రవాణాలో",kn:"₹14.2L ಸಾಗಣೆಯಲ್ಲಿ",bn:"₹14.2L ট্রানজিটে",ar:"₹14.2L في العبور"},
  incomingBids:  {en:"Incoming Bids",hi:"आने वाली बोलियाँ",mr:"येणारी बोली",pa:"ਆਉਣ ਵਾਲੀਆਂ ਬੋਲੀਆਂ",gu:"આવતી બોલીઓ",ta:"வரும் ஏலங்கள்",te:"వచ్చే బిడ్లు",kn:"ಬರುವ ಬಿಡ್‌ಗಳು",bn:"আসছে বিড",ar:"العروض الواردة"},
  allBidsLink:   {en:"All bids →",hi:"सभी बोलियाँ →",mr:"सर्व बोली →",pa:"ਸਭ ਬੋਲੀਆਂ →",gu:"બધી બોલીઓ →",ta:"அனைத்து ஏலங்கள் →",te:"అన్ని బిడ్లు →",kn:"ಎಲ್ಲಾ ಬಿಡ್‌ಗಳು →",bn:"সব বিড →",ar:"جميع العروض →"},
  noBidsYet:     {en:"No bids yet. Float a tender to receive bids!",hi:"अभी बोलियाँ नहीं। टेंडर पोस्ट करें!",mr:"अजून बोली नाही. टेंडर पोस्ट करा!",pa:"ਅਜੇ ਬੋਲੀਆਂ ਨਹੀਂ। ਟੈਂਡਰ ਪੋਸਟ ਕਰੋ!",gu:"હજી બોલીઓ નથી. ટેન્ડર ફ્લોટ કરો!",ta:"இன்னும் ஏலங்கள் இல்லை. டெண்டர் போடுங்கள்!",te:"ఇంకా బిడ్లు లేవు. టెండర్ పోస్ట్ చేయండి!",kn:"ಇನ್ನೂ ಬಿಡ್‌ಗಳಿಲ್ಲ. ಟೆಂಡರ್ ಪೋಸ್ಟ್ ಮಾಡಿ!",bn:"এখনো বিড নেই। টেন্ডার ফ্লোট করুন!",ar:"لا عروض بعد. أضف مناقصة!"},
  topFarmers:    {en:"Top Farmers",hi:"शीर्ष किसान",mr:"अव्वल शेतकरी",pa:"ਚੋਟੀ ਦੇ ਕਿਸਾਨ",gu:"ટોચના ખેડૂત",ta:"சிறந்த விவசாயிகள்",te:"అగ్రశ్రేణి రైతులు",kn:"ಅಗ್ರ ರೈತರು",bn:"শীর্ষ কৃষক",ar:"أفضل المزارعين"},
  viewAllFarmers:{en:"View All Farmers →",hi:"सभी किसान देखें →",mr:"सर्व शेतकरी पहा →",pa:"ਸਭ ਕਿਸਾਨ ਦੇਖੋ →",gu:"બધા ખેડૂત જુઓ →",ta:"அனைத்து விவசாயிகளையும் பார்க்கவும் →",te:"అందరు రైతులను చూడండి →",kn:"ಎಲ್ಲಾ ರೈತರನ್ನು ನೋಡಿ →",bn:"সব কৃষক দেখুন →",ar:"عرض جميع المزارعين →"},
  manageAll:     {en:"Manage all →",hi:"सब प्रबंधित करें →",mr:"सर्व व्यवस्थापित करा →",pa:"ਸਭ ਪ੍ਰਬੰਧਿਤ ਕਰੋ →",gu:"બધું સંચાલિત કરો →",ta:"அனைத்தும் நிர்வகிக்கவும் →",te:"అన్నీ నిర్వహించు →",kn:"ಎಲ್ಲವನ್ನೂ ನಿರ್ವಹಿಸಿ →",bn:"সব পরিচালনা করুন →",ar:"إدارة الكل →"},
  noTendersYet:  {en:"No tenders yet.",hi:"अभी कोई टेंडर नहीं।",mr:"अजून टेंडर नाही.",pa:"ਅਜੇ ਕੋਈ ਟੈਂਡਰ ਨਹੀਂ।",gu:"હજી ટેન્ડર નથી.",ta:"இன்னும் டெண்டர்கள் இல்லை.",te:"ఇంకా టెండర్లు లేవు.",kn:"ಇನ್ನೂ ಟೆಂಡರ್‌ಗಳಿಲ್ಲ.",bn:"এখনো টেন্ডার নেই.",ar:"لا توجد مناقصات بعد."},
  compareBtn:    {en:"⚖️ Compare Farmers",hi:"⚖️ किसानों की तुलना",mr:"⚖️ शेतकऱ्यांची तुलना",pa:"⚖️ ਕਿਸਾਨਾਂ ਦੀ ਤੁਲਨਾ",gu:"⚖️ ખેડૂતો સરખામણી",ta:"⚖️ விவசாயிகளை ஒப்பிடுக",te:"⚖️ రైతులను పోల్చండి",kn:"⚖️ ರೈತರನ್ನು ಹೋಲಿಸಿ",bn:"⚖️ কৃষকদের তুলনা",ar:"⚖️ مقارنة المزارعين"},
  floatTender:   {en:"+ Float Tender",hi:"+ टेंडर फ्लोट करें",mr:"+ टेंडर फ्लोट करा",pa:"+ ਟੈਂਡਰ ਫਲੋਟ ਕਰੋ",gu:"+ ટેન્ડર ફ્લોટ",ta:"+ டெண்டர் போடுங்கள்",te:"+ టెండర్ ఫ్లోట్",kn:"+ ಟೆಂಡರ್ ಫ್ಲೋಟ್",bn:"+ টেন্ডার ফ্লোট করুন",ar:"+ طرح مناقصة"},
  postTender:    {en:"+ Float New Tender",hi:"+ नया टेंडर फ्लोट करें",mr:"+ नवीन टेंडर फ्लोट करा",pa:"+ ਨਵਾਂ ਟੈਂਡਰ ਫਲੋਟ ਕਰੋ",gu:"+ નવો ટેન્ડર ફ્લોટ",ta:"+ புதிய டெண்டர் போடு",te:"+ కొత్త టెండర్ ఫ్లోట్",kn:"+ ಹೊಸ ಟೆಂಡರ್ ಫ್ಲೋಟ್",bn:"+ নতুন টেন্ডার ফ্লোট",ar:"+ طرح مناقصة جديدة"},
  shortlist:     {en:"⭐ Shortlist",hi:"⭐ शॉर्टलिस्ट",mr:"⭐ शॉर्टलिस्ट",pa:"⭐ ਸ਼ੌਰਟਲਿਸਟ",gu:"⭐ શૉર્ટલિસ્ટ",ta:"⭐ தேர்ந்தெடு",te:"⭐ షార్ట్‌లిస్ట్",kn:"⭐ ಆಯ್ಕೆಪಟ್ಟಿ",bn:"⭐ শর্টলিস্ট",ar:"⭐ إدراج في القائمة"},
  awardContract: {en:"🏆 Award Contract",hi:"🏆 अनुबंध प्रदान करें",mr:"🏆 करार द्या",pa:"🏆 ਠੇਕਾ ਦਿਓ",gu:"🏆 કોન્ટ્રેક્ટ આપો",ta:"🏆 ஒப்பந்தம் வழங்கவும்",te:"🏆 కాంట్రాక్ట్ ఇవ్వండి",kn:"🏆 ಒಪ್ಪಂದ ನೀಡಿ",bn:"🏆 চুক্তি প্রদান করুন",ar:"🏆 منح العقد"},
  browseProduce: {en:"Browse Listings 🔍",hi:"लिस्टिंग ब्राउज़ करें 🔍",mr:"लिस्टिंग ब्राउझ करा 🔍",pa:"ਲਿਸਟਿੰਗ ਬ੍ਰਾਊਜ਼ ਕਰੋ 🔍",gu:"લિસ્ટિંગ બ્રાઉઝ 🔍",ta:"பட்டியல்களை உலாவுக 🔍",te:"జాబితాలు చూడండి 🔍",kn:"ಪಟ್ಟಿಗಳನ್ನು ನೋಡಿ 🔍",bn:"তালিকা দেখুন 🔍",ar:"تصفح القوائم 🔍"},
  searchProduce: {en:"Search produce, farmer or location…",hi:"फसल, किसान या स्थान खोजें…",mr:"पीक, शेतकरी किंवा स्थान शोधा…",pa:"ਫਸਲ, ਕਿਸਾਨ ਜਾਂ ਸਥਾਨ ਖੋਜੋ…",gu:"ઉપજ, ખેડૂત ખોજો…",ta:"விளைபொருள், விவசாயி தேடுங்கள்…",te:"పంట, రైతు వెతకండి…",kn:"ಬೆಳೆ, ರೈತ ಹುಡುಕಿ…",bn:"ফসল, কৃষক খুঁজুন…",ar:"ابحث عن منتج أو مزارع…"},
  cancel:        {en:"Cancel",hi:"रद्द करें",mr:"रद्द करा",pa:"ਰੱਦ ਕਰੋ",gu:"રદ કરો",ta:"ரத்து செய்",te:"రద్దు చేయి",kn:"ರದ್ದುಮಾಡಿ",bn:"বাতিল করুন",ar:"إلغاء"},
  save:          {en:"Save",hi:"सहेजें",mr:"जतन करा",pa:"ਸੇਵ ਕਰੋ",gu:"સેવ",ta:"சேமி",te:"సేవ్",kn:"ಉಳಿಸಿ",bn:"সেভ",ar:"حفظ"},
  vsLastYear:    {en:"↑ +22% vs last year",hi:"↑ +22% पिछले साल से",mr:"↑ +22% गेल्या वर्षापेक्षा",pa:"↑ +22% ਪਿਛਲੇ ਸਾਲ ਨਾਲੋਂ",gu:"↑ +22% ગત વર્ષ કરતાં",ta:"↑ +22% கடந்த ஆண்டை விட",te:"↑ +22% గత సంవత్సరం కంటే",kn:"↑ +22% ಕಳೆದ ವರ್ಷಕ್ಕಿಂತ",bn:"↑ +22% গত বছরের তুলনায়",ar:"↑ +22% مقارنة بالعام الماضي"},
  compareArrow:  {en:"Compare →",hi:"तुलना →",mr:"तुलना →",pa:"ਤੁਲਨਾ →",gu:"સરખામણી →",ta:"ஒப்பிடு →",te:"పోల్చు →",kn:"ಹೋಲಿಸಿ →",bn:"তুলনা →",ar:"قارن →"},
};
const tt=(key,lang)=>TT[key]?.[lang]||TT[key]?.en||key;

const TICKER=[
  {n:"Wheat",p:"₹28/kg",c:"+0.8%",up:true},{n:"Potato",p:"₹22/kg",c:"+4.2%",up:true},
  {n:"Onion",p:"₹14/kg",c:"-1.8%",up:false},{n:"Corn",p:"₹18/kg",c:"+2.1%",up:true},
  {n:"Chilli",p:"₹85/kg",c:"+6.4%",up:true},{n:"Tomato",p:"₹32/kg",c:"+12.3%",up:true},
  {n:"Soybean",p:"₹44/kg",c:"+1.2%",up:true},{n:"Rice",p:"₹52/kg",c:"-0.5%",up:false},
];

const FARMERS=[
  {id:1,name:"Ramesh Patil",e:"👨‍🌾",loc:"Nashik, MH",rating:4.9,verified:true,spec:["Potato","Onion","Wheat"],score:96,onTime:"100%",price:"Competitive",orders:28,listings:4,avgQty:"2.4 ton",resp:"< 1 hr",certs:["FSSAI","Organic"],tag:"Top Seller",bio:"12 years farming experience. National award winner 2024. Consistent Grade A produce."},
  {id:2,name:"Sunita Devi",e:"👩‍🌾",loc:"Pune, MH",rating:4.7,verified:true,spec:["Tomato","Corn","Brinjal"],score:89,onTime:"97%",price:"Below Mkt",orders:41,listings:6,avgQty:"1.8 ton",resp:"< 2 hr",certs:["FSSAI"],tag:"Reliable",bio:"Specializes in hybrid tomato varieties. 41 orders completed without disputes."},
  {id:3,name:"Gopal Singh",e:"🧑‍🌾",loc:"Nagpur, MH",rating:4.5,verified:false,spec:["Wheat","Soybean","Rice"],score:72,onTime:"92%",price:"Above Mkt",orders:14,listings:2,avgQty:"5.2 ton",resp:"< 4 hr",certs:[],tag:null,bio:"Large land holding, ideal for bulk wheat orders. Verification in progress."},
  {id:4,name:"Kavitha Rao",e:"👩‍🌾",loc:"Kolhapur, MH",rating:4.8,verified:true,spec:["Chilli","Turmeric","Ginger"],score:91,onTime:"99%",price:"Competitive",orders:19,listings:3,avgQty:"1.2 ton",resp:"< 1 hr",certs:["FSSAI","APEDA","Organic"],tag:"Export Ready",bio:"APEDA registered. Exports spices to Dubai and Singapore. Premium quality guaranteed."},
  {id:5,name:"Arjun Mehta",e:"👨‍🌾",loc:"Amravati, MH",rating:4.6,verified:true,spec:["Soybean","Corn","Wheat"],score:84,onTime:"95%",price:"Below Mkt",orders:33,listings:5,avgQty:"3.6 ton",resp:"< 2 hr",certs:["FSSAI"],tag:null,bio:"Organic certified soybean specialist. Large scale production available."},
  {id:6,name:"Lakshmi Bai",e:"👩‍🌾",loc:"Satara, MH",rating:4.8,verified:true,spec:["Onion","Tomato","Garlic"],score:88,onTime:"98%",price:"Competitive",orders:22,listings:4,avgQty:"2.0 ton",resp:"< 1 hr",certs:["FSSAI","Organic"],tag:"Organic",bio:"Certified organic farm. Women farmer of the year 2023. Zero-pesticide produce."},
];

const PRODUCE=[
  {id:1,e:"🥔",name:"Grade A Potatoes",farmer:"Ramesh Patil",fid:1,loc:"Nashik, MH",price:"₹22",qty:"800 kg",fresh:"3 days ago",geo:true,v:true,bids:4,desc:"Freshly harvested Grade A. FSSAI certified. No pesticides last 30 days. Daily cold storage available."},
  {id:2,e:"🌶️",name:"Red Chilli Teja",farmer:"Kavitha Rao",fid:4,loc:"Kolhapur, MH",price:"₹85",qty:"500 kg",fresh:"1 week ago",geo:true,v:true,bids:7,desc:"Teja variety, APEDA certified. High capsaicin. Export quality packaging available."},
  {id:3,e:"🌽",name:"Sweet Corn",farmer:"Sunita Devi",fid:2,loc:"Pune, MH",price:"₹18",qty:"1.2 ton",fresh:"2 days ago",geo:true,v:true,bids:2,desc:"Hybrid sweet corn, freshly harvested. Ideal for processing. Consistent weekly supply."},
  {id:4,e:"🧅",name:"Nashik Onion",farmer:"Ramesh Patil",fid:1,loc:"Nashik, MH",price:"₹14",qty:"2 ton",fresh:"5 days ago",geo:true,v:true,bids:0,desc:"Medium Nashik onion 40-60mm. Stored in cool warehouse. Pickup available."},
  {id:5,e:"🌾",name:"Sharbati Wheat",farmer:"Gopal Singh",fid:3,loc:"Nagpur, MH",price:"₹28",qty:"10 ton",fresh:"2 weeks ago",geo:false,v:false,bids:1,desc:"Premium Sharbati wheat, protein 12.5%. Suitable for premium flour brands."},
  {id:6,e:"🍅",name:"Hybrid Tomato",farmer:"Sunita Devi",fid:2,loc:"Pune, MH",price:"₹32",qty:"600 kg",fresh:"1 day ago",geo:true,v:true,bids:5,desc:"Round hybrid tomato, 60-80mm, Brix 5.2+. Direct from greenhouse. Sorted and graded."},
  {id:7,e:"🫘",name:"Organic Soybean",farmer:"Arjun Mehta",fid:5,loc:"Amravati, MH",price:"₹44",qty:"5 ton",fresh:"1 week ago",geo:true,v:true,bids:3,desc:"Certified organic, non-GMO. Protein 41%. Available Q1 and Q3."},
  {id:8,e:"🧄",name:"Premium Garlic",farmer:"Lakshmi Bai",fid:6,loc:"Satara, MH",price:"₹72",qty:"400 kg",fresh:"4 days ago",geo:true,v:true,bids:2,desc:"Organic garlic, certified chemical-free. Strong aroma variety. Bulk orders available."},
];

const PAYMENTS=[
  {id:1,to:"Ramesh Patil",tender:"50 ton Wheat (Nov)",amount:"₹1,37,500",status:"completed",date:"10 Feb 2026",method:"NEFT"},
  {id:2,to:"Sunita Devi",tender:"Potato Contract (Nov)",amount:"₹94,000",status:"completed",date:"05 Feb 2026",method:"RTGS"},
  {id:3,to:"Kavitha Rao",tender:"Red Chilli Export",amount:"₹1,76,000",status:"pending",date:"Due 20 Feb 2026",method:"LC"},
  {id:4,to:"Arjun Mehta",tender:"Soybean Q3",amount:"₹58,500",status:"completed",date:"28 Jan 2026",method:"NEFT"},
  {id:5,to:"Lakshmi Bai",tender:"Onion Bulk",amount:"₹42,000",status:"processing",date:"Processing...",method:"IMPS"},
];

const ANALYTICS={
  months:["Sep","Oct","Nov","Dec","Jan","Feb"],
  spend:[420,580,490,920,760,1080],
  orders:[3,5,4,8,7,10],
};

const MSGS={
  contacts:[
    {id:"00000000-0000-0000-0000-000000000001",name:"Ramesh Patil",e:"👨‍🌾",preview:"₹27.5/kg works for me...",time:"2m",unread:2,online:true},
    {id:2,name:"Sunita Devi",e:"👩‍🌾",preview:"Quality certificate attached",time:"45m",unread:0,online:true},
    {id:3,name:"Kavitha Rao",e:"👩‍🌾",preview:"APEDA docs ready to share",time:"2h",unread:1,online:false},
    {id:4,name:"Arjun Mehta",e:"👨‍🌾",preview:"Can do ₹26 for 40 ton",time:"1d",unread:0,online:false},
  ],
  threads:{
    "00000000-0000-0000-0000-000000000001":[
      {f:"them",m:"Hello! I saw your wheat tender. I can supply 50 ton at ₹27.5/kg.",t:"10:10 AM"},
      {f:"me",m:"That looks good. Do you have FSSAI certification available?",t:"10:12 AM"},
      {f:"them",m:"Yes, all certificates ready. Farm visit also possible this week.",t:"10:14 AM"},
      {f:"me",m:"Perfect. Can you share the certificate and delivery schedule?",t:"10:15 AM"},
      {f:"them",m:"₹27.5/kg works for me. I'll send docs now.",t:"10:22 AM"},
    ],
    2:[{f:"them",m:"Hi, attaching quality cert for potato supply.",t:"Yesterday"},{f:"me",m:"Thanks. We reviewed your bid.",t:"Yesterday"},{f:"them",m:"Quality certificate attached",t:"45m ago"}],
    3:[{f:"them",m:"I have 20 ton Teja chilli ready for export.",t:"2h ago"},{f:"me",m:"Great. We need APEDA docs.",t:"2h ago"},{f:"them",m:"APEDA docs ready to share",t:"2h ago"}],
    4:[{f:"them",m:"Can do ₹26 for 40 ton wheat.",t:"1 day ago"}],
  }
};

/* ─── TOKENS ─── */
const gd="#1e4620",gm="#2d6b30",ac="#a3c45c",navy="#1e2a4a",cr="#f6f9f0";
const PF=s=>({fontFamily:"'Playfair Display',serif",...s});
const crd=(x={})=>({background:"#fff",borderRadius:20,padding:20,border:"1px solid rgba(30,70,20,0.07)",...x});
const gBtn=(x={})=>({background:`linear-gradient(135deg,${gd},${gm})`,color:"#fff",border:"none",borderRadius:12,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:13,...x});
const ghBtn=(x={})=>({background:"#f0f4ec",color:"#374151",border:"1px solid rgba(30,70,20,0.1)",borderRadius:12,padding:"10px 16px",fontWeight:600,cursor:"pointer",fontSize:13,...x});

/* ─── SHARED COMPONENTS ─── */
function Badge({color="green",size="sm",children}){
  const C={green:{bg:"#f0f7f0",fg:"#2d6b30"},amber:{bg:"#fef3c7",fg:"#92400e"},blue:{bg:"#eff6ff",fg:"#1d4ed8"},red:{bg:"#fee2e2",fg:"#991b1b"},gray:{bg:"#f3f4f6",fg:"#6b7280"},purple:{bg:"#f3e8ff",fg:"#7e22ce"},teal:{bg:"#f0fdfa",fg:"#0f766e"}};
  const s=C[color]||C.gray;
  return <span style={{fontSize:size==="xs"?8:9,fontWeight:700,padding:size==="xs"?"2px 5px":"3px 8px",borderRadius:100,background:s.bg,color:s.fg,display:"inline-flex",alignItems:"center",gap:3}}>{children}</span>;
}

function StarRating({val}){
  return <span style={{fontSize:11,fontWeight:600,color:"#f59e0b"}}>{"★".repeat(Math.floor(val))}{"☆".repeat(5-Math.floor(val))} <span style={{color:"#6b7280"}}>{val}</span></span>;
}

function Modal({onClose,children,w=580}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:24,padding:28,width:w,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.25)",position:"relative",animation:"modalIn .22s ease"}}>
        <button onClick={onClose} style={{position:"absolute",top:18,right:18,width:30,height:30,borderRadius:"50%",border:"none",background:"#f0f4ec",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Field({label,type="text",placeholder,opts,value,onChange,rows=2}){
  const base={width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:13,outline:"none",background:"#fafafa",transition:"border .15s"};
  const inp=type==="select"
    ?<select value={value} onChange={e=>onChange(e.target.value)} style={{...base,cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>
    :type==="textarea"
    ?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...base,resize:"none"}}/>
    :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e=>e.target.style.borderColor=gm} onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>;
  return(
    <div style={{marginBottom:14}}>
      <label style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:6,display:"block"}}>{label}</label>
      {inp}
    </div>
  );
}

function TickerBar(){
  return(
    <div style={{background:gd,padding:"7px 24px",display:"flex",alignItems:"center",gap:24,overflow:"hidden",flexShrink:0}}>
      <span style={{fontSize:10,fontWeight:700,color:ac,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}>Live Mandi Prices</span>
      <div style={{display:"flex",gap:20,animation:"ticker 22s linear infinite"}}>
        {[...TICKER,...TICKER].map((t,i)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,.65)"}}>{t.n}</span>
            <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{t.p}</span>
            <span style={{fontSize:10,fontWeight:700,color:t.up?ac:"#fc8181"}}>{t.up?"▲":"▼"}{t.c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── NAV ─── */
const NAV_ITEMS=[
  {id:"dashboard",icon:"🏠",key:"dashboard",label:"Dashboard"},
  {id:"browse",   icon:"🔍",key:"browse",   label:"Browse Listings"},
  {id:"tenders",  icon:"📋",key:"tenders",  label:"My Tenders"},
  {id:"bids",     icon:"🤝",key:"bids",     label:"Bids Received",  badge:null,red:true},
  {id:"farmers",  icon:"👨‍🌾",key:"farmers",  label:"My Farmers"},
  {id:"messages", icon:"💬",key:"messages", label:"Messages",       badge:null,red:true},
  {id:"payments", icon:"💰",key:"payments", label:"Payments"},
  {id:"analytics",icon:"📊",key:"analytics",label:"Analytics"},
  {id:"settings", icon:"⚙️",key:"settings", label:"Settings"},
];

function Sidebar({page,setPage,lang,setLang}){
  const [langOpen,setLangOpen]=useState(false);
  return(
    <aside style={{width:224,background:navy,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:50,overflowY:"auto"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${gm},${ac})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🌾</div>
        <div>
          <div style={{...PF({fontSize:16,fontWeight:700,color:"#fff"})}}>GrainOS</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:.8}}>Industry Portal</div>
        </div>
      </div>
      <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
        <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#3b5998,#667eea)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏭</div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>PepsiCo India</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)"}}>✅ GST Verified · Mumbai</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 10px",position:"relative",zIndex:1}}>
        <div style={{fontSize:9,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.22)",padding:"8px 8px 4px",fontWeight:600}}>Menu</div>
        {NAV_ITEMS.map((item)=>{
          const {id,icon,key,badge,red}=item;
          const a=page===id;
          return(
            <div key={id} onClick={()=>setPage(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:11,marginBottom:2,fontSize:12,fontWeight:a?600:500,color:a?"#fff":"rgba(255,255,255,.45)",background:a?"rgba(255,255,255,.09)":"transparent",cursor:"pointer",transition:"all .15s",borderLeft:`3px solid ${a?ac:"transparent"}`,paddingLeft:a?"11px":"14px"}} onMouseEnter={e=>{if(!a)e.currentTarget.style.background="rgba(255,255,255,.04)"}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:15}}>{icon}</span>
              <span style={{flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tt(item.key,lang)||item.label}</span>
              {badge&&<span style={{background:red?"#e53e3e":"rgba(255,255,255,.12)",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:9,fontWeight:700}}>{badge}</span>}
            </div>
          );
        })}
      </nav>
      <div style={{padding:12,borderTop:"1px solid rgba(255,255,255,.06)",position:"relative",zIndex:1}}>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:13,padding:13,border:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:3}}>Sourcing Expert Online</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)",lineHeight:1.5,marginBottom:9}}>Get a dedicated agri-expert to manage your sourcing.</div>
          <button style={{...gBtn({width:"100%",padding:"7px 0",fontSize:10})}}>📞 Talk Now</button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({title,sub,actions}){
  return(
    <div style={{background:"rgba(255,255,255,.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(30,42,74,.07)",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40}}>
      <div>
        <h1 style={{...PF({fontSize:20,fontWeight:600,color:"#1a1f36"})}}>{title}</h1>
        {sub&&<p style={{fontSize:12,color:"#6b7280",marginTop:1}}>{sub}</p>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>{actions}</div>
    </div>
  );
}

/* ─── FLOAT TENDER MODAL ─── */
function FloatTenderModal({onClose,onDone}){
  const [step,setStep]=useState(1);
  const [done,setDone]=useState(false);
  const [form,setForm]=useState({crop:"Wheat",qty:"",priceMin:"",priceMax:"",deadline:"",freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",desc:"",notify:true,visit:false});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const match=Math.floor(Math.random()*10)+18;

  if(done) return(
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:60,marginBottom:14}}>🎉</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>Tender Floated!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.8,marginBottom:22}}>
        Your tender for <strong>{form.qty} of {form.crop}</strong> is now live.<br/>
        <strong style={{color:gm}}>{match} verified farmers</strong> have been notified.
      </div>
      <button onClick={()=>{onDone&&onDone(form);onClose();}} style={{...gBtn({padding:"11px 36px",fontSize:14})}}>Done ✓</button>
    </div>
  );

  return(
    <>
      <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>Float New Tender 📋</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>Step {step} of 2 · Reach 12,000+ verified farmers instantly</div>
      <div style={{display:"flex",background:"#f0f4ec",borderRadius:12,padding:3,marginBottom:20,gap:3}}>
        {["Basic Details","Requirements & Reach"].map((s,i)=>(
          <button key={s} onClick={()=>setStep(i+1)} style={{flex:1,padding:"8px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:step===i+1?"#fff":"transparent",color:step===i+1?gd:"#9ca3af",transition:"all .15s"}}>{s}</button>
        ))}
      </div>
      {step===1&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Crop / Produce *" type="select" opts={["Wheat","Potato","Onion","Chilli","Corn","Tomato","Soybean","Rice","Turmeric","Ginger","Garlic"]} value={form.crop} onChange={v=>set("crop",v)}/>
            <Field label="Quantity Required *" placeholder="e.g. 50000 (kg)" value={form.qty} onChange={v=>set("qty",v)}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Budget Min ₹/kg" placeholder="e.g. 26" value={form.priceMin} onChange={v=>set("priceMin",v)}/>
            <Field label="Budget Max ₹/kg" placeholder="e.g. 29" value={form.priceMax} onChange={v=>set("priceMax",v)}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Deadline *" type="date" value={form.deadline} onChange={v=>set("deadline",v)}/>
            <Field label="Supply Frequency" type="select" opts={["One-time","Weekly","Bi-weekly","Monthly","Quarterly"]} value={form.freq} onChange={v=>set("freq",v)}/>
          </div>
          <Field label="Preferred Grade" type="select" opts={["Grade A (Premium)","Grade B (Standard)","Any Grade"]} value={form.grade} onChange={v=>set("grade",v)}/>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:4}}>
            <button onClick={onClose} style={ghBtn({fontSize:12})}>{tt("cancel",lang)}</button>
            <button onClick={()=>setStep(2)} disabled={!form.qty} style={{...gBtn({fontSize:12,opacity:form.qty?1:0.5})}}>Next →</button>
          </div>
        </>
      )}
      {step===2&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Target State / Region" type="select" opts={["Maharashtra","Punjab","Uttar Pradesh","Madhya Pradesh","Karnataka","Rajasthan","Gujarat","All India"]} value={form.state} onChange={v=>set("state",v)}/>
            <Field label="Certifications Required" type="select" opts={["FSSAI","Organic","APEDA","ISO 22000","None Required"]} value={form.cert} onChange={v=>set("cert",v)}/>
          </div>
          <Field label="Tender Description" type="textarea" placeholder="Quality standards, packaging, delivery terms…" value={form.desc} onChange={v=>set("desc",v)} rows={4}/>
          <div style={{background:"linear-gradient(135deg,#f0f7f0,#e8f5e9)",borderRadius:14,padding:"12px 16px",marginBottom:18,border:"1px solid rgba(45,107,48,.15)"}}>
            <div style={{fontSize:12,color:"#1a2e1a",lineHeight:1.7}}>
              🤖 <strong>AI Farmer Match:</strong> Found <strong style={{color:gm}}>{match} verified farmers</strong> in {form.state} growing {form.crop}.
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"space-between"}}>
            <button onClick={()=>setStep(1)} style={ghBtn({fontSize:12})}>← Back</button>
            <button onClick={()=>setDone(true)} disabled={!form.qty} style={{...gBtn({fontSize:12})}}>🚀 Float Tender Now</button>
          </div>
        </>
      )}
    </>
  );
}

/* ─── COMPARE FARMERS MODAL ─── */
function CompareFarmersModal({onClose}){
  const [sel,setSel]=useState([1,2]);
  const [invited,setInvited]=useState({});
  const toggle=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p.slice(-2),id]);
  const selF=FARMERS.filter(f=>sel.includes(f.id));
  return(
    <>
      <div style={{...PF({fontSize:20,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>⚖️ Compare Farmers Side-by-Side</div>
      <div style={{fontSize:12,color:"#6b7280",marginBottom:16}}>Select up to 3 farmers to compare</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {FARMERS.map(f=>(
          <button key={f.id} onClick={()=>toggle(f.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:10,border:`1.5px solid ${sel.includes(f.id)?gm:"#e5e7eb"}`,background:sel.includes(f.id)?"#f0f7f0":"#fff",color:sel.includes(f.id)?gm:"#374151",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            {f.e} {f.name}{sel.includes(f.id)?" ✓":""}
          </button>
        ))}
      </div>
      {selF.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:`repeat(${selF.length},1fr)`,gap:12}}>
          {selF.map(f=>(
            <div key={f.id} style={{border:`1.5px solid rgba(30,70,20,.12)`,borderRadius:18,overflow:"hidden"}}>
              <div style={{background:`linear-gradient(135deg,${gd},${gm})`,padding:"16px 12px",textAlign:"center"}}>
                {f.tag&&<div style={{marginBottom:4}}><Badge color="amber" size="xs">{f.tag}</Badge></div>}
                <div style={{fontSize:36,marginBottom:6}}>{f.e}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{f.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.55)",marginTop:2}}>📍 {f.loc}</div>
                {f.verified&&<div style={{fontSize:10,color:ac,marginTop:4,fontWeight:600}}>✅ Verified</div>}
              </div>
              <div style={{padding:14}}>
                {[{k:"Trust Score",v:`${f.score}/100`},{k:"Rating",v:`${f.rating}/5.0`},{k:"On-Time",v:f.onTime},{k:"Orders",v:f.orders}].map(({k,v})=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}>
                    <span style={{color:"#9ca3af"}}>{k}</span>
                    <span style={{fontWeight:700,color:gm}}>{v}</span>
                  </div>
                ))}
                <button onClick={()=>setInvited(p=>({...p,[f.id]:true}))} style={{...gBtn({width:"100%",padding:"8px 0",fontSize:11,marginTop:4}),background:invited[f.id]?"#f0f7f0":"",color:invited[f.id]?gm:"",border:invited[f.id]?`1.5px solid ${ac}`:"none"}}>
                  {invited[f.id]?"✓ Invited":"Invite to Tender →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── FARMER PROFILE MODAL ─── */
function FarmerProfileModal({farmer,onClose,onInvite,invited}){
  const [tab,setTab]=useState("overview");
  const [msgSent,setMsgSent]=useState(false);
  const [msg,setMsg]=useState("");
  return(
    <>
      <div style={{background:`linear-gradient(135deg,${gd},${gm})`,borderRadius:16,padding:"20px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:60,height:60,borderRadius:16,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>{farmer.e}</div>
        <div>
          <div style={{...PF({fontSize:18,fontWeight:700,color:"#fff"})}}>{farmer.name}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:2}}>📍 {farmer.loc}</div>
          {farmer.verified&&<div style={{fontSize:11,color:ac,marginTop:4,fontWeight:600}}>✅ Government eKYC Verified</div>}
        </div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:28,fontWeight:800,color:"#fff"}}>⭐ {farmer.rating}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>({farmer.orders} orders)</div>
        </div>
      </div>
      <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:12,padding:3,marginBottom:18}}>
        {["overview","produce","reviews"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px",borderRadius:10,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize"}}>{t}</button>)}
      </div>
      {tab==="overview"&&(
        <div className="fu">
          <div style={{fontSize:13,color:"#374151",lineHeight:1.7,background:cr,padding:"12px 14px",borderRadius:12,marginBottom:16}}>{farmer.bio}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{icon:"📦",l:"Orders Done",v:farmer.orders},{icon:"⚡",l:"Response Time",v:farmer.resp},{icon:"⏱️",l:"On-Time Rate",v:farmer.onTime},{icon:"💰",l:"Price Position",v:farmer.price}].map(({icon,l,v})=>(
              <div key={l} style={{background:"#f9f9f9",borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>{icon}</span>
                <div><div style={{fontSize:10,color:"#9ca3af"}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{v}</div></div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:8}}>Specialises In</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{farmer.spec.map(s=><Badge key={s} color="green">🌾 {s}</Badge>)}</div>
          </div>
          {msgSent
            ?<div style={{background:"#f0f7f0",borderRadius:12,padding:"12px 14px",textAlign:"center",fontSize:13,color:gm,fontWeight:600}}>✅ Message sent!</div>
            :<div>
              <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:8}}>Quick Message</div>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={2} style={{width:"100%",padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:12,outline:"none",resize:"none",marginBottom:8}}/>
              <button onClick={()=>msg&&setMsgSent(true)} disabled={!msg} style={{...gBtn({width:"100%",padding:10,fontSize:12,opacity:msg?1:.5})}}>Send Message →</button>
            </div>
          }
        </div>
      )}
      {tab==="produce"&&(
        <div className="fu">
          {PRODUCE.filter(p=>p.fid===farmer.id).map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,border:"1px solid rgba(30,70,20,.07)",marginBottom:8,background:cr}}>
              <div style={{fontSize:28}}>{p.e}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{p.name}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>📦 {p.qty} · 🌱 {p.fresh}</div>
              </div>
              <div style={{fontSize:17,fontWeight:800,color:gd}}>{p.price}/kg</div>
            </div>
          ))}
        </div>
      )}
      {tab==="reviews"&&(
        <div className="fu">
          {[{buyer:"PepsiCo India",rating:5,comment:"Excellent quality. Consistent supply.",date:"Jan 2026"},{buyer:"ITC Foods",rating:4,comment:"Good quality, minor delay resolved quickly.",date:"Dec 2025"}].map((r,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:14,background:"#f9fdf9",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,fontWeight:700,color:"#1a2e1a"}}>🏭 {r.buyer}</span>
                <span style={{fontSize:10,color:"#9ca3af"}}>{r.date}</span>
              </div>
              <StarRating val={r.rating}/>
              <div style={{fontSize:12,color:"#374151",lineHeight:1.5,marginTop:6}}>{r.comment}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>Close</button>
        <button onClick={()=>onInvite(farmer.id)} style={{...gBtn({flex:2,padding:12}),background:invited?`linear-gradient(135deg,#a3c45c,${gm})`:""}}>{invited?"✓ Invited":"Invite to Tender →"}</button>
      </div>
    </>
  );
}

/* ─── PRODUCE DETAIL MODAL ─── */
function ProduceDetailModal({item,onClose}){
  const [bidAmt,setBidAmt]=useState("");
  const [bidQty,setBidQty]=useState("");
  const [sent,setSent]=useState(false);
  if(sent) return(
    <div style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:56,marginBottom:14}}>✅</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>Bid Sent!</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:22}}>Your bid of <strong>₹{bidAmt}/kg</strong> has been sent to {item.farmer}.</div>
      <button onClick={onClose} style={gBtn({padding:"11px 36px"})}>Done</button>
    </div>
  );
  return(
    <>
      <div style={{height:120,background:`linear-gradient(135deg,${gd},${gm})`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:64,marginBottom:20}}>{item.e}</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>{item.name}</div>
      <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>👨‍🌾 {item.farmer} · 📍 {item.loc}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Field label="Your Offer ₹/kg *" placeholder={`Asking: ${item.price}`} value={bidAmt} onChange={setBidAmt}/>
        <Field label="Quantity You Need *" placeholder="e.g. 500 kg" value={bidQty} onChange={setBidQty}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} style={ghBtn({flex:1})}>{tt("cancel",lang)}</button>
        <button onClick={()=>bidAmt&&bidQty&&setSent(true)} disabled={!bidAmt||!bidQty} style={{...gBtn({flex:2,padding:12,opacity:bidAmt&&bidQty?1:0.5})}}>Send Bid →</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: DASHBOARD
═══════════════════════════════════════════════════════════ */
function BidDetailModal({bid,onClose,onAct}){
  const [accepted,setAccepted]=useState(false);
  const farmer=FARMERS.find(f=>f.id===bid.fid);

  if(accepted) return(
    <div style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:56,marginBottom:14}}>🏆</div>
      <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a2e1a",marginBottom:8})}}>Contract Awarded!</div>
      <div style={{fontSize:13,color:"#6b7280",lineHeight:1.8,marginBottom:22}}>
        You've awarded the <strong>{bid.tender}</strong> contract to <strong>{bid.farmer}</strong> at <strong style={{color:gm}}>{bid.offer}/kg</strong>.<br/>
        A confirmation has been sent to the farmer. Delivery contract will be generated shortly.
      </div>
      <button onClick={onClose} style={gBtn({padding:"11px 36px"})}>Done</button>
    </div>
  );

  return(
    <>
      <div style={{...PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:16})}}>Bid from {bid.farmer}</div>
      {/* Farmer card */}
      {farmer&&<div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:`linear-gradient(135deg,${gd},${gm})`,borderRadius:16,marginBottom:18}}>
        <div style={{fontSize:32}}>{farmer.e}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{farmer.name}{farmer.verified&&<span style={{fontSize:11,color:ac,marginLeft:6}}>✅</span>}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.55)",marginTop:2}}>📍 {farmer.loc} · ⭐{farmer.rating} · {farmer.orders} orders</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{bid.offer}/kg</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.55)"}}>for {bid.qty}</div>
        </div>
      </div>}
      {/* Details */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{i:"📋",l:"Tender",v:bid.tender},{i:"📦",l:"Quantity",v:bid.qty},{i:"🕐",l:"Submitted",v:bid.time},{i:"📄",l:"Documents",v:bid.docs?"Submitted ✅":"Not submitted ⚠️"}].map(({i,l,v})=>(
          <div key={l} style={{background:"#f9fdf9",borderRadius:12,padding:"10px 12px"}}>
            <div style={{fontSize:10,color:"#9ca3af",marginBottom:3}}>{i} {l}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#1a2e1a"}}>{v}</div>
          </div>
        ))}
      </div>
      {/* Farmer note */}
      <div style={{background:cr,borderRadius:12,padding:"12px 14px",marginBottom:18,border:"1px solid rgba(30,70,20,.07)"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#6b7280",marginBottom:5}}>Note from Farmer</div>
        <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{bid.note}</div>
      </div>
      {/* Actions */}
      {bid.status!=="awarded"&&bid.status!=="declined"&&<div style={{display:"flex",gap:10}}>
        <button onClick={()=>{onAct(bid.id,"declined");onClose();}} style={{...ghBtn({flex:1,color:"#991b1b",background:"#fee2e2",border:"none"})}}>✕ Decline</button>
        {bid.status==="new"&&<button onClick={()=>{onAct(bid.id,"shortlisted");onClose();}} style={ghBtn({flex:1})}>⭐ {tt("shortlist",lang)}</button>}
        <button onClick={()=>setAccepted(true)} style={gBtn({flex:2,padding:12})}>🏆 {tt("awardContract",lang)}</button>
      </div>}
      {bid.status==="shortlisted"&&<button onClick={()=>setAccepted(true)} style={{...gBtn({width:"100%",padding:12,fontSize:14})}}>🏆 {tt("awardContract",lang)}</button>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCE LISTING DETAIL + BID MODAL
═══════════════════════════════════════════════════════════ */
function PageDashboard({setPage,tenders,bids,setBids,lang="en"}){
  const [showFloat,setShowFloat]=useState(false);
  const [showCompare,setShowCompare]=useState(false);
  const newBids=bids.filter(b=>b.status==="new");

  return(
    <>
      <Topbar
        title="Good morning, Sourcing Team 🏭"
        sub="GrainOS Industry Portal · Q4 Procurement Phase"
        actions={<>
          <button onClick={()=>setShowCompare(true)} style={ghBtn({padding:"8px 14px",fontSize:12,background:"#fff",border:"1.5px solid #e5e7eb"})}>⚖️ Compare Farmers</button>
          <button onClick={()=>setShowFloat(true)} style={gBtn({padding:"8px 16px",fontSize:12})}>+ Float Tender</button>
        </>}
      />
      <div style={{padding:"24px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
          {[
            {icon:"💰",label:"Total Spent YTD",value:"₹8.4Cr",sub:"↑ +22% vs last year",color:"#1e4620"},
            {icon:"📋",label:"Active Tenders",value:tenders.filter(t=>t.status==="open"||t.status==="active").length,sub:"Live on platform",color:"#1e2a4a"},
            {icon:"🤝",label:"New Bids",value:newBids.length,sub:"Awaiting your response",color:"#7e22ce",alert:newBids.length>0},
            {icon:"🚚",label:"Pending Deliveries",value:"6",sub:"₹14.2L in transit",color:"#d97706"},
          ].map(({icon,label,value,sub,color,alert})=>(
            <div key={label} style={{...crd({marginBottom:0,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"})}} onClick={()=>{if(label==="New Bids")setPage("bids");if(label.includes("Tender"))setPage("tenders");}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.08)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:color,opacity:.06}}/>
              {alert&&<div style={{position:"absolute",top:12,right:12,width:8,height:8,borderRadius:"50%",background:"#e53e3e",animation:"pulse2 2s infinite"}}/>}
              <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:5}}>{label}</div>
              <div style={{...PF({fontSize:28,fontWeight:700,color:"#1a1f36"})}}>{value}</div>
              <div style={{fontSize:11,color:color,fontWeight:600,marginTop:4}}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:18,marginBottom:18}}>
          <div style={crd()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36"})}}>Incoming Bids</span>
              <span onClick={()=>setPage("bids")} style={{fontSize:12,color:gm,fontWeight:600,cursor:"pointer"}}>All bids →</span>
            </div>
            {bids.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:13}}>No bids yet. Float a tender to receive bids!</div>}
            {bids.slice(0,3).map(b=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:14,marginBottom:8,background:"#f9fdf9",border:"1px solid rgba(30,70,20,.06)"}}>
                <div style={{width:40,height:40,borderRadius:11,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{b.fe||"👨‍🌾"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1f36"}}>{b.farmer}</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>📋 {b.tender}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:gd}}>{b.offer}/kg</div>
                  <Badge color={b.status==="new"?"amber":b.status==="shortlisted"?"blue":b.status==="awarded"?"green":"gray"}>{(b.status||"new").toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div style={crd()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36"})}}>Top Farmers</span>
              <span onClick={()=>setShowCompare(true)} style={{fontSize:11,color:gm,fontWeight:600,cursor:"pointer"}}>Compare →</span>
            </div>
            {FARMERS.slice(0,4).map(f=>(
              <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:13,marginBottom:5,border:"1px solid #f0f0f0",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fdf9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{f.e}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a1f36"}}>{f.name}{f.verified&&<span style={{fontSize:9,marginLeft:4}}>✅</span>}</div>
                  <div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>{f.loc} · ⭐{f.rating}</div>
                </div>
                {f.tag&&<Badge color={f.tag==="Export Ready"?"purple":f.tag==="Organic"?"teal":"amber"} size="xs">{f.tag}</Badge>}
              </div>
            ))}
            <button onClick={()=>setPage("farmers")} style={{width:"100%",padding:"8px",borderRadius:11,border:`1px dashed ${ac}`,background:"transparent",color:gm,fontWeight:600,fontSize:11,cursor:"pointer",marginTop:4}}>View All Farmers →</button>
          </div>
        </div>
        <div style={crd()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36"})}}>Active Tenders</span>
            <span onClick={()=>setPage("tenders")} style={{fontSize:12,color:gm,fontWeight:600,cursor:"pointer"}}>Manage all →</span>
          </div>
          {tenders.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#9ca3af",fontSize:13}}>No tenders yet.</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {tenders.filter(t=>t.status==="open"||t.status==="active").slice(0,4).map(t=>(
              <div key={t.id} style={{padding:"13px 15px",borderRadius:14,background:cr,border:"1px solid rgba(30,70,20,.07)"}}>
                <div style={{...PF({fontSize:13,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>{t.title}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginBottom:6}}>📦 {t.qty} · ⏰ {typeof t.deadline === "string" ? new Date(t.deadline).toLocaleDateString("en-IN") : t.deadline}</div>
                <Badge color="green">{t.budget}/kg</Badge>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowFloat(true)} style={{width:"100%",marginTop:12,padding:"10px",borderRadius:12,border:`2px dashed #c5d9b8`,background:"transparent",color:gm,fontWeight:600,fontSize:12,cursor:"pointer"}}>{tt("postTender",lang)}</button>
        </div>
      </div>
      {showFloat&&<Modal onClose={()=>setShowFloat(false)} w={580}><FloatTenderModal onClose={()=>setShowFloat(false)} onDone={async(form)=>{
        const {data,error}=await supabase.from("tenders").insert({
          industry_id:DEMO_INDUSTRY_ID,crop:form.crop,quantity:parseFloat(form.qty)||0,
          budget_per_kg:parseFloat(form.priceMin)||0,deadline:form.deadline,description:form.desc,status:"open"
        }).select().single();
        console.log("NEW TENDER:",{data,error});
      }}/></Modal>}
      {showCompare&&<Modal onClose={()=>setShowCompare(false)} w={720}><CompareFarmersModal onClose={()=>setShowCompare(false)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: BROWSE LISTINGS
═══════════════════════════════════════════════════════════ */
function PageBrowse({lang="en"}){
  const [search,setSearch]=useState("");
  const [detail,setDetail]=useState(null);
  const [bidSent,setBidSent]=useState({});
  const filtered=PRODUCE.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.farmer.toLowerCase().includes(search.toLowerCase()));

  return(
    <>
      <Topbar title="Browse Listings 🔍" sub={`${filtered.length} verified produce listings`} actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4,fontSize:14}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search produce, farmer…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:220}}/>
        </div>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {filtered.map(p=>(
            <div key={p.id} style={{...crd({padding:0,overflow:"hidden",cursor:"pointer",transition:"all .2s"})}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(30,70,20,.09)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              <div style={{height:100,background:"linear-gradient(135deg,#f0f7f0,#d4edda)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,position:"relative"}}>
                {p.e}
                {p.geo&&<div style={{position:"absolute",bottom:7,left:9,background:`rgba(30,70,20,.8)`,color:"#fff",fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:100}}>📍 GPS</div>}
                {p.v&&<div style={{position:"absolute",top:7,right:9,background:"rgba(255,255,255,.9)",color:gm,fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:100}}>✅ Verified</div>}
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a",marginBottom:2}}>{p.name}</div>
                <div style={{fontSize:10,color:"#9ca3af",marginBottom:5}}>👨‍🌾 {p.farmer} · {p.loc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:18,fontWeight:800,color:gd}}>{p.price}/kg</span>
                  <span style={{fontSize:10,color:"#9ca3af"}}>{p.qty}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setDetail(p)} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>Details</button>
                  <button onClick={()=>setDetail(p)} style={{...gBtn({flex:1,padding:"7px 0",fontSize:11}),opacity:bidSent[p.id]?.6:1}}>{bidSent[p.id]?"✓ Bid":"Bid Now"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {detail&&<Modal onClose={()=>setDetail(null)} w={500}><ProduceDetailModal item={detail} onClose={()=>{setBidSent(p=>({...p,[detail.id]:true}));setDetail(null);}}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: MY TENDERS  ✅ SUPABASE WIRED
═══════════════════════════════════════════════════════════ */
function PageTenders({tenders,setTenders,lang="en"}){
  const [showFloat,setShowFloat]=useState(false);
  const [tab,setTab]=useState("open");
  const [loading,setLoading]=useState(true);
  const [inviteModal,setInviteModal]=useState(null);
  const [invitedMap,setInvitedMap]=useState({});

  useEffect(()=>{
    const fetch=async()=>{
      setLoading(true);
      const {data,error}=await supabase
        .from("tenders")
        .select("*")
        .eq("industry_id",DEMO_INDUSTRY_ID)
        .order("created_at",{ascending:false});
      console.log("TENDERS FETCH:",{data,error});
      if(data) setTenders(data.map(t=>({
        ...t,
        title:`${t.crop} — ${t.quantity}kg`,
        budget:`₹${t.budget_per_kg}`,
        qty:`${t.quantity} kg`,
        freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",
        desc:t.description||"",applied:0,shortlisted:0,invited:[],
      })));
      setLoading(false);
    };
    fetch();
  },[]);

  const filtered=tab==="all"?tenders:tenders.filter(t=>t.status===tab);

  const postTender=async(formData)=>{
    const {data,error}=await supabase.from("tenders").insert({
      industry_id:DEMO_INDUSTRY_ID,
      crop:formData.crop,
      quantity:parseFloat(formData.qty)||0,
      budget_per_kg:parseFloat(formData.priceMin)||0,
      deadline:formData.deadline,
      description:formData.desc,
      status:"open",
    }).select().single();
    console.log("POST TENDER:",{data,error});
    if(data) setTenders(p=>[{
      ...data,
      title:`${data.crop} — ${data.quantity}kg`,
      budget:`₹${data.budget_per_kg}`,
      qty:`${data.quantity} kg`,
      freq:"Monthly",grade:"Grade A",state:"Maharashtra",cert:"FSSAI",
      desc:data.description||"",applied:0,shortlisted:0,invited:[],
    },...p]);
  };

  const doInvite=(tid,fid)=>setInvitedMap(p=>({...p,[`${tid}-${fid}`]:true}));

  return(
    <>
      <Topbar title="My Tenders 📋" sub="Float tenders, track applications, award contracts" actions={<>
        <div style={{display:"flex",gap:3,background:"#f0f4ec",borderRadius:11,padding:3}}>
          {["all","open","closed"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:9,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?"#fff":"transparent",color:tab===t?gd:"#9ca3af",textTransform:"capitalize",transition:"all .12s"}}>{t}</button>
          ))}
        </div>
        <button onClick={()=>setShowFloat(true)} style={gBtn({padding:"8px 16px",fontSize:12})}>{tt("postTender",lang)}</button>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        {loading&&<div style={{textAlign:"center",padding:"40px 0",color:"#9ca3af",fontSize:14}}>⏳ Loading tenders from database…</div>}
        {!loading&&<div style={crd()}>
          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>📋</div>
              <div style={{fontSize:14,fontWeight:600,color:"#374151",marginBottom:4}}>No {tab} tenders yet</div>
              <div style={{fontSize:12,color:"#9ca3af"}}>Click "Float New Tender" to post your first requirement</div>
            </div>
          )}
          {filtered.map(t=>(
            <div key={t.id} style={{border:"1px solid rgba(30,42,74,.08)",borderRadius:16,padding:"16px 18px",marginBottom:12,transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(30,42,74,.2)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.05)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(30,42,74,.08)";e.currentTarget.style.boxShadow="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{...PF({fontSize:15,fontWeight:700,color:"#1a1f36"})}}>{t.title}</div>
                  <div style={{fontSize:12,color:"#9ca3af",marginTop:3}}>📦 {t.qty} · ⏰ {new Date(t.deadline).toLocaleDateString("en-IN")} · 🔄 {t.freq}</div>
                  <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                    <Badge color={t.status==="open"?"green":"gray"}>{(t.status||"open").toUpperCase()}</Badge>
                    <Badge color="blue">{t.cert}</Badge>
                    <Badge color="green">{t.grade}</Badge>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:800,color:gd}}>{t.budget}/kg</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{t.state}</div>
                </div>
              </div>
              {t.desc&&<div style={{fontSize:12,color:"#6b7280",marginBottom:12,lineHeight:1.5}}>{t.desc}</div>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>👨‍🌾 <strong>{t.applied||0}</strong> applied</span>
                <button onClick={()=>setInviteModal(t)} style={ghBtn({fontSize:11,padding:"6px 14px"})}>+ Invite Farmers</button>
              </div>
            </div>
          ))}
        </div>}
      </div>
      {showFloat&&<Modal onClose={()=>setShowFloat(false)} w={580}><FloatTenderModal onClose={()=>setShowFloat(false)} onDone={postTender}/></Modal>}
      {inviteModal&&<Modal onClose={()=>setInviteModal(null)} w={680}>
        <div style={{...PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:4})}}>Invite Farmers to: {inviteModal.title}</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:18}}>AI-matched farmers for your {inviteModal.crop} requirement</div>
        {FARMERS.map(f=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:14,border:"1px solid #f0f0f0",marginBottom:8}}>
            <div style={{fontSize:20}}>{f.e}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1a2e1a"}}>{f.name}{f.verified&&" ✅"}</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>{f.loc} · ⭐{f.rating}</div>
            </div>
            <button onClick={()=>doInvite(inviteModal.id,f.id)} style={{...gBtn({fontSize:11,padding:"6px 14px"}),background:invitedMap[`${inviteModal.id}-${f.id}`]?`linear-gradient(135deg,${ac},${gm})`:""}}>
              {invitedMap[`${inviteModal.id}-${f.id}`]?"✓ Invited":"Invite"}
            </button>
          </div>
        ))}
      </Modal>}
    </>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: BIDS RECEIVED  (Supabase version)
═══════════════════════════════════════════════════════════ */
function PageBids({bids,setBids,lang="en"}){
  const [tab,setTab]=useState("all");
  const [detail,setDetail]=useState(null);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetch=async()=>{
      setLoading(true);
      const {data,error}=await supabase
        .from("bids")
        .select("*, tenders(crop,quantity,budget_per_kg)")
        .order("created_at",{ascending:false});
      console.log("BIDS FETCH:",{data,error});
      if(data) setBids(data.map(b=>({
        ...b,
        farmer:b.farmer_name||"Farmer",
        fe:"👨‍🌾",
        tender:b.tenders?`${b.tenders.crop} — ${b.tenders.quantity}kg`:"Tender",
        offer:`₹${b.price_per_kg||0}`,
        qty:`${b.quantity||0} kg`,
        time:new Date(b.created_at).toLocaleDateString("en-IN"),
        status:b.status||"new",
        rating:4.7,loc:"Maharashtra",
        note:b.note||"No note provided.",
        docs:false,fid:1,
      })));
      setLoading(false);
    };
    fetch();
  },[]);

  const filtered=(tab==="all"?bids:bids.filter(b=>b.status===tab))
    .filter(b=>(b.farmer||"").toLowerCase().includes(search.toLowerCase())||(b.tender||"").toLowerCase().includes(search.toLowerCase()));

  const act=async(id,status)=>{
    const {error}=await supabase.from("bids").update({status}).eq("id",id);
    if(!error) setBids(p=>p.map(b=>b.id===id?{...b,status}:b));
  };

  const statusColors={new:"amber",shortlisted:"blue",awarded:"green",declined:"gray"};

  return(
    <>
      <Topbar title="Bids Received 🤝" sub="All farmer applications to your tenders" actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter by farmer or tender…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:200}}/>
        </div>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {["all","new","shortlisted","awarded","declined"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",borderRadius:10,border:"1px solid",fontSize:11,fontWeight:600,cursor:"pointer",background:tab===t?navy:"#fff",color:tab===t?"#fff":"#374151",borderColor:tab===t?"transparent":"#e5e7eb",textTransform:"capitalize",transition:"all .12s"}}>
              {t} {t==="all"&&`(${bids.length})`}{t==="new"&&`(${bids.filter(b=>b.status==="new").length})`}
            </button>
          ))}
        </div>
        {loading&&<div style={{textAlign:"center",padding:"40px 0",color:"#9ca3af",fontSize:14}}>⏳ Loading bids…</div>}
        {!loading&&<div style={crd()}>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#9ca3af",fontSize:13}}>No {tab} bids found.</div>}
          {filtered.map(b=>(
            <div key={b.id} style={{border:"1px solid rgba(30,42,74,.08)",borderRadius:16,padding:"16px 18px",marginBottom:12,cursor:"pointer",transition:"all .18s"}} onClick={()=>setDetail(b)} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(30,42,74,.2)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.05)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(30,42,74,.08)";e.currentTarget.style.boxShadow="";}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
                <div style={{width:46,height:46,borderRadius:13,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{b.fe}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#1a1f36"}}>{b.farmer}</span>
                    <Badge color={statusColors[b.status]||"gray"}>{(b.status||"new").toUpperCase()}</Badge>
                  </div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>📍 {b.loc} · 🕐 {b.time}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:800,color:gd}}>{b.offer}/kg</div>
                  <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>for {b.qty}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>📋 {b.tender}</div>
              {b.note&&<div style={{fontSize:12,color:"#374151",background:"#f9fdf9",padding:"8px 12px",borderRadius:9,marginBottom:12,lineHeight:1.5}}>"{b.note}"</div>}
              {(b.status==="new"||b.status==="shortlisted")&&(
                <div style={{display:"flex",gap:8}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>act(b.id,"declined")} style={{...ghBtn({flex:1,padding:"8px 0",fontSize:11}),color:"#991b1b",background:"#fee2e2",border:"none"}}>✕ Decline</button>
                  {b.status==="new"&&<button onClick={()=>act(b.id,"shortlisted")} style={ghBtn({flex:1,padding:"8px 0",fontSize:11})}>⭐ {tt("shortlist",lang)}</button>}
                  <button onClick={()=>act(b.id,"awarded")} style={gBtn({flex:2,padding:"8px 0",fontSize:11})}>🏆 {tt("awardContract",lang)}</button>
                </div>
              )}
              {b.status==="awarded"&&<div style={{padding:"8px 12px",borderRadius:9,background:"#f0f7f0",textAlign:"center",fontSize:12,fontWeight:700,color:gm}}>🏆 Contract Awarded</div>}
            </div>
          ))}
        </div>}
      </div>
      {detail&&<Modal onClose={()=>setDetail(null)} w={520}><BidDetailModal bid={detail} onClose={()=>setDetail(null)} onAct={act}/></Modal>}
    </>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: MESSAGES  (Supabase version)
═══════════════════════════════════════════════════════════ */
function PageFarmers({lang="en"}){
  const [profile,setProfile]=useState(null);
  const [search,setSearch]=useState("");
  const [invited,setInvited]=useState({1:true,2:true,4:true});
  const [showCompare,setShowCompare]=useState(false);
  const filtered=FARMERS.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));

  return(
    <>
      <Topbar title="My Farmers 👨‍🌾" sub="Empaneled suppliers, performance tracking and discovery" actions={<>
        <div style={{display:"flex",alignItems:"center",gap:7,background:"#f5f5f8",borderRadius:12,padding:"8px 14px",border:"1px solid rgba(30,42,74,.07)"}}>
          <span style={{opacity:.4}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, crop…" style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:200}}/>
        </div>
        <button onClick={()=>setShowCompare(true)} style={ghBtn({padding:"8px 14px",fontSize:12,background:"#fff",border:"1.5px solid #e5e7eb"})}>⚖️ Compare</button>
      </>}/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {filtered.map(f=>(
            <div key={f.id} style={{...crd({padding:0,overflow:"hidden",cursor:"pointer",transition:"all .2s"})}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(30,70,20,.09)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              <div style={{background:`linear-gradient(135deg,${gd},${gm})`,padding:"18px 16px",position:"relative",textAlign:"center"}}>
                {f.tag&&<div style={{position:"absolute",top:10,right:10}}><Badge color={f.tag==="Export Ready"?"purple":f.tag==="Organic"?"teal":"amber"}>{f.tag}</Badge></div>}
                {invited[f.id]&&<div style={{position:"absolute",top:10,left:10}}><Badge color="green" size="xs">Empaneled</Badge></div>}
                <div style={{fontSize:40,marginBottom:6}}>{f.e}</div>
                <div style={{...PF({fontSize:14,fontWeight:700,color:"#fff"})}}>{f.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.55)",marginTop:2}}>📍 {f.loc}</div>
                {f.verified&&<div style={{fontSize:10,color:ac,marginTop:4,fontWeight:600}}>✅ Govt Verified</div>}
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                  {[{l:"Rating",v:`⭐${f.rating}`},{l:"Orders",v:f.orders},{l:"On-Time",v:f.onTime}].map(({l,v})=>(
                    <div key={l} style={{textAlign:"center",padding:"7px 4px",background:"#f9f9f9",borderRadius:8}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#1a2e1a"}}>{v}</div>
                      <div style={{fontSize:9,color:"#9ca3af",marginTop:1}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                    <span style={{color:"#6b7280"}}>Trust Score</span>
                    <span style={{fontWeight:700,color:f.score>80?gm:"#d97706"}}>{f.score}/100</span>
                  </div>
                  <div style={{height:5,background:"#f0f0f0",borderRadius:100}}>
                    <div style={{height:"100%",width:`${f.score}%`,background:`linear-gradient(90deg,${ac},${gd})`,borderRadius:100}}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                  {f.spec.map(s=><Badge key={s} color="green" size="xs">🌾 {s}</Badge>)}
                </div>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={()=>setProfile(f)} style={ghBtn({flex:1,padding:"7px 0",fontSize:11})}>Profile</button>
                  <button onClick={()=>setInvited(p=>({...p,[f.id]:true}))} style={{...gBtn({flex:1,padding:"7px 0",fontSize:11}),background:invited[f.id]?`linear-gradient(135deg,${ac},${gm})`:""}}>
                    {invited[f.id]?"✓ Added":"+ Empanel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {profile&&<Modal onClose={()=>setProfile(null)} w={560}><FarmerProfileModal farmer={profile} onClose={()=>setProfile(null)} onInvite={id=>setInvited(p=>({...p,[id]:true}))} invited={!!invited[profile.id]}/></Modal>}
      {showCompare&&<Modal onClose={()=>setShowCompare(false)} w={720}><CompareFarmersModal onClose={()=>setShowCompare(false)}/></Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: MESSAGES  ✅ SUPABASE WIRED
═══════════════════════════════════════════════════════════ */
const DEMO_FARMER_ID="00000000-0000-0000-0000-000000000001";
const FIXED_CONTACTS=[
  {id:DEMO_FARMER_ID,name:"Ramesh Patil",e:"👨‍🌾",preview:"Available for supply…",time:"",unread:0,online:true},
  {id:"00000000-0000-0000-0000-000000000003",name:"Britannia Industries",e:"🏭",preview:"",time:"",unread:0,online:false},
];

function PageMessages({lang="en"}){
  const [activeId,setActiveId]=useState(DEMO_FARMER_ID);
  const [contacts,setContacts]=useState(FIXED_CONTACTS);
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(true);
  const bottomRef=useRef();

  useEffect(()=>{
    if(!activeId)return;
    setLoading(true);
    const loadMsgs=async()=>{
      const {data,error}=await supabase.from("messages").select("*")
        .or(`and(sender_id.eq.${DEMO_INDUSTRY_ID},receiver_id.eq.${activeId}),and(sender_id.eq.${activeId},receiver_id.eq.${DEMO_INDUSTRY_ID})`)
        .order("created_at",{ascending:true});
      console.log("MSGS LOAD:",{data,error});
      if(data) setMessages(data.map(m=>({
        f:m.sender_id===DEMO_INDUSTRY_ID?"me":"them",
        m:m.text,
        t:new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      })));
      setLoading(false);
    };
    loadMsgs();

    const sub=supabase.channel(`ind-chat-${activeId}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},payload=>{
        const m=payload.new;
        if((m.sender_id===DEMO_INDUSTRY_ID&&m.receiver_id===activeId)||(m.sender_id===activeId&&m.receiver_id===DEMO_INDUSTRY_ID)){
          setMessages(p=>[...p,{
            f:m.sender_id===DEMO_INDUSTRY_ID?"me":"them",
            m:m.text,
            t:new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
          }]);
        }
      }).subscribe();
    return()=>supabase.removeChannel(sub);
  },[activeId]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages.length]);

  const send=async()=>{
    if(!input.trim())return;
    const content=input.trim();
    setInput("");
    // Optimistic update immediately
    const t=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMessages(p=>[...p,{f:"me",m:content,t}]);
    const {error}=await supabase.from("messages").insert({
      sender_id:DEMO_INDUSTRY_ID,
      receiver_id:activeId,
      text:content,
    });
    console.log("MSG SEND:",{error});
  };

  const active=contacts.find(c=>c.id===activeId)||MSGS.contacts[0];
  const quickR=["Are documents ready?","What's the delivery date?","Can you reduce the price?","Please share quality certificate","We'll finalize by Friday","Interested, let's proceed"];

  return(
    <>
      <Topbar title="Messages 💬" sub="Encrypted · All parties verified on GrainOS"/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:16,height:"calc(100vh - 195px)"}}>
          <div style={{...crd({padding:14,overflowY:"auto"})}}>
            <div style={{...PF({fontSize:14,fontWeight:600,color:"#1a2e1a",marginBottom:12})}}>Conversations</div>
            {loading&&<div style={{textAlign:"center",color:"#9ca3af",fontSize:12,padding:"20px 0"}}>⏳ Loading…</div>}
            {contacts.map(c=>(
              <div key={c.id} onClick={()=>setActiveId(c.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:13,marginBottom:4,cursor:"pointer",background:activeId===c.id?"#f0f7f0":"transparent",border:`1px solid ${activeId===c.id?"rgba(163,196,92,.3)":"transparent"}`,transition:"all .15s"}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:40,height:40,borderRadius:11,background:`linear-gradient(135deg,${cr},#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{c.e}</div>
                  {c.online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"1.5px solid #fff"}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a2e1a"}}>{c.name}</div>
                  <div style={{fontSize:10,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{c.preview}</div>
                </div>
                <span style={{fontSize:9,color:"#9ca3af"}}>{c.time}</span>
              </div>
            ))}
          </div>
          <div style={{...crd({padding:0,overflow:"hidden",display:"flex",flexDirection:"column"})}}>
            <div style={{padding:"13px 18px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${cr},#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{active?.e}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1a2e1a"}}>{active?.name}</div>
                <div style={{fontSize:11,fontWeight:600,marginTop:1,color:"#22c55e"}}>🟢 Online</div>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:10,background:"#fafaf8"}}>
              {messages.map(({f,m,t},i)=>(
                <div key={i} style={{display:"flex",justifyContent:f==="me"?"flex-end":"flex-start"}}>
                  {f==="them"&&<div style={{width:26,height:26,borderRadius:8,background:`linear-gradient(135deg,${cr},#d4edda)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,marginRight:7,alignSelf:"flex-end"}}>{active?.e}</div>}
                  <div style={{maxWidth:"64%",padding:"10px 14px",borderRadius:f==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:f==="me"?`linear-gradient(135deg,${gd},${gm})`:"#fff",color:f==="me"?"#fff":"#1a2e1a",fontSize:13,lineHeight:1.55,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
                    {m}
                    <div style={{fontSize:9,marginTop:4,opacity:.5,textAlign:f==="me"?"right":"left"}}>{t}{f==="me"&&" ✓✓"}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}/>
            </div>
            <div style={{padding:"7px 14px",borderTop:"1px solid #f0f0f0",display:"flex",gap:6,overflowX:"auto",flexShrink:0}}>
              {quickR.map(q=><button key={q} onClick={()=>setInput(q)} style={{padding:"4px 12px",borderRadius:100,border:"1px solid #e5e7eb",background:"#fff",fontSize:10,color:"#374151",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{q}</button>)}
            </div>
            <div style={{padding:"9px 13px",borderTop:"1px solid #f0f0f0",display:"flex",gap:9,alignItems:"center",flexShrink:0}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Type a message… Enter to send" style={{flex:1,padding:"9px 14px",border:"1.5px solid #e5e7eb",borderRadius:13,fontSize:13,outline:"none"}}/>
              <button onClick={send} disabled={!input.trim()} style={{...gBtn({padding:"9px 16px",fontSize:13,opacity:input.trim()?1:0.5,flexShrink:0})}}>→</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PagePayments({lang="en"}){
  const [payments,setPayments]=useState(PAYMENTS);
  const [showPay,setShowPay]=useState(null);
  const [paid,setPaid]=useState({});
  const total=payments.filter(p=>p.status==="completed").reduce((a,p)=>a+parseInt(p.amount.replace(/[₹,]/g,"")),0);

  return(
    <>
      <Topbar title="Payments 💰" sub="Track all procurement payments to verified farmers"/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{i:"✅",l:"Total Paid YTD",v:`₹${(total/100000).toFixed(1)}L`,c:gm},{i:"⏳",l:"Pending",v:"₹2.18L",c:"#d97706"},{i:"🔄",l:"Processing",v:"₹42k",c:"#3b82f6"},{i:"📊",l:"Avg. Per Order",v:"₹1.01L",c:"#7e22ce"}].map(({i,l,v,c})=>(
            <div key={l} style={crd({marginBottom:0})}>
              <div style={{fontSize:22,marginBottom:8}}>{i}</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:5}}>{l}</div>
              <div style={{...PF({fontSize:22,fontWeight:700,color:"#1a1f36"})}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={crd()}>
          <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Payment History</div>
          {payments.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",borderRadius:14,marginBottom:8,border:"1px solid rgba(30,42,74,.07)"}}>
              <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${cr},#c8e6c9)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👨‍🌾</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1f36"}}>{p.to}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>📋 {p.tender} · 💳 {p.method}</div>
              </div>
              <div style={{fontSize:11,color:"#9ca3af"}}>{p.date}</div>
              <div style={{fontSize:16,fontWeight:800,color:gd}}>{p.amount}</div>
              <Badge color={p.status==="completed"?"green":p.status==="processing"?"blue":"amber"}>{p.status.toUpperCase()}</Badge>
              {p.status==="pending"&&!paid[p.id]&&<button onClick={()=>setShowPay(p)} style={gBtn({padding:"6px 14px",fontSize:11})}>Pay Now</button>}
              {(p.status==="completed"||paid[p.id])&&<button style={ghBtn({padding:"6px 12px",fontSize:11})}>Receipt</button>}
            </div>
          ))}
        </div>
      </div>
      {showPay&&<Modal onClose={()=>setShowPay(null)} w={460}>
        <div style={{...PF({fontSize:19,fontWeight:700,color:"#1a2e1a",marginBottom:16})}}>Initiate Payment</div>
        <div style={{background:cr,borderRadius:14,padding:"14px 16px",marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#6b7280"}}>Payee</span><span style={{fontSize:13,fontWeight:700}}>{showPay.to}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#6b7280"}}>Amount</span><span style={{fontSize:18,fontWeight:800,color:gd}}>{showPay.amount}</span></div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={()=>setShowPay(null)} style={ghBtn({flex:1})}>{tt("cancel",lang)}</button>
          <button onClick={()=>{setPaid(p=>({...p,[showPay.id]:true}));setPayments(prev=>prev.map(x=>x.id===showPay.id?{...x,status:"completed"}:x));setShowPay(null);}} style={gBtn({flex:2,padding:12})}>✓ Confirm & Pay</button>
        </div>
      </Modal>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: ANALYTICS
═══════════════════════════════════════════════════════════ */
function PageAnalytics({lang="en"}){
  const mx=Math.max(...ANALYTICS.spend);
  const mo=Math.max(...ANALYTICS.orders);
  return(
    <>
      <Topbar title="Analytics 📊" sub="Procurement spend, supplier performance and savings"/>
      <div style={{padding:"22px 28px"}} className="fu">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{i:"💰",l:"Total Spend",v:"₹8.4Cr"},{i:"🌾",l:"Produce Sourced",v:"1,240 ton"},{i:"👨‍🌾",l:"Unique Farmers",v:"28"},{i:"💸",l:"Savings vs Market",v:"-14%"}].map(({i,l,v})=>(
            <div key={l} style={crd({marginBottom:0})}><div style={{fontSize:22,marginBottom:8}}>{i}</div><div style={{...PF({fontSize:24,fontWeight:700,color:"#1a1f36"})}}>{v}</div><div style={{fontSize:11,color:"#6b7280",marginTop:3}}>{l}</div></div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={crd({padding:24})}>
            <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Monthly Spend (₹ Lakhs)</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:130}}>
              {ANALYTICS.spend.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{fontSize:9,fontWeight:700,color:navy}}>₹{(v/100).toFixed(1)}L</div>
                  <div style={{width:"100%",height:`${Math.round(v/mx*100)}%`,borderRadius:"6px 6px 0 0",background:`linear-gradient(180deg,#667eea,${navy})`,minHeight:4}}/>
                  <div style={{fontSize:9,color:"#9ca3af"}}>{ANALYTICS.months[i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={crd({padding:24})}>
            <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Monthly Orders Completed</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:130}}>
              {ANALYTICS.orders.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{fontSize:9,fontWeight:700,color:gm}}>{v}</div>
                  <div style={{width:"100%",height:`${Math.round(v/mo*100)}%`,borderRadius:"6px 6px 0 0",background:`linear-gradient(180deg,${ac},${gd})`,minHeight:4}}/>
                  <div style={{fontSize:9,color:"#9ca3af"}}>{ANALYTICS.months[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: SETTINGS
═══════════════════════════════════════════════════════════ */
function PageSettings({lang="en"}){
  const [saved,setSaved]=useState(false);
  const [notif,setNotif]=useState({sms:true,email:true,app:true,bid:true,tender:false});
  const [comp,setComp]=useState({name:"PepsiCo India",gstin:"27AABCS1429B1Z5",email:"sourcing@pepsico.in",phone:"+91 98765 43210",state:"Maharashtra",category:"Food Processing"});
  const toggle=k=>setNotif(p=>({...p,[k]:!p[k]}));
  const set=(k,v)=>setComp(p=>({...p,[k]:v}));

  return(
    <>
      <Topbar title="Settings ⚙️" sub="Company profile, notifications and account preferences"/>
      <div style={{padding:"22px 28px",maxWidth:700}} className="fu">
        {saved&&<div style={{background:"#f0f7f0",border:"1px solid rgba(45,107,48,.2)",borderRadius:12,padding:"10px 16px",marginBottom:16,fontSize:13,color:gm,fontWeight:600}}>✅ Settings saved successfully!</div>}
        <div style={{...crd({marginBottom:16})}}>
          <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Company Profile</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Company Name" value={comp.name} onChange={v=>set("name",v)}/>
            <Field label="GSTIN" value={comp.gstin} onChange={v=>set("gstin",v)}/>
            <Field label="Email" type="email" value={comp.email} onChange={v=>set("email",v)}/>
            <Field label="Phone" value={comp.phone} onChange={v=>set("phone",v)}/>
            <Field label="State" type="select" opts={["Maharashtra","Delhi","Karnataka","Punjab","Gujarat","Tamil Nadu"]} value={comp.state} onChange={v=>set("state",v)}/>
            <Field label="Industry Category" type="select" opts={["Food Processing","FMCG","Export","Retail","Agriculture"]} value={comp.category} onChange={v=>set("category",v)}/>
          </div>
        </div>
        <div style={crd({marginBottom:16})}>
          <div style={{...PF({fontSize:15,fontWeight:600,color:"#1a1f36",marginBottom:16})}}>Notifications</div>
          {[{k:"sms",l:"SMS Alerts",d:"Bid updates, tender alerts via SMS"},{k:"email",l:"Email Notifications",d:"Daily digest and important updates"},{k:"app",l:"In-App Notifications",d:"Real-time alerts within GrainOS"},{k:"bid",l:"New Bid Alerts",d:"Instantly notify when farmer bids on your tender"},{k:"tender",l:"Tender Expiry Reminders",d:"Remind 24hrs before tender closes"}].map(({k,l,d})=>(
            <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#1a2e1a"}}>{l}</div>
                <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{d}</div>
              </div>
              <div onClick={()=>toggle(k)} style={{width:40,height:22,borderRadius:100,background:notif[k]?gm:"#e5e7eb",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:notif[k]?21:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>setSaved(true)} style={gBtn({padding:"11px 32px",fontSize:13})}>{tt("save",lang)} Changes</button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP  ✅ SUPABASE WIRED
═══════════════════════════════════════════════════════════ */
export default function IndustryDashboard(){
  const [page,setPage]=useState("dashboard");
  const [tenders,setTenders]=useState([]);
  const [bids,setBids]=useState([]);
  const [lang,setLang]=useState(()=>{
    if(typeof window!=="undefined") return localStorage.getItem("grainos_lang")||"en";
    return "en";
  });
  const handleSetLang=(l)=>{setLang(l);if(typeof window!=="undefined")localStorage.setItem("grainos_lang",l);};

  const renderPage=()=>{
    switch(page){
      case "dashboard": return <PageDashboard setPage={setPage} tenders={tenders} bids={bids} setBids={setBids} lang={lang}/>;
      case "browse":    return <PageBrowse lang={lang}/>;
      case "tenders":   return <PageTenders tenders={tenders} setTenders={setTenders} lang={lang}/>;
      case "bids":      return <PageBids bids={bids} setBids={setBids} lang={lang}/>;
      case "farmers":   return <PageFarmers lang={lang}/>;
      case "messages":  return <PageMessages lang={lang}/>;
      case "payments":  return <PagePayments lang={lang}/>;
      case "analytics": return <PageAnalytics lang={lang}/>;
      case "settings":  return <PageSettings lang={lang}/>;
      default: return null;
    }
  };

  return(
    <>
      <style>{CSS}</style>
      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <TickerBar/>
        <div style={{display:"flex",flex:1}}>
          <Sidebar page={page} setPage={setPage} lang={lang} setLang={handleSetLang}/>
          <div style={{marginLeft:224,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",background:"#eef2e8"}}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
