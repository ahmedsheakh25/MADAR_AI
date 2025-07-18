import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  generationCount: integer("generation_count").default(0),
  resetDate: timestamp("reset_date").defaultNow(),
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

// Export types
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Image = typeof imagesTable.$inferSelect;
export type NewImage = typeof imagesTable.$inferInsert;

export type Style = typeof stylesTable.$inferSelect;
export type NewStyle = typeof stylesTable.$inferInsert; 