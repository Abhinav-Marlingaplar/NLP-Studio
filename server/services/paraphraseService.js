import { getGroqClient } from "../utils/groqClient.js";

export const paraphraseText = async ({ text, tone, length, creativity }) => {
  const groq = getGroqClient();

  const systemPrompt = `
You are an expert paraphrasing assistant.

Task:
Paraphrase the user's text while strictly preserving the original meaning.

Controls:
- Tone: ${tone}
- Length: ${length}
- Creativity level: ${creativity}

Guidelines:
- Adjust word choice, sentence structure, and style to match the given tone.
- Control verbosity based on the length setting:
  • shorter → more concise than original
  • same → approximately same length
  • longer → more detailed but not repetitive
- Creativity controls how much rephrasing is allowed:
  • low (0–0.3): minimal rewording, close to original
  • medium (0.4–0.6): balanced rephrasing
  • high (0.7–1): more expressive, but factual
- Do NOT add new facts, examples, or opinions.
- Improve clarity, grammar, and flow.

Output:
Return ONLY the paraphrased text. Do not include explanations, bullet points, or quotes.
`.trim();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: Math.min(Math.max(creativity, 0), 1),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: String(text) }
    ]
  });

  return completion?.choices?.[0]?.message?.content || "No output";
};
