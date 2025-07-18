import React, { Suspense } from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </motion.div>
  </div>
);

interface LoadingBoundaryProps {
  children: React.ReactNode;
}

export function LoadingBoundary({ children }: LoadingBoundaryProps) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
