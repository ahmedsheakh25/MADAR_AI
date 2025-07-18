import * as React from "react";
import { useLocation } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dock,
  DockIcon,
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/design-system";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavItems } from "./NavItems";
import { useNavigation } from "./hooks/useNavigation";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import { extractLanguageFromPath } from "@/lib/routing";

const DockNavigation = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navItems = useNavItems();
  const { navigateToPath, isCurrentPath } = useNavigation();

  // Extract path without language for hiding dock
  const { pathWithoutLang } = extractLanguageFromPath(location.pathname);

  // Hide dock on login pages
  if (
    pathWithoutLang === "/login" ||
    pathWithoutLang === "/signup" ||
    pathWithoutLang === "/forgot-password"
  ) {
    return null;
  }

  // Mock authentication state - replace with actual auth logic
  const isAuthenticated = false;

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Logout logic
      console.log("Logging out...");
      // Implement actual logout
    } else {
      // Navigate to login
      navigateToPath({ path: "/login" });
    }
  };

  const authButtonContent = (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={handleAuthAction}
          className="relative p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={
            isAuthenticated
              ? t("common.buttons.signOut")
              : t("common.buttons.signIn")
          }
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isAuthenticated ? (
              <LogOut className="h-4 w-4 text-red-600" />
            ) : (
              <LogIn className="h-4 w-4 text-primary" />
            )}
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>
          {isAuthenticated
            ? t("common.buttons.signOut")
            : t("common.buttons.signIn")}
        </p>
      </TooltipContent>
    </Tooltip>
  );

  const navigationItems = navItems.map((item) => (
    <Tooltip key={item.id}>
      <TooltipTrigger asChild>
        <motion.button
          onClick={() =>
            navigateToPath({
              path: item.path,
              requiresAuth: item.requiresAuth,
            })
          }
          className={`relative p-2 rounded-lg bg-background/50 backdrop-blur-sm border transition-all duration-200 ${
            isCurrentPath(item.path)
              ? "border-primary bg-primary/20"
              : "border-border hover:border-primary/50"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={item.label}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <item.icon
              className={`h-4 w-4 ${isCurrentPath(item.path) ? "text-primary" : "text-foreground"}`}
            />
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  ));

  const separatorElement = <Separator className="mx-1" />;

  // Language/Theme switcher section
  const languageThemeSection = (
    <>
      <LanguageSwitcher />
      <ThemeToggle />
    </>
  );

  // Determine order based on RTL/LTR
  const isRTL = language === "ar";

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-[90vw] flex flex-col justify-start items-start">
      <Dock
        direction="bottom"
        className="bg-background/90 backdrop-blur-lg border border-border/50 shadow-2xl px-1 sm:px-2 py-1"
        iconSize={32}
        iconMagnification={40}
      >
        {isRTL ? (
          <>
            {authButtonContent}
            {separatorElement}
            {navigationItems}
            {separatorElement}
            {languageThemeSection}
          </>
        ) : (
          <>
            {languageThemeSection}
            {separatorElement}
            {navigationItems}
            {separatorElement}
            {authButtonContent}
          </>
        )}
      </Dock>
    </div>
  );
};

export default DockNavigation;
