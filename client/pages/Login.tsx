"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useOnceUITheme } from "@/hooks/use-once-ui-theme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Heading, Text } from "@/components/design-system/Typography";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

export default function Login() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { theme: onceTheme } = useOnceUITheme();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Debug font loading
  React.useEffect(() => {
    if (language === "ar") {
      document.fonts.ready.then(() => {
        console.log("Fonts loaded, checking Arabic fonts...");
        if (document.fonts.check('1em "IBM Plex Sans Arabic"')) {
          console.log("✅ IBM Plex Sans Arabic is available");
        } else {
          console.log("❌ IBM Plex Sans Arabic is NOT available");
        }
        if (document.fonts.check('1em "Noto Sans Arabic"')) {
          console.log("✅ Noto Sans Arabic is available");
        } else {
          console.log("❌ Noto Sans Arabic is NOT available");
        }
      });
    }
  }, [language]);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Google OAuth logic would go here
    setTimeout(() => {
      setIsLoading(false);
      console.log(isSignUp ? "Google sign up" : "Google sign in");
    }, 2000);
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className={`flex flex-col w-full min-h-screen bg-background text-foreground relative ${
        language === "ar" ? "font-arabic" : "font-body"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        fontFamily:
          language === "ar" ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif" : "var(--font-body-en)",
      }}
    >
      {/* Transparent Navigation */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-50 flex justify-end items-center p-6 bg-transparent"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </motion.nav>

      <div className="flex flex-1">
        {/* Left Panel - Sign In Form */}
        <div className="flex w-full lg:w-[640px] flex-col items-center justify-center px-4 lg:px-40 py-8 bg-background">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <motion.div
              className="flex flex-col items-center justify-center max-w-[400px] w-auto bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg self-center"
              variants={itemVariants}
              style={{
                height: "auto",
                flexGrow: "0",
                padding: "36px",
              }}
            >
              {/* Logo */}
              <motion.div className="mb-10" variants={logoVariants}>
                <motion.img
                  src={
                    onceTheme === "dark"
                      ? "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fefbd0a6b9abd446c96eb7f1fea4c67bf?format=webp&width=800"
                      : "https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc39b14bbc4d54ee390a9493467c086d1?format=webp&width=800"
                  }
                  alt={t("brand.name") || "Madaar Logo"}
                  className="w-[230px] h-auto object-contain"
                  style={{ aspectRatio: "230/117.19" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Animated Shiny Text */}
              <motion.div
                className="z-10 flex min-h-16 items-center justify-center mb-6 w-auto self-stretch"
                variants={itemVariants}
              >
                <div className="group rounded-full border border-border bg-muted transition-all ease-in hover:cursor-pointer hover:bg-muted/80 w-auto flex-grow">
                  <AnimatedShinyText
                    className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-muted-foreground hover:duration-300 w-auto self-stretch"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    <span
                      className="w-auto self-stretch"
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                            : "var(--font-body-en)",
                        direction: language === "ar" ? "rtl" : "ltr",
                      }}
                    >
                      {isSignUp
                        ? t("pages.signup.freeText") ||
                          (language === "ar"
                            ? "خدمة مجانية لمجتمع المصممين العرب ✨"
                            : "✨ Free For Arabic designers Community")
                        : t("pages.login.freeText") ||
                          (language === "ar"
                            ? "خدمة مجانية لمجتمع المصممين العرب ✨"
                            : "✨ Free For Arabic designers Community")}
                    </span>
                    <ArrowRightIcon
                      className={`ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 ${isRTL ? "rotate-180" : ""}`}
                    />
                  </AnimatedShinyText>
                </div>
              </motion.div>

              {/* Title */}
              <motion.div className="mb-10" variants={itemVariants}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSignUp ? "signup" : "signin"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heading
                      as="h1"
                      size="3xl"
                      weight="normal"
                      className="text-center"
                      style={{
                        fontFamily:
                          language === "ar"
                            ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                            : "var(--font-heading-en)",
                        direction: language === "ar" ? "rtl" : "ltr",
                        fontSize: language === "ar" ? "28px" : "30px",
                        lineHeight: language === "ar" ? "34px" : "36px",
                        letterSpacing: language === "ar" ? "0" : "-0.75px",
                      }}
                    >
                      {isSignUp
                        ? t("pages.signup.title") || "Join Madaar"
                        : t("pages.login.title") || "Welcome Back"}
                    </Heading>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Auth Options */}
              <motion.div
                className="flex flex-col items-center gap-6 w-full max-w-[320px]"
                variants={itemVariants}
              >
                {/* Google Auth Button */}
                <motion.button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="flex w-[320px] h-[44px] px-5 py-2 justify-center items-center gap-2 rounded-[10px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed border border-border bg-card hover:bg-muted text-card-foreground"
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <motion.img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/1147e8965e9d996efd722b8f68d7a52c3847b3d6?width=48"
                      alt="Google"
                      className="w-6 h-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        isLoading ? "loading" : isSignUp ? "signup" : "signin"
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text
                        as="span"
                        size="sm"
                        weight="semibold"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                              : "var(--font-body-en)",
                          direction: language === "ar" ? "rtl" : "ltr",
                          fontSize: "14px",
                          lineHeight: "20px",
                          letterSpacing: language === "ar" ? "0" : "-0.28px",
                        }}
                      >
                        {isLoading
                          ? isSignUp
                            ? t("common.buttons.signingUp") || "Signing up..."
                            : t("common.buttons.signingIn") || "Signing in..."
                          : isSignUp
                            ? t("common.buttons.signUpWithGoogle") ||
                              "Sign up with Google"
                            : t("common.buttons.loginWithGoogle") ||
                              "Sign in with Google"}
                      </Text>
                    </motion.div>
                  </AnimatePresence>
                </motion.button>

                {/* Toggle Auth Mode Text */}
                <motion.div
                  className="flex flex-col items-center gap-2"
                  variants={itemVariants}
                >
                  <Text
                    as="p"
                    size="xs"
                    weight="medium"
                    color="muted"
                    className="text-center"
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "var(--font-arabic)"
                          : "var(--font-body-en)",
                      direction: language === "ar" ? "rtl" : "ltr",
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: language === "ar" ? "0" : "-0.11px",
                    }}
                  >
                    {isSignUp
                      ? t("common.messages.haveAccount") ||
                        "Already have an account?"
                      : t("common.messages.dontHaveAccount") ||
                        "Don't have an account?"}
                  </Text>

                  <motion.button
                    onClick={toggleAuthMode}
                    className="hover:underline transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isSignUp ? "signin" : "signup"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Text
                          as="span"
                          size="xs"
                          weight="semibold"
                          color="primary"
                          className="text-center"
                          style={{
                            fontFamily:
                              language === "ar"
                                ? "var(--font-arabic)"
                                : "var(--font-body-en)",
                            direction: language === "ar" ? "rtl" : "ltr",
                            fontSize: "12px",
                            lineHeight: "16px",
                            letterSpacing: language === "ar" ? "0" : "-0.11px",
                          }}
                        >
                          {isSignUp
                            ? t("common.buttons.signIn") || "Sign in"
                            : t("common.buttons.createAccount") ||
                              "Create new account"}
                        </Text>
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </MagicCard>
        </div>

        {/* Right Panel - AI Generated Image */}
        <motion.div
          className="hidden lg:flex flex-1 relative rounded-[12px] overflow-hidden"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          {/* Background Image with Gradient Overlay */}
          <motion.div
            className="w-full h-full relative"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            style={{
              background:
                "url(https://cdn.builder.io/api/v1/image/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fc553c5e529344e66b3f0e5fbd4a790c4)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Volume Icon */}
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M13 4.22585C13 3.20697 11.8465 2.6161 11.0196 3.21143L6.08529 6.76415C5.87255 6.91732 5.61705 6.99973 5.35491 6.99973H3.75C2.23122 6.99973 1 8.23095 1 9.74973V14.2497C1 15.7685 2.23122 16.9997 3.75 16.9997H5.35491C5.61705 16.9997 5.87255 17.0821 6.08529 17.2353L11.0196 20.788C11.8465 21.3834 13 20.7925 13 19.7736V4.22585Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M18.7175 4.22138C19.0104 3.92849 19.4852 3.92849 19.7781 4.22138C21.7679 6.21117 23 8.96219 23 11.9996C23 15.0369 21.7679 17.7879 19.7781 19.7777C19.4852 20.0706 19.0104 20.0706 18.7175 19.7777C18.4246 19.4848 18.4246 19.01 18.7175 18.7171C20.4375 16.9971 21.5 14.6231 21.5 11.9996C21.5 9.37599 20.4375 7.00202 18.7175 5.28204C18.4246 4.98915 18.4246 4.51427 18.7175 4.22138Z"
                  fill="#FCFCFC"
                />
                <path
                  d="M16.4194 7.58075C16.1265 7.28786 15.6516 7.28786 15.3587 7.58075C15.0658 7.87365 15.0658 8.34852 15.3587 8.64141C16.2191 9.50182 16.75 10.6883 16.75 12.0002C16.75 13.3121 16.2191 14.4985 15.3587 15.3589C15.0658 15.6518 15.0658 16.1267 15.3587 16.4196C15.6516 16.7125 16.1265 16.7125 16.4194 16.4196C17.5496 15.2894 18.25 13.7259 18.25 12.0002C18.25 10.2745 17.5496 8.71096 16.4194 7.58075Z"
                  fill="#FCFCFC"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
