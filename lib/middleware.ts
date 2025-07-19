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
    // Check for dev mode first
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer dev-token-")) {
      console.log("🔧 Dev mode: Using mock user for authentication");

      // Return mock dev user for development
      const devUser: User = {
        id: "dev-user-123",
        email: "dev@madar.ai",
        name: "Development User",
        profilePicture: "https://via.placeholder.com/150",
        role: "user",
        generationCount: 0,
        resetDate: new Date(),
        googleId: "dev-google-id-123",
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      return {
        success: true,
        user: devUser,
      };
    }

    // Real authentication for production
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

// Helper to create forbidden response
export function createForbiddenResponse(message?: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message || "Admin access required",
    }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    },
  );
}

// Optional authentication (doesn't fail if no auth)
export async function optionalAuth(req: Request): Promise<User | null> {
  try {
    // Check for dev mode first
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer dev-token-")) {
      console.log("🔧 Dev mode: Using mock user for optional auth");

      // Return mock dev user for development
      const devUser: User = {
        id: "dev-user-123",
        email: "dev@madar.ai",
        name: "Development User",
        profilePicture: "https://via.placeholder.com/150",
        role: "user",
        generationCount: 0,
        resetDate: new Date(),
        googleId: "dev-google-id-123",
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      return devUser;
    }

    // Real authentication for production
    return await AuthService.getUserFromRequest(req);
  } catch (error) {
    console.error("Optional auth error:", error);
    return null;
  }
}

// Middleware to require admin authentication
export async function requireAdmin(req: Request): Promise<AuthResult> {
  try {
    // First check if user is authenticated
    const authResult = await requireAuth(req);
    if (!authResult.success || !authResult.user) {
      return authResult;
    }

    // Check if user has admin privileges
    if (!AuthService.isAdmin(authResult.user)) {
      return {
        success: false,
        error: "Admin access required",
      };
    }

    return authResult;
  } catch (error) {
    console.error("Admin authentication middleware error:", error);
    return {
      success: false,
      error: "Admin authentication failed",
    };
  }
}
