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
    <div className="min-h-screen bg-background font-inter relative overflow-x-hidden">
      {/* Background gradient for dark/light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />

      {/* Main Container with proper spacing for footer */}
      <div className="min-h-screen pb-32 md:pb-24 flex flex-col">
        {/* Header Navigation - Fixed at top */}
        <motion.div
          className="fixed top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 md:gap-4 z-50 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border/50 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page Navigation Buttons */}
          <motion.button
            onClick={() => navigateToPath({ path: "/" })}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("common.navigation.home")}
          >
            <HomeIcon className="w-3 h-3 md:w-4 md:h-4" />
          </motion.button>

          <motion.button
            onClick={() => navigateToPath({ path: "/generator" })}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("common.navigation.generator")}
          >
            <Grid className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={() => navigateToPath({ path: "/gallery" })}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("common.navigation.gallery")}
          >
            <Image className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
          </motion.button>

          {/* Language and Theme Toggles */}
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Three Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              {/* Mobile-only theme and language controls */}
              <div className="sm:hidden">
                <div className="px-2 py-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </div>

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
        </motion.div>

        {/* Main Content Area - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              className="w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col items-center justify-center rounded-2xl md:rounded-[20px] border border-border bg-card/50 backdrop-blur-sm shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Hero Section with proper z-index */}
              <div className="hero-wrapper w-full h-full relative z-10">
                <Hero211 />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer Section - Required for Google Verification */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border backdrop-blur-lg z-20 max-h-32 md:max-h-24 overflow-y-auto"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 md:py-6">
          {/* Simplified Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex flex-col items-center gap-3">
              {/* Logo and Title */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    theme === "dark"
                      ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fefbd0a6b9abd446c96eb7f1fea4c67bf?format=webp&width=800"
                      : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc39b14bbc4d54ee390a9493467c086d1?format=webp&width=800"
                  }
                  alt="Madar Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-sm font-semibold text-foreground">
                  Madar (مدار)
                </span>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-4 text-xs">
                <motion.button
                  onClick={() => navigateToPath({ path: "/privacy" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Privacy
                </motion.button>
                <span className="text-border">•</span>
                <motion.button
                  onClick={() => navigateToPath({ path: "/terms" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Terms
                </motion.button>
                <span className="text-border">•</span>
                <a
                  href="mailto:ahmed.sheakh25@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  © 2024 OfSpace Studio
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between gap-6">
              {/* Left Section - Logo and Description */}
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={
                      theme === "dark"
                        ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fefbd0a6b9abd446c96eb7f1fea4c67bf?format=webp&width=800"
                        : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc39b14bbc4d54ee390a9493467c086d1?format=webp&width=800"
                    }
                    alt="Madar Logo"
                    className="h-10 lg:h-12 w-auto object-contain"
                  />
                </motion.div>

                {/* Project Description */}
                <div className="max-w-md">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Madar (مدار) - Free Creative AI Playground
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AI-powered 3D image generation for designers.
                    <strong className="text-primary"> 100% free</strong> with
                    Google sign-in.
                  </p>
                </div>
              </motion.div>

              {/* Center Section - Quick Links */}
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-4 text-xs">
                  <motion.button
                    onClick={() => navigateToPath({ path: "/privacy" })}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Privacy
                  </motion.button>
                  <span className="text-border">•</span>
                  <motion.button
                    onClick={() => navigateToPath({ path: "/terms" })}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Terms
                  </motion.button>
                  <span className="text-border">•</span>
                  <a
                    href="mailto:ahmed.sheakh25@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </motion.div>

              {/* Right Section - Company Info */}
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    OfSpace Studio
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>© 2024 • madar.ofspace.studio ✨</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
