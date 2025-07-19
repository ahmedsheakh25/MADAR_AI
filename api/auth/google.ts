import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    // Debug environment variables
    console.log("Environment check:", {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      nodeEnv: process.env.NODE_ENV,
      devMode: process.env.DEV_MODE_AUTH === "true",
    });

    // Check if we're in development mode
    if (AuthService.isDevMode()) {
      console.log("🔧 Development mode activated for Google Auth");

      return new Response(
        JSON.stringify({
          success: true,
          authUrl: "/api/auth/callback?dev=true",
          devMode: true,
          message:
            "Development mode: Will bypass Google OAuth and create test user",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Generate Google OAuth URL for production
    const authUrl = AuthService.getGoogleAuthUrl();

    return new Response(
      JSON.stringify({
        success: true,
        authUrl,
        devMode: false,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Google OAuth URL generation error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate authentication URL",
        details: error instanceof Error ? error.stack : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
