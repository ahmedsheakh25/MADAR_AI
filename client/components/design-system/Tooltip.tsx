import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    animate?: boolean;
  }
>(({ className, sideOffset = 4, animate = true, children, ...props }, ref) => {
  const contentElement = (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        // Enhanced animations with RTL support
        animate && [
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2 rtl:data-[side=left]:slide-in-from-left-2",
          "data-[side=right]:slide-in-from-left-2 rtl:data-[side=right]:slide-in-from-right-2",
          "data-[side=top]:slide-in-from-bottom-2",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  );

  if (!animate) {
    return contentElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {contentElement}
    </motion.div>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Enhanced Tooltip component with better props
interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  disabled?: boolean;
  animate?: boolean;
  className?: string;
}

const EnhancedTooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
  disabled = false,
  animate = true,
  className,
}: EnhancedTooltipProps) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <Tooltip delayDuration={delay}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        side={side} 
        align={align} 
        animate={animate}
        className={className}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  EnhancedTooltip,
};
