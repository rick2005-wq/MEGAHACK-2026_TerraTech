import { ReactNode } from "react";
interface GlassCardProps { children: ReactNode; className?: string; }
export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-glass ${className}`}>
      {children}
    </div>
  );
}