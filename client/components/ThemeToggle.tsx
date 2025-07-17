import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Get theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("data-theme") as "light" | "dark";
    const initialTheme = storedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("data-theme", newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <motion.div
        key={theme}\n        initial={{ y: -20, opacity: 0, rotate: -90 }}\n        animate={{ y: 0, opacity: 1, rotate: 0 }}\n        exit={{ y: 20, opacity: 0, rotate: 90 }}\n        transition={{ duration: 0.2 }}\n        className="w-5 h-5 text-foreground"\n      >\n        {theme === "dark" ? (\n          <Sun className="w-5 h-5" />\n        ) : (\n          <Moon className="w-5 h-5" />\n        )}\n      </motion.div>\n    </motion.button>\n  );\n}