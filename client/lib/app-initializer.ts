import { AuthManager, UserCache, GalleryCache } from './auth-manager';
import { APIManager } from './api-manager';

export interface AppInitState {
  stage: 'initializing' | 'cached' | 'refreshing' | 'ready' | 'unauthenticated' | 'error';
  user: any | null;
  error: string | null;
  fromCache: boolean;
}

export class AppInitializer {
  private static initPromise: Promise<AppInitState> | null = null;

  /**
   * Initialize the application with progressive loading
   */
  static async initialize(): Promise<AppInitState> {
    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private static async performInitialization(): Promise<AppInitState> {
    try {
      // Stage 1: Initialize auth manager
      AuthManager.initialize();

      // Stage 2: Check authentication
      const token = AuthManager.getToken();
      if (!token) {
        return {
          stage: 'unauthenticated',
          user: null,
          error: null,
          fromCache: false,
        };
      }

      // Stage 3: Load cached data for instant UX
      const cachedUser = UserCache.load();
      if (cachedUser) {
        // Return cached state immediately
        const cachedState: AppInitState = {
          stage: 'cached',
          user: cachedUser,
          error: null,
          fromCache: true,
        };

        // Continue initialization in background
        this.backgroundRefresh().catch(console.error);

        return cachedState;
      }

      // Stage 4: Fresh data load (no cache available)
      return this.fetchFreshData();

    } catch (error) {
      console.error('App initialization failed:', error);
      
      // Clear invalid state
      AuthManager.clearToken();
      
      return {
        stage: 'error',
        user: null,
        error: error instanceof Error ? error.message : 'Initialization failed',
        fromCache: false,
      };
    }
  }

  /**
   * Background refresh of data
   */
  private static async backgroundRefresh(): Promise<void> {
    try {
      // Preload critical data
      await APIManager.preloadData();
    } catch (error) {
      console.warn('Background refresh failed:', error);
      
      // If auth error, handle it
      if (error instanceof Error && error.message.includes('Authentication')) {
        AuthManager.clearToken();
        window.location.href = '/login';
      }
    }
  }

  /**
   * Fetch fresh data when no cache is available
   */
  private static async fetchFreshData(): Promise<AppInitState> {
    try {
      const userStats = await APIManager.getUserStats();
      
      return {
        stage: 'ready',
        user: userStats.user,
        error: null,
        fromCache: false,
      };
    } catch (error) {
      console.error('Fresh data fetch failed:', error);
      
      // Clear invalid token
      AuthManager.clearToken();
      
      return {
        stage: 'error',
        user: null,
        error: error instanceof Error ? error.message : 'Failed to load user data',
        fromCache: false,
      };
    }
  }

  /**
   * Reset initialization state (for re-initialization)
   */
  static reset(): void {
    this.initPromise = null;
  }

  /**
   * Quick health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await APIManager.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle OAuth callback
   */
  static async handleOAuthCallback(code: string): Promise<AppInitState> {
    try {
      // The callback should be handled by the API, but we can process the result here
      const response = await fetch(`/api/auth/callback?code=${code}`);
      const result = await response.json();

      if (result.success && result.token && result.user) {
        // Store the token
        AuthManager.setToken(result.token);
        
        // Cache user data
        UserCache.save(result.user);
        
        return {
          stage: 'ready',
          user: result.user,
          error: null,
          fromCache: false,
        };
      } else {
        throw new Error(result.error || 'OAuth callback failed');
      }
    } catch (error) {
      return {
        stage: 'error',
        user: null,
        error: error instanceof Error ? error.message : 'OAuth callback failed',
        fromCache: false,
      };
    }
  }
}

/**
 * React hook for app initialization
 */
export function useAppInitialization() {
  const [state, setState] = React.useState<AppInitState>({
    stage: 'initializing',
    user: null,
    error: null,
    fromCache: false,
  });

  React.useEffect(() => {
    AppInitializer.initialize().then(setState);
  }, []);

  const retry = React.useCallback(() => {
    AppInitializer.reset();
    setState({
      stage: 'initializing',
      user: null,
      error: null,
      fromCache: false,
    });
    AppInitializer.initialize().then(setState);
  }, []);

  return {
    ...state,
    retry,
  };
}

// Note: Import React for the hook
import * as React from 'react'; 