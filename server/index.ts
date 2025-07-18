import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGenerate } from "./routes/generate";
import { handleSave } from "./routes/save";
import { handleUserStats } from "./routes/user";
import { handleGallery } from "./routes/gallery";
import { handleStyles } from "./routes/styles";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increased limit for image uploads
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/ping", (_req, res) => {
    res.json({ message: "Madar AI API is running!" });
  });

  // Demo endpoint (existing)
  app.get("/demo", handleDemo);

  // Madar AI API endpoints (no /api prefix since Vite mounts at /api)
  app.post("/generate", handleGenerate);
  app.post("/save", handleSave);
  app.get("/user", handleUserStats);
  app.get("/gallery", handleGallery);
  app.get("/styles", handleStyles);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    },
  );

  return app;
}
