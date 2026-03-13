"use client";

const FEATURES = [
  { icon: "🌾", bg: "#f0f7f0", title: "Direct Produce Listing",  desc: "Farmers list crops with images, prices, quantities and harvest dates. No commission, no cuts." },
  { icon: "📋", bg: "#fff8e6", title: "Smart Tender System",      desc: "Industries float tenders with budgets and deadlines. AI matches the best farmers automatically." },
  { icon: "🤖", bg: "#f0f4ff", title: "AI Language Translation",  desc: "Real-time multilingual chat so farmers and buyers speak freely in their native language." },
  { icon: "🏛️", bg: "#f9f0ff", title: "Aadhaar Verification",     desc: "Government-backed eKYC via UIDAI. Every farmer and buyer is verified before trading." },
  { icon: "💬", bg: "#f0faf5", title: "Real-time Chat",            desc: "Direct negotiations between farmers and industries. No middlemen in the conversation." },
  { icon: "📊", bg: "#fff0f0", title: "Analytics Dashboard",       desc: "Track transactions, monitor produce prices, and get insights on market trends." },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-24 px-12"
      style={{ background: "linear-gradient(180deg, #f6f9f0 0%, #fff 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "#f6f9f0", border: "1px solid rgba(45,107,48,0.15)", color: "#2d6b30" }}
          >
            ✦ Platform Features
          </div>
          <h2
            className="font-semibold text-green-950 leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 42 }}
          >
            Everything you need to <span style={{ color: "#a3c45c" }}>trade directly</span>
          </h2>
          <p className="text-base text-gray-500 leading-relaxed max-w-[500px] mx-auto">
            Built specifically for India's agri supply chain — from small farmers to large food manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {FEATURES.map(({ icon, bg, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ background: "#fff", border: "1px solid rgba(30,70,20,0.07)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(30,70,20,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(163,196,92,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,70,20,0.07)";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <h3
                className="text-lg font-semibold text-green-950 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
