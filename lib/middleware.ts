import { AuthService } from "./auth.js";
import type { User } from "./schema.js";

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Middleware to require authentication
export async function requireAuth(req: Request): Promise<AuthResult> {
  try {
    // Check if we're in development mode (Google OAuth not configured)
    const isDevMode =
      !process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID === "your_google_client_id_here";

    if (isDevMode) {
      console.log("🔧 Development mode: Using mock authentication");
      // In development mode, create a mock user
      const devUser: User = {
        id: "dev-user-1",
        email: "dev@example.com",
        name: "Dev User",
        generationCount: 5,
        resetDate: new Date(),
        createdAt: new Date(),
        lastLoginAt: new Date(),
        googleId: null,
        profilePicture: null,
      };

      return {
        success: true,
        user: devUser,
      };
    }

    const user = await AuthService.getUserFromRequest(req);

    if (!user) {
      return {
        success: false,
        error: "Authentication required. Please log in.",
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return {
      success: false,
      error: "Authentication failed",
    };
  }
}

// Helper to create unauthorized response
export function createUnauthorizedResponse(message?: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message || "Authentication required",
    }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    },
  );
}

// Optional authentication (doesn't fail if no auth)
export async function optionalAuth(req: Request): Promise<User | null> {
  try {
    // Check if we're in development mode (Google OAuth not configured)
    const isDevMode =
      !process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID === "your_google_client_id_here";

    if (isDevMode) {
      // In development mode, return mock user
      return {
        id: "dev-user-1",
        email: "dev@example.com",
        name: "Dev User",
        generationCount: 5,
        resetDate: new Date(),
        createdAt: new Date(),
        lastLoginAt: new Date(),
        googleId: null,
        profilePicture: null,
      };
    }

    return await AuthService.getUserFromRequest(req);
  } catch (error) {
    console.error("Optional auth error:", error);
    return null;
  }
}
