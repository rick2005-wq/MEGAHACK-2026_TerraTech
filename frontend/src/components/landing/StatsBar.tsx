"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = target / 60;
          const t = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(t); }
            else setCount(Math.floor(current));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const STATS = [
  { num: 50000, suffix: "+",      label: "Verified Farmers" },
  { num: 2000,  suffix: "+",      label: "Food Industries" },
  { num: 12,    suffix: " Cr+",   label: "₹ Volume Traded" },
  { num: 18,    suffix: " States", label: "Across India" },
];

export default function StatsBar() {
  return (
    <section style={{ background: "#1e4620", padding: "48px" }}>
      <div
        className="max-w-[1200px] mx-auto grid"
        style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr", gap: 32, alignItems: "center" }}
      >
        {STATS.map(({ num, suffix, label }, i) => (
          <>
            <div key={label} className="text-center">
              <div
                className="font-bold text-white leading-none"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 42 }}
              >
                <Counter target={num} suffix={suffix} />
              </div>
              <div className="text-xs mt-2 tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>
                {label}
              </div>
            </div>
            {i < 3 && (
              <div key={`div-${i}`} style={{ width: 1, height: 48, background: "rgba(255,255,255,0.1)" }} />
            )}
          </>
        ))}
      </div>
    </section>
  );
}
