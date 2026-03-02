import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.POSTGRES_URL!);

async function addAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "draewe3@gmail.com";
    console.log(`Adding admin email: ${email} to waitlist...`);
    
    await sql`
      INSERT INTO "Waitlist" (email) 
      VALUES (${email}) 
      ON CONFLICT (email) DO NOTHING
    `;
    
    console.log("Admin email added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to add admin:", error);
    process.exit(1);
  }
}

addAdmin();
