import React from "react";
import { motion } from "framer-motion";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <motion.div
            className="flex flex-col items-center gap-4 max-w-md mx-auto p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
