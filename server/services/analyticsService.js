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
  "confidence": number between 0 and 1,
  "urgencyScore": number between 0 and 10,
  "npsEstimate": number between -100 and 100,
  "summary": string,
  "aspects": [
    {
      "aspect": string,
      "sentiment": "Positive | Neutral | Negative",
      "confidence": number between 0 and 1,
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
      "justification": string,
      "priority": "High | Medium | Low",
      "effort": "Low | Medium | High"
    }
  ],
  "evidence": [string]
}

Field definitions:
- confidence: how certain the sentiment classification is (0 = uncertain, 1 = certain)
- urgencyScore: how urgently this text needs attention or action (0 = no urgency, 10 = critical)
- npsEstimate: estimated Net Promoter Score implied by the text (-100 = extremely negative, 100 = extremely positive)
- recommendations[].priority: how important this action is relative to others
- recommendations[].effort: how much work is required to implement this action

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