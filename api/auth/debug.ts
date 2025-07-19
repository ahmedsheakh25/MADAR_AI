import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const authHeader = req.headers.get("Authorization");

    // Basic environment info (safe for production)
    const envInfo = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      devMode: AuthService.isDevMode(),
      redirectUri: AuthService.getRedirectUri(req.url),
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 12) + "...",
    };

    // Auth header info
    const authInfo = {
      hasAuthHeader: !!authHeader,
      authHeaderFormat: authHeader
        ? authHeader.startsWith("Bearer ")
          ? "Bearer"
          : "Invalid"
        : "None",
      tokenPrefix: authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7, 15) + "..."
        : "None",
    };

    // Test token verification if provided
    let tokenInfo = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const payload = await AuthService.verifyToken(token);
        tokenInfo = {
          valid: !!payload,
          userId: payload?.userId?.substring(0, 8) + "..." || "None",
          exp: payload?.exp
            ? new Date(payload.exp * 1000).toISOString()
            : "None",
          expired: payload?.exp ? Date.now() / 1000 > payload.exp : false,
        };
      } catch (error) {
        tokenInfo = {
          valid: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    return new Response(
      JSON.stringify(
        {
          success: true,
          timestamp: new Date().toISOString(),
          environment: envInfo,
          authentication: authInfo,
          token: tokenInfo,
          url: url.origin,
          headers: Object.fromEntries(req.headers.entries()),
        },
        null,
        2,
      ),
      {
        headers: {
          "Content-Type": "application/json",
          // Allow CORS for debugging
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
      },
    );
  } catch (error) {
    console.error("Auth debug error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Debug failed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
