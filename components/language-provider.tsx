"use client"

import { translations } from "@/data/translations"
import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type Language = "en" | "kk" | "ru"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const defaultLanguage: Language = "en"

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split("-")[0] as Language
    const supportedLangs: Language[] = ["en", 'kk', 'ru']

    if (supportedLangs.includes(browserLang)) {
      setLanguage(browserLang)
    }
  }, [])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || `${key} ${language}`
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

