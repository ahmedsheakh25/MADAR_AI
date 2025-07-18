import { AuthManager, UserCache, GalleryCache } from './auth-manager';
import type { 
  User, 
  GenerateImageRequest, 
  GenerateImageResponse,
  SaveImageRequest,
  SaveImageResponse,
  UserStatsResponse,
  GalleryResponse,
  StylesResponse,
  AuthResponse,
  GoogleAuthUrlResponse,
  LogoutResponse
} from '@shared/api';

export interface APIError {
  message: string;
  status?: number;
  fromCache?: boolean;
}

export interface APIOptions {
  useCache?: boolean;
  retry?: boolean;
  retryAttempts?: number;
  timeout?: number;
}

export class APIManager {
  private static readonly BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Make authenticated API request with error handling and caching
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit & APIOptions = {}
  ): Promise<T> {
    const {
      useCache = false,
      retry = true,
      retryAttempts = this.DEFAULT_RETRY_ATTEMPTS,
      timeout = this.DEFAULT_TIMEOUT,
      ...fetchOptions
    } = options;

    const url = `${this.BASE_URL}${endpoint}`;
    const token = AuthManager.getToken();

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Add auth header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle authentication errors
        if (response.status === 401) {
          AuthManager.clearToken();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }

        // Handle other HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error as Error;

        // Don't retry on auth errors or client errors
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('Authentication')) {
            throw error;
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < retryAttempts && retry) {
          await this.delay(this.RETRY_DELAY * attempt);
          continue;
        }

        // Final attempt failed
        break;
      }
    }

    clearTimeout(timeoutId);

    // All attempts failed - try to return cached data if available
    if (useCache) {
      const cachedData = this.getCachedData<T>(endpoint);
      if (cachedData) {
        console.warn(`API call failed, returning cached data for ${endpoint}`);
        return { ...cachedData, fromCache: true } as T;
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * GET request with caching support
   */
  private static async get<T>(
    endpoint: string, 
    options: APIOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'GET', 
      useCache: true,
      ...options 
    });
  }

  /**
   * POST request
   */
  private static async post<T>(
    endpoint: string, 
    data?: any, 
    options: APIOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cached data for endpoint
   */
  private static getCachedData<T>(endpoint: string): T | null {
    try {
      const cacheKey = `api_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const data = JSON.parse(cached);
      // Check if cache is expired (5 minutes)
      if (Date.now() - data.timestamp > 5 * 60 * 1000) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return data.value;
    } catch {
      return null;
    }
  }

  /**
   * Cache data for endpoint
   */
  private static setCachedData<T>(endpoint: string, data: T): void {
    try {
      const cacheKey = `api_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const cacheData = {
        value: data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache API data:', error);
    }
  }

  // =============================================================================
  // Authentication API Methods
  // =============================================================================

  /**
   * Get Google OAuth URL
   */
  static async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    return this.get<GoogleAuthUrlResponse>('/api/auth/google');
  }

  /**
   * Logout user
   */
  static async logout(): Promise<LogoutResponse> {
    const response = await this.post<LogoutResponse>('/api/auth/logout');
    AuthManager.clearToken();
    return response;
  }

  // =============================================================================
  // User API Methods
  // =============================================================================

  /**
   * Get current user stats with smart caching
   */
  static async getUserStats(): Promise<UserStatsResponse> {
    try {
      // Try cached data first for instant UX
      const cachedUser = UserCache.load();
      
      // If we have cached data and it's fresh, return it immediately
      if (cachedUser && !UserCache.isStale()) {
        // Still fetch fresh data in background
        this.get<UserStatsResponse>('/api/user')
          .then(response => {
            if (response.user) {
              UserCache.save(response.user);
            }
          })
          .catch(console.warn);

        return {
          user: cachedUser,
          remainingGenerations: 30 - (cachedUser.generationCount || 0),
          maxGenerations: 30
        };
      }

      // Fetch fresh data
      const response = await this.get<UserStatsResponse>('/api/user');
      
      // Cache the fresh data
      if (response.user) {
        UserCache.save(response.user);
      }

      return response;
    } catch (error) {
      // If we have any cached data, return it as fallback
      const cachedUser = UserCache.load();
      if (cachedUser) {
        return {
          user: cachedUser,
          remainingGenerations: 30 - (cachedUser.generationCount || 0),
          maxGenerations: 30,
          fromCache: true
        } as UserStatsResponse;
      }
      
      throw error;
    }
  }

  // =============================================================================
  // Image Generation API Methods
  // =============================================================================

  /**
   * Generate image with progress tracking
   */
  static async generateImage(
    request: GenerateImageRequest
  ): Promise<GenerateImageResponse> {
    const response = await this.post<GenerateImageResponse>('/api/generate', request, {
      timeout: 60000, // 60 seconds for image generation
      retry: false // Don't retry image generation
    });

    // Update user cache with new generation count
    if (response.success && response.remainingGenerations !== undefined) {
      const cachedUser = UserCache.load();
      if (cachedUser) {
        cachedUser.generationCount = 30 - response.remainingGenerations;
        UserCache.save(cachedUser);
      }
    }

    return response;
  }

  /**
   * Save image to gallery
   */
  static async saveImage(request: SaveImageRequest): Promise<SaveImageResponse> {
    const response = await this.post<SaveImageResponse>('/api/save', request);

    // Add to gallery cache optimistically
    if (response.success && response.imageId) {
      const newImage = {
        id: response.imageId,
        imageUrl: request.imageUrl,
        prompt: request.prompt,
        styleName: request.styleName,
        colors: request.colors,
        createdAt: new Date().toISOString()
      };
      GalleryCache.addImage(newImage);
    }

    return response;
  }

  // =============================================================================
  // Gallery API Methods
  // =============================================================================

  /**
   * Get user gallery with smart caching
   */
  static async getGallery(
    limit: number = 50, 
    offset: number = 0
  ): Promise<GalleryResponse> {
    try {
      // Load cached gallery
      const { images: cachedImages, needsRefresh } = GalleryCache.load();
      
      // If we have cached data and don't need refresh, return it
      if (cachedImages.length > 0 && !needsRefresh && offset === 0) {
        // Still fetch fresh data in background
        this.get<GalleryResponse>(`/api/gallery?limit=${limit}&offset=${offset}`)
          .then(response => {
            GalleryCache.save(response.images);
          })
          .catch(console.warn);

        return {
          images: cachedImages.slice(0, limit),
          total: cachedImages.length
        };
      }

      // Fetch fresh data
      const response = await this.get<GalleryResponse>(
        `/api/gallery?limit=${limit}&offset=${offset}`
      );

      // Cache the fresh data (only for first page)
      if (offset === 0) {
        GalleryCache.save(response.images);
      }

      return response;
    } catch (error) {
      // Return cached data as fallback
      const { images: cachedImages } = GalleryCache.load();
      if (cachedImages.length > 0) {
        return {
          images: cachedImages.slice(offset, offset + limit),
          total: cachedImages.length,
          fromCache: true
        } as GalleryResponse;
      }
      
      throw error;
    }
  }

  // =============================================================================
  // Styles API Methods
  // =============================================================================

  /**
   * Get available styles with caching
   */
  static async getStyles(): Promise<StylesResponse> {
    return this.get<StylesResponse>('/api/styles');
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  /**
   * Check API health
   */
  static async ping(): Promise<{ message: string; timestamp: string }> {
    return this.get('/api/ping');
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    UserCache.clear();
    GalleryCache.clear();
    
    // Clear API cache
    const keys = Object.keys(localStorage).filter(key => key.startsWith('api_cache_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Preload critical data
   */
  static async preloadData(): Promise<void> {
    try {
      await Promise.allSettled([
        this.getUserStats(),
        this.getStyles(),
        this.getGallery(20, 0) // Load first 20 images
      ]);
    } catch (error) {
      console.warn('Failed to preload some data:', error);
    }
  }
} 