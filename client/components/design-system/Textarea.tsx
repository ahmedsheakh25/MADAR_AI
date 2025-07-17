import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-md border bg-background text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
      size: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-base",
        xl: "min-h-[160px] px-4 py-3 text-base",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      resize: "vertical",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  animate?: boolean;
  error?: string;
  success?: string;
  warning?: string;
  isLoading?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      resize,
      animate = true,
      error,
      success,
      warning,
      isLoading,
      maxLength,
      showCharCount,
      value,
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

    // Character count logic
    const currentLength = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && currentLength / maxLength > 0.8;
    const isOverLimit = maxLength && currentLength > maxLength;

    const textareaElement = (
      <div className="relative">
        <textarea
          className={cn(
            textareaVariants({ variant: currentVariant, size, resize }),
            isLoading && "pe-10",
            showCharCount && maxLength && "pb-8",
            className,
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        
        {isLoading && (
          <div className="absolute top-3 end-3 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full"
            />
          </div>
        )}

        {showCharCount && maxLength && (
          <div className="absolute bottom-2 end-3 text-xs text-muted-foreground pointer-events-none">
            <span
              className={cn(
                "transition-colors",
                isOverLimit
                  ? "text-destructive"
                  : isNearLimit
                  ? "text-yellow-500"
                  : "text-muted-foreground",
              )}
            >
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );

    if (!animate) {
      return textareaElement;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileFocus={{ scale: 1.01 }}
      >
        {textareaElement}
      </motion.div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
