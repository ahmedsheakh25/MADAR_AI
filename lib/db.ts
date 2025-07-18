import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Create Neon HTTP client - Edge Runtime compatible
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with Neon HTTP adapter for Edge Runtime
export const db = drizzle(sql, { schema });

export type Database = typeof db; 