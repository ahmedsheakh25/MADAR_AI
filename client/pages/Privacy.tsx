"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useNavigation } from "@/components/navigation/hooks/useNavigation";
import { Heading, Text } from "@/components/design-system/Typography";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Privacy() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { navigateToPath } = useNavigation();

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
    },
  };

  return (
    <motion.div
      className={`flex flex-col w-full min-h-screen bg-background text-foreground ${
        language === "ar" ? "font-arabic" : "font-body"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-6 border-b border-border"
        variants={itemVariants}
      >
        <motion.button
          onClick={() => navigateToPath({ path: "/login" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          <Text size="sm">{language === "ar" ? "العودة" : "Back"}</Text>
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1 max-w-4xl mx-auto px-6 py-12"
        variants={itemVariants}
      >
        <motion.div className="space-y-8" variants={itemVariants}>
          {/* Title */}
          <Heading
            as="h1"
            size="4xl"
            weight="bold"
            className="text-center"
            style={{
              fontFamily:
                language === "ar"
                  ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                  : "var(--font-heading-en)",
            }}
          >
            {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
          </Heading>

          <Text
            size="sm"
            color="muted"
            className="text-center"
            style={{
              fontFamily:
                language === "ar"
                  ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                  : "var(--font-body-en)",
            }}
          >
            {language === "ar"
              ? "آخر تحديث: ديسمبر 2024"
              : "Last updated: December 2024"}
          </Text>

          {/* Privacy Content */}
          <div className="space-y-6">
            {/* Introduction */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar" ? "مقدمة" : "Introduction"}
              </Heading>
              <Text
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar"
                  ? "مدار (Madar) ملتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية عند استخدام خدماتنا."
                  : "Madar is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services."}
              </Text>
            </motion.section>

            {/* Information We Collect */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar"
                  ? "المعلومات التي نجمعها"
                  : "Information We Collect"}
              </Heading>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "معلومات Google الأساسية: الاسم، البريد الإلكتروني، والصورة الشخصية"
                      : "Basic Google information: name, email address, and profile picture"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "الصور والنصوص المُرسلة لإنشاء المحتوى"
                      : "Images and text submitted for content generation"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "الصور المُولّدة والمحفوظة في مكتبتك الشخصية"
                      : "Generated images saved in your personal gallery"}
                  </Text>
                </li>
              </ul>
            </motion.section>

            {/* How We Use Information */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar"
                  ? "كيف نستخدم المعلومات"
                  : "How We Use Information"}
              </Heading>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "توفير وتحسين خدمات إنشاء الصور بالذكاء الاصطناعي"
                      : "Provide and improve AI image generation services"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "إدارة حسابك والمصادقة"
                      : "Manage your account and authentication"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "حفظ المحتوى المُولّد في مكتبتك الشخصية"
                      : "Save generated content in your personal gallery"}
                  </Text>
                </li>
              </ul>
            </motion.section>

            {/* Data Security */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar" ? "أمان البيانات" : "Data Security"}
              </Heading>
              <Text
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar"
                  ? "نحن نلتزم بحماية بياناتك باستخدام تقنيات التشفير المتقدمة وممارسات الأمان المعيارية في الصناعة."
                  : "We are committed to protecting your data using advanced encryption technologies and industry-standard security practices."}
              </Text>
            </motion.section>

            {/* Your Rights */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar" ? "حقوقك" : "Your Rights"}
              </Heading>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "الوصول إلى بياناتك الشخصية"
                      : "Access your personal data"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "طلب تصحيح أو حذف بياناتك"
                      : "Request correction or deletion of your data"}
                  </Text>
                </li>
                <li>
                  <Text
                    style={{
                      fontFamily:
                        language === "ar"
                          ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                          : "var(--font-body-en)",
                    }}
                  >
                    {language === "ar"
                      ? "إلغاء حسابك في أي وقت"
                      : "Delete your account at any time"}
                  </Text>
                </li>
              </ul>
            </motion.section>

            {/* Contact */}
            <motion.section variants={itemVariants} className="space-y-4">
              <Heading
                as="h2"
                size="xl"
                weight="semibold"
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-heading-en)",
                }}
              >
                {language === "ar" ? "تواصل معنا" : "Contact Us"}
              </Heading>
              <Text
                style={{
                  fontFamily:
                    language === "ar"
                      ? "IBM Plex Sans Arabic, Noto Sans Arabic, Arial, sans-serif"
                      : "var(--font-body-en)",
                }}
              >
                {language === "ar"
                  ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني:"
                  : "If you have any questions about this Privacy Policy, please contact us at:"}{" "}
                <a
                  href="mailto:ahmed.sheakh25@gmail.com"
                  className="text-primary hover:underline"
                >
                  ahmed.sheakh25@gmail.com
                </a>
              </Text>
            </motion.section>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
