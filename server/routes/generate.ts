import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";
import { FalAIService } from "../services/fal-ai";
import type { GenerateImageRequest, GenerateImageResponse } from "@shared/api";

const MAX_GENERATIONS_PER_MONTH = 30;

export const handleGenerate: RequestHandler<
  {},
  GenerateImageResponse,
  GenerateImageRequest
> = async (req, res) => {
  try {
    const { prompt, styleId, colors, uploadedImageUrl } = req.body;

    // Validate input
    if (!prompt || !styleId) {
      return res.status(400).json({
        success: false,
        error: "Prompt and style ID are required",
      });
    }

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

    // Check generation quota
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

    if (user.generationCount >= MAX_GENERATIONS_PER_MONTH) {
      return res.status(429).json({
        success: false,
        error:
          "Monthly generation limit exceeded. Please wait until next month.",
        remainingGenerations: 0,
      });
    }

    // Get style information
    const style = await DatabaseService.getStyleById(styleId);
    if (!style) {
      return res.status(404).json({
        success: false,
        error: "Style not found",
      });
    }

    try {
      // Generate image using Fal AI
      const imageUrl = await FalAIService.generateImage({
        prompt,
        stylePrompt: style.promptJson,
        colors,
        imageUrl: uploadedImageUrl,
      });

      // Update user generation count
      const updatedUser = await DatabaseService.updateUserGenerationCount(
        user.id,
      );

      // Calculate remaining generations
      const remainingGenerations =
        MAX_GENERATIONS_PER_MONTH - updatedUser.generationCount;

      return res.json({
        success: true,
        imageUrl,
        remainingGenerations,
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      return res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Image generation failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("Generate endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
