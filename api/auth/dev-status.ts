import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const isDevMode = AuthService.isDevMode();

    return new Response(
      JSON.stringify({
        success: true,
        devMode: isDevMode,
        environment: process.env.NODE_ENV,
        devModeAuth: process.env.DEV_MODE_AUTH === "true",
        hasGoogleCredentials: {
          clientId: !!process.env.GOOGLE_CLIENT_ID,
          clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
          redirectUri: !!process.env.GOOGLE_REDIRECT_URI,
        },
        message: isDevMode
          ? "🔧 Development mode is ACTIVE - Auth will bypass Google OAuth"
          : "🚀 Production mode - Using real Google OAuth",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Dev status check error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
