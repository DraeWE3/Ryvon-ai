import { isEmailInWaitlist } from "./lib/db/queries";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
  try {
    const result = await isEmailInWaitlist("test@example.com");
    console.log("Waitlist check result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
