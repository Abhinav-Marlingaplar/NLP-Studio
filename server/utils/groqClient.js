import Groq from "groq-sdk";

export function getGroqClient() {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    console.error("Missing GROQ_API_KEY");
    throw new Error("GROQ_API_KEY missing");
  }

  return new Groq({ apiKey: key });
}
