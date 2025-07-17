import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/design-system";
import { useLanguage, type Language } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";

interface LanguageOption {
  code: Language;
  labelKey: string;
  nativeLabel: string;
}

const languages: LanguageOption[] = [
  { code: "ar", labelKey: "common.languages.arabic", nativeLabel: "العربية" },
  { code: "en", labelKey: "common.languages.english", nativeLabel: "English" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentLanguage?.nativeLabel}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <motion.div
              key={lang.code}
              whileHover={{ backgroundColor: "rgba(138, 43, 226, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem
                onClick={() => setLanguage(lang.code)}
                className={`cursor-pointer ${
                  language === lang.code ? "bg-accent" : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeLabel}</span>
                  <span className="text-xs text-muted-foreground">
                    {t(lang.labelKey)}
                  </span>
                </div>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
