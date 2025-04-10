"use client";

import { translations } from "@/data/translations"; // Ensure this path is correct
import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type Language = "en" | "kk" | "ru";

// Define the structure for variables used in interpolation
type TranslationVariables = Record<string, string | number>;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  // Update the signature of t to accept optional variables
  t: (key: string, variables?: TranslationVariables) => string;
};

const defaultLanguage: Language = "kk";

// Update default context to match the new signature
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  // Provide a default t that handles optional variables minimally
  t: (key, variables?) => {
      let value = key; // Default to key if not found
      if (variables) {
        // Simple placeholder replacement for the default context (or make more robust)
        Object.keys(variables).forEach(varKey => {
            value = value.replace(`{${varKey}}`, String(variables[varKey]));
        });
      }
      return `${value} ${defaultLanguage}`; // Append language in default fallback
  }
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Ensure this hook is only used on the client side
  if (typeof window === "undefined") {
     // Render children directly on the server with default context?
     // Or return null if the whole subtree depends on client-side language.
     // Returning null means nothing renders initially server-side.
    // return null;
    // If you want SSR with default lang, wrap children in the default context:
     return <LanguageContext.Provider value={{
       language: defaultLanguage,
       setLanguage: () => {},
       t: (key, variables?) => {
         let value = key;
         if (variables) {
           Object.keys(variables).forEach(varKey => {
             value = value.replace(`{${varKey}}`, String(variables[varKey]));
           });
         }
         return `${value} ${defaultLanguage}`;
       }
     }}>
              {children}
            </LanguageContext.Provider>;
     // Note: The default context will just show keys + lang name if used server-side
  }

  // ---- Client-side execution from here ----
  const [language, setLanguage] = useLocalStorage<Language>("app-language", defaultLanguage);

  useEffect(() => {
    // This effect only runs on the client
    const browserLang = navigator.language.split("-")[0] as Language;
    const supportedLangs: Language[] = ["en", "kk", "ru"];
    const storedLang = localStorage.getItem("app-language"); // Check storage directly

    if (!storedLang && supportedLangs.includes(browserLang)) {
      setLanguage(browserLang);
    }
    // Note: No need for localStorage check in useLocalStorage dependency array
    // Check removed: !localStorage.getItem("app-language") -> storedLang used instead
  }, [setLanguage]); // setLanguage identity is stable

  // The actual translation and interpolation function
  const t = (key: string, variables?: TranslationVariables): string => {
    // Get the raw translation string
    const rawString = translations[language]?.[key as keyof (typeof translations)[typeof language]] || null;

    if (rawString === null) {
      console.warn(`Translation key "${key}" not found for language "${language}".`);
      // Fallback: Return key possibly with placeholders for easier debugging
      let fallback = key;
        if (variables) {
            Object.keys(variables).forEach(varKey => {
                fallback = fallback.replace(`{${varKey}}`, String(variables[varKey]));
            });
        }
      return fallback;
    }

    // If no variables, return the raw string
    if (!variables) {
      return rawString;
    }

    // Perform interpolation
    let interpolatedString = rawString;
    Object.keys(variables).forEach((varKey) => {
      const regex = new RegExp(`\\{${varKey}\\}`, "g"); // Need to escape {}
      interpolatedString = interpolatedString.replace(regex, String(variables[varKey]));
    });

    return interpolatedString;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};