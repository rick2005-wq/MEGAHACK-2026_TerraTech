import { ReactNode } from "react";
interface GlassModalProps { isOpen: boolean; onClose: () => void; children: ReactNode; title?: string; }
export default function GlassModal({ isOpen, onClose, children, title }: GlassModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-6 w-full max-w-lg shadow-glass">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-800">Close</button>
      </div>
    </div>
  );
}