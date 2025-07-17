// Utility to suppress ResizeObserver loop errors
export function suppressResizeObserverErrors() {
  // Store the original console.error
  const originalError = console.error;

  // Override console.error to filter out ResizeObserver errors
  console.error = (...args: any[]) => {
    // Check if the error is related to ResizeObserver
    if (
      args.length > 0 &&
      typeof args[0] === "string" &&
      args[0].includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      // Silently ignore this specific error
      return;
    }

    // For all other errors, use the original console.error
    originalError.apply(console, args);
  };

  // Add global error handler for unhandled ResizeObserver errors
  window.addEventListener("error", (event) => {
    if (
      event.message?.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections related to ResizeObserver
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      event.preventDefault();
      return false;
    }
  });
}

// Debounced resize observer to prevent rapid firing
export function createDebouncedResizeObserver(
  callback: ResizeObserverCallback,
  delay: number = 16, // ~60fps
): ResizeObserver {
  let timeoutId: number | null = null;

  return new ResizeObserver((entries, observer) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      try {
        callback(entries, observer);
      } catch (error) {
        // Silently handle any errors to prevent loops
        console.warn("ResizeObserver callback error:", error);
      }
    }, delay);
  });
}
