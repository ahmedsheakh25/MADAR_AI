import { RequestHandler } from "express";
import { DatabaseService } from "../../lib/database.js";
import {
  requireAuth,
  createUnauthorizedResponse,
} from "../../lib/middleware.js";
import type { UserStatsResponse } from "../../shared/api.js";

const MAX_GENERATIONS_PER_MONTH = 30;

export const handleUserStats: RequestHandler = async (req, res) => {
  try {
    // Create a Request object for auth middleware
    const url = new URL(req.originalUrl, `http://${req.headers.host}`);
    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as HeadersInit,
    });

    // Require authentication
    const authResult = await requireAuth(webRequest);
    if (!authResult.success || !authResult.user) {
      return res.status(401).json({
        success: false,
        error: authResult.error || "Unauthorized",
      });
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
        role: user.role || "user",
        generationCount: userGenerationCount,
        resetDate: user.resetDate?.toISOString() || new Date().toISOString(),
        isAdmin: user.role === "admin",
        isMasterAdmin: user.email.toLowerCase() === "ahmed.sheakh@gmail.com",
      },
      remainingGenerations,
      maxGenerations: MAX_GENERATIONS_PER_MONTH,
    };

    res.json(responseData);
  } catch (error) {
    console.error("User stats endpoint error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to get user stats",
    });
  }
};
