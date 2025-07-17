"use client";

import {
  DataThemeProvider,
  IconProvider,
  ThemeProvider,
  ToastProvider,
} from "@once-ui-system/core";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <DataThemeProvider>
        <ToastProvider>
          <IconProvider>{children}</IconProvider>
        </ToastProvider>
      </DataThemeProvider>
    </ThemeProvider>
  );
}
