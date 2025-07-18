import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for text elements
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Heading component
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  animate?: boolean;
  letterAnimation?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      as: Component = "h2",
      size = "lg",
      weight = "semibold",
      animate = false,
      letterAnimation = false,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    };

    const weightClasses = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    const classes = cn(
      "leading-tight tracking-tight",
      sizeClasses[size],
      weightClasses[weight],
      className,
    );

    // Animation temporarily disabled for TypeScript compatibility
    // Letter animation is also disabled
    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);
Heading.displayName = "Heading";

// Text component
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?:
    | "default"
    | "muted"
    | "subtle"
    | "primary"
    | "success"
    | "warning"
    | "danger";
  animate?: boolean;
}

const Text = React.forwardRef<any, TextProps>(
  (
    {
      className,
      as: Component = "p",
      size = "md",
      weight = "normal",
      color = "default",
      animate = false,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    };

    const weightClasses = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    const colorClasses = {
      default: "text-foreground",
      muted: "text-muted-foreground",
      subtle: "text-muted-foreground/80",
      primary: "text-primary",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      danger: "text-red-600 dark:text-red-400",
    };

    const classes = cn(
      "leading-relaxed",
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className,
    );

    // Animation temporarily disabled for TypeScript compatibility
    return <Component ref={ref} className={classes} {...props} />;
  },
);
Text.displayName = "Text";

// Gradient text component
interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  gradient?: "primary" | "secondary" | "custom";
  customGradient?: string;
  animate?: boolean;
}

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
  (
    {
      className,
      gradient = "primary",
      customGradient,
      animate = false,
      ...props
    },
    ref,
  ) => {
    const gradientClasses = {
      primary: "bg-gradient-primary",
      secondary: "bg-gradient-to-r from-primary to-accent",
      custom: "",
    };

    const style = customGradient ? { background: customGradient } : undefined;

    const classes = cn(
      "bg-clip-text text-transparent",
      gradient !== "custom" && gradientClasses[gradient],
      className,
    );

    // Animation temporarily disabled for TypeScript compatibility
    return <span ref={ref} className={classes} style={style} {...props} />;
  },
);
GradientText.displayName = "GradientText";

export { Heading, Text, GradientText };
