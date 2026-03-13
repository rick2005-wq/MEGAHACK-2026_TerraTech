"use client";
import { useState, useEffect } from "react";
export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <button onClick={() => setDark(!dark)} className="p-2 rounded-full">{dark ? "☀️" : "🌙"}</button>;
}