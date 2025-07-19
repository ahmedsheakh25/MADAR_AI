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
    <div className="min-h-screen bg-background font-inter">
      {/* Background gradient for dark/light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />

      {/* Project Description Header - Required for Google Verification */}
      <motion.div
        className="w-full bg-card/50 border-b border-border backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Madar (مدار) - Your Free Creative AI Playground
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              <strong>Madar (مدار)</strong> is a creative tool that lets you
              generate AI-powered 3D image assets to use in your designs. Upload
              an image, choose a 3D style, and get beautiful cutout PNGs for{" "}
              <strong>100% free</strong>. Madar is made for designers and
              creators who want to experiment with visual ideas quickly. All
              your results are saved to your private gallery after signing in
              with your Google account.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Hosted on:</span>
              <a
                href="https://www.madar.ofspace.studio"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.madar.ofspace.studio
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-[1440px] h-[1024px] flex items-center justify-center p-8 mx-auto">
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

      {/* Footer Section - Required for Google Verification */}
      <motion.footer
        className="w-full bg-card/50 border-t border-border backdrop-blur-sm mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Contact Us
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>OfSpace Studio</strong>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:ahmed.sheakh25@gmail.com"
                    className="text-primary hover:underline"
                  >
                    ahmed.sheakh25@gmail.com
                  </a>
                </p>
                <p>
                  Support:{" "}
                  <a
                    href="mailto:support@ofspace.studio"
                    className="text-primary hover:underline"
                  >
                    support@ofspace.studio
                  </a>
                </p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Legal</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <motion.button
                    onClick={() => navigateToPath({ path: "/privacy" })}
                    className="text-primary hover:underline transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Privacy Policy
                  </motion.button>
                </div>
                <div>
                  <motion.button
                    onClick={() => navigateToPath({ path: "/terms" })}
                    className="text-primary hover:underline transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Terms of Service
                  </motion.button>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                About Madar
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Free AI-powered 3D image generation for the Arabic creative
                  community.
                </p>
                <p>Generate 30 images per month - completely free.</p>
                <p>Sign in with Google to save your creations.</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>© 2024 OfSpace Studio. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Made for Arabic designers</span>
                <span>•</span>
                <span>100% Free</span>
                <span>•</span>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
