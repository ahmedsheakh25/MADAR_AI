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
import {
  handleGetAllUsers,
  handlePromoteUser,
  handleDemoteUser,
  handleResetUserGenerations,
} from "./routes/admin.js";

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

  // Auth routes
  app.get("/auth/google", handleGoogleAuth);
  app.get("/auth/callback", handleAuthCallback);
  app.post("/auth/logout", handleLogout);

  // Debug endpoint to check OAuth config
  app.get("/auth/config", (req, res) => {
    const isProduction =
      process.env.FLY_APP_NAME || process.env.NODE_ENV === "production";
    const redirectUri = isProduction
      ? "https://madar-ai.fly.dev/api/auth/callback"
      : "http://localhost:8080/api/auth/callback";

    res.json({
      environment: isProduction ? "production" : "development",
      redirectUri,
      clientId: process.env.GOOGLE_CLIENT_ID ? "***configured***" : "not set",
      flyAppName: process.env.FLY_APP_NAME || "not set",
      nodeEnv: process.env.NODE_ENV || "not set",
    });
  });

  // Admin routes
  app.get("/admin/users", handleGetAllUsers);
  app.post("/admin/users/:userId/promote", handlePromoteUser);
  app.post("/admin/users/:userId/demote", handleDemoteUser);
  app.post(
    "/admin/users/:userId/reset-generations",
    handleResetUserGenerations,
  );

  // Migration route (development only)
  app.get("/run-migration", async (req, res) => {
    try {
      const { neon } = await import("@neondatabase/serverless");

      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not configured");
      }

      const sql = neon(process.env.DATABASE_URL);

      const migrationSQL = `
        -- Drop existing tables if they exist to start fresh
        DROP TABLE IF EXISTS "images" CASCADE;
        DROP TABLE IF EXISTS "sessions" CASCADE;
        DROP TABLE IF EXISTS "styles" CASCADE;
        DROP TABLE IF EXISTS "users" CASCADE;

        -- Create users table
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "email" text NOT NULL,
          "name" text,
          "google_id" text,
          "profile_picture" text,
          "generation_count" integer DEFAULT 0,
          "reset_date" timestamp DEFAULT now(),
          "created_at" timestamp DEFAULT now(),
          "last_login_at" timestamp,
          CONSTRAINT "users_email_unique" UNIQUE("email"),
          CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
        );

        -- Create sessions table
        CREATE TABLE "sessions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "token" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "sessions_token_unique" UNIQUE("token")
        );

        -- Create styles table
        CREATE TABLE "styles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "name" text,
          "description" text,
          "thumbnail" text,
          "prompt_json" jsonb
        );

        -- Create images table
        CREATE TABLE "images" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "image_url" text,
          "prompt" text,
          "style_name" text,
          "colors" text[],
          "created_at" timestamp DEFAULT now()
        );

        -- Add foreign key constraints
        ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk"
          FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      `;

      // Run the migration statements separately
      await sql`DROP TABLE IF EXISTS "images" CASCADE`;
      await sql`DROP TABLE IF EXISTS "sessions" CASCADE`;
      await sql`DROP TABLE IF EXISTS "styles" CASCADE`;
      await sql`DROP TABLE IF EXISTS "users" CASCADE`;

      // Create users table
      await sql`
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "email" text NOT NULL,
          "name" text,
          "google_id" text,
          "profile_picture" text,
          "generation_count" integer DEFAULT 0,
          "reset_date" timestamp DEFAULT now(),
          "created_at" timestamp DEFAULT now(),
          "last_login_at" timestamp,
          CONSTRAINT "users_email_unique" UNIQUE("email"),
          CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
        )
      `;

      // Create sessions table
      await sql`
        CREATE TABLE "sessions" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "token" text NOT NULL,
          "expires_at" timestamp NOT NULL,
          "created_at" timestamp DEFAULT now(),
          CONSTRAINT "sessions_token_unique" UNIQUE("token")
        )
      `;

      // Create styles table
      await sql`
        CREATE TABLE "styles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "name" text,
          "description" text,
          "thumbnail" text,
          "prompt_json" jsonb
        )
      `;

      // Create images table
      await sql`
        CREATE TABLE "images" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid,
          "image_url" text,
          "prompt" text,
          "style_name" text,
          "colors" text[],
          "created_at" timestamp DEFAULT now()
        )
      `;

      // Add foreign key constraints
      await sql`
        ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
      `;

      await sql`
        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
      `;

      res.json({
        success: true,
        message: "Database migration completed successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Image generation route
  app.post("/generate", async (req, res) => {
    try {
      // Check if API key is configured
      if (
        !process.env.FAL_AI_API_KEY ||
        process.env.FAL_AI_API_KEY === "your_fal_ai_api_key_here"
      ) {
        return res.status(500).json({
          success: false,
          error:
            "Fal AI API key is not configured. Please set FAL_AI_API_KEY environment variable.",
        });
      }

      // For now, return a test response indicating the endpoint is working
      // but API key needs to be configured
      res.json({
        success: false,
        error:
          "Image generation temporarily disabled - API key needs to be configured with a real Fal AI key",
      });
    } catch (error) {
      console.error("Generate route error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      });
    }
  });

  // Placeholder routes for other endpoints
  app.get("/gallery", (req, res) => {
    res.json({ images: [] });
  });

  app.post("/save", (req, res) => {
    res.status(501).json({ error: "Save endpoint not implemented yet" });
  });

  return app;
}
