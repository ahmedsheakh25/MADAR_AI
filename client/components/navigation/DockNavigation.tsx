import * as React from "react";
import { useLocation } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
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

const DockNavigation = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navItems = useNavItems();
  const { navigateToPath, isCurrentPath } = useNavigation();

  // Hide dock on login page
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password"
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
    <DockIcon
      className={`bg-background border-2 ${isAuthenticated ? "border-red-500 hover:bg-red-50" : "border-primary hover:bg-primary/10"}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAuthAction}
            className="w-full h-full"
          >
            {isAuthenticated ? (
              <LogOut className="h-4 w-4 text-red-600" />
            ) : (
              <LogIn className="h-4 w-4 text-primary" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>
            {isAuthenticated
              ? t("common.buttons.signOut")
              : t("common.buttons.signIn")}
          </p>
        </TooltipContent>
      </Tooltip>
    </DockIcon>
  );

  const navigationItems = navItems.map((item) => (
    <DockIcon
      key={item.id}
      className={`bg-background border-2 ${
        isCurrentPath(item.path)
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-accent"
      }`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigateToPath({
                path: item.path,
                requiresAuth: item.requiresAuth,
              })
            }
            className="w-full h-full"
          >
            <item.icon
              className={`h-4 w-4 ${isCurrentPath(item.path) ? "text-primary" : "text-foreground"}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </DockIcon>
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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Dock
        direction="bottom"
        className="bg-background/90 backdrop-blur-lg border border-border/50 shadow-2xl px-2 py-1"
        iconSize={36}
        iconMagnification={48}
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
