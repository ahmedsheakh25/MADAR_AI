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

    if (letterAnimation && typeof children === "string") {
      const letters = children.split("");
      return (
        <motion.div
          className={classes}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              transition={{ delay: index * 0.1 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>
      );
    }

    if (animate) {
      return (
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <Component ref={ref} className={classes} {...props}>
            {children}
          </Component>
        </motion.div>
      );
    }

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  },
);
Heading.displayName = "Heading";

// Text component
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div" | "label";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "accent" | "primary" | "destructive";
  animate?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
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
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
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
      accent: "text-accent-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    };

    const classes = cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className,
    );

    if (animate) {
      return (
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <Component ref={ref} className={classes} {...props} />
        </motion.div>
      );
    }

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

    if (animate) {
      return (
        <motion.span
          ref={ref}
          className={classes}
          style={style}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          {...props}
        />
      );
    }

    return <span ref={ref} className={classes} style={style} {...props} />;
  },
);
GradientText.displayName = "GradientText";

export { Heading, Text, GradientText };
