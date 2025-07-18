import { useState, useEffect } from "react";
import {
  ChevronUp,
  Plus,
  ArrowUp,
  MoreHorizontal,
  Grid,
  Image,
  LogOut,
  Trash2,
  Bookmark,
  Wand2,
  ZoomIn,
  Download,
  Home as HomeIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  StyleCard,
  ColorPicker,
  Slider,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "../components/design-system";
import { Hero211 } from "../components/hero/Hero211";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useNavigation } from "../components/navigation/hooks/useNavigation";
import { useOnceUITheme } from "../hooks/use-once-ui-theme";
import { useTranslation } from "../hooks/use-translation";
import { useAuth } from "../hooks/use-auth";

export default function Home() {
  const { theme } = useOnceUITheme();
  const { t } = useTranslation();
  const { navigateToPath } = useNavigation();
  const { user, signOut, isDevMode } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-inter">
      {/* Background gradient for dark/light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />
      <div className="w-full max-w-[1440px] h-[1024px] flex items-center justify-center p-8">
        {/* Main Content Area - Hero Section */}
        <div className="flex flex-col items-center justify-center flex-1 self-stretch rounded-[20px] border border-border bg-card shadow-lg">
          {/* Header with Navigation */}
          <div className="absolute top-8 right-8 flex items-center gap-4 z-10">
            {/* Page Navigation Buttons */}
            <motion.button
              onClick={() => navigateToPath({ path: "/" })}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("common.navigation.home")}
            >
              <HomeIcon className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => navigateToPath({ path: "/generator" })}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("common.navigation.generator")}
            >
              <Grid className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            <motion.button
              onClick={() => navigateToPath({ path: "/gallery" })}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("common.navigation.gallery")}
            >
              <Image className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            {/* Language and Theme Toggles */}
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Three Dots Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && (
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("common.buttons.signOut")}
                  </DropdownMenuItem>
                )}
                {!user && (
                  <DropdownMenuItem
                    onClick={() => navigateToPath({ path: "/login" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("common.buttons.signIn")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hero Section */}
          <div className="hero-wrapper w-full h-full">
            <Hero211 />
          </div>
        </div>
      </div>
    </div>
  );
}
