import { neon } from "@neondatabase/serverless";

export const runtime = "edge";

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

export async function GET(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured");
    }

    const sql = neon(process.env.DATABASE_URL);

    // Run the migration
    await sql(migrationSQL);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database migration completed successfully",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Migration error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
