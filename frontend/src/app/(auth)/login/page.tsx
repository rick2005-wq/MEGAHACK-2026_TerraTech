"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import AadhaarInput from "@/components/auth/AadhaarInput";
import ConsentBox from "@/components/auth/ConsentBox";
import SecurityRow from "@/components/auth/SecurityRow";

type Role   = "farmer" | "industry";
type Method = "phone" | "password" | "aadhaar";

export default function LoginPage() {
  const router = useRouter();
  const [role,    setRole]    = useState<Role>("farmer");
  const [method,  setMethod]  = useState<Method>("phone");
  const [aadhaar, setAadhaar] = useState("");
  const [consent, setConsent] = useState(false);

  const dashboardPath = role === "industry" ? "/dashboard" : "/farmer/dashboard";

  function handlePasswordLogin() {
    // TODO: validate credentials, then redirect
    router.push(dashboardPath);
  }

  function handleAadhaarLogin() {
    // TODO: validate aadhaar, then redirect
    router.push(dashboardPath);
  }

  const aadhaarReady = aadhaar.length === 12 && consent;

  return (
    <AuthCard
      leftTag="Secure Login"
      leftHeadline={<>Sell your harvest at the <span className="text-[#a3c45c]">right price</span></>}
      leftDesc="Login with Phone OTP, Password, or Aadhaar eKYC — your choice."
    >
      <p className="text-2xl font-semibold text-green-950 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}>
        Welcome back
      </p>
      <p className="text-sm text-gray-400 mb-5">Sign in to your GrainOS account</p>

      {/* Role */}
      <div className="flex gap-2 mb-4">
        {(["farmer", "industry"] as Role[]).map(r => (
          <button key={r} onClick={() => setRole(r)}
            className={`role-btn ${role === r ? "role-btn-active" : ""}`}>
            <span className="block text-base mb-0.5">{r === "farmer" ? "🌾" : "🏭"}</span>
            {r === "farmer" ? "Farmer" : "Industry"}
          </button>
        ))}
      </div>

      {/* Method */}
      <div className="flex gap-2 mb-5">
        {([
          ["phone",    "📱", "Phone OTP"],
          ["password", "🔒", "Password"],
          ["aadhaar",  "🪪", "Aadhaar"],
        ] as const).map(([m, icon, label]) => (
          <button key={m} onClick={() => setMethod(m)}
            className={`method-tab ${method === m ? "method-tab-active" : ""}`}>
            <span className="text-lg">{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* Phone OTP */}
      {method === "phone" && (
        <div className="fade-in">
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">📱</span>
              <input className="grain-input" type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>
          <Link href={`/otp-verify?role=${role}`}>
            <button className="btn-green">Send OTP →</button>
          </Link>
        </div>
      )}

      {/* Password */}
      {method === "password" && (
        <div className="fade-in">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">📱</span>
              <input className="grain-input" type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔒</span>
              <input className="grain-input" type="password" placeholder="••••••••" />
            </div>
          </div>
          <button className="btn-green" onClick={handlePasswordLogin}>Sign In →</button>
        </div>
      )}

      {/* Aadhaar */}
      {method === "aadhaar" && (
        <div className="fade-in">
          <div className="aadhaar-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: "linear-gradient(135deg,#e67e22,#f39c12)" }}>🪪</div>
              <div>
                <p className="text-xs font-bold text-amber-900">Aadhaar eKYC Login</p>
                <p className="text-[10px] text-amber-700">Powered by UIDAI · Govt. of India</p>
              </div>
            </div>
            <div className="aadhaar-badge">🔒 DigiLocker Verified</div>
            <AadhaarInput value={aadhaar} onChange={setAadhaar} />
            <p className="flex gap-1 text-[11px] text-amber-900 mt-2 leading-relaxed">
              <span>ℹ️</span>
              <span>Your Aadhaar number is never stored. We only fetch your name, address &amp; verified status via UIDAI API.</span>
            </p>
          </div>
          <ConsentBox checked={consent} onChange={setConsent} id="login-consent" />
          <button className="btn-amber" style={{ opacity: aadhaarReady ? 1 : 0.5 }}
            disabled={!aadhaarReady} onClick={handleAadhaarLogin}>
            🪪 Verify with Aadhaar →
          </button>
        </div>
      )}

      <SecurityRow />
      <p className="text-center text-xs text-gray-400 mt-4">
        No account?{" "}
        <Link href="/register" className="text-green-700 font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}