import type { Request, Response } from "express";
import { AuthService } from "../../lib/auth.js";

// Google OAuth URL endpoint
export const handleGoogleAuth = async (req: Request, res: Response) => {
  try {
    // Generate Google OAuth URL
    const authUrl = AuthService.getGoogleAuthUrl();

    res.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error("Google OAuth URL generation error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate authentication URL",
    });
  }
};

// Google OAuth callback endpoint
export const handleAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code, error } = req.query;

    // Handle OAuth errors
    if (error) {
      return res.status(400).json({
        success: false,
        error: `OAuth error: ${error}`,
      });
    }

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Authorization code not provided",
      });
    }

    // Exchange code for user info
    const googleUser = await AuthService.exchangeGoogleCode(code);
    if (!googleUser) {
      return res.status(400).json({
        success: false,
        error: "Failed to authenticate with Google",
      });
    }

    // Authenticate or create user
    const { user, token, isNewUser } =
      await AuthService.authenticateWithGoogle(googleUser);

    // Redirect to frontend callback page with token and user data in URL
    const baseUrl =
      process.env.FLY_APP_NAME || process.env.NODE_ENV === "production"
        ? "https://madar-ai.fly.dev"
        : "http://localhost:8080";
    const callbackUrl = new URL("/ar/auth/callback", baseUrl);
    callbackUrl.searchParams.set("token", token);
    callbackUrl.searchParams.set(
      "user",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        generationCount: user.generationCount,
        resetDate: user.resetDate?.toISOString(),
      }),
    );
    callbackUrl.searchParams.set("isNewUser", isNewUser.toString());

    res.redirect(callbackUrl.toString());
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Logout endpoint
export const handleLogout = async (req: Request, res: Response) => {
  try {
    // For now, logout is handled client-side (clearing JWT)
    // In the future, we could add token blacklisting here

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
};
