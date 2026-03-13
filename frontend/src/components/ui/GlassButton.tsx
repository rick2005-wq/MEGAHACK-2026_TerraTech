interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}
export default function GlassButton({ children, variant = "primary", className = "", ...props }: GlassButtonProps) {
  const base = "px-4 py-2 rounded-xl font-medium transition-all duration-200";
  const variants = {
    primary: "bg-grain-500 text-white hover:bg-grain-600",
    ghost: "backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}