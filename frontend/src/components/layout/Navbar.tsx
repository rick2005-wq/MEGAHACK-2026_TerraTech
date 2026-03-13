import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="backdrop-blur-md bg-white/20 border-b border-white/30 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-grain-700">🌾 GrainOS</Link>
      <div className="flex gap-4">
        <Link href="/login" className="text-grain-600 hover:text-grain-800">Login</Link>
        <Link href="/register" className="bg-grain-500 text-white px-4 py-1.5 rounded-xl">Sign Up</Link>
      </div>
    </nav>
  );
}