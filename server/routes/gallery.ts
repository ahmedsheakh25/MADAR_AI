import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";
import type { GalleryResponse } from "@shared/api";

export const handleGallery: RequestHandler<{}, GalleryResponse> = async (
  req,
  res,
) => {
  try {
    const { limit = "50", offset = "0" } = req.query;

    // Get user from request (for now, using dev user)
    // In production, this would come from authenticated session
    const userEmail = "dev@example.com"; // This should come from auth middleware
    const user = await DatabaseService.findUserByEmail(userEmail);

    if (!user) {
      return res.json({
        images: [],
        total: 0,
      });
    }

    // Get user's images
    const images = await DatabaseService.getUserImages(
      user.id,
      parseInt(limit as string, 10),
      parseInt(offset as string, 10),
    );

    // Transform images to match API interface
    const galleryImages = images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl || "",
      prompt: image.prompt || "",
      styleName: image.styleName || "",
      colors: image.colors || [],
      createdAt: image.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return res.json({
      images: galleryImages,
      total: galleryImages.length,
    });
  } catch (error) {
    console.error("Gallery endpoint error:", error);
    return res.status(500).json({
      images: [],
      total: 0,
    });
  }
};
