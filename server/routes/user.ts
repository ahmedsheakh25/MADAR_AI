import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";
import type { UserStatsResponse } from "@shared/api";

const MAX_GENERATIONS_PER_MONTH = 30;

export const handleUserStats: RequestHandler<{}, UserStatsResponse> = async (
  req,
  res,
) => {
  try {
    // Get user from request (for now, using dev user)
    // In production, this would come from authenticated session
    const userEmail = "dev@example.com"; // This should come from auth middleware
    let user = await DatabaseService.findUserByEmail(userEmail);

    if (!user) {
      // Create new user if doesn't exist
      user = await DatabaseService.createUser({
        email: userEmail,
        name: "Dev User",
        generationCount: 0,
      });
    }

    // Check if generation count should be reset
    const currentDate = new Date();
    const resetDate = new Date(user.resetDate);
    const monthsDiff =
      (currentDate.getFullYear() - resetDate.getFullYear()) * 12 +
      currentDate.getMonth() -
      resetDate.getMonth();

    // Reset count if it's been a month since last reset
    if (monthsDiff >= 1) {
      user = await DatabaseService.resetUserGenerationCount(user.id);
    }

    const remainingGenerations =
      MAX_GENERATIONS_PER_MONTH - user.generationCount;

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        generationCount: user.generationCount,
        resetDate: user.resetDate.toISOString(),
      },
      remainingGenerations: Math.max(0, remainingGenerations),
      maxGenerations: MAX_GENERATIONS_PER_MONTH,
    });
  } catch (error) {
    console.error("User stats endpoint error:", error);
    return res.status(500).json({
      user: {
        id: "",
        email: "",
        name: "",
        generationCount: 0,
        resetDate: new Date().toISOString(),
      },
      remainingGenerations: 0,
      maxGenerations: MAX_GENERATIONS_PER_MONTH,
    });
  }
};
