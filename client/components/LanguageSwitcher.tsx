import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar";
    setLanguage(newLanguage);

    // Get current path without language prefix
    const currentPath = location.pathname.replace(/^\/[a-z]{2}/, "") || "/";
    // Navigate to the same path but with new language prefix
    navigate(`/${newLanguage}${currentPath}`, { replace: true });
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${language === "ar" ? "English" : "Arabic"} language`}
    >
      <motion.div
        key={language}
        initial={{ y: -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 20, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-5 text-xl flex items-center justify-center"
      >
        {language === "ar" ? "🇺🇸" : "🇵🇸"}
      </motion.div>
    </motion.button>
  );
}
