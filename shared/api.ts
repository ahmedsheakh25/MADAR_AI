/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Madar AI API Types
 */

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  profilePicture?: string;
  role?: string;
  generationCount: number;
  resetDate: string;
  isAdmin?: boolean;
  isMasterAdmin?: boolean;
}

// Authentication types
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  isNewUser?: boolean;
  error?: string;
}

export interface GoogleAuthUrlResponse {
  success: boolean;
  authUrl?: string;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserStatsResponse {
  user: User;
  remainingGenerations: number;
  maxGenerations: number;
}

// Image generation types
export interface GenerateImageRequest {
  prompt: string;
  styleId: string;
  colors?: string[];
  uploadedImageUrl?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  remainingGenerations?: number;
}

// Save image types
export interface SaveImageRequest {
  imageUrl: string;
  prompt: string;
  styleName: string;
  colors?: string[];
}

export interface SaveImageResponse {
  success: boolean;
  imageId?: string;
  error?: string;
}

// Gallery types
export interface GalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  styleName: string;
  colors?: string[];
  createdAt: string;
}

export interface GalleryResponse {
  images: GalleryImage[];
  total: number;
}

// Style types
export interface Style {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  promptJson: any;
}

export interface StylesResponse {
  styles: Style[];
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  generationCount: number;
  resetDate: string;
  createdAt?: string;
  lastLoginAt?: string;
  isAdmin?: boolean;
  isMasterAdmin?: boolean;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export interface UpdateUserQuotaRequest {
  userId: string;
  newQuota?: number;
  resetCount?: boolean;
}

export interface UpdateUserQuotaResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}
