interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export default function GlassInput({ label, className = "", ...props }: GlassInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input className={`backdrop-blur-sm bg-white/30 border border-white/40 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-grain-500 ${className}`} {...props} />
    </div>
  );
}