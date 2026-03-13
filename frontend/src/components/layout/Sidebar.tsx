interface SidebarProps { role: "farmer" | "industry" | "admin"; }
export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen backdrop-blur-md bg-white/20 border-r border-white/30 p-6">
      <p className="text-sm text-gray-500 uppercase mb-4">{role}</p>
      {/* TODO: Dynamic nav links per role */}
    </aside>
  );
}