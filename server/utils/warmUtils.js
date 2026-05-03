import mongoose from "mongoose";
import supabase from "./supabaseClient.js";

export const warmAllServices = async () => {
  // 1. Warm MongoDB
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB warmed");
  } else {
    throw new Error("MongoDB not connected");
  }

  // 2. Warm Supabase
  const { error } = await supabase
    .from("documents")
    .select("id")
    .limit(1);

  if (error) throw new Error(`Supabase warm failed: ${error.message}`);
  console.log("Supabase warmed");
};
