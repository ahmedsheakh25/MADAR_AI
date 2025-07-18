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
    });

    // Generate Google OAuth URL
    const authUrl = AuthService.getGoogleAuthUrl();

    return new Response(
      JSON.stringify({
        success: true,
        authUrl,
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
