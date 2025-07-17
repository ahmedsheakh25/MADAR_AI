import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Dropdown, Flex, Text } from "@once-ui-system/core";
import { useLanguage, type Language } from "@/hooks/use-language";

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const languages: LanguageOption[] = [
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "en", label: "English", nativeLabel: "English" },
];

export function LanguageSwitcherOnceUI() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Dropdown>
        <Button variant="secondary" size="sm" as="trigger" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage?.nativeLabel}
          </span>
        </Button>

        <Dropdown.Menu align="end">
          {languages.map((lang) => (
            <motion.div
              key={lang.code}
              whileHover={{ backgroundColor: "rgba(138, 43, 226, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <Dropdown.Item
                onClick={() => setLanguage(lang.code)}
                className={`cursor-pointer ${
                  language === lang.code ? "bg-accent" : ""
                }`}
              >
                <Flex direction="column">
                  <Text weight="medium">{lang.nativeLabel}</Text>
                  <Text size="xs" className="text-muted-foreground">
                    {lang.label}
                  </Text>
                </Flex>
              </Dropdown.Item>
            </motion.div>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </motion.div>
  );
}
