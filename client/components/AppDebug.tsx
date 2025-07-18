import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "../hooks/use-translation";
import { useLanguage } from "../hooks/use-language";
import { useOnceUITheme } from "../hooks/use-once-ui-theme";

export function AppDebug() {
  const [mounted, setMounted] = useState(false);
  const { user, isDevMode } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { theme } = useOnceUITheme();

  useEffect(() => {
    setMounted(true);
    console.log("✅ App Debug: Component mounted successfully");
    console.log("✅ Auth System:", isDevMode ? "Dev Mode" : "Production Mode");
    console.log(
      "✅ User Status:",
      user ? "Authenticated" : "Not authenticated",
    );
    console.log("✅ Language:", language);
    console.log("✅ Theme:", theme);
  }, [user, isDevMode, language, theme]);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs">
        Mounting...
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded text-xs space-y-1 max-w-xs">
      <div>✅ App: Running</div>
      <div>🔐 Auth: {user ? "Signed In" : "Signed Out"}</div>
      <div>🌍 Lang: {language}</div>
      <div>🎨 Theme: {theme}</div>
      <div>🔧 Mode: {isDevMode ? "Dev" : "Prod"}</div>
    </div>
  );
}
