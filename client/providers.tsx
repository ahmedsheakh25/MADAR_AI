import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Simple provider wrapper - no external dependencies needed
  // Theme management is handled by our custom hooks
  return <>{children}</>;
}
