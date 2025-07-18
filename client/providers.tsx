import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={true}
      themes={["light", "dark"]}
    >
      {children}
    </ThemeProvider>
  );
}
