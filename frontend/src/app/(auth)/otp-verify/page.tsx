"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SecurityRow from "@/components/auth/SecurityRow";

const OTP_LENGTH = 6;

function OtpVerifyContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "farmer";
  const dashboardPath = role === "industry" ? "/dashboard" : "/farmer/dashboard";

  const [otp,   setOtp]   = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const filled = otp.filter(Boolean).length;

  return (
    <AuthCard
      leftTag="Verification"
      leftHeadline={<>Secure & <span className="text-[#a3c45c]">verified</span> every step</>}
      leftDesc="Government-backed verification ensures every farmer and buyer on GrainOS is legitimate."
    >
      <div className="verified-badge mb-4">🔐 OTP Verification</div>

      <p className="text-2xl font-semibold text-green-950 mb-1"
       style={{ fontFamily: "'Playfair Display', serif" }}>
        Check your phone
      </p>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        We sent a 6-digit code to{" "}
        <strong className="text-green-900">+91 98765 43210</strong>.<br />
        Valid for 10 minutes.
      </p>

      {/* OTP Boxes */}
      <div className="flex gap-2 justify-center mb-5">
        {otp.map((val, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            className={`otp-box ${val ? "otp-box-filled" : ""}`}
            maxLength={1}
            value={val}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            inputMode="numeric"
          />
        ))}
      </div>

      {/* Resend */}
      <p className="text-center text-xs text-gray-400 mb-5">
        {timer > 0 ? (
          <>Resend in <strong className="text-green-700">{timer}s</strong></>
        ) : (
          <button onClick={() => setTimer(30)}
            className="text-green-700 font-semibold hover:underline">
            Resend OTP
          </button>
        )}
      </p>

      <Link href={filled === OTP_LENGTH ? dashboardPath : "#"}>
        <button
          className="btn-green"
          style={{ opacity: filled < OTP_LENGTH ? 0.55 : 1 }}
          disabled={filled < OTP_LENGTH}
        >
          {filled < OTP_LENGTH
            ? `Enter ${OTP_LENGTH - filled} more digit${OTP_LENGTH - filled !== 1 ? "s" : ""}`
            : "Verify & Continue →"}
        </button>
      </Link>

      <SecurityRow />
      <p className="text-center text-xs text-gray-400 mt-4">
        Wrong number?{" "}
        <Link href="/register" className="text-green-700 font-semibold hover:underline">
          Go back
        </Link>
      </p>
    </AuthCard>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>Loading...</div>}>
      <OtpVerifyContent />
    </Suspense>
  );
}