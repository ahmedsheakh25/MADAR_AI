import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `OAuth error: ${error}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Authorization code not provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Exchange code for user info
    console.log("Callback: Attempting to exchange code with Google...");
    const googleUser = await AuthService.exchangeGoogleCode(code);
    if (!googleUser) {
      console.error("Callback: Google code exchange failed");
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Failed to authenticate with Google - check server logs for details",
          details: "Google OAuth code exchange returned null",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      "Callback: Google authentication successful, proceeding with user creation/login...",
    );

    // Authenticate or create user
    const { user, token, isNewUser } =
      await AuthService.authenticateWithGoogle(googleUser);

    // Return success response with token
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
          generationCount: user.generationCount,
          resetDate: user.resetDate?.toISOString(),
        },
        token,
        isNewUser,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Authentication failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
