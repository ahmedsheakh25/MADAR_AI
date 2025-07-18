import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config();

async function testDB() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW() as current_time`;
    console.log("✅ Database connection successful:", result);

    // Test if users table exists
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log(
        "📋 Tables in database:",
        tables.map((t) => t.table_name),
      );

      // Try to count users
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log("👥 Users in database:", userCount[0].count);
    } catch (tableError) {
      console.log("⚠️ Users table might not exist yet:", tableError.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testDB();
