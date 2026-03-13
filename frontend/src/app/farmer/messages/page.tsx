"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const DEMO_FARMER_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_INDUSTRY_ID = "00000000-0000-0000-0000-000000000002";

/* ─── DESIGN TOKENS ─── */
const gd = "#1e4620", gm = "#2d6b30", ac = "#a3c45c", navy = "#1e2a4a";

/* ─── LANGUAGES ─── */
const LANGUAGES = [
  { code: "en", label: "English",  native: "English"    },
  { code: "hi", label: "Hindi",    native: "हिन्दी"      },
  { code: "mr", label: "Marathi",  native: "मराठी"       },
  { code: "pa", label: "Punjabi",  native: "ਪੰਜਾਬੀ"      },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી"     },
  { code: "ta", label: "Tamil",    native: "தமிழ்"        },
  { code: "te", label: "Telugu",   native: "తెలుగు"      },
  { code: "kn", label: "Kannada",  native: "ಕನ್ನಡ"       },
  { code: "bn", label: "Bengali",  native: "বাংলা"       },
  { code: "ar", label: "Arabic",   native: "العربية"    },
];

/* ─── MOCK TRANSLATIONS ─── */
const TRANS: Record<string, Record<string, string>> = {
  hi: {
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":
      "मैं ₹23/किग्रा पर 500 किग्रा ग्रेड A आलू की आपूर्ति कर सकता हूं। डिलीवरी कब चाहिए?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":
      "हमारे कारखाने को 20 मार्च तक आलू चाहिए। क्या आप उस तारीख की गारंटी दे सकते हैं?",
    "Yes, I can deliver by March 18. I'll send you a sample first.":
      "हां, मैं 18 मार्च तक डिलीवरी कर सकता हूं। पहले एक नमूना भेजूंगा।",
  },
  mr: {
    "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?":
      "मी ₹23/किलोने 500 किलो ग्रेड A बटाटे पुरवू शकतो. तुम्हाला डिलिव्हरी केव्हा हवी?",
    "Our factory needs the potatoes by March 20. Can you guarantee that date?":
      "आमच्या कारखान्याला 20 मार्चपर्यंत बटाटे हवे. तुम्ही ती तारीख हमी देऊ शकता का?",
  },
};

function mockTranslate(text: string, lang: string): string {
  if (lang === "en") return text;
  const t = TRANS[lang];
  if (t?.[text]) return t[text];
  const pfx: Record<string,string> = { hi:"[हिंदी] ", mr:"[मराठी] ", pa:"[ਪੰਜਾਬੀ] ", gu:"[ગુ.] ", ta:"[த.] ", te:"[తె.] ", kn:"[ಕ.] ", bn:"[বাং.] ", ar:"[ع.] " };
  return (pfx[lang] || "[Translated] ") + text;
}

/* ─── TYPES ─── */
type MsgType = "text" | "image" | "video" | "file";
interface Msg {
  id: number;
  from: "me" | "them";
  type: MsgType;
  text?: string;
  imgUrl?: string;
  imgLabel?: string;
  videoLabel?: string;
  videoDuration?: string;
  videoSize?: string;
  file?: { name: string; size: string; mimeType: string };
  time: string;
  status: "sent" | "delivered" | "read";
}
interface Convo {
  id: number;
  name: string;
  avatar: string;
  role: "buyer" | "farmer";
  verified: boolean;
  online: boolean;
  unread: number;
  lastMsg: string;
  lastTime: string;
  about: string;
  messages: Msg[];
}

/* ─── SEED DATA ─── */
const FARMER_CONVOS: Convo[] = [
  {
    id: 1, name: "PepsiCo India", avatar: "🏭", role: "buyer", verified: true, online: true,
    unread: 2, lastMsg: "Can you confirm the order for 500 kg?", lastTime: "2m ago",
    about: "Chip-Grade Potato Tender",
    messages: [
      { id: 1, from: "them", type: "text", text: "Hello Ramesh ji! We're interested in your Grade A Potatoes listing.", time: "10:02 AM", status: "read" },
      { id: 2, from: "me",   type: "text", text: "Namaste! Yes, I have 800 kg available. What quality specs do you need?", time: "10:05 AM", status: "read" },
      { id: 3, from: "them", type: "text", text: "We need specific gravity >1.080, size 40–80mm.", time: "10:07 AM", status: "read" },
      { id: 4, from: "me",   type: "text", text: "I can supply 500 kg of Grade A potatoes at ₹23/kg. When do you need delivery?", time: "10:10 AM", status: "read" },
      { id: 5, from: "them", type: "text", text: "Our factory needs the potatoes by March 20. Can you guarantee that date?", time: "10:13 AM", status: "read" },
      { id: 6, from: "me",   type: "text", text: "Yes, I can deliver by March 18. I'll send you a sample first.", time: "10:15 AM", status: "read" },
      { id: 7, from: "them", type: "file", file: { name: "Quality_Requirements.pdf", size: "1.2 MB", mimeType: "pdf" }, time: "10:18 AM", status: "read" },
      { id: 8, from: "them", type: "text", text: "Can you confirm the order for 500 kg?", time: "Just now", status: "delivered" },
    ],
  },
  {
    id: 2, name: "Britannia Industries", avatar: "🏭", role: "buyer", verified: true, online: false,
    unread: 0, lastMsg: "Please share the FSSAI certificate.", lastTime: "1h ago",
    about: "Wheat Tender Q2",
    messages: [
      { id: 1, from: "them", type: "text", text: "Hi! We are interested in your wheat listing. Are you FSSAI certified?", time: "Yesterday", status: "read" },
      { id: 2, from: "me",   type: "text", text: "Yes, FSSAI certified. Protein content is 12.5%.", time: "Yesterday", status: "read" },
      { id: 3, from: "them", type: "text", text: "Please share the FSSAI certificate.", time: "1h ago", status: "read" },
    ],
  },
  {
    id: 3, name: "BigBasket", avatar: "🛒", role: "buyer", verified: true, online: true,
    unread: 1, lastMsg: "Can you do weekly supply?", lastTime: "30m ago",
    about: "Onion Bulk Supply",
    messages: [
      { id: 1, from: "them", type: "text", text: "We need 2 ton of Nashik onions weekly.", time: "30m ago", status: "read" },
      { id: 2, from: "them", type: "text", text: "Can you do weekly supply?", time: "28m ago", status: "delivered" },
    ],
  },
  {
    id: 4, name: "NatureFresh Exports", avatar: "🌿", role: "buyer", verified: false, online: false,
    unread: 0, lastMsg: "Thank you, we'll review your application.", lastTime: "2 days ago",
    about: "Red Chilli Export Dubai",
    messages: [
      { id: 1, from: "me",   type: "text", text: "I have Teja variety chilli, APEDA certified.", time: "2 days ago", status: "read" },
      { id: 2, from: "them", type: "text", text: "Thank you, we'll review your application.", time: "2 days ago", status: "read" },
    ],
  },
];

const INDUSTRY_CONVOS: Convo[] = [
  {
    id: 1, name: "Ramesh Patil", avatar: "👨‍🌾", role: "farmer", verified: true, online: true,
    unread: 2, lastMsg: "₹27.5/kg works for me. I'll send docs now.", lastTime: "2m ago",
    about: "Wheat Tender · 50 ton",
    messages: [
      { id: 1, from: "them", type: "text", text: "Hello! I saw your wheat tender. I can supply 50 ton at ₹27.5/kg.", time: "10:10 AM", status: "read" },
      { id: 2, from: "me",   type: "text", text: "That looks good. Do you have FSSAI certification available?", time: "10:12 AM", status: "read" },
      { id: 3, from: "them", type: "text", text: "Yes, all certificates ready. Farm visit also possible this week.", time: "10:14 AM", status: "read" },
      { id: 4, from: "me",   type: "text", text: "Perfect. Can you share the certificate and delivery schedule?", time: "10:15 AM", status: "read" },
      { id: 5, from: "them", type: "text", text: "₹27.5/kg works for me. I'll send docs now.", time: "10:22 AM", status: "read" },
    ],
  },
  {
    id: 2, name: "Sunita Devi", avatar: "👩‍🌾", role: "farmer", verified: true, online: false,
    unread: 0, lastMsg: "Quality certificate attached.", lastTime: "45m ago",
    about: "Potato Supply · 80 ton",
    messages: [
      { id: 1, from: "them", type: "text", text: "I have chip potatoes s.g. 1.085. Ready for delivery.", time: "45m ago", status: "read" },
      { id: 2, from: "me",   type: "text", text: "Great. Please send quality certificate.", time: "40m ago", status: "read" },
    ],
  },
  {
    id: 3, name: "Kavitha Rao", avatar: "👩‍🌾", role: "farmer", verified: true, online: true,
    unread: 1, lastMsg: "APEDA docs ready to share.", lastTime: "2h ago",
    about: "Chilli Export",
    messages: [
      { id: 1, from: "them", type: "text", text: "I grow Teja chilli. APEDA docs ready to share.", time: "2h ago", status: "delivered" },
    ],
  },
  {
    id: 4, name: "Arjun Mehta", avatar: "👨‍🌾", role: "farmer", verified: false, online: false,
    unread: 0, lastMsg: "Can do ₹26 for 40 ton.", lastTime: "1 day ago",
    about: "Wheat Supply",
    messages: [
      { id: 1, from: "them", type: "text", text: "Can do ₹26 for 40 ton of wheat, Grade A.", time: "1 day ago", status: "read" },
    ],
  },
];

/* ─── HELPERS ─── */
function fmtBytes(b: number) {
  return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB";
}
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── TRANSLATE BUTTON ─── */
function TranslateBtn({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const translate = (code: string) => {
    setOpen(false);
    if (code === "en") { setTranslated(null); return; }
    setLoading(true);
    setTimeout(() => { setTranslated(mockTranslate(text, code)); setLoading(false); }, 500);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: 3 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 5px", borderRadius: 5, display: "flex", alignItems: "center", gap: 3, color: "#9ca3af", fontSize: 10, fontWeight: 600 }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = gm; (e.currentTarget as HTMLElement).style.background = "#f0f7f0"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#9ca3af"; (e.currentTarget as HTMLElement).style.background = "none"; }}
      >
        🌐 {loading ? "Translating…" : translated ? "Translated ↩" : "Translate"}
      </button>
      {translated && !loading && (
        <div style={{ padding: "5px 9px", background: "#f0f7f0", borderRadius: 8, fontSize: 11, color: gd, lineHeight: 1.5, border: "1px solid rgba(45,107,48,.12)", fontStyle: "italic", maxWidth: 280 }}>
          {translated}
          <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2, display: "flex", alignItems: "center", gap: 2 }}>🌐 Google Translate</div>
        </div>
      )}
      {open && (
        <div style={{ position: "absolute", bottom: "calc(100% + 5px)", left: 0, background: "#fff", borderRadius: 12, border: "1px solid rgba(30,70,20,.1)", boxShadow: "0 8px 28px rgba(0,0,0,.14)", zIndex: 200, minWidth: 175, padding: "5px 0", animation: "popIn .15s ease" }}>
          <div style={{ padding: "5px 12px 3px", fontSize: 9, fontWeight: 700, color: "#9ca3af", letterSpacing: .8, textTransform: "uppercase" }}>🌐 Google Translate</div>
          {LANGUAGES.map(l => (
            <div key={l.code} onClick={() => translate(l.code)} style={{ padding: "7px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: 12 }} onMouseEnter={e => (e.currentTarget.style.background = "#f9fdf9")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ color: "#374151" }}>{l.label}</span>
              <span style={{ color: "#9ca3af", fontSize: 11 }}>{l.native}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MESSAGE BUBBLE ─── */
function Bubble({ msg, isMe }: { msg: Msg; isMe: boolean }) {
  const bg = isMe ? `linear-gradient(135deg,${gd},${gm})` : "#fff";
  const fg = isMe ? "#fff" : "#1a2e1a";

  return (
    <div style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, marginBottom: 6, alignItems: "flex-end" }}>
      {!isMe && (
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1e2a4a,#2d3b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
          {msg.from === "them" ? "👤" : ""}
        </div>
      )}
      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: 3 }}>
        <div style={{ background: bg, color: fg, borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: msg.type === "image" || msg.type === "video" ? 5 : "10px 14px", boxShadow: "0 2px 8px rgba(0,0,0,.07)", border: isMe ? "none" : "1px solid rgba(30,70,20,.06)", overflow: "hidden" }}>
          {/* TEXT */}
          {msg.type === "text" && <div style={{ fontSize: 13, lineHeight: 1.55 }}>{msg.text}</div>}

          {/* IMAGE */}
          {msg.type === "image" && (
            <div style={{ borderRadius: 12, overflow: "hidden", minWidth: 160 }}>
              {msg.imgUrl
                ? <img src={msg.imgUrl} alt={msg.imgLabel || "photo"} style={{ width: "100%", maxWidth: 260, maxHeight: 200, objectFit: "cover", display: "block" }} />
                : <div style={{ background: `linear-gradient(135deg,${gd}22,${gm}22)`, padding: "32px 24px", textAlign: "center", fontSize: 52 }}>🖼️</div>
              }
              {msg.imgLabel && (
                <div style={{ padding: "5px 10px 7px", background: isMe ? "rgba(0,0,0,.18)" : "#f9fdf9", fontSize: 10, color: isMe ? "rgba(255,255,255,.7)" : "#6b7280", fontWeight: 600 }}>{msg.imgLabel}</div>
              )}
            </div>
          )}

          {/* VIDEO */}
          {msg.type === "video" && (
            <div style={{ borderRadius: 12, overflow: "hidden", minWidth: 180 }}>
              <div style={{ background: "#111827", padding: "28px", textAlign: "center", position: "relative" }}>
                <span style={{ fontSize: 40 }}>🎬</span>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.85)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}>▶</div>
                </div>
              </div>
              <div style={{ padding: "6px 10px 8px", background: isMe ? "rgba(0,0,0,.18)" : "#f9fdf9" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: isMe ? "rgba(255,255,255,.8)" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.videoLabel}</div>
                <div style={{ fontSize: 9, color: isMe ? "rgba(255,255,255,.4)" : "#9ca3af", marginTop: 1 }}>{msg.videoDuration} · {msg.videoSize}</div>
              </div>
            </div>
          )}

          {/* FILE */}
          {msg.type === "file" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 2, minWidth: 185 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: isMe ? "rgba(255,255,255,.15)" : "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {msg.file?.mimeType === "video" ? "🎬" : msg.file?.mimeType?.includes("image") ? "🖼️" : "📄"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.file?.name}</div>
                <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,.5)" : "#9ca3af", marginTop: 1 }}>{msg.file?.size}</div>
              </div>
              <button style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer", background: isMe ? "rgba(255,255,255,.15)" : "#f0f4ec", color: fg, fontSize: 13, flexShrink: 0 }}>⬇</button>
            </div>
          )}
        </div>
        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexDirection: isMe ? "row-reverse" : "row", flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, color: "#9ca3af" }}>{msg.time}</span>
          {isMe && <span style={{ fontSize: 9, color: msg.status === "read" ? gm : "#9ca3af" }}>{msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}</span>}
          {msg.type === "text" && msg.text && <TranslateBtn text={msg.text} />}
        </div>
      </div>
    </div>
  );
}

/* ─── ATTACHMENT MENU ─── */
function AttachMenu({ onPick, onClose }: { onPick: (type: string) => void; onClose: () => void }) {
  const items = [
    { id: "photo",       icon: "🖼️", label: "Photo",       sub: "JPG, PNG, WebP" },
    { id: "video",       icon: "🎬", label: "Video",       sub: "MP4, MOV, AVI"  },
    { id: "document",    icon: "📄", label: "Document",    sub: "PDF, DOCX, XLSX" },
    { id: "certificate", icon: "🏅", label: "Certificate", sub: "FSSAI, Organic"  },
    { id: "location",    icon: "📍", label: "Location",    sub: "Farm GPS"        },
    { id: "contact",     icon: "👤", label: "Contact",     sub: "Share card"      },
  ];
  return (
    <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "#fff", borderRadius: 16, border: "1px solid rgba(30,70,20,.1)", boxShadow: "0 12px 36px rgba(0,0,0,.15)", zIndex: 100, padding: "12px 10px", width: 250 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: .8, padding: "0 4px", marginBottom: 9 }}>Share</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
        {items.map(o => (
          <button key={o.id} onClick={() => onPick(o.id)}
            style={{ padding: "9px 6px", borderRadius: 11, border: "1.5px solid rgba(30,70,20,.07)", background: "#fafafa", cursor: "pointer", textAlign: "center", transition: "all .14s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0f7f0"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,107,48,.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,70,20,.07)"; }}
          >
            <div style={{ fontSize: 20, marginBottom: 3 }}>{o.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#1a2e1a" }}>{o.label}</div>
            <div style={{ fontSize: 8, color: "#9ca3af", marginTop: 1 }}>{o.sub}</div>
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{ width: "100%", marginTop: 9, padding: "6px", borderRadius: 9, border: "none", background: "#f0f4ec", cursor: "pointer", fontSize: 11, color: "#374151", fontWeight: 600 }}>Cancel</button>
    </div>
  );
}

/* ─── FILE PREVIEW BAR ─── */
function FilePreviewBar({ file, type, previewUrl, caption, setCaption, onSend, onCancel }:
  { file: File | null; type: string; previewUrl: string | null; caption: string; setCaption: (s: string) => void; onSend: () => void; onCancel: () => void }) {
  const icons: Record<string, string> = { photo: "🖼️", video: "🎬", document: "📄", certificate: "🏅", location: "📍", contact: "👤" };
  return (
    <div style={{ padding: "11px 14px", background: "#f9fdf9", borderTop: "1px solid rgba(30,70,20,.08)", display: "flex", alignItems: "center", gap: 10 }}>
      {type === "photo" && previewUrl
        ? <img src={previewUrl} alt="preview" style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
        : <div style={{ width: 46, height: 46, borderRadius: 10, background: "linear-gradient(135deg,#f0f7f0,#c8e6c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icons[type] || "📎"}</div>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1a2e1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file ? file.name : type === "location" ? "Farm GPS Location" : "Contact Card"}
        </div>
        {file && <div style={{ fontSize: 9, color: "#9ca3af" }}>{fmtBytes(file.size)}</div>}
      </div>
      {(type === "photo" || type === "video") && (
        <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption…" style={{ border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "6px 10px", fontSize: 12, outline: "none", width: 130, background: "#fff" }} />
      )}
      <button onClick={onSend} style={{ background: `linear-gradient(135deg,${gd},${gm})`, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>Send</button>
      <button onClick={onCancel} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
    </div>
  );
}

/* ─── QUICK REPLIES ─── */
const QUICK = ["What's your best price?", "When can you deliver?", "Please share certificate", "Is farm visit possible?", "Can you send a sample?", "Payment terms?"];

/* ─── CALL MODAL ─── */
function CallModal({ name, avatar, type, onClose }: { name: string; avatar: string; type: string; onClose: () => void }) {
  const [status, setStatus] = useState("calling");
  useEffect(() => { const t = setTimeout(() => setStatus("connected"), 2000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#1e2a4a,#2d3b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{avatar}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif" }}>{name}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{status === "calling" ? `${type === "video" ? "Video" : "Voice"} calling…` : "Connected · 00:04"}</div>
      <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
        {type === "video" && <button style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.1)", cursor: "pointer", fontSize: 20 }}>📷</button>}
        <button style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.1)", cursor: "pointer", fontSize: 20 }}>🎤</button>
        <button style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.1)", cursor: "pointer", fontSize: 20 }}>🔊</button>
        <button onClick={onClose} style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "#ef4444", cursor: "pointer", fontSize: 20 }}>📵</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CHAT CORE — accepts portal prop
═══════════════════════════════════════════════ */
export default function MessagesPage() {
  const portal = "farmer"; const isFarmer = true;
  const accentBg = isFarmer ? `linear-gradient(135deg,${gd},${gm})` : `linear-gradient(135deg,${navy},#2d3b6b)`;
  const accentSolid = isFarmer ? gd : navy;

  const [convos, setConvos] = useState<Convo[]>(FARMER_CONVOS);
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [callType, setCallType] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const [hoverMsg, setHoverMsg] = useState<number | null>(null);

  // File upload state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingType, setPendingType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  // Hidden file input refs
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const docRef   = useRef<HTMLInputElement>(null);
  const certRef  = useRef<HTMLInputElement>(null);

  const endRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;
  const filtered = convos.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeId, convos]);

  // Cleanup object URLs
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Load messages from Supabase on mount + realtime
  useEffect(() => {
    const loadMsgs = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${DEMO_FARMER_ID},receiver_id.eq.${DEMO_INDUSTRY_ID}),and(sender_id.eq.${DEMO_INDUSTRY_ID},receiver_id.eq.${DEMO_FARMER_ID})`)
        .order("created_at", { ascending: true });
      console.log("FARMER MSGS LOAD:", { data, error });
      if (data && data.length > 0) {
        const dbMsgs: Msg[] = data.map((m: any) => ({
          id: m.id,
          from: m.sender_id === DEMO_FARMER_ID ? "me" : "them",
          type: "text" as const,
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read" as const,
        }));
        setConvos(p => p.map(c => c.id === 1 ? { ...c, messages: dbMsgs } : c));
      }
    };
    loadMsgs();

    const sub = supabase
      .channel("farmer-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const m = payload.new as any;
        const relevant =
          (m.sender_id === DEMO_FARMER_ID && m.receiver_id === DEMO_INDUSTRY_ID) ||
          (m.sender_id === DEMO_INDUSTRY_ID && m.receiver_id === DEMO_FARMER_ID);
        if (!relevant) return;
        const newMsg: Msg = {
          id: m.id, from: m.sender_id === DEMO_FARMER_ID ? "me" : "them",
          type: "text", text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        };
        setConvos(p => p.map(c => c.id === 1 ? { ...c, messages: [...c.messages, newMsg] } : c));
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  /* ── Pick attachment type → trigger file input ── */
  const handleAttachPick = (type: string) => {
    setShowAttach(false);
    if (type === "photo")       photoRef.current?.click();
    else if (type === "video")  videoRef.current?.click();
    else if (type === "document") docRef.current?.click();
    else if (type === "certificate") certRef.current?.click();
    else if (type === "location") sendMsg({ type: "text", text: "📍 Farm Location: 19.9975° N, 73.7898° E — Nashik, Maharashtra" });
    else if (type === "contact")  sendMsg({ type: "text", text: `👤 Contact: ${isFarmer ? "Ramesh Patil · +91 98765 43210" : "Britannia Industries · procurement@britannia.in"}` });
  };

  /* ── File selected from OS file manager ── */
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPendingType(type);
    setCaption("");
    if (type === "photo") {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    e.target.value = ""; // reset so same file can be picked again
  };

  /* ── Cancel pending file ── */
  const cancelFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null); setPendingType(null); setPreviewUrl(null); setCaption("");
  };

  /* ── Send pending file as message ── */
  const sendFile = () => {
    if (!pendingType || !pendingFile) return;
    const type = pendingType;
    const file = pendingFile;
    let newMsg: Partial<Msg> = {};
    if (type === "photo") {
      newMsg = { type: "image", imgUrl: previewUrl || undefined, imgLabel: caption || file.name };
    } else if (type === "video") {
      newMsg = { type: "video", videoLabel: caption || file.name, videoDuration: "—", videoSize: fmtBytes(file.size) };
    } else {
      newMsg = { type: "file", file: { name: file.name, size: fmtBytes(file.size), mimeType: file.type } };
    }
    sendMsg(newMsg);
    // Don't revoke URL yet — bubble still shows image
    setPendingFile(null); setPendingType(null); setPreviewUrl(null); setCaption("");
  };

  /* ── Send text or media message ── */
  const sendMsg = (partial: Partial<Msg>) => {
    const newMsg: Msg = { id: Date.now(), from: "me", status: "sent", time: now(), type: "text", ...partial } as Msg;
    const lastMsg =
      partial.type === "text" ? (partial.text || "") :
      partial.type === "image" ? "📷 Photo" :
      partial.type === "video" ? "🎬 Video" : "📎 File";
    // Optimistic update
    setConvos(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, newMsg], lastMsg, lastTime: "Just now" } : c));
    // Save to Supabase (text messages only)
    if (partial.type === "text" && partial.text) {
      supabase.from("messages").insert({
        sender_id: DEMO_FARMER_ID,
        receiver_id: DEMO_INDUSTRY_ID,
        text: partial.text,
        
        
      }).then(({ error }) => { if (error) console.log("MSG SAVE ERROR:", error); });
    }
  };

  const sendText = () => {
    if (!input.trim()) return;
    sendMsg({ type: "text", text: input.trim() });
    setInput(""); setShowQuick(false);
  };

  const selectConvo = (id: number) => {
    setActiveId(id);
    setConvos(p => p.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowInfo(false); cancelFile();
  };

  const emojiReacts = ["👍", "❤️", "😊", "🙏", "✅", "🌾"];

  return (
    <>
      {/* Hidden real file inputs */}
      <input ref={photoRef} type="file" accept="image/*"                                        style={{ display: "none" }} onChange={e => handleFileSelected(e, "photo")} />
      <input ref={videoRef} type="file" accept="video/*"                                        style={{ display: "none" }} onChange={e => handleFileSelected(e, "video")} />
      <input ref={docRef}   type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"    style={{ display: "none" }} onChange={e => handleFileSelected(e, "document")} />
      <input ref={certRef}  type="file" accept=".pdf,.jpg,.jpeg,.png"                           style={{ display: "none" }} onChange={e => handleFileSelected(e, "certificate")} />

      <div style={{ display: "flex", height: "100%", fontFamily: "'DM Sans',sans-serif", background: "#f5f8f2", overflow: "hidden" }}>

        {/* ══ LEFT: CONVERSATION LIST ══ */}
        <div style={{ width: 260, background: "#fff", borderRight: "1px solid rgba(30,42,74,.07)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "16px 14px 10px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36", fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>
              Messages 💬
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f8f2", borderRadius: 10, padding: "7px 11px", border: "1px solid rgba(30,70,20,.08)" }}>
              <span style={{ opacity: .4, fontSize: 12 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…"
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 11, flex: 1, color: "#374151" }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map(c => (
              <div key={c.id} onClick={() => selectConvo(c.id)}
                style={{ display: "flex", gap: 10, padding: "11px 14px", cursor: "pointer", background: c.id === activeId ? "#f0f7f0" : "transparent", borderLeft: c.id === activeId ? `3px solid ${accentSolid}` : "3px solid transparent", transition: "all .13s" }}
                onMouseEnter={e => { if (c.id !== activeId) (e.currentTarget as HTMLElement).style.background = "#f9fdf9"; }}
                onMouseLeave={e => { if (c.id !== activeId) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: isFarmer ? "linear-gradient(135deg,#1e2a4a,#2d3b6b)" : "linear-gradient(135deg,#1e4620,#2d6b30)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.avatar}</div>
                  {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: c.unread > 0 ? 700 : 600, color: "#1a2e1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ fontSize: 9, color: "#9ca3af", flexShrink: 0 }}>{c.lastTime}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
                </div>
                {c.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: "50%", background: accentSolid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.unread}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT: CHAT AREA ══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: accentBg, padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{active.avatar}</div>
              {active.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid rgba(0,0,0,.2)" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{active.name}</span>
                {active.verified && <span style={{ fontSize: 11, color: ac }}>✅</span>}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginTop: 1 }}>
                {active.online ? "🟢 Online now" : `Last seen ${active.lastTime}`} · {active.about}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ icon: "📞", title: "Voice call", fn: () => setCallType("voice") }, { icon: "📹", title: "Video call", fn: () => setCallType("video") }, { icon: "ℹ️", title: "Info", fn: () => setShowInfo(p => !p) }].map(b => (
                <button key={b.title} onClick={b.fn} title={b.title}
                  style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.12)", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {b.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column" }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 10, color: "#9ca3af", background: "rgba(255,255,255,.8)", padding: "3px 12px", borderRadius: 100 }}>Today</span>
              </div>
              {active.messages.map(msg => (
                <div key={msg.id} style={{ position: "relative" }}
                  onMouseEnter={() => setHoverMsg(msg.id)}
                  onMouseLeave={() => setHoverMsg(null)}
                >
                  <Bubble msg={msg} isMe={msg.from === "me"} />
                  {/* Reaction display */}
                  {reactions[msg.id] && (
                    <div onClick={() => setReactions(p => { const n = { ...p }; delete n[msg.id]; return n; })}
                      style={{ position: "absolute", bottom: 2, [msg.from === "me" ? "right" : "left"]: msg.from === "me" ? 10 : 46, background: "#fff", borderRadius: 100, padding: "2px 7px", fontSize: 14, border: "1px solid #f0f0f0", boxShadow: "0 2px 6px rgba(0,0,0,.1)", cursor: "pointer", zIndex: 10 }}>
                      {reactions[msg.id]}
                    </div>
                  )}
                  {/* Reaction picker on hover */}
                  {hoverMsg === msg.id && !reactions[msg.id] && (
                    <div style={{ position: "absolute", bottom: 24, [msg.from === "me" ? "right" : "left"]: msg.from === "me" ? 10 : 46, background: "#fff", borderRadius: 100, padding: "5px 10px", display: "flex", gap: 6, boxShadow: "0 4px 16px rgba(0,0,0,.14)", border: "1px solid #f0f0f0", zIndex: 10 }}>
                      {emojiReacts.map(r => (
                        <span key={r} onClick={() => setReactions(p => ({ ...p, [msg.id]: r }))}
                          style={{ fontSize: 18, cursor: "pointer", transition: "transform .1s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Info panel */}
            {showInfo && (
              <div style={{ width: 220, background: "#fff", borderLeft: "1px solid rgba(30,70,20,.07)", padding: "18px 14px", overflowY: "auto", flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1f36", fontFamily: "'Playfair Display',serif", marginBottom: 12 }}>Contact Info</div>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 10px" }}>{active.avatar}</div>
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a" }}>{active.name}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{active.online ? "🟢 Online" : "⚫ Offline"}</div>
                </div>
                {[{ l: "About", v: active.about }, { l: "Messages", v: String(active.messages.length) }, { l: "Verified", v: active.verified ? "Yes ✅" : "No" }].map(({ l, v }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f5f5f5", fontSize: 11 }}>
                    <span style={{ color: "#9ca3af" }}>{l}</span>
                    <span style={{ fontWeight: 600, color: "#1a2e1a" }}>{v}</span>
                  </div>
                ))}
                <button style={{ width: "100%", marginTop: 12, padding: "8px", borderRadius: 10, background: accentBg, border: "none", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                  📋 View Tender
                </button>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {showQuick && (
            <div style={{ padding: "7px 14px 0", background: "#fff", borderTop: "1px solid rgba(30,70,20,.06)", display: "flex", gap: 7, overflowX: "auto", flexShrink: 0 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => { setInput(q); setShowQuick(false); }}
                  style={{ whiteSpace: "nowrap", padding: "5px 12px", borderRadius: 100, border: "1.5px solid rgba(30,70,20,.15)", background: "#f9fdf9", color: gm, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0f7f0"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f9fdf9"; }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* File preview bar */}
          {pendingFile && pendingType && (
            <FilePreviewBar file={pendingFile} type={pendingType} previewUrl={previewUrl} caption={caption} setCaption={setCaption} onSend={sendFile} onCancel={cancelFile} />
          )}

          {/* Input bar */}
          <div style={{ padding: "11px 14px", background: "#fff", borderTop: "1px solid rgba(30,70,20,.07)", flexShrink: 0, position: "relative" }}>
            {showAttach && <AttachMenu onPick={handleAttachPick} onClose={() => setShowAttach(false)} />}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button onClick={() => { setShowAttach(p => !p); setShowQuick(false); }}
                style={{ width: 38, height: 38, borderRadius: 11, border: "none", background: showAttach ? accentBg : "#f0f4ec", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18, transition: "all .18s" }}>
                <span style={{ display: "inline-block", transform: showAttach ? "rotate(45deg)" : "rotate(0)", transition: "transform .2s", color: showAttach ? "#fff" : "#374151" }}>📎</span>
              </button>

              <div style={{ flex: 1, background: "#f5f8f2", borderRadius: 14, padding: "8px 12px", border: "1.5px solid rgba(30,70,20,.09)", display: "flex", alignItems: "flex-end", gap: 8 }}
                onClick={() => setShowAttach(false)}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, resize: "none", lineHeight: 1.5, maxHeight: 96, color: "#1a2e1a" }}
                />
                <button onClick={() => { setShowQuick(p => !p); setShowAttach(false); }}
                  title="Quick replies"
                  style={{ fontSize: 16, cursor: "pointer", border: "none", background: "none", flexShrink: 0, opacity: showQuick ? 1 : .45, transition: "opacity .15s" }}>⚡</button>
              </div>

              <button onClick={sendText} disabled={!input.trim()}
                style={{ width: 38, height: 38, borderRadius: 11, border: "none", background: input.trim() ? accentBg : "#f0f4ec", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .18s" }}>
                <span style={{ color: input.trim() ? "#fff" : "#9ca3af", fontSize: 16 }}>➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {callType && <CallModal name={active.name} avatar={active.avatar} type={callType} onClose={() => setCallType(null)} />}
    </>
  );
}
