import { getGroqClient } from "../utils/groqClient.js";

export const analyzeText = async ({ text }) => {
  const groq = getGroqClient();

  const prompt = `
You are a senior text analytics and product evaluation system used to generate
detailed technical and executive reports.

Your task:
Perform a comprehensive, multi-layered analysis of the given text.

Depth requirements (MANDATORY):
- Expand on causes, implications, and severity.
- Do not summarize too aggressively.
- Each section must contain meaningful detail.
- Avoid generic phrasing such as "works fine" or "has issues".
- Use precise, professional, project-grade language.

Return ONLY valid JSON following this exact schema:

{
  "overallSentiment": "Positive | Neutral | Negative | Mixed",
  "confidence": number,
  "summary": string,
  "aspects": [
    {
      "aspect": string,
      "sentiment": "Positive | Neutral | Negative",
      "confidence": number,
      "severity": "Low | Medium | High",
      "analysis": string
    }
  ],
  "keyIssues": [
    {
      "issue": string,
      "severity": "Low | Medium | High",
      "impact": string
    }
  ],
  "strengths": [
    {
      "point": string,
      "explanation": string
    }
  ],
  "risks": [
    {
      "risk": string,
      "reason": string
    }
  ],
  "recommendations": [
    {
      "action": string,
      "justification": string
    }
  ],
  "evidence": [string]
}

Strict rules:
- Output ONLY raw JSON (no markdown, no backticks).
- Do NOT use bullet symbols or emojis inside JSON.
- Avoid repeating the same wording across sections.
- All arrays must be non-empty where applicable.
- Do NOT invent facts beyond the given text.

Text to analyze:
"""${text}"""
`.trim();

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: "Return ONLY raw JSON. Do not use markdown or backticks."
      },
      { role: "user", content: prompt }
    ]
  });

  const raw = completion?.choices?.[0]?.message?.content || "";
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("INVALID JSON FROM LLM:", raw);
    throw new Error("Invalid AI response");
  }
};
