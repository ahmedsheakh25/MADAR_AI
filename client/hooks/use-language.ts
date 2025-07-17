import { useState, useEffect } from "react";

export type Language = "en" | "ar";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to Arabic since the app is primarily Arabic
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
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
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
