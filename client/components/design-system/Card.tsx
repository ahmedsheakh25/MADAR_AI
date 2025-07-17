import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for cards
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: boolean;
    hoverEffect?: boolean;
  }
>(({ className, animate = true, hoverEffect = true, ...props }, ref) => {
  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className,
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverEffect ? "hover" : undefined}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
