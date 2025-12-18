import { getGroqClient } from "../utils/groqClient.js";
import History from "../models/History.js";

export const handleAnalyze = async (req, res) => {
  try {
    const { text, sessionId } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text required" });
    }

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
  "confidence": number,                     // 0–1, confidence in the analysis
  "summary": string,                        // 2–3 sentences, detailed overview
  "aspects": [
    {
      "aspect": string,
      "sentiment": "Positive | Neutral | Negative",
      "confidence": number,                  // 0–1
      "severity": "Low | Medium | High",
      "analysis": string                     // 2–3 sentences explaining WHY
    }
  ],
  "keyIssues": [
    {
      "issue": string,
      "severity": "Low | Medium | High",
      "impact": string                       // concrete user or system impact
    }
  ],
  "strengths": [
    {
      "point": string,
      "explanation": string                  // why this is a strength
    }
  ],
  "risks": [
    {
      "risk": string,
      "reason": string                       // long-term concern
    }
  ],
  "recommendations": [
    {
      "action": string,
      "justification": string                // actionable improvement
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
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const raw = completion?.choices?.[0]?.message?.content || "";

    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("INVALID JSON:", raw);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    await History.create({
      userId: req.userId,
      type: "analyze",
      sessionId,
      input: text,
      output: result
    });

    res.json(result);

  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
};
