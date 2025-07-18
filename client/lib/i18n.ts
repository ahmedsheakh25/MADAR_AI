import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enCommon from "../locales/en/common.json";
import arCommon from "../locales/ar/common.json";

export const defaultNS = "common";
export const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ar", // Default language
    fallbackLng: "ar", // Fallback language
    defaultNS,
    ns: ["common"],

    resources,

    detection: {
      // Detection options
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "language",
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false, // Avoid suspense for SSR compatibility
    },
  });

export default i18n;
