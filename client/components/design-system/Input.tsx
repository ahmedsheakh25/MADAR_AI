import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  animate?: boolean;
  error?: string;
  success?: string;
  warning?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      size,
      animate = true,
      error,
      success,
      warning,
      isLoading,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    // Determine variant based on validation state
    const currentVariant = error
      ? "error"
      : success
      ? "success"
      : warning
      ? "warning"
      : variant;

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <div className="text-muted-foreground">{leftIcon}</div>
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ variant: currentVariant, size }),
            leftIcon && "ps-10",
            rightIcon && "pe-10",
            isLoading && "pe-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        
        {(rightIcon || isLoading) && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full"
              />
            ) : (
              <div className="text-muted-foreground">{rightIcon}</div>
            )}
          </div>
        )}
      </div>
    );

    if (!animate) {
      return inputElement;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileFocus={{ scale: 1.01 }}
      >
        {inputElement}
      </motion.div>
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
