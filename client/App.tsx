import "./global.css";
import "./lib/i18n"; // Initialize i18n

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import AdminUsers from "./pages/AdminUsers";
import AdminStyles from "./pages/AdminStyles";
import AuthCallback from "./pages/AuthCallback";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { useLanguage } from "./hooks/use-language";
import { Providers } from "./providers";
import { TooltipProvider } from "@/components/design-system";
import { LanguageRoute } from "./components/routing/LanguageRoute";
import { LoadingBoundary } from "./components/LoadingBoundary";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { suppressResizeObserverErrors } from "./lib/resize-observer-fix";
import { AuthManager } from "./lib/auth-manager";

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
          path="/:lang/auth/callback"
          element={
            <LanguageRoute>
              <AuthCallback />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/generator"
          element={
            <LanguageRoute>
              <Generator />
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
          path="/:lang/admin/users"
          element={
            <LanguageRoute>
              <AdminUsers />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/admin/styles"
          element={
            <LanguageRoute>
              <AdminStyles />
            </LanguageRoute>
          }
        />
        <Route
          path="/:lang/privacy"
          element={
            <LanguageRoute>
              <Privacy />
            </LanguageRoute>
          }
        />

        {/* Legacy routes without language prefix - redirect to language version */}
        <Route
          path="/login"
          element={<Navigate to={`/${language}/login`} replace />}
        />
        <Route
          path="/generator"
          element={<Navigate to={`/${language}/generator`} replace />}
        />
        <Route
          path="/gallery"
          element={<Navigate to={`/${language}/gallery`} replace />}
        />
        <Route
          path="/admin/users"
          element={<Navigate to={`/${language}/admin/users`} replace />}
        />
        <Route
          path="/admin/styles"
          element={<Navigate to={`/${language}/admin/styles`} replace />}
        />
        <Route
          path="/privacy"
          element={<Navigate to={`/${language}/privacy`} replace />}
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
    </BrowserRouter>
  );
}

const App = () => {
  // Set up Once UI theme attributes and defaults to prevent FOUC
  useEffect(() => {
    const root = document.documentElement;

    // Set default theme to dark
    root.setAttribute("data-theme", "dark");

    // Set default language to Arabic
    root.setAttribute("lang", "ar");
    root.setAttribute("dir", "rtl");

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

    // Initialize authentication manager
    AuthManager.initialize();

    // Suppress ResizeObserver errors
    suppressResizeObserverErrors();
  }, []);

  return (
    <ErrorBoundary>
      <Providers>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <LoadingBoundary>
              <AppWithLanguage />
            </LoadingBoundary>
          </TooltipProvider>
        </QueryClientProvider>
      </Providers>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
