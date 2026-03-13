"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthCardProps {
  leftTag: string;
  leftHeadline: ReactNode;
  leftDesc: string;
  children: ReactNode;
}

const TABS = [
  { label: "Login",      href: "/login" },
  { label: "Register",   href: "/register" },
  { label: "Verify OTP", href: "/otp-verify" },
];

const STATS = [
  { num: "50K+",  label: "Farmers" },
  { num: "2K+",   label: "Industries" },
  { num: "₹12Cr", label: "Traded" },
];

export default function AuthCard({ leftTag, leftHeadline, leftDesc, children }: AuthCardProps) {
  const path = usePathname();

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div
        className="flex flex-col lg:flex-row w-full max-w-[940px] min-h-[600px] rounded-[28px] overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(30,70,20,0.15), 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        {/* ── Left Panel ── */}
        <div
          className="lg:w-[42%] w-full p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1e4620 0%, #2d6b30 50%, #3a7d35 100%)" }}
        >
          {/* dot pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              🌾
            </div>
            <div>
              <div
                className="text-white font-bold text-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                GrainOS
              </div>
              <div className="text-white/50 text-[10px] tracking-widest">AGRI MARKETPLACE</div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
            <span
              className="inline-flex text-[10px] font-medium tracking-[1px] uppercase text-white/70 px-3 py-1 rounded-full mb-5 w-fit"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              ✦ {leftTag}
            </span>
            <h2
              className="text-[28px] font-semibold text-white leading-snug mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {leftHeadline}
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">{leftDesc}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 relative z-10">
            {STATS.map(({ num, label }) => (
              <div key={label}>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {num}
                </div>
                <div className="text-[10px] text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Decorative circles */}
          <div
            className="absolute -bottom-14 -right-14 w-56 h-56 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="absolute inset-8 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Extra circle top right */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 bg-white/75 backdrop-blur-xl px-8 lg:px-11 py-10 flex flex-col justify-center overflow-y-auto">
          {/* Tab bar */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-6"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            {TABS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="tab-btn"
                style={path === href ? {
                  background: "#fff",
                  color: "#14532d",
                  fontWeight: 600,
                  borderRadius: "9px",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.1)",
                  flex: 1,
                  padding: "8px 4px",
                  textAlign: "center",
                  fontSize: "13px",
                  display: "block",
                } : {
                  flex: 1,
                  padding: "8px 4px",
                  textAlign: "center",
                  fontSize: "13px",
                  display: "block",
                  color: "#9ca3af",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}