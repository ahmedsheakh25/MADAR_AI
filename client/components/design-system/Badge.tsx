import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-yellow-900 hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        outline: 
          "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        gradient:
          "border-transparent bg-gradient-primary text-white hover:opacity-80",
        glass:
          "border-border/50 bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/70",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-sm",
      },
      shape: {
        default: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  animate?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant,
    size,
    shape,
    animate = true,
    removable,
    onRemove,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    const badgeElement = (
      <div 
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)} 
        role="status"
        aria-label={typeof children === "string" ? children : undefined}
        {...props}
      >
        {leftIcon && (
          <span className="me-1 flex-shrink-0">{leftIcon}</span>
        )}
        
        <span className="truncate">{children}</span>
        
        {rightIcon && !removable && (
          <span className="ms-1 flex-shrink-0">{rightIcon}</span>
        )}
        
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ms-1 flex-shrink-0 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            aria-label="Remove badge"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );

    if (!animate) {
      return badgeElement;
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {badgeElement}
      </motion.div>
    );
  }
);
Badge.displayName = "Badge";

// Dot Badge for status indicators
interface DotBadgeProps {
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  size?: "sm" | "default" | "lg";
  animate?: boolean;
  className?: string;
}

const DotBadge = ({ 
  variant = "default", 
  size = "default", 
  animate = true,
  className 
}: DotBadgeProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    default: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-destructive",
    info: "bg-blue-500",
  };

  const dotElement = (
    <div
      className={cn(
        "rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={`${variant} status`}
    />
  );

  if (!animate) {
    return dotElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {dotElement}
    </motion.div>
  );
};

export { Badge, DotBadge, badgeVariants };
