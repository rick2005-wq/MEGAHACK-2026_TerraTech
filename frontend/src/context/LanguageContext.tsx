"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
  lang: string;
  setLang: (l: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("grainos_lang");
    if (saved) setLangState(saved);
  }, []);

  const setLang = (l: string) => {
    setLangState(l);
    localStorage.setItem("grainos_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
