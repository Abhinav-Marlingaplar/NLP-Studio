import { paraphraseText } from "../services/paraphraseService.js";
import History from "../models/History.js";

export const handleParaphrase = async (req, res) => {
  try {
    const {
      text,
      tone = "neutral",
      length = "same",
      creativity = 0.3,
      sessionId
    } = req.body;

    if (!text) return res.status(400).json({ error: "Text required" });

    const result = await paraphraseText({ text, tone, length, creativity });

    await History.create({
      userId: req.userId,
      type: "paraphrase",
      sessionId,
      input: text,
      output: result,
      meta: { tone, length, creativity }
    });

    res.json({ output: result });
  } catch (err) {
    console.error("PARAPHRASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
