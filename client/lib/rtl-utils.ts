import { type Language } from "@/hooks/use-language";

/**
 * RTL utility functions for handling directional layouts
 */

export function getDirectionalValue<T>(
  language: Language,
  ltrValue: T,
  rtlValue: T,
): T {
  return language === "ar" ? rtlValue : ltrValue;
}

export function getDirectionalClassName(
  language: Language,
  ltrClass: string,
  rtlClass: string,
): string {
  return language === "ar" ? rtlClass : ltrClass;
}

export function getTextDirection(language: Language): "ltr" | "rtl" {
  return language === "ar" ? "rtl" : "ltr";
}

export function getFlexDirection(
  language: Language,
  baseDirection: "row" | "row-reverse" | "col" | "col-reverse",
): string {
  if (language === "ar" && baseDirection === "row") {
    return "row-reverse";
  }
  if (language === "ar" && baseDirection === "row-reverse") {
    return "row";
  }
  return baseDirection;
}

/**
 * Helper to get appropriate margin classes for directional spacing
 */
export function getDirectionalMargin(
  language: Language,
  side: "start" | "end",
  size: string,
): string {
  const prefix = side === "start" ? "ms" : "me";
  return `${prefix}-${size}`;
}

/**
 * Helper to get appropriate padding classes for directional spacing
 */
export function getDirectionalPadding(
  language: Language,
  side: "start" | "end",
  size: string,
): string {
  const prefix = side === "start" ? "ps" : "pe";
  return `${prefix}-${size}`;
}

/**
 * Helper to get appropriate positioning classes for directional layouts
 */
export function getDirectionalPosition(
  language: Language,
  side: "start" | "end",
  value: string,
): string {
  const property = side === "start" ? "start" : "end";
  return `${property}-${value}`;
}

/**
 * Helper to determine if an icon should be flipped in RTL
 */
export function shouldFlipIcon(iconType: "directional" | "neutral"): boolean {
  return iconType === "directional";
}

/**
 * Get the appropriate font family based on language
 */
export function getFontFamily(
  language: Language,
  type: "heading" | "body",
): string {
  if (language === "ar") {
    return "var(--font-arabic)";
  }

  if (type === "heading") {
    return "var(--font-heading-en)";
  }

  return "var(--font-body-en)";
}
