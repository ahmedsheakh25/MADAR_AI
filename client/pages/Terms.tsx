"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useNavigation } from "@/components/navigation/hooks/useNavigation";
import { Heading, Text } from "@/components/design-system/Typography";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Terms() {
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
            {language === "ar" ? "شروط الخدمة" : "Terms of Service"}
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

          {/* Terms Content */}
          <div className="space-y-6">
            {/* Agreement */}
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
                {language === "ar" ? "الاتفاقية" : "Agreement"}
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
                  ? "بوصولك واستخدامك لخدمة مدار (Madar)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الخدمة."
                  : "By accessing and using Madar's services, you agree to be bound by these Terms of Service. If you do not agree to any of these terms, please do not use our service."}
              </Text>
            </motion.section>

            {/* Service Description */}
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
                {language === "ar" ? "وصف الخدمة" : "Service Description"}
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
                  ? "مدار هي منصة مجانية لتوليد الصور بالذكاء الاصطناعي مخصصة للمجتمع العربي من المصممين والمبدعين. نوفر أدوات لإنشاء صور ثلاثية الأبعاد وبأنماط مختلفة باستخدام تقنيات الذكاء الاصطناعي."
                  : "Madar is a free AI image generation platform designed for the Arabic community of designers and creators. We provide tools to create 3D images and different styles using artificial intelligence technologies."}
              </Text>
            </motion.section>

            {/* Usage Guidelines */}
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
                {language === "ar" ? "إرشادات الاستخدام" : "Usage Guidelines"}
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
                      ? "استخدم الخدمة لأغراض إبداعية ومشروعة فقط"
                      : "Use the service for creative and legitimate purposes only"}
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
                      ? "لا تستخدم الخدمة لإنشاء محتوى مؤذي أو غير قانوني"
                      : "Do not use the service to create harmful or illegal content"}
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
                      ? "احترم حقوق الطبع والنشر للآخرين"
                      : "Respect others' copyrights and intellectual property"}
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
                      ? "لا تحاول تعطيل أو إساءة استخدام النظام"
                      : "Do not attempt to disrupt or misuse the system"}
                  </Text>
                </li>
              </ul>
            </motion.section>

            {/* Generation Limits */}
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
                {language === "ar" ? "حدود الاستخدام" : "Usage Limits"}
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
                      ? "كل مستخدم مسموح له بتوليد 30 صورة شهرياً مجاناً"
                      : "Each user is allowed to generate 30 images per month for free"}
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
                      ? "يتم إعادة تعيين العدد في بداية كل شهر"
                      : "The count resets at the beginning of each month"}
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
                      ? "نحتفظ بالحق في تعديل هذه الحدود"
                      : "We reserve the right to modify these limits"}
                  </Text>
                </li>
              </ul>
            </motion.section>

            {/* Content Ownership */}
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
                {language === "ar" ? "ملكية المحتوى" : "Content Ownership"}
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
                  ? "أنت تحتفظ بحقوق الملكية للصور التي تولدها باستخدام خدمتنا. ومع ذلك، فإنك تمنحنا ترخيصاً لحفظ ومعالجة المحتوى الخاص بك لتوفير الخدمة وتحسينها."
                  : "You retain ownership rights to the images you generate using our service. However, you grant us a license to store and process your content to provide and improve the service."}
              </Text>
            </motion.section>

            {/* Disclaimer */}
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
                {language === "ar" ? "إخلاء المسؤولية" : "Disclaimer"}
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
                  ? "يتم توفير الخدمة 'كما هي' دون أي ضمانات. نحن لا نضمن الدقة أو الجودة أو الملاءمة للغرض المقصود للمحتوى المُولّد. استخدم الخدمة على مسؤوليتك الخاصة."
                  : "The service is provided 'as is' without any warranties. We do not guarantee the accuracy, quality, or fitness for purpose of generated content. Use the service at your own risk."}
              </Text>
            </motion.section>

            {/* Service Availability */}
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
                {language === "ar" ? "توفر الخدمة" : "Service Availability"}
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
                  ? "نسعى لتوفير الخدمة بشكل مستمر، لكننا لا نضمن عدم انقطاعها. قد نحتاج لإيقاف الخدمة مؤقتاً للصيانة أو التحديثات. نحتفظ بالحق في تعديل أو إنهاء الخدمة في أي وقت."
                  : "We strive to provide continuous service, but we do not guarantee uninterrupted availability. We may need to temporarily suspend the service for maintenance or updates. We reserve the right to modify or terminate the service at any time."}
              </Text>
            </motion.section>

            {/* Changes to Terms */}
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
                {language === "ar" ? "تعديل الشروط" : "Changes to Terms"}
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
                  ? "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات المهمة، واستمرار استخدامك للخدمة يعني موافقتك على الشروط المحدثة."
                  : "We reserve the right to modify these terms at any time. You will be notified of significant changes, and your continued use of the service constitutes acceptance of the updated terms."}
              </Text>
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
                  ? "إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى التواصل معنا عبر البريد الإلكتروني:"
                  : "If you have any questions about these Terms of Service, please contact us at:"}{" "}
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
