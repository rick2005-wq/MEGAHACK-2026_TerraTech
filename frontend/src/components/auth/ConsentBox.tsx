"use client";
interface ConsentBoxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}
export default function ConsentBox({ checked, onChange, id }: ConsentBoxProps) {
  return (
    <div className="consent-box">
      <input
        type="checkbox" id={id} checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 accent-green-700 cursor-pointer shrink-0"
      />
      <label htmlFor={id} className="text-xs text-gray-500 leading-relaxed cursor-pointer">
        I consent to GrainOS fetching my details from UIDAI for verification. View our{" "}
        <span className="text-green-700 font-semibold cursor-pointer">Privacy Policy</span> and{" "}
        <span className="text-green-700 font-semibold cursor-pointer">Data Terms</span>.
      </label>
    </div>
  );
}
