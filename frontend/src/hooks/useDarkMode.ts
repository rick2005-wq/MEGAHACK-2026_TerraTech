import { useState, useEffect } from "react";
export function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return { dark, toggleDark: () => setDark(d => !d) };
}