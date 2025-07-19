import { AuthService } from "../../lib/auth.js";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    console.log("Testing dev auth...");

    // Create dev user directly
    const { user, token, isNewUser } = await AuthService.createDevUser();

    console.log("Dev user created:", {
      userId: user.id,
      email: user.email,
      isNewUser,
    });

    return new Response(
      JSON.stringify({
        success: true,
        user,
        token: token.substring(0, 20) + "...", // Truncate for security
        isNewUser,
        message: "Dev user created successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Dev auth test failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
