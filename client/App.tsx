import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexOnceUI from "./pages/IndexOnceUI";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import { useLanguage } from "./hooks/use-language";
import { Providers } from "./providers";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AppWithLanguage() {
  // Initialize language system
  useLanguage();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexOnceUI />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/my-images" element={<Gallery />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/forgot-password" element={<Login />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
          <Toaster />
          <Sonner />
          <AppWithLanguage />
        </TooltipProvider>
      </QueryClientProvider>
    </Providers>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
