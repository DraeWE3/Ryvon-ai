import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.POSTGRES_URL!);

async function setup() {
  try {
    console.log("Checking if Waitlist table exists...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "Waitlist" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(64) NOT NULL UNIQUE
      );
    `);
    console.log("Waitlist table ready!");
    process.exit(0);
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
}

setup();
