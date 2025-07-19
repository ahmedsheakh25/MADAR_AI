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
        <div className="flex flex-col items-center justify-center flex-1 self-stretch rounded-[20px] border border-border bg-card shadow-lg relative">
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

      {/* Enhanced Footer Section - Required for Google Verification */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border backdrop-blur-lg z-20"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-6">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Section - Logo and Description */}
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6"
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
                  className="h-12 w-auto object-contain"
                />
              </motion.div>

              {/* Project Description */}
              <div className="text-center lg:text-left max-w-md">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Madar (مدار) - Free Creative AI Playground
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI-powered 3D image generation for designers. Upload, choose a
                  style, get beautiful PNGs.
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
              className="text-center lg:text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">
                  OfSpace Studio
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Hosted on:</span>
                  <a
                    href="https://www.madar.ofspace.studio"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    madar.ofspace.studio
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Made for Arabic designers</span>
                  <span className="text-primary">✨</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            className="mt-4 pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span>© 2024 OfSpace Studio. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                30 Free Images/Month
              </span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                Google OAuth Verified
              </span>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
