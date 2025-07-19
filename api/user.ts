import { DatabaseService } from "../lib/database.js";
import { requireAuth, createUnauthorizedResponse } from "../lib/middleware.js";
import type { UserStatsResponse } from "../shared/api.js";

export const runtime = "edge";

const MAX_GENERATIONS_PER_MONTH = 30;

export async function GET(req: Request) {
  try {
    console.log("User stats request:", {
      hasAuthHeader: !!req.headers.get("Authorization"),
      authHeaderPrefix:
        req.headers.get("Authorization")?.substring(0, 15) + "...",
      timestamp: new Date().toISOString(),
    });

    // Require authentication
    const authResult = await requireAuth(req);
    console.log("Auth result:", {
      success: authResult.success,
      hasUser: !!authResult.user,
      error: authResult.error,
      userId: authResult.user?.id?.substring(0, 8) + "..." || "None",
    });

    if (!authResult.success || !authResult.user) {
      return createUnauthorizedResponse(authResult.error);
    }

    let user = authResult.user;

    // Check if we need to reset the count for new month
    const currentDate = new Date();
    const resetDate = user.resetDate ? new Date(user.resetDate) : new Date();
    const monthsDiff =
      (currentDate.getFullYear() - resetDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      resetDate.getMonth();

    if (monthsDiff >= 1) {
      user = await DatabaseService.resetUserGenerationCount(user.id);
    }

    const userGenerationCount = user.generationCount || 0;
    const remainingGenerations = Math.max(
      0,
      MAX_GENERATIONS_PER_MONTH - userGenerationCount,
    );

    const responseData: UserStatsResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        generationCount: userGenerationCount,
        resetDate: user.resetDate?.toISOString() || new Date().toISOString(),
      },
      remainingGenerations,
      maxGenerations: MAX_GENERATIONS_PER_MONTH,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("User stats endpoint error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to get user stats",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
