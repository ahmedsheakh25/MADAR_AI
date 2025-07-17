import { useTranslation as useI18nTranslation } from "react-i18next";

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

export function useTranslation() {
  const { t: i18nT, i18n } = useI18nTranslation();

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    try {
      return i18nT(key, params);
    } catch (error) {
      console.warn(
        `Translation key "${key}" not found for language "${i18n.language}"`,
      );
      return key;
    }
  };

  return { t, i18n };
}
