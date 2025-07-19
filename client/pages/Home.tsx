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
import { useLanguage } from "../hooks/use-language";
import { useAuth } from "../hooks/use-auth";

export default function Home() {
  const { theme } = useOnceUITheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { navigateToPath } = useNavigation();
  const { user, signOut, isDevMode } = useAuth();

  return (
    <div className="min-h-screen bg-background font-inter relative overflow-x-hidden">
      {/* Background gradient with animated mesh */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/10 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header Navigation - Fixed at top with improved design */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 ${isRTL ? "rtl" : "ltr"}`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div
            className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {/* Logo Section */}
            <motion.div
              className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={
                  theme === "dark"
                    ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fefbd0a6b9abd446c96eb7f1fea4c67bf?format=webp&width=800"
                    : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc39b14bbc4d54ee390a9493467c086d1?format=webp&width=800"
                }
                alt={t("brand.name") || "Madar Logo"}
                className="h-8 w-auto object-contain"
              />
              <div
                className={`hidden sm:block ${isRTL ? "text-right" : "text-left"}`}
              >
                <h1
                  className="text-lg font-bold text-foreground"
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-heading-en)",
                  }}
                >
                  {t("brand.name")}
                </h1>
              </div>
            </motion.div>

            {/* Navigation Actions */}
            <div
              className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {/* Main Navigation */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={() => navigateToPath({ path: "/" })}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t("common.navigation.home")}
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigateToPath({ path: "/generator" })}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-muted transition-all duration-300 shadow-sm border border-border/50"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("common.navigation.generator")}
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigateToPath({ path: "/gallery" })}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-muted transition-all duration-300 shadow-sm border border-border/50"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("common.navigation.gallery")}
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Language and Theme Controls */}
              <div className="hidden sm:flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="p-2 rounded-lg bg-card hover:bg-muted transition-all duration-300 border border-border/50 md:hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuItem
                    onClick={() => navigateToPath({ path: "/generator" })}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    {t("common.navigation.generator")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigateToPath({ path: "/gallery" })}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    {t("common.navigation.gallery")}
                  </DropdownMenuItem>
                  <div className="sm:hidden border-t border-border/50 mt-1 pt-1">
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                  {user ? (
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("common.buttons.signOut")}
                    </DropdownMenuItem>
                  ) : (
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
          </div>
        </div>
      </motion.header>

      {/* Scrollable Main Content */}
      <main className="pt-20 pb-32 md:pb-28">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <motion.div
              className="w-full max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative">
                {/* Glassmorphism container */}
                <div className="relative bg-card/30 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

                  {/* Hero Content */}
                  <div className="relative z-10 p-6 sm:p-8 md:p-12">
                    <Hero211 />
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar" ? "لماذا مدار؟" : "Why Madar?"}
              </h2>
              <p
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar"
                  ? "أدوات احترافية لتوليد الصور ثلاثية الأبعاد بالذكاء الاصطناعي، مصممة خصيصاً للمبدعين العرب"
                  : "Professional AI-powered 3D image generation tools, designed specifically for Arabic creators"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎨",
                  titleAr: "إبداع بلا حدود",
                  titleEn: "Unlimited Creativity",
                  descAr: "حوّل أي فكرة إلى تصميم ثلاثي الأبعاد مذهل",
                  descEn: "Transform any idea into stunning 3D designs",
                },
                {
                  icon: "⚡",
                  titleAr: "سرعة فائقة",
                  titleEn: "Lightning Fast",
                  descAr: "احصل على تصاميمك في دقائق معدودة",
                  descEn: "Get your designs ready in minutes",
                },
                {
                  icon: "🆓",
                  titleAr: "مجاني تماماً",
                  titleEn: "Completely Free",
                  descAr: "30 صورة شهرياً بدون أي تكلفة",
                  descEn: "30 images per month at no cost",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3
                      className="text-xl font-semibold text-foreground mb-3"
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                            : "var(--font-heading-en)",
                      }}
                    >
                      {language === "ar" ? feature.titleAr : feature.titleEn}
                    </h3>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                            : "var(--font-body-en)",
                      }}
                    >
                      {language === "ar" ? feature.descAr : feature.descEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 border border-border/50"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar"
                  ? "جاهز لبدء الإبداع؟"
                  : "Ready to Start Creating?"}
              </h2>
              <p
                className="text-xl text-muted-foreground mb-8"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar"
                  ? "انضم إلى آلاف المصممين الذين يستخدمون مدار لإنشاء تصاميم استثنائية"
                  : "Join thousands of designers using Madar to create exceptional designs"}
              </p>
              <motion.button
                onClick={() =>
                  navigateToPath({ path: user ? "/generator" : "/login" })
                }
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar" ? "ابدأ الآن مجاناً" : "Start Creating Free"}
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer Section - Required for Google Verification */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border backdrop-blur-lg z-20 max-h-32 md:max-h-24 overflow-y-auto"
        dir={isRTL ? "rtl" : "ltr"}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 md:py-6">
          {/* Simplified Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex flex-col items-center gap-3">
              {/* Logo and Title */}
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <img
                  src={
                    theme === "dark"
                      ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fefbd0a6b9abd446c96eb7f1fea4c67bf?format=webp&width=800"
                      : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc39b14bbc4d54ee390a9493467c086d1?format=webp&width=800"
                  }
                  alt={t("brand.name") || "Madar Logo"}
                  className="h-8 w-auto object-contain"
                />
                <span
                  className="text-sm font-semibold text-foreground"
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-body-en)",
                  }}
                >
                  {t("common.footer.projectName")}
                </span>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-4 text-xs">
                <motion.button
                  onClick={() => navigateToPath({ path: "/privacy" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-body-en)",
                  }}
                >
                  {t("common.footer.privacy")}
                </motion.button>
                <span className="text-border">•</span>
                <motion.button
                  onClick={() => navigateToPath({ path: "/terms" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-body-en)",
                  }}
                >
                  {t("common.footer.terms")}
                </motion.button>
                <span className="text-border">•</span>
                <a
                  href="mailto:ahmed.sheakh25@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-body-en)",
                  }}
                >
                  {t("common.footer.contact")}
                </a>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <span
                  className="text-xs text-muted-foreground"
                  style={{
                    fontFamily:
                      language === "ar"
                        ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                        : "var(--font-body-en)",
                  }}
                >
                  {t("common.footer.copyright")}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div
              className={`flex items-center justify-between gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {/* Left Section - Logo and Description */}
              <motion.div
                className={`flex items-center gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
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
                    alt={t("brand.name") || "Madar Logo"}
                    className="h-10 lg:h-12 w-auto object-contain"
                  />
                </motion.div>

                {/* Project Description */}
                <div
                  className={`max-w-md ${isRTL ? "text-right" : "text-left"}`}
                >
                  <h3
                    className="text-sm font-semibold text-foreground mb-1"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.projectName")} -{" "}
                    {t("common.footer.projectSubtitle")}
                  </h3>
                  <p
                    className="text-xs text-muted-foreground leading-relaxed"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.descriptionFull")}.
                    <strong className="text-primary">
                      {" "}
                      {t("common.footer.freeWithGoogle")}
                    </strong>
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
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.privacy")}
                  </motion.button>
                  <span className="text-border">•</span>
                  <motion.button
                    onClick={() => navigateToPath({ path: "/terms" })}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.terms")}
                  </motion.button>
                  <span className="text-border">•</span>
                  <a
                    href="mailto:ahmed.sheakh25@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.contact")}
                  </a>
                </div>
              </motion.div>

              {/* Right Section - Company Info */}
              <motion.div
                className={`${isRTL ? "text-left" : "text-right"}`}
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="space-y-1">
                  <p
                    className="text-xs font-medium text-foreground"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {t("common.footer.companyName")}
                  </p>
                  <div
                    className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    <span>{t("common.footer.copyright").split("•")[0]}•</span>
                    <a
                      href="https://www.madar.ofspace.studio"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      madar.ofspace.studio
                    </a>
                    <span>✨</span>
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
