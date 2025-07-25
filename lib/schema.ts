import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  role: varchar("role", { length: 20 }).default("user"), // 'user', 'admin'
  generationCount: integer("generation_count").default(0),
  resetDate: timestamp("reset_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// Sessions table for managing user sessions
export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Images table
export const imagesTable = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id),
  imageUrl: text("image_url"),
  prompt: text("prompt"),
  styleName: text("style_name"),
  colors: text("colors").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Styles table
export const stylesTable = pgTable("styles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  description: text("description"),
  thumbnail: text("thumbnail"),
  promptJson: jsonb("prompt_json"),
});

// Generation usage tracking table
export const generationUsageTable = pgTable("generation_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  styleUsed: text("style_used"),
  promptUsed: text("prompt_used"),
  uploadedImageUsed: text("uploaded_image_used"),
  colorsUsed: text("colors_used").array(),
  generatedImageUrl: text("generated_image_url"),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Export types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;

export type Image = typeof imagesTable.$inferSelect;
export type NewImage = typeof imagesTable.$inferInsert;

export type Style = typeof stylesTable.$inferSelect;
export type NewStyle = typeof stylesTable.$inferInsert;

export type GenerationUsage = typeof generationUsageTable.$inferSelect;
export type NewGenerationUsage = typeof generationUsageTable.$inferInsert;
