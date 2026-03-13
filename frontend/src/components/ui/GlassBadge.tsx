interface GlassBadgeProps { label: string; verified?: boolean; }
export default function GlassBadge({ label, verified }: GlassBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${verified ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-600"}`}>
      {verified && "✅"} {label}
    </span>
  );
}