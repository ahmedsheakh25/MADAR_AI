import "./global.css";
import "./lib/i18n"; // Initialize i18n

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import { useLanguage } from "./hooks/use-language";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/design-system";
import DockNavigation from "./components/navigation/DockNavigation";
import { LanguageRoute } from "./components/routing/LanguageRoute";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AppWithLanguage() {
  const { language } = useLanguage();

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to default language */}
        <Route path="/" element={<Navigate to={`/${language}`} replace />} />

        {/* Language-prefixed routes */}
        <Route
          path="/:lang"
          element={
            <LanguageRoute>
              <Index />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/login"
          element={
            <LanguageRoute>
              <Login />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/gallery"
          element={
            <LanguageRoute>
              <Gallery />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/my-images"
          element={
            <LanguageRoute>
              <Gallery />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/signup"
          element={
            <LanguageRoute>
              <Login />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/forgot-password"
          element={
            <LanguageRoute>
              <Login />
            </LanguageRoute>
          }
        />

        {/* Legacy routes without language prefix - redirect to language version */}
        <Route
          path="/login"
          element={<Navigate to={`/${language}/login`} replace />}
        />
        <Route
          path="/gallery"
          element={<Navigate to={`/${language}/gallery`} replace />}
        />
        <Route
          path="/my-images"
          element={<Navigate to={`/${language}/my-images`} replace />}
        />
        <Route
          path="/signup"
          element={<Navigate to={`/${language}/signup`} replace />}
        />
        <Route
          path="/forgot-password"
          element={<Navigate to={`/${language}/forgot-password`} replace />}
        />

        {/* 404 for unmatched routes */}
        <Route
          path="*"
          element={
            <LanguageRoute>
              <NotFound />
            </LanguageRoute>
          }
        />
      </Routes>
      <DockNavigation />
    </BrowserRouter>
  );
}

const App = () => {
  // Set up Once UI theme attributes to prevent FOUC
  useEffect(() => {
    const root = document.documentElement;

    // Set default Once UI attributes
    root.setAttribute("data-neutral", "gray");
    root.setAttribute("data-brand", "violet"); // Maps to your purple theme
    root.setAttribute("data-accent", "indigo");
    root.setAttribute("data-solid", "contrast");
    root.setAttribute("data-solid-style", "flat");
    root.setAttribute("data-border", "playful");
    root.setAttribute("data-surface", "filled");
    root.setAttribute("data-transition", "all");
    root.setAttribute("data-scaling", "100");
    root.setAttribute("data-viz-style", "categorical");
    root.setAttribute("data-theme", "dark"); // Default to dark theme
  }, []);

  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppWithLanguage />
        </TooltipProvider>
      </QueryClientProvider>
    </Providers>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
