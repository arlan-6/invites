"use client";

import { translations } from "@/data/translations";
import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type Language = "en" | "kk" | "ru";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = "kk";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Ensure this hook is only used on the client side
  if (typeof window === "undefined") {
    return null; // Prevent rendering on the server
  }

  const [language, setLanguage] = useLocalStorage<Language>("app-language", defaultLanguage);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split("-")[0] as Language;
    const supportedLangs: Language[] = ["en", "kk", "ru"];

    if (supportedLangs.includes(browserLang) && !localStorage.getItem("app-language")) {
      setLanguage(browserLang);
    }
  }, [setLanguage]);

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || `${key} ${language}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};