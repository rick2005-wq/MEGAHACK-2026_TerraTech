import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(135deg, #e8f0e3 0%, #f5f7f2 40%, #edf3e8 100%)" }} />
      <div className="fixed -z-10 w-[600px] h-[600px] rounded-full -top-40 -left-40"
        style={{ background: "radial-gradient(circle, rgba(74,124,62,0.12) 0%, transparent 70%)" }} />
      <div className="fixed -z-10 w-[500px] h-[500px] rounded-full -bottom-24 -right-24"
        style={{ background: "radial-gradient(circle, rgba(163,196,92,0.1) 0%, transparent 70%)" }} />
      <div className="fixed -z-10 w-[300px] h-[300px] rounded-full"
        style={{ top: "50%", left: "60%", background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
      <div className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#2d5a27 1px, transparent 1px), linear-gradient(90deg, #2d5a27 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

      {children}
    </div>
  );
}
