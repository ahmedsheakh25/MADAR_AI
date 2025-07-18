import { RequestHandler } from "express";
import { DatabaseService } from "../services/database";
import type { StylesResponse } from "@shared/api";

export const handleStyles: RequestHandler<{}, StylesResponse> = async (
  req,
  res,
) => {
  try {
    // Get all available styles
    const styles = await DatabaseService.getAllStyles();

    // Transform styles to match API interface
    const apiStyles = styles.map((style) => ({
      id: style.id,
      name: style.name || "",
      description: style.description || "",
      thumbnail: style.thumbnail || "",
      promptJson: style.promptJson,
    }));

    return res.json({
      styles: apiStyles,
    });
  } catch (error) {
    console.error("Styles endpoint error:", error);
    return res.status(500).json({
      styles: [],
    });
  }
};
