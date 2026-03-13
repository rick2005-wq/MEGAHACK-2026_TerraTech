interface StatsWidgetProps { label: string; value: string | number; icon?: string; }
export default function StatsWidget({ label, value, icon }: StatsWidgetProps) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1">{icon} {value}</p>
    </div>
  );
}