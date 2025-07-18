import type { User } from '@shared/api';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface StoredAuthData {
  token: string;
  expires: string;
  timestamp: number;
}

export class AuthManager {
  private static readonly TOKEN_KEY = 'madar_auth_token';
  private static readonly EXPIRES_KEY = 'madar_auth_expires';
  private static readonly TIMESTAMP_KEY = 'madar_auth_timestamp';
  
  // Token expires in 7 days (matching backend JWT expiration)
  private static readonly TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

  /**
   * Store authentication token securely
   */
  static setToken(token: string): void {
    try {
      const expires = new Date(Date.now() + this.TOKEN_DURATION).toISOString();
      const timestamp = Date.now();

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRES_KEY, expires);
      localStorage.setItem(this.TIMESTAMP_KEY, timestamp.toString());

      // Set automatic cleanup
      this.scheduleTokenCleanup();
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  }

  /**
   * Get valid authentication token
   */
  static getToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const expires = localStorage.getItem(this.EXPIRES_KEY);
      
      if (!token || !expires) {
        return null;
      }

      // Check if token is expired
      if (new Date() > new Date(expires)) {
        this.clearToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  static clearToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.EXPIRES_KEY);
      localStorage.removeItem(this.TIMESTAMP_KEY);
      
      // Clear all related cached data
      UserCache.clear();
      GalleryCache.clear();
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get time until token expires
   */
  static getTimeUntilExpiry(): number | null {
    try {
      const expires = localStorage.getItem(this.EXPIRES_KEY);
      if (!expires) return null;

      return new Date(expires).getTime() - Date.now();
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 1 day)
   */
  static willExpireSoon(): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    return timeUntilExpiry !== null && timeUntilExpiry < 24 * 60 * 60 * 1000;
  }

  /**
   * Schedule automatic token cleanup
   */
  private static scheduleTokenCleanup(): void {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    if (timeUntilExpiry && timeUntilExpiry > 0) {
      setTimeout(() => {
        this.clearToken();
        window.location.href = '/login';
      }, timeUntilExpiry);
    }
  }

  /**
   * Initialize auth manager (call on app start)
   */
  static initialize(): void {
    // Clean up expired token on startup
    const token = this.getToken();
    if (token) {
      this.scheduleTokenCleanup();
    }

    // Listen for storage changes (multiple tabs)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.TOKEN_KEY && !e.newValue) {
          // Token was cleared in another tab
          window.location.reload();
        }
      });
    }
  }
}

/**
 * User data caching system
 */
export class UserCache {
  private static readonly USER_KEY = 'madar_user_data';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static save(userData: User): void {
    try {
      const cacheData = {
        ...userData,
        timestamp: Date.now()
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  }

  static load(): User | null {
    try {
      const cached = localStorage.getItem(this.USER_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - data.timestamp > this.CACHE_DURATION) {
        this.clear();
        return null;
      }

      // Remove timestamp before returning
      const { timestamp, ...userData } = data;
      return userData as User;
    } catch (error) {
      console.error('Failed to load cached user data:', error);
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Failed to clear user cache:', error);
    }
  }

  static isStale(): boolean {
    try {
      const cached = localStorage.getItem(this.USER_KEY);
      if (!cached) return true;

      const data = JSON.parse(cached);
      return Date.now() - data.timestamp > this.CACHE_DURATION;
    } catch (error) {
      return true;
    }
  }
}

/**
 * Gallery caching system
 */
export class GalleryCache {
  private static readonly GALLERY_KEY = 'madar_gallery';
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  static save(images: any[]): void {
    try {
      const cacheData = {
        images,
        lastUpdated: Date.now(),
        count: images.length
      };
      localStorage.setItem(this.GALLERY_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache gallery data:', error);
    }
  }

  static load(): { images: any[]; needsRefresh: boolean } {
    try {
      const cached = localStorage.getItem(this.GALLERY_KEY);
      if (!cached) {
        return { images: [], needsRefresh: true };
      }

      const data = JSON.parse(cached);
      const needsRefresh = Date.now() - data.lastUpdated > this.CACHE_DURATION;

      return {
        images: data.images || [],
        needsRefresh
      };
    } catch (error) {
      console.error('Failed to load cached gallery data:', error);
      return { images: [], needsRefresh: true };
    }
  }

  static addImage(newImage: any): any[] {
    const { images } = this.load();
    const updatedImages = [newImage, ...images];
    this.save(updatedImages);
    return updatedImages;
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.GALLERY_KEY);
    } catch (error) {
      console.error('Failed to clear gallery cache:', error);
    }
  }
}

/**
 * Generation state management
 */
export class GenerationManager {
  private static readonly PREFIX = 'generation_';
  private static readonly STATE_DURATION = 30 * 60 * 1000; // 30 minutes

  static saveProgress(generationId: string, progress: any): void {
    try {
      const key = `${this.PREFIX}${generationId}`;
      const data = {
        id: generationId,
        progress,
        timestamp: Date.now(),
        prompt: progress.prompt,
        style: progress.style
      };
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save generation progress:', error);
    }
  }

  static restoreProgress(): any[] {
    try {
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(this.PREFIX)
      );

      return keys.map(key => {
        try {
          const data = JSON.parse(sessionStorage.getItem(key) || '');
          
          // Clean up old generations
          if (Date.now() - data.timestamp > this.STATE_DURATION) {
            sessionStorage.removeItem(key);
            return null;
          }
          
          return data;
        } catch {
          sessionStorage.removeItem(key);
          return null;
        }
      }).filter(Boolean);
    } catch (error) {
      console.error('Failed to restore generation progress:', error);
      return [];
    }
  }

  static clearProgress(generationId: string): void {
    try {
      const key = `${this.PREFIX}${generationId}`;
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear generation progress:', error);
    }
  }

  static clearAllProgress(): void {
    try {
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(this.PREFIX)
      );
      keys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear all generation progress:', error);
    }
  }
} 