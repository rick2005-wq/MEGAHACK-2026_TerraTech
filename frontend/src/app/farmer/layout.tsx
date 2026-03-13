"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageProvider, useLang } from "@/context/LanguageContext";
import { LANGUAGES, t } from "@/lib/translations";

const NAV_KEYS = [
  { icon: "🏠", key: "dashboard", href: "/farmer/dashboard" },
  { icon: "📦", key: "listings",  href: "/farmer/listings",  badge: "3" },
  { icon: "📋", key: "tenders",   href: "/farmer/tenders",   badge: "12" },
  { icon: "💬", key: "messages",  href: "/farmer/messages",  badge: "4", red: true },
  { icon: "📊", key: "analytics", href: "/farmer/analytics" },
  { icon: "💰", key: "payments",  href: "/farmer/payments" },
];

const TICKER = [
  { name: "Potato", price: "₹22/kg", change: "▲ +4.2%", up: true },
  { name: "Onion",  price: "₹14/kg", change: "▼ -1.8%", up: false },
  { name: "Corn",   price: "₹18/kg", change: "▲ +2.1%", up: true },
  { name: "Chilli", price: "₹85/kg", change: "▲ +6.4%", up: true },
  { name: "Wheat",  price: "₹28/kg", change: "▲ +0.8%", up: true },
  { name: "Tomato", price: "₹32/kg", change: "▲+12.3%",  up: true },
];

function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: "relative", padding: "0 12px 4px" }}>
      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "10px 0 6px" }}>
        🌐 {t("language", lang)}
      </div>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 7, width: "100%",
          padding: "8px 12px", borderRadius: 10, cursor: "pointer",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", fontSize: 12, fontWeight: 600, justifyContent: "space-between",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span>{current.flag} {current.native}</span>
        <span style={{ opacity: 0.5, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% - 10px)", left: 12, right: 12,
          background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
          boxShadow: "0 -12px 40px rgba(0,0,0,0.2)", zIndex: 999,
          maxHeight: 260, overflowY: "auto", padding: 6,
        }}>
          {LANGUAGES.map(l => (
            <div
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px", borderRadius: 9, cursor: "pointer",
                background: lang === l.code ? "#f0f7f0" : "transparent",
              }}
              onMouseEnter={e => { if (lang !== l.code) (e.currentTarget as HTMLElement).style.background = "#f9f9f9"; }}
              onMouseLeave={e => { if (lang !== l.code) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{l.flag}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a2e1a" }}>{l.native}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{l.label}</div>
              </div>
              {lang === l.code && <span style={{ marginLeft: "auto", color: "#2d6b30" }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function LogoutButton({ lang }: { lang: string }) {
  const router = useRouter();
  const labels: Record<string, string> = {
    en:"🚪 Logout", hi:"🚪 लॉगआउट", mr:"🚪 लॉगआउट", pa:"🚪 ਲੌਗਆਉਟ",
    gu:"🚪 લૉગ આઉટ", ta:"🚪 வெளியேறு", te:"🚪 లాగ్‌అవుట్",
    kn:"🚪 ಲಾಗ್‌ಔಟ್", bn:"🚪 লগআউট", ar:"🚪 تسجيل الخروج",
  };
  return (
    <div
      onClick={() => router.push("/")}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: 12, marginBottom: 2,
        fontSize: 13, color: "rgba(255,100,100,0.75)", cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,80,80,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fc8181"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,100,100,0.75)"; }}
    >
      <span style={{ fontSize: 16 }}>🚪</span>
      {labels[lang] || labels.en}
    </div>
  );
}

function FarmerSidebar() {
  const path = usePathname();
  const { lang } = useLang();

  return (
    <aside style={{ width: 240, background: "#1e4620", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌾</div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>GrainOS</span>
      </div>

      {/* Farmer profile */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#3a7d35,#a3c45c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👨‍🌾</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Ramesh Patil</div>
          <div style={{ display: "inline-flex", background: "rgba(163,196,92,0.15)", border: "1px solid rgba(163,196,92,0.3)", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: "#a3c45c", fontWeight: 600, marginTop: 2 }}>✅ Govt. Verified</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: 12, position: "relative", zIndex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "8px 8px 4px" }}>Menu</div>
        {NAV_KEYS.map(({ icon, key, href, badge, red }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 12, marginBottom: 2, fontSize: 13,
                fontWeight: active ? 600 : 500,
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                cursor: "pointer", transition: "all 0.2s",
                borderLeft: `3px solid ${active ? "#a3c45c" : "transparent"}`,
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                {t(key, lang)}
                {badge && (
                  <span style={{ marginLeft: "auto", background: red ? "#e53e3e" : "#3a7d35", color: "#fff", borderRadius: 100, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                    {badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", padding: "14px 8px 4px" }}>Account</div>
        {[
          { icon: "⚙️", key: "settings", href: "/farmer/settings" },
        ].map(({ icon, key, href }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, marginBottom: 2, fontSize: 13, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>
              <span>{icon}</span>{t(key, lang)}
            </div>
          </Link>
        ))}
        <LogoutButton lang={lang} />
      </nav>

      {/* Language Switcher */}
      <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <LanguageSwitcher />
      </div>

      {/* Help box */}
      <div style={{ padding: "12px 16px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Need Help?</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 10 }}>Our agri-experts are available 24/7 in your language.</div>
          <button style={{ width: "100%", padding: 8, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>📞 Call Support</button>
        </div>
      </div>
    </aside>
  );
}

function FarmerLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4ec", fontFamily: "'DM Sans', sans-serif" }}>
      <FarmerSidebar />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#1e4620", padding: "8px 32px", display: "flex", alignItems: "center", gap: 32, overflow: "hidden" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#a3c45c", letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>Live Prices</span>
          <div style={{ display: "flex", gap: 24, animation: "tickerScroll 22s linear infinite" }}>
            {[...TICKER, ...TICKER].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{item.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{item.price}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.up ? "#a3c45c" : "#fc8181" }}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.3s ease; }
        a { text-decoration: none; }
      `}</style>
    </div>
  );
}

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <FarmerLayoutInner>{children}</FarmerLayoutInner>
    </LanguageProvider>
  );
}
