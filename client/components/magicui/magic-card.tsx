"use client";

import React, { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientColor = "#262626",
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "before:absolute before:inset-0 before:z-0 before:transition-opacity before:duration-500",
        "before:bg-gradient-to-br before:opacity-0 hover:before:opacity-10",
        "after:absolute after:inset-0 after:z-0 after:rounded-xl after:opacity-0 after:transition-opacity after:duration-500",
        "after:bg-[radial-gradient(200px_at_var(--mouse-x)_var(--mouse-y),theme(colors.white/.1),transparent_50%)]",
        "hover:after:opacity-100",
        className,
      )}
      style={
        {
          "--gradient-color": gradientColor,
          "--gradient-from": gradientFrom,
          "--gradient-to": gradientTo,
        } as React.CSSProperties
      }
    >
      <style>{`
        .group:before {
          background: linear-gradient(
            135deg,
            var(--gradient-from),
            var(--gradient-to)
          );
        }

        @media (prefers-color-scheme: dark) {
          .group:after {
            background: radial-gradient(
              200px at var(--mouse-x, 50%) var(--mouse-y, 50%),
              var(--gradient-color),
              transparent 50%
            );
          }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
