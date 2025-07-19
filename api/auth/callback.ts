import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const state = url.searchParams.get("state");
    const devMode = url.searchParams.get("dev") === "true";

    console.log("OAuth Callback received:", {
      hasCode: !!code,
      error: error,
      state: state,
      devMode: devMode,
      url: req.url,
    });

    // Handle development mode FIRST
    if (devMode) {
      console.log(
        "🔧 Development mode: Creating dev user and bypassing Google OAuth",
      );

      try {
        const { user, token, isNewUser } = await AuthService.createDevUser();

        console.log("Development user authenticated:", {
          userId: user.id,
          email: user.email,
          isNewUser: isNewUser,
        });

        // Redirect to the generator page with the token
        const redirectUrl = new URL("/generator", url.origin);
        redirectUrl.searchParams.set("token", token);
        redirectUrl.searchParams.set("success", "true");
        redirectUrl.searchParams.set("dev_mode", "true");
        if (isNewUser) {
          redirectUrl.searchParams.set("new_user", "true");
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl.toString(),
            "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`, // 7 days
          },
        });
      } catch (devError) {
        console.error("Development mode authentication failed:", devError);

        return new Response(
          JSON.stringify({
            success: false,
            error:
              devError instanceof Error ? devError.message : "Dev auth failed",
            devMode: true,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error received:", error);

      // Redirect to login with error message instead of JSON response
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("error", `OAuth error: ${error}`);

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl.toString(),
        },
      });
    }

    if (!code && !devMode) {
      console.error("No authorization code provided");

      // Redirect to login with error message
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set("error", "Authorization code not provided");

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl.toString(),
        },
      });
    }

    // Exchange code for user info
    console.log("Callback: Attempting to exchange code with Google...");
    const googleUser = await AuthService.exchangeGoogleCode(code);
    if (!googleUser) {
      console.error("Callback: Google code exchange failed");

      // Redirect to login with error message
      const redirectUrl = new URL("/login", url.origin);
      redirectUrl.searchParams.set(
        "error",
        "Failed to authenticate with Google",
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl.toString(),
        },
      });
    }

    console.log(
      "Callback: Google authentication successful, proceeding with user creation/login...",
    );

    // Authenticate or create user
    const { user, token, isNewUser } =
      await AuthService.authenticateWithGoogle(googleUser);

    console.log("Callback: User authenticated successfully:", {
      userId: user.id,
      email: user.email,
      isNewUser: isNewUser,
    });

    // Redirect to the generator page with the token
    const redirectUrl = new URL("/generator", url.origin);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("success", "true");
    if (isNewUser) {
      redirectUrl.searchParams.set("new_user", "true");
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
        "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`, // 7 days
      },
    });
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    // Redirect to login with error message
    const url = new URL(req.url);
    const redirectUrl = new URL("/login", url.origin);
    redirectUrl.searchParams.set("error", "Authentication failed");

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
      },
    });
  }
}
