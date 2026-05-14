import { getGroqClient } from "../utils/groqClient.js";

export const paraphraseText = async ({ text, tone, length, creativity }) => {
  const groq = getGroqClient();

  const systemPrompt = `
You are an expert paraphrasing assistant.

Task:
Generate exactly 3 different paraphrases of the user's text.
Each variant must preserve the original meaning but take a structurally different approach.

Controls applied to ALL variants:
- Tone: ${tone}
- Length: ${length}
- Creativity level: ${creativity}

Variant guidelines:
- Variant 1: Direct rewrite — minimal structural change, closest to original
- Variant 2: Restructured — reorder sentences or clauses, different sentence openings
- Variant 3: Reinterpreted — most expressive approach within the creativity level, different vocabulary choices

General rules for all variants:
- Adjust word choice and style to match the given tone
- Control verbosity based on length setting:
  shorter -> more concise than original
  same -> approximately same length
  longer -> more detailed but not repetitive
- Creativity controls rephrasing depth:
  low (0-0.3): minimal rewording
  medium (0.4-0.6): balanced rephrasing
  high (0.7-1): more expressive but factual
- Do NOT add new facts, examples, or opinions
- Improve clarity, grammar, and flow

Output format — return ONLY this exact structure, no extra text:
VARIANT_1: <paraphrased text>
VARIANT_2: <paraphrased text>
VARIANT_3: <paraphrased text>
`.trim();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: Math.min(Math.max(creativity, 0), 1),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: String(text) }
    ]
  });

  const raw = completion?.choices?.[0]?.message?.content || "";

  // Parse the three variants from structured output
  const parse = (label) => {
    const match = raw.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=VARIANT_\\d:|$)`));
    return match ? match[1].trim() : null;
  };

  const variant1 = parse("VARIANT_1");
  const variant2 = parse("VARIANT_2");
  const variant3 = parse("VARIANT_3");

  // Fallback — if parsing fails return raw as single variant
  if (!variant1 && !variant2 && !variant3) {
    return { variants: [{ label: "Paraphrase", text: raw }], raw };
  }

  return {
    variants: [
      { label: "Direct", text: variant1 },
      { label: "Restructured", text: variant2 },
      { label: "Reinterpreted", text: variant3 },
    ].filter(v => v.text) // remove any that failed to parse
  };
};