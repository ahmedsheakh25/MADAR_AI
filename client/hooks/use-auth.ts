import { useState, useEffect, useCallback } from "react";
import { AuthManager, UserCache } from "../lib/auth-manager";
import { APIManager } from "../lib/api-manager";
import type { User } from "@shared/api";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

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
            setState(prev => ({
              ...prev,
              user: response.user!,
            }));
          }
        } catch (error) {
          // Keep using cached data if background refresh fails
          console.warn('Background user refresh failed:', error);
        }
        
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
        throw new Error('No user data received');
      }

    } catch (error) {
      console.error('Auth initialization failed:', error);
      
      // Clear invalid token
      AuthManager.clearToken();
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };

  const signIn = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get Google OAuth URL
      const response = await APIManager.getGoogleAuthUrl();
      if (response.success && response.authUrl) {
        // Redirect to Google OAuth
        window.location.href = response.authUrl;
      } else {
        throw new Error(response.error || 'Failed to get authentication URL');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
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
      window.location.href = '/login';
      
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

      window.location.href = '/login';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;

    try {
      const response = await APIManager.getUserStats();
      if (response.user) {
        setState(prev => ({
          ...prev,
          user: response.user!,
          error: null,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      
      // If it's an auth error, sign out
      if (error instanceof Error && error.message.includes('Authentication')) {
        signOut();
      }
    }
  }, [state.isAuthenticated, signOut]);

  // Handle OAuth callback (if URL contains code parameter)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setState(prev => ({
        ...prev,
        error: `OAuth error: ${error}`,
        isLoading: false,
      }));
      return;
    }

    if (code) {
      // This should be handled by the callback page, but just in case
      console.log('OAuth code received, should be handled by callback page');
    }
  }, []);

  return {
    ...state,
    signIn,
    signOut,
    refreshUser,
    // Backward compatibility
    isDevMode: false, // No longer in dev mode with real auth
  };
}
