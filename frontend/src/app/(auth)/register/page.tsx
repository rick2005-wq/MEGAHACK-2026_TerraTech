"use client";
import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import AadhaarInput from "@/components/auth/AadhaarInput";
import ConsentBox from "@/components/auth/ConsentBox";
import SecurityRow from "@/components/auth/SecurityRow";

type Role   = "farmer" | "industry";
type Method = "phone" | "aadhaar";

export default function RegisterPage() {
  const [role,    setRole]    = useState<Role>("farmer");
  const [method,  setMethod]  = useState<Method>("phone");
  const [aadhaar, setAadhaar] = useState("");
  const [consent, setConsent] = useState(false);

  const aadhaarReady = aadhaar.length === 12 && consent;

  return (
    <AuthCard
      leftTag="New Account"
      leftHeadline={<>India's largest <span className="text-[#a3c45c]">agri network</span></>}
      leftDesc="Register with Aadhaar for an instant Government Verified badge — farmers trust verified sellers more."
    >
      <p className="text-2xl font-semibold text-green-950 mb-1"
       style={{ fontFamily: "'Playfair Display', serif" }}>
        Join GrainOS
      </p>
      <p className="text-sm text-gray-400 mb-5">No middlemen, full transparency — start free</p>

      {/* Role */}
      <div className="flex gap-2 mb-4">
        {(["farmer", "industry"] as Role[]).map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`role-btn ${role === r ? "role-btn-active" : ""}`}>
            <span className="block text-base mb-0.5">{r === "farmer" ? "🌾" : "🏭"}</span>
            {r === "farmer" ? "I'm a Farmer" : "I'm a Buyer"}
          </button>
        ))}
      </div>

      {/* Method */}
      <div className="flex gap-2 mb-5">
        {([
          ["phone",   "📱", "Phone + OTP"],
          ["aadhaar", "🪪", "Aadhaar eKYC"],
        ] as const).map(([m, icon, label]) => (
          <button key={m} onClick={() => setMethod(m)}
            className={`method-tab ${method === m ? "method-tab-active" : ""}`}>
            <span className="text-lg">{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* Phone */}
      {method === "phone" && (
        <div className="fade-in">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {([["First Name","👤","Ramesh"],["Last Name","👤","Kumar"]] as const).map(([label, icon, ph]) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">{icon}</span>
                  <input className="grain-input" type="text" placeholder={ph} />
                </div>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">📱</span>
              <input className="grain-input" type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>
          {role === "farmer" && (
            <div className="mb-4 fade-in">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Village / District</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">📍</span>
                <input className="grain-input" type="text" placeholder="Nashik, Maharashtra" />
              </div>
            </div>
          )}
          {role === "industry" && (
            <div className="mb-4 fade-in">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Company Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🏭</span>
                <input className="grain-input" type="text" placeholder="AgroFoods Pvt Ltd" />
              </div>
            </div>
          )}
          <Link href="/otp-verify">
            <button className="btn-green">Continue with OTP →</button>
          </Link>
        </div>
      )}

      {/* Aadhaar */}
      {method === "aadhaar" && (
        <div className="fade-in">
          <div className="govt-strip">
            <span>🏛️</span>
            <span>Get an instant <strong>Govt. Verified</strong> badge on your profile</span>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.15)", color: "#a3c45c", border: "1px solid rgba(163,196,92,0.4)" }}>
              INSTANT
            </span>
          </div>
          <div className="aadhaar-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: "linear-gradient(135deg,#e67e22,#f39c12)" }}>🪪</div>
              <div>
                <p className="text-xs font-bold text-amber-900">Aadhaar eKYC Registration</p>
                <p className="text-[10px] text-amber-700">Auto-fills name, address &amp; photo · UIDAI API</p>
              </div>
            </div>
            <div className="aadhaar-badge">✅ Skip manual document upload</div>
            <AadhaarInput value={aadhaar} onChange={setAadhaar} />
            <p className="flex gap-1 text-[11px] text-amber-900 mt-2 leading-relaxed">
              <span>ℹ️</span>
              <span>Your profile is auto-filled from UIDAI. Grants you an instant <strong>Govt. Verified</strong> badge.</span>
            </p>
          </div>
          {role === "industry" && (
            <div className="mb-3 fade-in">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Company Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🏭</span>
                <input className="grain-input" type="text" placeholder="AgroFoods Pvt Ltd" />
              </div>
            </div>
          )}
          <ConsentBox checked={consent} onChange={setConsent} id="register-consent" />
          <Link href={aadhaarReady ? "/otp-verify" : "#"}>
            <button className="btn-amber" style={{ opacity: aadhaarReady ? 1 : 0.5 }}
              disabled={!aadhaarReady}>
              🪪 Verify &amp; Create Account →
            </button>
          </Link>
        </div>
      )}

      <SecurityRow />
      <p className="text-center text-xs text-gray-400 mt-4">
        Have an account?{" "}
        <Link href="/login" className="text-green-700 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthCard>
  );
}