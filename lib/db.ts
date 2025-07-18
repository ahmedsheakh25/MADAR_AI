import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Create Neon HTTP client - Edge Runtime compatible
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with Neon HTTP adapter for Edge Runtime
export const db = drizzle(sql, { schema });

export type Database = typeof db;

// Test connection function
export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    const result = await sql`SELECT 1 as test`;
    return { success: true, result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
} 