import { useState, useEffect, useCallback } from "react";
import { AuthManager, UserCache } from "../lib/auth-manager";
import { APIManager } from "../lib/api-manager";
import type { User } from "@shared/api";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  devMode?: boolean;
  devModeMessage?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    devMode: false,
    devModeMessage: null,
  });

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
    checkDevMode();
  }, []);

  const checkDevMode = async () => {
    try {
      const response = await fetch("/api/auth/dev-status");
      const data = await response.json();

      if (data.success) {
        setState((prev) => ({
          ...prev,
          devMode: data.devMode,
          devModeMessage: data.message,
        }));

        if (data.devMode) {
          console.log("🔧 " + data.message);
        }
      }
    } catch (error) {
      console.warn("Failed to check dev mode status:", error);
    }
  };

  const initializeAuth = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check if we have a valid token
      const token = AuthManager.getToken();
      if (!token) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      // Try to load cached user data first for instant UX
      const cachedUser = UserCache.load();
      if (cachedUser) {
        setState({
          user: cachedUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        // Fetch fresh data in background
        try {
          const response = await APIManager.getUserStats();
          if (response.user) {
            setState((prev) => ({
              ...prev,
              user: response.user!,
            }));
          }
        } catch (error) {
          // Keep using cached data if background refresh fails
          console.warn("Background user refresh failed:", error);
        }

        return;
      }

      // Check if this is a dev token
      if (token.startsWith("dev-token-")) {
        console.log("🔧 Development mode: Using cached dev user");
        // For dev mode, we don't need to fetch from API
        return;
      }

      // No cached data, fetch fresh user data
      const response = await APIManager.getUserStats();
      if (response.user) {
        setState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);

      // Clear invalid token
      AuthManager.clearToken();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  const signIn = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check if we're in dev mode
      const isDev = import.meta.env.DEV;

      if (isDev) {
        console.log("🔧 Development mode: Creating dev user");

        // Create a mock dev user
        const devUser = {
          id: "dev-user-123",
          email: "dev@madar.ai",
          name: "Development User",
          profilePicture: "https://via.placeholder.com/150",
          role: "user",
          generationCount: 0,
          resetDate: new Date().toISOString(),
        };

        // Create a mock token
        const devToken = "dev-token-" + Date.now();

        // Store the token and user
        AuthManager.setToken(devToken);
        UserCache.save(devUser);

        setState({
          user: devUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
          devMode: true,
          devModeMessage: "Development mode active - using mock user",
        });

        console.log("✅ Dev user created:", devUser);
        return;
      }

      // Production Google OAuth flow
      const response = await APIManager.getGoogleAuthUrl();
      if (response.success && response.authUrl) {
        window.location.href = response.authUrl;
      } else {
        throw new Error(response.error || "Failed to get authentication URL");
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Sign in failed",
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Call logout API
      await APIManager.logout();

      // Clear all local data
      AuthManager.clearToken();
      APIManager.clearCache();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      // Even if logout API fails, clear local data
      AuthManager.clearToken();
      APIManager.clearCache();

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      window.location.href = "/login";
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;

    try {
      const response = await APIManager.getUserStats();
      if (response.user) {
        setState((prev) => ({
          ...prev,
          user: response.user!,
          error: null,
        }));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);

      // If it's an auth error, sign out
      if (error instanceof Error && error.message.includes("Authentication")) {
        signOut();
      }
    }
  }, [state.isAuthenticated, signOut]);

  // Handle OAuth callback (if URL contains code parameter)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      setState((prev) => ({
        ...prev,
        error: `OAuth error: ${error}`,
        isLoading: false,
      }));
      return;
    }

    if (code) {
      // This should be handled by the callback page, but just in case
      console.log("OAuth code received, should be handled by callback page");
    }
  }, []);

  return {
    ...state,
    signIn,
    signOut,
    refreshUser,
    // Backward compatibility
    isDevMode: state.devMode || false, // Real authentication enabled, but show dev mode status
  };
}
