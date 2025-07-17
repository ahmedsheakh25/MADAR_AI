import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "vertical", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-6 w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

export { Separator };
