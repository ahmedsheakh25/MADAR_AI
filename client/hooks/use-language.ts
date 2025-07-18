import { useState, useEffect } from "react";
import i18n from "../lib/i18n";

export type Language = "en" | "ar";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to Arabic
    const stored = localStorage.getItem("language") as Language;
    return stored && ["en", "ar"].includes(stored) ? stored : "ar";
  });

  useEffect(() => {
    // Update document attributes
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );

    // Store preference
    localStorage.setItem("language", language);

    // Update i18next language
    i18n.changeLanguage(language);
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    // i18next will be updated via useEffect
  };

  const setLanguageDirectly = (lang: Language) => {
    setLanguage(lang);
  };

  return {
    language,
    isRTL: language === "ar",
    toggleLanguage,
    setLanguage: setLanguageDirectly,
  };
}
