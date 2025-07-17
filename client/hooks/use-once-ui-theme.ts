import { useEffect, useState } from "react";

export type OnceUITheme = "light" | "dark";

export function useOnceUITheme() {
  const [theme, setTheme] = useState<OnceUITheme>("dark");

  useEffect(() => {
    // Get theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("data-theme") as OnceUITheme;
    const initialTheme = storedTheme || "dark";
    setTheme(initialTheme);

    // Apply theme to document
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: OnceUITheme) => {
    const root = document.documentElement;

    // Set Once UI theme attribute
    root.setAttribute("data-theme", newTheme);

    // Update CSS custom properties for existing components
    if (newTheme === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "0 0% 10%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "0 0% 10%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "0 0% 10%");
      root.style.setProperty("--primary", "264 100% 50%");
      root.style.setProperty("--primary-foreground", "0 0% 100%");
      root.style.setProperty("--secondary", "0 0% 96%");
      root.style.setProperty("--secondary-foreground", "0 0% 9%");
      root.style.setProperty("--muted", "0 0% 96%");
      root.style.setProperty("--muted-foreground", "0 0% 45%");
      root.style.setProperty("--accent", "0 0% 96%");
      root.style.setProperty("--accent-foreground", "0 0% 9%");
      root.style.setProperty("--destructive", "0 84% 60%");
      root.style.setProperty("--destructive-foreground", "0 0% 100%");
      root.style.setProperty("--border", "0 0% 90%");
      root.style.setProperty("--input", "0 0% 90%");
      root.style.setProperty("--ring", "264 100% 50%");
    } else {
      // Dark theme (original values)
      root.style.setProperty("--background", "0 0% 2%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "0 0% 6%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--popover", "0 0% 6%");
      root.style.setProperty("--popover-foreground", "210 40% 98%");
      root.style.setProperty("--primary", "264 100% 50%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "217.2 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      root.style.setProperty("--muted", "217.2 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215 20.2% 65.1%");
      root.style.setProperty("--accent", "264 100% 50%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--border", "217.2 32.6% 17.5%");
      root.style.setProperty("--input", "217.2 32.6% 17.5%");
      root.style.setProperty("--ring", "264 100% 50%");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("data-theme", newTheme);
  };

  const setThemeDirectly = (newTheme: OnceUITheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("data-theme", newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeDirectly,
    isDark: theme === "dark",
  };
}
