import { analyzeText } from "../services/analyticsService.js";
import History from "../models/History.js";

export const handleAnalyze = async (req, res) => {
  try {
    const { text, sessionId } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text required" });
    }

    const result = await analyzeText({ text });

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
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
};
