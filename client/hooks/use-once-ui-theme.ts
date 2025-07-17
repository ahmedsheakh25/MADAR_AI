import { useEffect, useState } from "react";

export type OnceUITheme = "light" | "dark";

export function useOnceUITheme() {
  const [theme, setTheme] = useState<OnceUITheme>("dark");

  useEffect(() => {
    // Get theme from localStorage or detect system preference
    const storedTheme = localStorage.getItem("data-theme") as OnceUITheme;
    let initialTheme: OnceUITheme;

    if (storedTheme) {
      initialTheme = storedTheme;
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark" : "light";
    }

    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("data-theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const applyTheme = (newTheme: OnceUITheme) => {
    const root = document.documentElement;

    // Set Once UI theme attribute
    root.setAttribute("data-theme", newTheme);

    // Update CSS custom properties for existing components
    if (newTheme === "light") {
      // Light theme with proper contrast ratios
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--primary", "264 100% 50%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "210 40% 96%");
      root.style.setProperty("--secondary-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--muted", "210 40% 96%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
      root.style.setProperty("--accent", "210 40% 96%");
      root.style.setProperty("--accent-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--border", "214.3 31.8% 91.4%");
      root.style.setProperty("--input", "214.3 31.8% 91.4%");
      root.style.setProperty("--ring", "264 100% 50%");

      // Light theme specific glass effects
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.6)");
      root.style.setProperty("--glass-border", "rgba(0, 0, 0, 0.1)");

      // Update body background for light theme
      document.body.style.background = "radial-gradient(ellipse at top, hsl(264, 100%, 95%) 0%, hsl(0, 0%, 100%) 50%)";
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

      // Dark theme specific glass effects
      root.style.setProperty("--glass-bg", "rgba(0, 0, 0, 0.4)");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.1)");

      // Update body background for dark theme
      document.body.style.background = "radial-gradient(ellipse at top, hsl(264, 100%, 10%) 0%, hsl(0, 0%, 2%) 50%)";
    }

    // Trigger a custom event for components that need to react to theme changes
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { theme: newTheme } 
    }));
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
    isLight: theme === "light",
  };
}
