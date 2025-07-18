import { RequestHandler } from "express";
import { DatabaseService } from "../../lib/database.js";
import type { StylesResponse } from "../../shared/api.js";

export const handleStyles: RequestHandler = async (req, res) => {
  try {
    // Get all styles from database
    const styles = await DatabaseService.getAllStyles();

    // Transform database styles to API format
    const formattedStyles = styles.map((style) => ({
      id: style.id,
      name: style.name || "",
      description: style.description || "",
      thumbnail: style.thumbnail || "",
      promptJson: style.promptJson || {},
    }));

    const responseData: StylesResponse = {
      styles: formattedStyles,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Styles endpoint error:", error);

    const responseData: StylesResponse = {
      styles: [],
    };

    res.status(500).json(responseData);
  }
};
