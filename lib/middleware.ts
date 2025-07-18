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
    // Real authentication is now enabled - no dev mode

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
    // Real authentication is now enabled - no dev mode

    return await AuthService.getUserFromRequest(req);
  } catch (error) {
    console.error("Optional auth error:", error);
    return null;
  }
}
