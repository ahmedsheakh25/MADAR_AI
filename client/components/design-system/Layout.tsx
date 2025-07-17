import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for layout components
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

// Flex component with animations
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  gap?: "none" | "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16";
  wrap?: boolean;
  animate?: boolean;
  stagger?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction = "row",
      align = "start",
      justify = "start",
      gap = "none",
      wrap = false,
      animate = false,
      stagger = false,
      as: Component = "div",
      ...props
    },
    ref,
  ) => {
    const directionClasses = {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    };

    const gapClasses = {
      none: "",
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "12": "gap-12",
      "16": "gap-16",
    };

    const classes = cn(
      "flex",
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      gapClasses[gap],
      wrap && "flex-wrap",
      className,
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          variants={stagger ? containerVariants : itemVariants}
          initial="hidden"
          animate="visible"
          {...props}
        />
      );
    }

    return React.createElement(Component, {
      ref,
      className: classes,
      ...props,
    });
  },
);
Flex.displayName = "Flex";

// Grid component with animations
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16";
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  animate?: boolean;
  stagger?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      cols = 1,
      gap = "none",
      responsive,
      animate = false,
      stagger = false,
      ...props
    },
    ref,
  ) => {
    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const gapClasses = {
      none: "",
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "12": "gap-12",
      "16": "gap-16",
    };

    const responsiveClasses = responsive
      ? [
          responsive.sm && `sm:grid-cols-${responsive.sm}`,
          responsive.md && `md:grid-cols-${responsive.md}`,
          responsive.lg && `lg:grid-cols-${responsive.lg}`,
          responsive.xl && `xl:grid-cols-${responsive.xl}`,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

    const classes = cn(
      "grid",
      colClasses[cols],
      gapClasses[gap],
      responsiveClasses,
      className,
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          variants={stagger ? containerVariants : itemVariants}
          initial="hidden"
          animate="visible"
          {...props}
        />
      );
    }

    return <div ref={ref} className={classes} {...props} />;
  },
);
Grid.displayName = "Grid";

// Container component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  animate?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", animate = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-7xl",
      "2xl": "max-w-2xl",
      full: "max-w-full",
    };

    const classes = cn("mx-auto px-4", sizeClasses[size], className);

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          {...props}
        />
      );
    }

    return <div ref={ref} className={classes} {...props} />;
  },
);
Container.displayName = "Container";

export { Flex, Grid, Container };
