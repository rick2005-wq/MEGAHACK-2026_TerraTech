"use client";
import { ChangeEvent } from "react";

interface AadhaarInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function AadhaarInput({ value, onChange }: AadhaarInputProps) {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const g1 = digits.slice(0, 4) || "····";
  const g2 = digits.slice(4, 8) || "····";
  const g3 = digits.slice(8, 12) || "····";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, "").slice(0, 12));
  };

  return (
    <div>
      {/* Visual digit groups */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {[g1, g2, g3].map((g, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-amber-900 tracking-widest text-center"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #f0c040", minWidth: 52 }}
            >
              {g}
            </span>
            {i < 2 && <span className="text-amber-400 font-bold text-lg">–</span>}
          </span>
        ))}
      </div>

      {/* Actual input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50">🪪</span>
        <input
          className="aadhaar-input"
          type="tel"
          maxLength={14}
          placeholder="Enter 12-digit Aadhaar number"
          value={digits.replace(/(\d{4})(?=\d)/g, "$1 ")}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
