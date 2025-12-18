import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safety check
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase environment variables:");
  console.error("SUPABASE_URL =", SUPABASE_URL);
  console.error("SUPABASE_SERVICE_ROLE_KEY =", SUPABASE_KEY);
  throw new Error("Supabase configuration missing. Check your .env file.");
}

// MUST export as DEFAULT
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export default supabase;
