import express from "express";
import cors from "cors";

// Import Express route handlers
import { handleUserStats } from "./routes/user.js";
import { handleStyles } from "./routes/styles.js";
import {
  handleGoogleAuth,
  handleAuthCallback,
  handleLogout,
} from "./routes/auth.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/ping", (req, res) => {
    res.json({ message: "MADAR AI Express Server is running!" });
  });

  app.get("/user", handleUserStats);
  app.get("/styles", handleStyles);

  // Placeholder routes for other endpoints
  app.get("/gallery", (req, res) => {
    res.json({ images: [] });
  });

  app.post("/generate", (req, res) => {
    res.status(501).json({ error: "Generate endpoint not implemented yet" });
  });

  app.post("/save", (req, res) => {
    res.status(501).json({ error: "Save endpoint not implemented yet" });
  });

  return app;
}
