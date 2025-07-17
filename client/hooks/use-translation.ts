import { useLanguage } from "./use-language";
import enTranslations from "../locales/en.json";
import arTranslations from "../locales/ar.json";

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

interface Translation {
  [key: string]: string | Translation;
}

const translations = {
  en: enTranslations as Translation,
  ar: arTranslations as Translation,
};

function getNestedValue(obj: Translation, path: TranslationKey): string {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return current[key] as any;
    }
    return undefined;
  }, obj) as string;
}

function interpolateParams(text: string, params: TranslationParams): string {
  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
    text,
  );
}

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const translation = getNestedValue(translations[language], key);

    if (!translation) {
      console.warn(
        `Translation key "${key}" not found for language "${language}"`,
      );
      return key;
    }

    if (params) {
      return interpolateParams(translation, params);
    }

    return translation;
  };

  return { t };
}
