import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";
import type { SaveImageRequest, SaveImageResponse } from "@shared/api";

export const handleSave: RequestHandler<
  {},
  SaveImageResponse,
  SaveImageRequest
> = async (req, res) => {
  try {
    const { imageUrl, prompt, styleName, colors } = req.body;

    // Validate input
    if (!imageUrl || !prompt || !styleName) {
      return res.status(400).json({
        success: false,
        error: "Image URL, prompt, and style name are required",
      });
    }

    // Get user from request (for now, using dev user)
    // In production, this would come from authenticated session
    const userEmail = "dev@example.com"; // This should come from auth middleware
    const user = await DatabaseService.findUserByEmail(userEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found. Please sign in.",
      });
    }

    try {
      // Save image to database
      const savedImage = await DatabaseService.saveImage({
        userId: user.id,
        imageUrl,
        prompt,
        styleName,
        colors: colors || [],
      });

      return res.json({
        success: true,
        imageId: savedImage.id,
      });
    } catch (error) {
      console.error("Failed to save image:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to save image. Please try again.",
      });
    }
  } catch (error) {
    console.error("Save endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
