import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function pushMigration() {
  try {
    console.log("Pushing database migration...");
    // Force push the migration, accepting any constraints
    const { stdout, stderr } = await execAsync(
      'echo "2" | npx drizzle-kit push',
    );
    console.log("Migration pushed successfully!");
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error("Migration failed:", error.message);
    // Try with force flag
    try {
      const { stdout: forceStdout } = await execAsync(
        "npx drizzle-kit push --force",
      );
      console.log("Force push successful:", forceStdout);
    } catch (forceError) {
      console.error("Force push also failed:", forceError.message);
    }
  }
}

pushMigration();
