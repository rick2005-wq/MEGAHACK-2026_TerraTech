export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
